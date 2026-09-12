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
  content = content.replaceAll('.jpg', '.png');
  content = content.replaceAll('.jpeg', '.png');
  content = content.replaceAll('image/webp', 'image/png');
  content = content.replaceAll('image/jpeg', 'image/png');
  await fs.writeFile(path.join(DIST, file), content, 'utf8');
}

async function normalizeImage(input, output) {
  await sharp(input)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
}

async function processHero(input, output) {
  const meta = await sharp(input).metadata();
  if (!meta.width || !meta.height) throw new Error('Hero sem dimensões válidas');

  const left = Math.max(0, Math.round(meta.width * 0.025));
  const bottomCut = Math.max(1, Math.round(meta.height * 0.12));
  const width = meta.width - left;
  const height = meta.height - bottomCut;

  await sharp(input)
    .extract({ left, top: 0, width, height })
    .resize({ width: 1000, withoutEnlargement: false, kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.45 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
}

async function processLogo(input, output) {
  const { data, info } = await sharp(input)
    .resize({ width: 1400, withoutEnlargement: false, kernel: sharp.kernel.lanczos3 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const neutralDark = max <= 18 && (max - min) <= 7;
    const edgeDark = max > 18 && max < 32 && (max - min) <= 8;

    if (neutralDark) data[i + 3] = 0;
    else if (edgeDark) data[i + 3] = Math.round(data[i + 3] * ((max - 18) / 14));
  }

  await sharp(data, { raw: info })
    .sharpen({ sigma: 0.35 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
}

const assetFiles = await fs.readdir(SRC_ASSETS);
for (const file of assetFiles) {
  const input = path.join(SRC_ASSETS, file);
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);

  if (!['.webp', '.jpg', '.jpeg', '.png'].includes(ext)) continue;

  const output = path.join(DIST_ASSETS, `${base}.png`);
  console.log(`Publicando ${base}.png`);

  if (base === 'luiz-hero') await processHero(input, output);
  else if (base === 'team-carvalho') await processLogo(input, output);
  else await normalizeImage(input, output);
}

const publishedAssets = await fs.readdir(DIST_ASSETS);
for (const file of publishedAssets) {
  if (!file.toLowerCase().endsWith('.png')) {
    throw new Error(`Asset publicado fora do padrão PNG: ${file}`);
  }
  const meta = await sharp(path.join(DIST_ASSETS, file)).metadata();
  if (meta.format !== 'png') {
    throw new Error(`Arquivo ${file} não é PNG verdadeiro`);
  }
}

for (const file of ['index.html', 'styles.css']) {
  const content = await fs.readFile(path.join(DIST, file), 'utf8');
  if (/\.(webp|jpe?g)/i.test(content)) {
    throw new Error(`Referência não-PNG encontrada em ${file}`);
  }
}

console.log('Build concluído: todas as imagens publicadas são PNG verdadeiro.');
