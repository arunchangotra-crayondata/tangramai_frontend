import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

// Initialize S3 client with credentials from environment variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
})

// Extract bucket name and key from S3 URL
function parseS3Url(url: string): { bucket: string; key: string } | null {
  try {
    // Match S3 URL pattern: https://bucket-name.s3.region.amazonaws.com/key
    const match = url.match(/https?:\/\/([^\.]+)\.s3[\.-]([^\.]+)\.amazonaws\.com\/(.+)/)
    if (match) {
      return {
        bucket: match[1],
        key: decodeURIComponent(match[3]),
      }
    }
    // Alternative pattern: https://s3.region.amazonaws.com/bucket-name/key
    const altMatch = url.match(/https?:\/\/s3[\.-]([^\.]+)\.amazonaws\.com\/([^\/]+)\/(.+)/)
    if (altMatch) {
      return {
        bucket: altMatch[2],
        key: decodeURIComponent(altMatch[3]),
      }
    }
    return null
  } catch (e) {
    console.error('Failed to parse S3 URL:', url, e)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const imageUrl = searchParams.get('url')
    const rangeHeader = request.headers.get('range') || request.headers.get('Range') || undefined
    
    if (!imageUrl) {
      console.error('Image proxy: Missing URL parameter')
      return NextResponse.json(
        { error: 'Missing image URL parameter' },
        { status: 400 }
      )
    }
    
    // Decode the URL if it's encoded - handle multiple encodings
    let decodedUrl: string
    try {
      decodedUrl = decodeURIComponent(imageUrl)
      // Sometimes URLs are double-encoded, try decoding again
      if (decodedUrl.includes('%')) {
        decodedUrl = decodeURIComponent(decodedUrl)
      }
    } catch (e) {
      // If decoding fails, use the original URL
      decodedUrl = imageUrl
      console.warn('Image proxy: Failed to decode URL, using original:', imageUrl)
    }
    
    // Validate that it's an S3 URL
    // Allow any S3 URL from agentsstore bucket or any amazonaws.com domain
    const isS3Url = decodedUrl.includes('.s3.') || decodedUrl.includes('amazonaws.com')
    if (!isS3Url) {
      console.error('Image proxy: Invalid URL - not an S3 URL:', decodedUrl)
      return NextResponse.json(
        { error: 'Invalid image URL - must be an S3 URL' },
        { status: 400 }
      )
    }
    
    console.log('Image proxy: Proxying request for:', decodedUrl)
    console.log('Image proxy: Original encoded URL:', imageUrl)
    
    // Parse S3 URL to get bucket and key
    const s3Params = parseS3Url(decodedUrl)
    if (!s3Params) {
      console.error('Image proxy: Failed to parse S3 URL:', decodedUrl)
      return NextResponse.json(
        { 
          error: 'Invalid S3 URL format',
          url: decodedUrl
        },
        { status: 400 }
      )
    }
    
    console.log('Image proxy: Parsed S3 params:', s3Params)
    
    // Try using AWS SDK first (works for private buckets)
    try {
      const command = new GetObjectCommand({
        Bucket: s3Params.bucket,
        Key: s3Params.key,
        ...(rangeHeader ? { Range: rangeHeader } : {}),
      })
      
      const s3Response = await s3Client.send(command)
      
      if (!s3Response.Body) {
        throw new Error('Empty response body from S3')
      }
      
      // Convert stream to buffer using arrayBuffer() method (type-safe)
      let imageBuffer: Uint8Array
      
      if (s3Response.Body && typeof s3Response.Body === 'object') {
        // Try to use transformToWebStream if available
        if ('transformToWebStream' in s3Response.Body && typeof (s3Response.Body as any).transformToWebStream === 'function') {
          const chunks: Uint8Array[] = []
          const stream = (s3Response.Body as any).transformToWebStream() as ReadableStream<Uint8Array>
          const reader = stream.getReader()
          
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            if (value) chunks.push(value)
          }
          
          // Combine chunks into single buffer
          const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
          imageBuffer = new Uint8Array(totalLength)
          let offset = 0
          for (const chunk of chunks) {
            imageBuffer.set(chunk, offset)
            offset += chunk.length
          }
        } else {
          // Fallback: try to get as arrayBuffer directly
          const arrayBuffer = await (s3Response.Body as any).arrayBuffer?.() || 
                            await (s3Response.Body as any) as ArrayBuffer
          imageBuffer = new Uint8Array(arrayBuffer)
        }
      } else {
        throw new Error('Invalid response body from S3')
      }
      
      const contentType = s3Response.ContentType || 'image/jpeg'
      const contentLength = imageBuffer.length
      const contentRange = s3Response.ContentRange
      const isPartial = Boolean(rangeHeader && contentRange)
      
      console.log('Image proxy: Successfully fetched image from S3:', {
        bucket: s3Params.bucket,
        key: s3Params.key,
        contentType,
        size: `${(contentLength / 1024).toFixed(2)} KB`
      })
      
      // Convert Uint8Array to ArrayBuffer for NextResponse
      // Create a new ArrayBuffer to ensure type compatibility
      const arrayBuffer = new ArrayBuffer(imageBuffer.length)
      new Uint8Array(arrayBuffer).set(imageBuffer)
      
      // Return the image with proper headers
      return new NextResponse(arrayBuffer, {
        status: isPartial ? 206 : 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': contentLength.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Accept-Ranges': 'bytes',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          ...(contentRange ? { 'Content-Range': contentRange } : {}),
        },
      })
    } catch (s3Error) {
      console.error('Image proxy: AWS SDK error, trying fallback fetch:', s3Error)
      
      // Fallback to direct fetch if AWS SDK fails (for public buckets)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)
        
        const response = await fetch(decodedUrl, {
          method: 'GET',
          headers: {
            'Accept': 'image/*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ...(rangeHeader ? { Range: rangeHeader } : {}),
          },
          redirect: 'follow',
          signal: controller.signal,
          cache: 'no-store',
        }).finally(() => {
          clearTimeout(timeoutId)
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const imageBuffer = await response.arrayBuffer()
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const contentLength = imageBuffer.byteLength
        const contentRange = response.headers.get('content-range') || undefined
        const isPartial = response.status === 206 || Boolean(rangeHeader && contentRange)
        
        console.log('Image proxy: Successfully fetched image via fallback:', {
          url: decodedUrl,
          contentType,
          size: `${(contentLength / 1024).toFixed(2)} KB`
        })
        
        return new NextResponse(imageBuffer, {
          status: isPartial ? 206 : 200,
          headers: {
            'Content-Type': contentType,
            'Content-Length': contentLength.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            ...(contentRange ? { 'Content-Range': contentRange } : {}),
          },
        })
      } catch (fetchError) {
        console.error('Image proxy: Both AWS SDK and fetch failed:', {
          s3Error: s3Error instanceof Error ? s3Error.message : s3Error,
          fetchError: fetchError instanceof Error ? fetchError.message : fetchError,
          url: decodedUrl,
          bucket: s3Params.bucket,
          key: s3Params.key
        })
        
        return NextResponse.json(
          { 
            error: 'Failed to fetch image from S3',
            message: s3Error instanceof Error ? s3Error.message : 'Unknown error',
            details: 'Both AWS SDK and direct fetch failed. Check AWS credentials and bucket permissions.',
            url: decodedUrl
          },
          { status: 500 }
        )
      }
    }
  } catch (error) {
    console.error('Image proxy: Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to proxy image',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

