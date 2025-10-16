import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy route for Strapi media files.
 * This allows the browser to access private Strapi uploads through Next.js,
 * which adds the authentication token server-side.
 * 
 * Example: /api/strapi-media/uploads/image.jpg -> http://localhost:1337/uploads/image.jpg
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const strapiUrl = process.env.STRAPI_URL?.replace(/\/$/, '');
    
    if (!strapiUrl) {
      return NextResponse.json(
        { error: 'STRAPI_URL is not configured' },
        { status: 500 }
      );
    }

    // Reconstruct the full path
    const fullPath = path.join('/');
    const url = `${strapiUrl}/${fullPath}`;

    // Fetch from Strapi with authentication
    const headers: Record<string, string> = {};
    if (process.env.STRAPI_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.STRAPI_TOKEN}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error(`Failed to fetch Strapi media: ${url} - ${response.status}`);
      return NextResponse.json(
        { error: 'Media not found' },
        { status: response.status }
      );
    }

    // Get the content type and buffer
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();

    // Return the media file with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error proxying Strapi media:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

