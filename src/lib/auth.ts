import { cookies } from 'next/headers';

const AUTH_SECRET = process.env.AUTH_SECRET || 'ars_unibang_secret_key_2025_advance_secure';
const COOKIE_NAME = 'ars_admin_session';

async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64ToBuffer(base64: string): ArrayBuffer {
  let standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  while (standardBase64.length % 4) {
    standardBase64 += '=';
  }
  const binary = atob(standardBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function createSessionToken(username: string): Promise<string> {
  const payload = JSON.stringify({
    username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  const enc = new TextEncoder();
  const payloadBase64 = btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(payloadBase64));
  const signatureBase64 = bufferToBase64(signatureBuffer);

  return `${payloadBase64}.${signatureBase64}`;
}

export async function verifySessionToken(token: string): Promise<{ username: string } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadBase64, signatureBase64] = parts;

    const key = await getCryptoKey();
    const enc = new TextEncoder();
    const signatureBuffer = base64ToBuffer(signatureBase64);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBuffer,
      enc.encode(payloadBase64)
    );

    if (!isValid) return null;

    let standardPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    while (standardPayload.length % 4) {
      standardPayload += '=';
    }
    const payload = JSON.parse(atob(standardPayload));

    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    return { username: payload.username };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export { COOKIE_NAME };
