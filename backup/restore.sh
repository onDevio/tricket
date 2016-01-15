#!/bin/bash
echo "Starting MongoDb restore"
LATEST_BACKUP=`aws s3 ls s3://tricket.backup/mongo/ | sort | tail -n 1 | awk '{print $4}'`
aws s3 cp s3://tricket.backup/mongo/$LATEST_BACKUP ./
echo "Downloaded MongoDb backup from S3"
tar -xvzf dump_*.tgz
ls -lFa
rm dump_*.tgz
echo "Uncompressing dump complete"
mongorestore -h mongo --drop dump
echo "Restore MongoDb complete"

echo "Starting files restore"
aws s3 sync s3://tricket.backup/files/ /web/storage
ls -lFa /web/storage
echo "Restore files complete"
