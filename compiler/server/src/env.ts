const values = {
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_KEY_STATUS: process.env.S3_KEY_STATUS,
  S3_KEY_PIO_INI: process.env.S3_KEY_PIO_INI,
  S3_KEY_CONFIG_H: process.env.S3_KEY_CONFIG_H,
  S3_KEY_LOGS: process.env.S3_KEY_LOGS,
  S3_KEY_FIRMWARE_ELF: process.env.S3_KEY_FIRMWARE_ELF,
  S3_KEY_FIRMWARE_HEX: process.env.S3_KEY_FIRMWARE_HEX
}

const missing = Object.entries(values).filter(([, v]): boolean => !v).map(([k]): string => k)
if (missing.length > 0) throw new Error(`Missing env vars: ${missing.join(', ')}`)

export default values
