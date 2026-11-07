const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIco(pngBuffers, outputPath) {
  // pngBuffers: array of { width, height, buffer }
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + numImages * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(numImages, 4); // Number of images

  const entries = [];
  const imageDatas = [];

  for (const img of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // No color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Data size
    entry.writeUInt32LE(offset, 12); // Data offset

    entries.push(entry);
    imageDatas.push(img.buffer);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...entries, ...imageDatas]);
  fs.writeFileSync(outputPath, icoBuffer);
}

async function main() {
  const logoPath = path.join(__dirname, '../public/images/logo-ars.webp');
  if (!fs.existsSync(logoPath)) {
    throw new Error('Logo file not found at: ' + logoPath);
  }

  console.log('1. Generating Favicons & Icons from logo-ars.webp...');

  // Multi-resolution icons
  const b16 = await sharp(logoPath).resize(16, 16).png().toBuffer();
  const b32 = await sharp(logoPath).resize(32, 32).png().toBuffer();
  const b48 = await sharp(logoPath).resize(48, 48).png().toBuffer();
  const b180 = await sharp(logoPath).resize(180, 180).png().toBuffer();
  const b192 = await sharp(logoPath).resize(192, 192).png().toBuffer();
  const b512 = await sharp(logoPath).resize(512, 512).png().toBuffer();

  // Create favicon.ico in both src/app and public
  const icoBuffers = [
    { width: 16, height: 16, buffer: b16 },
    { width: 32, height: 32, buffer: b32 },
    { width: 48, height: 48, buffer: b48 },
  ];

  await createIco(icoBuffers, path.join(__dirname, '../src/app/favicon.ico'));
  await createIco(icoBuffers, path.join(__dirname, '../public/favicon.ico'));
  console.log('✓ Created src/app/favicon.ico & public/favicon.ico');

  // Next.js App Router icons
  fs.writeFileSync(path.join(__dirname, '../src/app/icon.png'), b32);
  fs.writeFileSync(path.join(__dirname, '../src/app/apple-icon.png'), b180);
  fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), b180);
  fs.writeFileSync(path.join(__dirname, '../public/icon-192.png'), b192);
  fs.writeFileSync(path.join(__dirname, '../public/icon-512.png'), b512);
  console.log('✓ Created icon.png, apple-icon.png, icon-192.png, icon-512.png');

  // 2. Generating High-Resolution 1200x630 Open Graph (OG) Image
  console.log('2. Generating 1200x630 Open Graph Social Share Image...');

  // Prepare logo as base64 PNG for embedding in SVG
  const logoPngBuffer = await sharp(logoPath)
    .resize(240, 240, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  const logoBase64 = `data:image/png;base64,${logoPngBuffer.toString('base64')}`;

  // SVG Canvas 1200x630
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background subtle gradient -->
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="50%" stop-color="#fbfcfd"/>
        <stop offset="100%" stop-color="#f1f5f9"/>
      </linearGradient>

      <!-- Soft Radial Glow for depth -->
      <radialGradient id="glow" cx="80%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#e0e7ff" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>

      <!-- Accent brand gradient -->
      <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#334155"/>
      </linearGradient>

      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f8fafc"/>
      </linearGradient>

      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.08"/>
      </filter>

      <filter id="pillShadow" x="-5%" y="-10%" width="110%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.04"/>
      </filter>
    </defs>

    <!-- Base Canvas -->
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#glow)"/>

    <!-- Subtle Grid Dots Pattern -->
    <g opacity="0.4">
      ${Array.from({ length: 24 })
        .map((_, i) =>
          Array.from({ length: 13 })
            .map((_, j) => `<circle cx="${50 + i * 48}" cy="${30 + j * 48}" r="1.5" fill="#cbd5e1"/>`)
            .join('')
        )
        .join('')}
    </g>

    <!-- Outer Decorative Border -->
    <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>

    <!-- Left Logo Card with Shadow -->
    <g transform="translate(100, 155)">
      <rect x="0" y="0" width="320" height="320" rx="36" fill="url(#cardGrad)" stroke="#e2e8f0" stroke-width="2" filter="url(#shadow)"/>
      <image href="${logoBase64}" x="40" y="40" width="240" height="240" />
    </g>

    <!-- Right Content Area -->
    <g transform="translate(470, 160)">
      <!-- Top Pill Tag -->
      <g filter="url(#pillShadow)">
        <rect x="0" y="0" width="370" height="42" rx="21" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="22" cy="21" r="5" fill="#2563eb" />
        <text x="36" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="700" fill="#0f172a" letter-spacing="1.2">
          FAKULTAS ILMU KESEHATAN DAN SAINS
        </text>
      </g>

      <!-- Main Headline: CLASS ARS UNIBANG -->
      <text x="0" y="115" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="56" font-weight="900" fill="#09090b" letter-spacing="-1.5">
        Class ARS UNIBANG
      </text>

      <!-- Subtitle: Program Studi Administrasi Rumah Sakit -->
      <text x="0" y="165" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="25" font-weight="600" fill="#475569" letter-spacing="-0.3">
        Program Studi Administrasi Rumah Sakit
      </text>

      <text x="0" y="200" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="18" font-weight="400" fill="#64748b">
        Website Resmi Mahasiswa Angkatan 2025 • Universitas Bhakti Asih Tangerang
      </text>

      <!-- Divider line -->
      <line x1="0" y1="235" x2="630" y2="235" stroke="#e2e8f0" stroke-width="1.5" />

      <!-- Bottom Domain Pill & Verification -->
      <g transform="translate(0, 260)">
        <rect x="0" y="0" width="320" height="48" rx="14" fill="#09090b"/>
        <!-- Globe icon -->
        <g transform="translate(18, 14)" stroke="#ffffff" stroke-width="1.8" fill="none">
          <circle cx="10" cy="10" r="9"/>
          <path d="M1 10h18"/>
          <path d="M10 1a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>
        </g>
        <text x="46" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="15" font-weight="700" fill="#ffffff" letter-spacing="0.2">
          classarsunibang.vercel.app
        </text>
      </g>
    </g>
  </svg>
  `;

  const ogBuffer = await sharp(Buffer.from(ogSvg))
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();

  fs.writeFileSync(path.join(__dirname, '../public/og-image.png'), ogBuffer);
  fs.writeFileSync(path.join(__dirname, '../src/app/opengraph-image.png'), ogBuffer);
  console.log('✓ Created public/og-image.png & src/app/opengraph-image.png (1200x630)');

  console.log('\nAll branding & OG images successfully generated!');
}

main().catch(console.error);
