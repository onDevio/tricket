#!/bin/bash
echo "Starting backup"
mongodump -d tricket -h mongo -v
echo "Dump complete"
tar -cvzf dump_`date +%Y%m%d_%H%M%S`.tgz dump
echo "Archiving complete"
aws s3 mv dump*.tgz s3://tricket.backup/
echo "Uploaded to S3"
aws s3 ls s3://tricket.backup
