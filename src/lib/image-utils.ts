import sharp from 'sharp';

/**
 * Optimizes an image (data URI or local image path) into WebP format.
 * - Converts base64 images (PNG, JPEG, etc.) into high-efficiency WebP.
 * - Remaps local /images/*.png and /images/*.jpg paths to .webp equivalents.
 */
export async function optimizeToWebP(
  input: string,
  maxWidth = 1200,
  quality = 80
): Promise<string> {
  if (!input || typeof input !== 'string') return input;

  const trimmed = input.trim();

  // 1. Convert base64 data URI to WebP
  if (trimmed.startsWith('data:image/')) {
    try {
      const match = trimmed.match(/^data:image\/([a-zA-Z0-9-+.]+);base64,(.+)$/);
      if (match && match[2]) {
        const buffer = Buffer.from(match[2], 'base64');
        const webpBuffer = await sharp(buffer)
          .resize({ width: maxWidth, height: maxWidth, fit: 'inside', withoutEnlargement: true })
          .webp({ quality, effort: 5 })
          .toBuffer();
        return `data:image/webp;base64,${webpBuffer.toString('base64')}`;
      }
    } catch (err) {
      console.warn('optimizeToWebP error:', err);
      return trimmed;
    }
  }

  // 2. Remap local image paths from .png / .jpg / .jpeg to .webp
  if (trimmed.startsWith('/images/')) {
    return trimmed.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  }

  return trimmed;
}
