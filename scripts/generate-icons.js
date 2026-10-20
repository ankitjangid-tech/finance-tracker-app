import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, rgbaBuffer) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowSize = width * 4;
  const filtered = Buffer.alloc((rowSize + 1) * height);
  for (let y = 0; y < height; y++) {
    filtered[(rowSize + 1) * y] = 0; // None filter
    rgbaBuffer.copy(filtered, (rowSize + 1) * y + 1, rowSize * y, rowSize * (y + 1));
  }

  const idat = makeChunk('IDAT', zlib.deflateSync(filtered, { level: 9 }));
  const iend = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, makeChunk('IHDR', ihdr), idat, iend]);
}

// Distance from point (px, py) to line segment (x1, y1) -> (x2, y2)
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

// Distance to rounded rectangle
function distToRoundedRect(px, py, rx, ry, rw, rh, rad) {
  const cx = rx + rw / 2;
  const cy = ry + rh / 2;
  const qx = Math.abs(px - cx) - (rw / 2 - rad);
  const qy = Math.abs(py - cy) - (rh / 2 - rad);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  const outerDist = Math.hypot(ax, ay) - rad;
  const innerDist = Math.min(Math.max(qx, qy), 0) - rad;
  return outerDist > 0 ? outerDist : innerDist;
}

function renderFinoraIcon(size, isMaskable = false) {
  const buf = Buffer.alloc(size * size * 4, 0);
  const s = size;

  // Maskable uses full-bleed edge-to-edge background with scale 0.72 inside safe circle
  const scale = isMaskable ? 0.72 : 0.88;
  const cornerRad = isMaskable ? 0 : s * 0.22;
  const rectMargin = isMaskable ? 0 : s * 0.04;
  const rectW = s - rectMargin * 2;
  const rectH = s - rectMargin * 2;

  // Rupee glyph geometry normalized to [-0.5, 0.5]
  const thickness = 0.065 * s * scale;

  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const idx = (y * s + x) * 4;

      // 1. Background Rounded Box
      let bgAlpha = 1.0;
      if (!isMaskable) {
        const d = distToRoundedRect(x, y, rectMargin, rectMargin, rectW, rectH, cornerRad);
        if (d > 0.5) {
          continue; // outside
        } else if (d > -0.5) {
          bgAlpha = Math.max(0, Math.min(1, 0.5 - d));
        }
      }

      // Emerald SaaS Gradient (#10B981 to #047857)
      const gradT = (x * 0.3 + y * 0.7) / s;
      const rBg = Math.round(16 * (1 - gradT) + 4 * gradT);
      const gBg = Math.round(185 * (1 - gradT) + 120 * gradT);
      const bBg = Math.round(129 * (1 - gradT) + 87 * gradT);

      // Subtle top highlight border
      let borderGlow = 0;
      if (!isMaskable) {
        const d = distToRoundedRect(x, y, rectMargin, rectMargin, rectW, rectH, cornerRad);
        if (d > -s * 0.03 && d <= 0) {
          borderGlow = Math.max(0, 1 - Math.abs(d) / (s * 0.03)) * 0.25;
        }
      }

      // 2. Rupee Glyph Centered
      const cx = s * 0.5;
      const cy = s * 0.5;
      const nx = (x - cx) / (s * scale);
      const ny = (y - cy) / (s * scale);

      // Distances to glyph components in normalized coords:
      // A. Top horizontal bar: x in [-0.22, 0.22], y = -0.26
      const dBar1 = distToSegment(nx, ny, -0.22, -0.26, 0.22, -0.26);
      // B. Second horizontal bar: x in [-0.22, 0.16], y = -0.11
      const dBar2 = distToSegment(nx, ny, -0.22, -0.11, 0.16, -0.11);
      // C. Vertical stem: x = -0.12, y in [-0.26, 0.04]
      const dStem = distToSegment(nx, ny, -0.12, -0.26, -0.12, 0.04);
      // D. Semi-circle / loop: center at (-0.12, -0.11), radius ~ 0.15 for right arc
      const arcCx = -0.12;
      const arcCy = -0.11;
      const arcR = 0.15;
      const dToArcCenter = Math.hypot(nx - arcCx, ny - arcCy);
      const isRightSide = nx >= arcCx && ny >= -0.26 && ny <= 0.04;
      const dLoop = isRightSide ? Math.abs(dToArcCenter - arcR) : 999;
      // E. Diagonal leg: from (-0.12, 0.04) to (0.22, 0.32)
      const dLeg = distToSegment(nx, ny, -0.10, 0.02, 0.22, 0.32);

      // Minimum distance to glyph
      const minGlyphDist = Math.min(dBar1, dBar2, dStem, dLoop, dLeg) * (s * scale);
      const glyphRadius = thickness / 2;

      let glyphAlpha = 0;
      if (minGlyphDist <= glyphRadius - 0.5) {
        glyphAlpha = 1.0;
      } else if (minGlyphDist <= glyphRadius + 0.5) {
        glyphAlpha = 0.5 - (minGlyphDist - glyphRadius);
      }

      // Blend glyph over background
      // White glyph with slight warm tint
      const rGlyph = 255;
      const gGlyph = 255;
      const bGlyph = 255;

      const rFinal = Math.round((rBg + (255 - rBg) * borderGlow) * (1 - glyphAlpha) + rGlyph * glyphAlpha);
      const gFinal = Math.round((gBg + (255 - gBg) * borderGlow) * (1 - glyphAlpha) + gGlyph * glyphAlpha);
      const bFinal = Math.round((bBg + (255 - bBg) * borderGlow) * (1 - glyphAlpha) + bGlyph * glyphAlpha);
      const aFinal = Math.round(bgAlpha * 255);

      buf[idx] = rFinal;
      buf[idx + 1] = gFinal;
      buf[idx + 2] = bFinal;
      buf[idx + 3] = aFinal;
    }
  }

  return createPng(size, size, buf);
}

// Generate the icons
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA icons...');

const icon192 = renderFinoraIcon(192, false);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), icon192);
console.log('Created public/pwa-192x192.png');

const icon512 = renderFinoraIcon(512, false);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), icon512);
console.log('Created public/pwa-512x512.png');

const maskable512 = renderFinoraIcon(512, true);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), maskable512);
console.log('Created public/pwa-maskable-512x512.png');

const appleIcon = renderFinoraIcon(180, false);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);
console.log('Created public/apple-touch-icon.png');

// Also update favicon.svg to match emerald Finora branding
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="finoraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#finoraGrad)" />
  <g fill="none" stroke="#FFFFFF" stroke-width="36" stroke-linecap="round" stroke-linejoin="round">
    <line x1="160" y1="140" x2="352" y2="140" />
    <line x1="160" y1="205" x2="320" y2="205" />
    <path d="M 212 140 L 212 270 C 290 270 290 140 212 140 Z" />
    <line x1="212" y1="270" x2="352" y2="400" />
  </g>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);
console.log('Updated public/favicon.svg');

console.log('All icons generated successfully!');
