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

// Fotos reais: saída pública sempre em PNG.
await sharp('image_sources/hero.avif')
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile('dist/assets/luiz-hero.png');

await sharp('image_sources/personal.avif')
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile('dist/assets/luiz-personal.png');

// A foto de atleta vinha do Instagram com elemento de compartilhamento no rodapé.
// O corte remove apenas a faixa inferior do arquivo original, sem gerar ou alterar pessoas.
const athleteSource = sharp('image_sources/atleta.avif');
const athleteMeta = await athleteSource.metadata();
const athleteWidth = athleteMeta.width;
const athleteHeight = athleteMeta.height;
if (!athleteWidth || !athleteHeight) throw new Error('Não foi possível ler a foto atleta.avif');
await athleteSource
  .extract({ left: 0, top: 0, width: athleteWidth, height: Math.floor(athleteHeight * 0.90) })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile('dist/assets/luiz-atleta.png');

await sharp('image_sources/atleta2.avif')
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile('dist/assets/luiz-atleta-2.png');

// Ajustes visuais validados separadamente para desktop e mobile.
await appendFile('dist/styles.css', `
.brand{display:flex!important;align-items:center!important;justify-content:flex-start!important;height:70px!important;overflow:visible!important}
.brand img{display:block!important;width:auto!important;height:52px!important;max-width:220px!important;object-fit:contain!important;object-position:left center!important;background:transparent!important;flex:0 0 auto!important}
#sobre,#treine,#atleta,#contato{scroll-margin-top:90px}

/* Mais que Treino: preserva cabeça e enquadramento. */
.about-photo img{object-position:74% top!important;transform:none!important;transform-origin:center top!important}

/* Atleta: duas colunas, sem repetição lateral e alinhada ao restante do site. */
.athlete{grid-template-columns:43% 57%!important;min-height:560px!important}
.athlete-photo{min-height:560px!important;background:#070908!important}
.athlete-photo img{object-position:64% top!important;transform:scale(1.08)!important;transform-origin:center top!important}
.athlete-photo:before{content:"";position:absolute;left:0;right:0;bottom:0;height:16%;z-index:2;pointer-events:none;background:linear-gradient(0deg,#070908 0%,rgba(7,9,8,.72) 45%,transparent 100%)}
.athlete-copy{padding:58px clamp(56px,6vw,96px) 52px 54px!important;align-self:center!important;max-width:820px!important}
.athlete h2{font-size:clamp(50px,4.9vw,76px)!important;line-height:.92!important;margin-bottom:20px!important}
.athlete-copy>p:not(.eyebrow){max-width:620px!important;line-height:1.55!important}
.athlete-tags{margin-top:30px!important}
.athlete-side{display:none!important}

@media(max-width:1180px){
  .brand img{width:auto!important;height:48px!important;max-width:195px!important}
  .athlete{grid-template-columns:44% 56%!important}
  .athlete-copy{padding:48px 38px 44px 42px!important}
  .athlete h2{font-size:clamp(46px,5.2vw,66px)!important}
}

@media(max-width:900px){
  .brand{height:60px!important}.brand img{width:auto!important;height:44px!important;max-width:180px!important}
  #sobre,#treine,#atleta,#contato{scroll-margin-top:78px}
  .about-photo img{object-position:72% top!important;transform:none!important}
  .athlete{grid-template-columns:1fr!important;min-height:auto!important}
  .athlete-photo{min-height:500px!important;height:68vh!important;max-height:650px!important}
  .athlete-photo img{object-position:62% top!important;transform:scale(1.06)!important;transform-origin:center top!important}
  .athlete-photo:before{height:18%!important}
  .athlete-copy{padding:42px 24px 48px!important;max-width:none!important;min-width:0!important}
  .athlete h2{font-size:clamp(45px,13vw,72px)!important}
  .athlete-copy>p:not(.eyebrow){max-width:none!important}
}

@media(max-width:520px){
  .brand img{width:auto!important;height:42px!important;max-width:165px!important}
  .about-photo img{object-position:70% top!important;transform:none!important}
  .athlete-photo{min-height:450px!important;height:60vh!important}
  .athlete-photo img{object-position:60% top!important;transform:scale(1.04)!important}
  .athlete-copy{padding:38px 20px 44px!important}
}
`);

// Cache-bust e limpeza estrutural da seção Atleta no HTML publicado.
const indexPath = 'dist/index.html';
let indexHtml = await readFile(indexPath, 'utf8');
indexHtml = indexHtml.replaceAll('v=20260913-3', 'v=20260913-5');
indexHtml = indexHtml.replace('/styles.css', '/styles.css?v=20260913-3');
indexHtml = indexHtml.replace(
  '<div class="athlete-side reveal delay-2"><div class="athlete-silhouette"><img src="/assets/luiz-atleta-2.png" alt="" /></div><div class="script small">Mesma<br />Disciplina<br />Novos<br />Resultados</div></div>',
  ''
);
await writeFile(indexPath, indexHtml);
