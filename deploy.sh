#/bin/bash
#upload files
if [ "$1" != "--prod" ]
then
	aws s3 cp ./dist s3://intellos-dev --recursive --acl public-read
else
	aws s3 cp ./dist s3://intellos --recursive --acl public-read
fi
