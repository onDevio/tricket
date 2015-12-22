#!/bin/bash
echo "Starting restore"
KEY=`aws s3 ls s3://tricket.backup | sort | tail -n 1 | awk '{print $4}'`
aws s3 cp s3://tricket.backup/$KEY ./
echo "Downloaded from S3"
tar -xvzf dump_*.tgz
ls -lFa
rm dump_*.tgz
echo "Uncompressing dump complete"
mongorestore -h mongo --drop dump
echo "Restore complete"
