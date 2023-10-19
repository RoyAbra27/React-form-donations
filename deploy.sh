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
        echo "Deleting $object from $BUCKET_NAME..."
        oci os object delete --bucket-name="$BUCKET_NAME" --name="$object" --force

        # if [[ $object == *.css ]] || [[ $object == *.js ]]; then
        #     echo "Deleting $object from $BUCKET_NAME..."
        #     oci os object delete --bucket-name="$BUCKET_NAME" --name="$object" --force
        # fi
    done

    # Iterate through each file in the directory and upload to bucket
    find "$DIR_TO_UPLOAD" -type f | while read -r FILE; do
        # Extract relative path from DIR_TO_UPLOAD
        RELATIVE_PATH=${FILE#"$DIR_TO_UPLOAD/"}

        # Determine content type based on file extension
        CONTENT_TYPE=""
        case "$RELATIVE_PATH" in
            *.html)  CONTENT_TYPE="text/html";;
            *.css)   CONTENT_TYPE="text/css";;
            *.js)    CONTENT_TYPE="application/javascript";;
            *.png)   CONTENT_TYPE="image/png";;
            *.svg)   CONTENT_TYPE="image/svg+xml";;
            # Add other file types if needed
            *)       CONTENT_TYPE="";;
        esac

        echo "Uploading $FILE to $BUCKET_NAME/$RELATIVE_PATH with content type $CONTENT_TYPE..."

        if [ -n "$CONTENT_TYPE" ]; then
            oci os object put --bucket-name="$BUCKET_NAME" --name="$RELATIVE_PATH" --file="$FILE" --force --content-type "$CONTENT_TYPE"
        else
            oci os object put --bucket-name="$BUCKET_NAME" --name="$RELATIVE_PATH" --file="$FILE" --force
        fi
    done

    echo "Upload completed!"
fi
