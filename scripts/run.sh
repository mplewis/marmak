#!/bin/sh

aws s3 cp demo.txt s3://"${S3_BUCKET}"
