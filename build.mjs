import { rm, mkdir, copyFile } from 'node:fs/promises';
import sharp from 'sharp';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });

for (const file of ['index.html', 'styles.css', 'script.js']) {
  await copyFile(file, `dist/${file}`);
}

await copyFile('assets/team-carvalho.png', 'dist/assets/team-carvalho.png');
await copyFile('assets/team-carvalho.png', 'dist/assets/favicon.png');

const images = [
  ['image_sources/hero.avif', 'dist/assets/luiz-hero.png'],
  ['image_sources/personal.avif', 'dist/assets/luiz-personal.png'],
  ['image_sources/atleta.avif', 'dist/assets/luiz-atleta.png'],
  ['image_sources/atleta2.avif', 'dist/assets/luiz-atleta-2.png']
];

for (const [input, output] of images) {
  await sharp(input).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(output);
}
