// ============================================
// Video Token Utilities
// ============================================

import crypto from 'crypto';

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

// Verify video access token
export function verifyVideoToken(token: string, lessonId: string): boolean {
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
