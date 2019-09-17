import AWS from 'aws-sdk'
import { readFile, writeFile } from 'fs-extra'
import env from './env'

type FinalStatus = 'success' | 'error'
type Status = 'created' | 'compiling' | FinalStatus
interface CompileResult {
  success: boolean
  runtime: number
  logs: string
}

const s3 = new AWS.S3()

async function putObject (params: AWS.S3.Types.PutObjectRequest): Promise<AWS.S3.PutObjectOutput> {
  const response = (await s3.putObject(params).promise()).$response.data
  if (!response) throw new Error('AWS method failed without throwing')
  return response
}

async function getObject (params: AWS.S3.Types.GetObjectRequest): Promise<string> {
  const response = (await s3.getObject(params).promise()).$response.data
  if (!response) throw new Error('AWS method failed without throwing')
  return response.Body.toString()
}

async function write (key: string, body: string): Promise<AWS.S3.PutObjectOutput> {
  return putObject({ Bucket: env.S3_BUCKET, Key: key, Body: body })
}

async function upload (key: string, path: string): ReturnType<typeof write> {
  const body = await readFile(path)
  return write(key, body.toString())
}

async function download (key: string, path: string): Promise<void> {
  const data = await getObject({ Bucket: env.S3_BUCKET, Key: key })
  await writeFile(path, data)
}

async function updateStatus (status: Status, additionalData = {}): Promise<void> {
  const body = { status, updated_at: new Date().toISOString() }
  Object.assign(body, additionalData)
  await write(env.S3_KEY_STATUS, JSON.stringify(body))
}

async function finalizeStatus (result: CompileResult): ReturnType<typeof updateStatus> {
  const status = result.success ? 'success' : 'error'
  return updateStatus(status, { runtime: result.runtime })
}

async function compile (): Promise<CompileResult> {
  // TODO: Implement
  return { success: true, runtime: 42.001, logs: 'dummy logz' }
}

async function uploadArtifacts (result: CompileResult): Promise<void> {
  await write(env.S3_KEY_LOGS, result.logs)
  if (!result.success) return
  await upload(env.S3_KEY_FIRMWARE_ELF, '/build/.pioenvs/printer/firmware.elf')
  await upload(env.S3_KEY_FIRMWARE_HEX, '/build/.pioenvs/printer/firmware.hex')
}

async function main (): Promise<void> {
  console.log(process.env)
  await updateStatus('compiling')
  await download(env.S3_KEY_PIO_INI, '/build/platformio.ini')
  await download(env.S3_KEY_CONFIG_H, '/build/src/Configuration.h')
  const result = await compile()
  await uploadArtifacts(result)
  await finalizeStatus(result)
}

main()
