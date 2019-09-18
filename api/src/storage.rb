require 'google/cloud/storage'

module Storage
  GOOGLE = Google::Cloud::Storage.new
  BUCKET = GOOGLE.bucket ENV['BUCKET_NAME']

  def Storage.upload_file(project, path, name)
    Storage::BUCKET.create_file path, "#{project}/#{name}"
  end

  def Storage.update_status(project, status)
    data = StringIO.new JSON.dump({status: status})
    Storage::BUCKET.create_file data, "#{project}/status.json"
  end
end
