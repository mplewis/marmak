require 'sinatra'
require_relative './app'

PORT = ENV['PORT']
raise 'PORT not set' unless PORT
set :port, PORT

post '/configuration_h' do
  result = lambda_handler event: { 'body' => request.body.read }, context: nil
  return result[:statusCode], result[:body]
end
