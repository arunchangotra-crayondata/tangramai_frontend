import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const S3_CONFIG = {
  bucket_name: process.env.S3_BUCKET_NAME || "agentsstore",
  region: process.env.S3_REGION || "us-east-1",
  access_key_id: process.env.S3_ACCESS_KEY_ID || "",
  secret_access_key: process.env.S3_SECRET_ACCESS_KEY || ""
}

const s3Client = new S3Client({
  region: S3_CONFIG.region,
  credentials: {
    accessKeyId: S3_CONFIG.access_key_id,
    secretAccessKey: S3_CONFIG.secret_access_key,
  },
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    // Extract key from full S3 URLs
    let key = filePath
    if (filePath.startsWith('https://agentsstore.s3.us-east-1.amazonaws.com/')) {
      key = filePath.replace('https://agentsstore.s3.us-east-1.amazonaws.com/', '')
    } else if (filePath.startsWith('http://agentsstore.s3.us-east-1.amazonaws.com/')) {
      key = filePath.replace('http://agentsstore.s3.us-east-1.amazonaws.com/', '')
    }
    // For other full URLs (non-S3), return them directly
    else if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return NextResponse.json({ url: filePath })
    }

    // Generate a presigned URL for the S3 object
    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.bucket_name,
      Key: key,
    })

    // Generate a presigned URL that expires in 1 hour
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    return NextResponse.json({ url })
  } catch (error: unknown) {
    console.error('Error generating presigned URL:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate file URL'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

