#!/bin/sh

# Run build
npm run build

# Set bucket name
BUCKET_NAME="form-bucket"

# Set directory to upload
DIR_TO_UPLOAD="$(dirname "$0")/dist"

# Check if directory exists
if [ ! -d "$DIR_TO_UPLOAD" ]; then
    echo "Directory $DIR_TO_UPLOAD does not exist."
else
    # List all objects in the bucket
    OBJECTS=$(oci os object list --bucket-name="$BUCKET_NAME" | grep '"name"' | awk -F': ' '{print $2}' | tr -d '",')

    # Filter objects with .css and .js extensions and delete them
    for object in $OBJECTS; do
        if [[ $object == *.css ]] || [[ $object == *.js ]]; then
            echo "Deleting $object from $BUCKET_NAME ..."
            oci os object delete --bucket-name="$BUCKET_NAME" --name="$object" --force
        fi
    done

    # Iterate through each file in the directory and upload to bucket
    find "$DIR_TO_UPLOAD" -type f | while read -r FILE; do
        OBJECT_NAME=$(basename "$FILE")
        echo "Uploading $FILE to $BUCKET_NAME/$OBJECT_NAME ..."
        oci os object put --bucket-name="$BUCKET_NAME" --name="$OBJECT_NAME" --file="$FILE" --force
    done

    echo "Upload completed!"
fi
