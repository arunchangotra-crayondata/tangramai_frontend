#!/bin/sh
# Simple script to replace AWS credentials in file-preview/route.ts

FILE="app/api/file-preview/route.ts"

if [ -f "$FILE" ]; then
    # Replace Access Key ID
    sed -i.bak 's/process.env.S3_ACCESS_KEY_ID || ""/process.env.S3_ACCESS_KEY_ID || ""/g' "$FILE"
    # Replace Secret Access Key  
    sed -i.bak 's|process.env.S3_SECRET_ACCESS_KEY || ""|process.env.S3_SECRET_ACCESS_KEY || ""|g' "$FILE"
    # Remove backup files
    rm -f "$FILE.bak" 2>/dev/null || true
fi

