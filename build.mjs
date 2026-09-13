import { rm, mkdir, copyFile, appendFile, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });

for (const file of ['index.html', 'styles.css', 'script.js']) {
  await copyFile(file, `dist/${file}`);
}

// Mantém o arquivo oficial intacto para o restante do site.
await copyFile('assets/team-carvalho.png', 'dist/assets/team-carvalho.png');
await copyFile('assets/team-carvalho.png', 'dist/assets/favicon.png');

// Cabeçalho: usa o próprio logo oficial, remove somente a margem transparente
// e gera um PNG dedicado com proporção natural. Não redesenha nem altera a marca.
await sharp('assets/team-carvalho.png')
  .ensureAlpha()
  .trim({ threshold: 10 })
  .resize({ height: 52, fit: 'inside', withoutEnlargement: false })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile('dist/assets/team-carvalho-header.png');

const images = [
  ['image_sources/hero.avif', 'dist/assets/luiz-hero.png'],
  ['image_sources/personal.avif', 'dist/assets/luiz-personal.png'],
  ['image_sources/atleta.avif', 'dist/assets/luiz-atleta.png'],
  ['image_sources/atleta2.avif', 'dist/assets/luiz-atleta-2.png']
];

for (const [input, output] of images) {
  await sharp(input).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(output);
}

// O logo do header deve respeitar sua proporção real; não deve ser espremido
// em uma caixa fixa. As regras abaixo entram por último e prevalecem no desktop/mobile.
await appendFile('dist/styles.css', `
.brand{display:flex!important;align-items:center!important;justify-content:flex-start!important;height:70px!important;overflow:visible!important}
.brand img{display:block!important;width:auto!important;height:52px!important;max-width:220px!important;object-fit:contain!important;object-position:left center!important;background:transparent!important;flex:0 0 auto!important}
@media(max-width:1180px){.brand img{width:auto!important;height:48px!important;max-width:195px!important}}
@media(max-width:900px){.brand{height:60px!important}.brand img{width:auto!important;height:44px!important;max-width:180px!important}}
@media(max-width:520px){.brand img{width:auto!important;height:42px!important;max-width:165px!important}}
`);

// Quebra o cache do navegador para o arquivo corrigido do cabeçalho.
const indexPath = 'dist/index.html';
const indexHtml = await readFile(indexPath, 'utf8');
await writeFile(indexPath, indexHtml.replaceAll('v=20260913-3', 'v=20260913-4'));
