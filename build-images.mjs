import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const SRC_ASSETS = path.join(ROOT, 'assets');
const DIST_ASSETS = path.join(DIST, 'assets');

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST_ASSETS, { recursive: true });

for (const file of ['index.html', 'styles.css', 'script.js']) {
  let content = await fs.readFile(path.join(ROOT, file), 'utf8');
  content = content.replaceAll('.webp', '.png');
  content = content.replaceAll('image/webp', 'image/png');
  await fs.writeFile(path.join(DIST, file), content, 'utf8');
}

async function normalizeImage(input, output) {
  const raw = await fs.readFile(input);
  try {
    await sharp(raw).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(output);
    return;
  } catch (firstError) {
    const text = raw.toString('utf8').replace(/\s+/g, '');
    if (/^[A-Za-z0-9+/=]+$/.test(text) && text.length > 32) {
      const decoded = Buffer.from(text, 'base64');
      await sharp(decoded).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(output);
      return;
    }
    throw firstError;
  }
}

const assetFiles = await fs.readdir(SRC_ASSETS);
for (const file of assetFiles) {
  const input = path.join(SRC_ASSETS, file);
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);

  if (ext === '.webp' || ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    console.log(`Convertendo ${file} -> ${base}.png`);
    await normalizeImage(input, path.join(DIST_ASSETS, `${base}.png`));
  } else {
    await fs.copyFile(input, path.join(DIST_ASSETS, file));
  }
}

console.log('Build concluído: todas as imagens publicadas em PNG.');
