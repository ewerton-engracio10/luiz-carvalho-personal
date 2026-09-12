import { rm, mkdir, copyFile } from 'node:fs/promises';
import sharp from 'sharp';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });

for (const file of ['index.html', 'styles.css', 'script.js']) {
  await copyFile(file, `dist/${file}`);
}

await copyFile('assets/team-carvalho.png', 'dist/assets/team-carvalho.png');
await copyFile('assets/luiz-hero.png', 'dist/assets/luiz-hero.png');

const conversions = [
  ['assets/luiz-personal.webp', 'dist/assets/luiz-personal.png'],
  ['assets/luiz-atleta.webp', 'dist/assets/luiz-atleta.png'],
  ['assets/luiz-atleta-2.webp', 'dist/assets/luiz-atleta-2.png'],
  ['assets/favicon.webp', 'dist/assets/favicon.png']
];

for (const [input, output] of conversions) {
  await sharp(input).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(output);
}
