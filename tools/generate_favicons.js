const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const zlib = require('zlib');

// CRC32 implementation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcVal = crc32(Buffer.concat([typeBuf, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, rgbaBuffer) {
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rawOffset = y * scanlineLength;
    rawData[rawOffset] = 0; // Filter: None
    rgbaBuffer.copy(rawData, rawOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

function createIco(pngBuffersWithSizes) {
  // pngBuffersWithSizes: [{ size: 16, png: Buffer }, ...]
  const count = pngBuffersWithSizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  let currentOffset = 6 + count * 16;

  for (const item of pngBuffersWithSizes) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 0); // width
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.png.length, 8); // image size
    entry.writeUInt32LE(currentOffset, 12); // image offset
    dirEntries.push(entry);
    currentOffset += item.png.length;
  }

  return Buffer.concat([
    header,
    ...dirEntries,
    ...pngBuffersWithSizes.map(item => item.png)
  ]);
}

// Source image paths
const srcEmblemJpg = '/Users/sumitujjwal/.gemini/antigravity-ide/brain/492ed821-242b-4aaa-851d-7a017c01e525/circular_dev_icon_1792747156135.jpg';
const srcOgBannerJpg = '/Users/sumitujjwal/.gemini/antigravity-ide/brain/492ed821-242b-4aaa-851d-7a017c01e525/og_share_preview_1792747176168.jpg';

const rootDir = path.resolve(__dirname, '..');
const faviconDir = path.join(rootDir, 'assets', 'favicon_io');
const assetsDir = path.join(rootDir, 'assets');

// Step 1: Crop and mask the emblem into circular transparent PNGs
// In the 1024x1024 original, the outer glowing circle is between radius ~360 and ~375.
// Let's crop tight around the circle: crop to 780x780 centered at (512, 512).
// sips -p 780 780
console.log('1. Cropping emblem with sips...');
const tempCroppedJpg = path.join(faviconDir, '_temp_cropped.jpg');
const tempCroppedBmp = path.join(faviconDir, '_temp_cropped.bmp');

cp.execSync(`sips -p 780 780 "${srcEmblemJpg}" --out "${tempCroppedJpg}"`);

function generateCircularPng(targetSize) {
  const sizeBmp = path.join(faviconDir, `_temp_${targetSize}.bmp`);
  cp.execSync(`sips -s format bmp -z ${targetSize} ${targetSize} "${tempCroppedJpg}" --out "${sizeBmp}"`);
  const buf = fs.readFileSync(sizeBmp);
  fs.unlinkSync(sizeBmp);

  const offset = buf.readUInt32LE(10);
  const w = buf.readInt32LE(18);
  const rawH = buf.readInt32LE(22);
  const h = Math.abs(rawH);
  const isTopDown = rawH < 0;
  const bpp = buf.readUInt16LE(28);
  const rowBytes = Math.floor((bpp * w + 31) / 32) * 4;

  const rgba = Buffer.alloc(w * h * 4);
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  // Radius of the circle within the cropped 780x780 square:
  // Ring was ~365px from center in 1024x1024, so in 780x780 it is ~ (365/390)*cx ≈ 0.935*cx
  const radius = cx * 0.94;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = Math.hypot(x - cx, y - cy);
      const outIdx = (y * w + x) * 4;

      if (d > radius + 0.5) {
        // Completely transparent outside circle
        rgba[outIdx] = 0;
        rgba[outIdx + 1] = 0;
        rgba[outIdx + 2] = 0;
        rgba[outIdx + 3] = 0;
      } else {
        const bmpY = isTopDown ? y : (h - 1 - y);
        const inOffset = offset + bmpY * rowBytes + x * (bpp / 8);
        const b = buf[inOffset];
        const g = buf[inOffset + 1];
        const r = buf[inOffset + 2];

        rgba[outIdx] = r;
        rgba[outIdx + 1] = g;
        rgba[outIdx + 2] = b;

        if (d >= radius - 1.0) {
          // Antialiased edge
          const edgeAlpha = Math.max(0, Math.min(255, Math.round((radius + 0.5 - d) * 170)));
          rgba[outIdx + 3] = edgeAlpha;
        } else {
          rgba[outIdx + 3] = 255;
        }
      }
    }
  }

  return createPng(w, h, rgba);
}

const sizes = [
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 }
];

const pngResults = {};

for (const s of sizes) {
  console.log(`Generating ${s.name} (${s.size}x${s.size})...`);
  const pngBuf = generateCircularPng(s.size);
  fs.writeFileSync(path.join(faviconDir, s.name), pngBuf);
  pngResults[s.size] = pngBuf;
}

// Generate favicon.ico with 16, 32, 48
console.log('Generating favicon.ico...');
const png48 = generateCircularPng(48);
const icoBuf = createIco([
  { size: 16, png: pngResults[16] },
  { size: 32, png: pngResults[32] },
  { size: 48, png: png48 }
]);
fs.writeFileSync(path.join(faviconDir, 'favicon.ico'), icoBuf);

// Cleanup temp crop
fs.unlinkSync(tempCroppedJpg);

// Generate Vector SVG Favicon
console.log('Generating favicon.svg...');
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="cyberBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#141c2c"/>
      <stop offset="70%" stop-color="#0b0e14"/>
      <stop offset="100%" stop-color="#05070a"/>
    </radialGradient>
    <linearGradient id="cyberRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffb366"/>
      <stop offset="50%" stop-color="#ff9933"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Circular badge base -->
  <circle cx="256" cy="256" r="240" fill="url(#cyberBg)" stroke="url(#cyberRing)" stroke-width="16" filter="url(#glow)"/>
  <!-- Inner cyber cyan ring -->
  <circle cx="256" cy="256" r="222" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.7"/>
  <!-- Central { SU } Monogram -->
  <text x="256" y="278" font-family="'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace" font-size="140" font-weight="800" text-anchor="middle" dominant-baseline="middle">
    <tspan fill="#ff9933" font-weight="700">{</tspan><tspan fill="#ffffff" dx="6">SU</tspan><tspan fill="#ff9933" font-weight="700" dx="6">}</tspan>
  </text>
</svg>
`;
fs.writeFileSync(path.join(faviconDir, 'favicon.svg'), svgContent);

// Step 2: Open Graph & Twitter Social Share Preview Card
console.log('Generating Open Graph & Twitter preview banner in assets/ ...');
const ogPngPath = path.join(assetsDir, 'og-preview.png');
const ogJpgPath = path.join(assetsDir, 'og-preview.jpg');

// Copy high-res 16:9 banner
cp.execSync(`sips -s format png "${srcOgBannerJpg}" --out "${ogPngPath}"`);
cp.execSync(`cp "${srcOgBannerJpg}" "${ogJpgPath}"`);

console.log('All icons and Open Graph banners generated successfully!');
