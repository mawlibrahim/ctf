#!/bin/bash

# Set the target directory (change this to your folder path)
TARGET_DIR="D:/000. Link DT/MIJT 2025/"

# Check if the directory exists
if [ -d "$TARGET_DIR" ]; then
    echo "Searching for folders named 'HO' or 'logfile' (case-insensitive) in $TARGET_DIR ..."

    # Find and remove matching folders
    find "$TARGET_DIR" -type d \( -iname "cf*" -o -iname "ho*" -o -iname "logfile" \) -exec rm -rf {} +

    echo "Folders removed."

    find "$TARGET_DIR" -type f -name "*gen.zip" -exec rm -rf {} +

    echo "Files removed."
else
    echo "Error: Directory $TARGET_DIR does not exist."
    exit 1
fi
