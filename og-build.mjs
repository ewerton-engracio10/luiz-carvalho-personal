import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const parts = await Promise.all(
  Array.from({ length: 5 }, (_, i) =>
    readFile(`image_sources/og_meta/part_${String(i).padStart(2, '0')}.txt`, 'utf8')
  )
);

const ogBase64 = parts.join('');

await sharp(Buffer.from(ogBase64, 'base64'))
  .resize(1200, 630, { fit: 'fill' })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile('dist/assets/og-team-carvalho.png');

const indexPath = 'dist/index.html';
let html = await readFile(indexPath, 'utf8');
const ogImage = 'https://luiz-carvalho-personal.vercel.app/assets/og-team-carvalho.png';

html = html.replace(
  /<meta property="og:image"[^>]*\/>/,
  `<meta property="og:image" content="${ogImage}" />\n  <meta property="og:image:type" content="image/png" />\n  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="630" />\n  <meta property="og:image:alt" content="Luiz Carvalho — Personal Trainer e Atleta Fitness" />`
);

html = html.replace(
  /<meta name="twitter:card" content="summary_large_image" \/>/,
  `<meta name="twitter:card" content="summary_large_image" />\n  <meta name="twitter:image" content="${ogImage}" />\n  <meta name="twitter:image:alt" content="Luiz Carvalho — Personal Trainer e Atleta Fitness" />`
);

await writeFile(indexPath, html);
