// ============================================
// Video Streaming API Route
// ============================================
// This route handles secure video streaming with token verification

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import crypto from 'crypto';

// Verify video access token
function verifyVideoToken(token: string, lessonId: string): boolean {
  try {
    const secret = process.env.VIDEO_SIGNING_KEY || 'dev-secret';
    const [payload, signature] = token.split('.');
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return false;
    }
    
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    
    // Check expiration
    if (decoded.exp < Date.now()) {
      return false;
    }
    
    // Check lesson ID
    if (decoded.lessonId !== lessonId) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Generate video access token
export function generateVideoToken(lessonId: string, userId: string): string {
  const secret = process.env.VIDEO_SIGNING_KEY || 'dev-secret';
  const expiresAt = Date.now() + 3600000; // 1 hour
  
  const payload = {
    lessonId,
    userId,
    exp: expiresAt,
    iat: Date.now(),
  };
  
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadBase64)
    .digest('hex');
  
  return `${payloadBase64}.${signature}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Verify token from query params
    const token = request.nextUrl.searchParams.get('token');
    
    if (!token || !verifyVideoToken(token, lessonId)) {
      return new NextResponse('Invalid or expired token', { status: 403 });
    }
    
    // In production, you would:
    // 1. Verify the user has access to this lesson (enrolled in course)
    // 2. Fetch the video from secure storage (S3, Cloud Storage, etc.)
    // 3. Stream the video with proper headers
    
    // For now, return a placeholder response
    // In production, implement actual video streaming here
    
    const headers = new Headers({
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      // Prevent caching and downloading
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': 'inline',
    });
    
    // Return a 206 Partial Content for range requests (streaming)
    // This is a simplified example - production would handle byte ranges
    return new NextResponse('Video streaming endpoint', {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Video streaming error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
