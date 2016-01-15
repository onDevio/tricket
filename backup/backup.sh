#!/bin/bash
echo "Starting MongoDb backup"
mongodump -d tricket -h mongo -v
echo "Dump complete"
tar -cvzf dump_`date +%Y%m%d_%H%M%S`.tgz dump
ls -lFa
echo "Archiving complete"
aws s3 mv dump*.tgz s3://tricket.backup/mongo/
echo "Uploaded to S3"
aws s3 ls s3://tricket.backup/mongo/

echo "Starting files backup"
ls -lFa /web/storage
aws s3 sync /web/storage s3://tricket.backup/files/
echo "Done files backup"
aws s3 ls s3://tricket.backup/files/
