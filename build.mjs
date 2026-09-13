import { rm, mkdir, copyFile, appendFile, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });

for (const file of ['index.html', 'styles.css', 'script.js']) {
  await copyFile(file, `dist/${file}`);
}

// Logos oficiais em PNG válido. Nenhum processamento visual da marca no build.
await copyFile('assets/team-carvalho.png', 'dist/assets/team-carvalho.png');
await copyFile('assets/team-carvalho-header.png', 'dist/assets/team-carvalho-header.png');
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

// O logo do cabeçalho respeita a proporção natural e nunca é espremido.
await appendFile('dist/styles.css', `
.brand{display:flex!important;align-items:center!important;justify-content:flex-start!important;height:70px!important;overflow:visible!important}
.brand img{display:block!important;width:auto!important;height:52px!important;max-width:220px!important;object-fit:contain!important;object-position:left center!important;background:transparent!important;flex:0 0 auto!important}
@media(max-width:1180px){.brand img{width:auto!important;height:48px!important;max-width:195px!important}}
@media(max-width:900px){.brand{height:60px!important}.brand img{width:auto!important;height:44px!important;max-width:180px!important}}
@media(max-width:520px){.brand img{width:auto!important;height:42px!important;max-width:165px!important}}

/* Enquadramento da foto da seção Mais que Treino: sem corte da cabeça em desktop e mobile. */
.about-photo img{object-position:74% top!important;transform:none!important;transform-origin:center top!important}
@media(max-width:900px){.about-photo img{object-position:72% top!important;transform:none!important}}
@media(max-width:520px){.about-photo img{object-position:70% top!important;transform:none!important}}
`);

// Cache-bust dos arquivos visuais/CSS corrigidos.
const indexPath = 'dist/index.html';
let indexHtml = await readFile(indexPath, 'utf8');
indexHtml = indexHtml.replaceAll('v=20260913-3', 'v=20260913-4');
indexHtml = indexHtml.replace('/styles.css', '/styles.css?v=20260913-2');
await writeFile(indexPath, indexHtml);
