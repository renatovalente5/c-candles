// Gera o site em _site/:  node src/build.mjs [--base=/c-candles] [--site=https://…] [--producao]
// Antes: python3 scripts/imagens.py (as fotografias em versões web, com cache).
// O conteúdo está em content/ (loja, catálogo, produtos, fotografias) e as regras em src/lib/regras.mjs:
// um problema que «bloqueia» pára o build; um que «neutraliza» esconde só aquele produto.
import { mkdirSync, rmSync, writeFileSync, cpSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { procurarFrasesProibidas } from '../legal-comum/index.mjs';
import * as R from './lib/regras.mjs';
import { RAIZ, BASE, SITE_URL, PRODUCAO, PREVIA, lerTexto, absoluto, url, carregarFotos, FOTOS, fotoPequena, fotoMedia } from './util.mjs';
import { pagina, VERSAO } from './layout.mjs';
import * as P from './paginas.mjs';
import { paginasDeTexto } from './textos.mjs';

const SAIDA = RAIZ + '_site/';
const ler = (f) => JSON.parse(lerTexto(f));

// ── O conteúdo ──
const loja = ler(R.FICHEIROS.loja);
const catalogo = ler(R.FICHEIROS.catalogo);
const fotos = ler(R.FICHEIROS.fotos);
const produtos = Object.fromEntries(readdirSync(RAIZ + R.PASTAS.produtos).filter((f) => f.endsWith('.json')).sort()
  .map((f) => [f.slice(0, -5), { slug: f.slice(0, -5), ...ler(`${R.PASTAS.produtos}/${f}`) }]));

// ── As regras ──
const problemas = R.problemas({ loja, catalogo, produtos, fotos });
const bloqueiam = problemas.filter((p) => p.classe === 'bloqueia');
for (const p of problemas) console.log(`  ${p.classe === 'avisa' ? '!' : '×'} ${p.mensagem}`);
if (bloqueiam.length) { console.error('O site não se constrói:\n' + bloqueiam.map((p) => ' - ' + p.mensagem).join('\n')); process.exit(1); }
const escondidos = new Set(problemas.filter((p) => p.classe === 'neutraliza').map((p) => p.chave.split(':')[1]));
if (PRODUCAO) {
  const e = loja.empresa;
  const falta = ['nome', 'nif', 'morada', 'email'].filter((k) => !e?.[k]);
  if (falta.length) { console.error('Em produção faltam os dados legais da loja: ' + falta.join(', ')); process.exit(1); }
  if (loja.entrega.porConfirmar) { console.error('Em produção os portes têm de estar confirmados (entrega.porConfirmar).'); process.exit(1); }
}

// ── As fotografias (python3 scripts/imagens.py) ──
if (!process.argv.includes('--sem-imagens') && !existsSync(RAIZ + '.cache/imagens/manifesto.json')) execFileSync('python3', [RAIZ + 'scripts/imagens.py'], { stdio: 'inherit' });
carregarFotos(fotos);

const lista = Object.values(produtos).filter((p) => R.noSite(p) && !escondidos.has(p.slug)).sort((a, b) => (a.ordem ?? 500) - (b.ordem ?? 500));
const visiveis = Object.fromEntries(lista.map((p) => [p.slug, p]));
catalogo._velas = new Set(lista.filter((p) => p.categoria === 'velas').map((p) => p.slug));
for (const p of lista) {
  const ar = p.aroma && catalogo.aromas.find((x) => x.id === p.aroma);
  if (ar) p._notas = (ar.piramide ? [...ar.piramide.saida, ...ar.piramide.coracao, ...ar.piramide.fundo] : ar.notas).slice(0, 3);
}
const d = { loja, catalogo, produtos: visiveis, lista };

// ── A saída ──
rmSync(SAIDA, { recursive: true, force: true });
mkdirSync(SAIDA + 'assets', { recursive: true });
for (const pasta of ['css', 'js', 'fontes', 'marca']) cpSync(RAIZ + 'assets/' + pasta, SAIDA + 'assets/' + pasta, { recursive: true });
cpSync(RAIZ + 'src/lib/regras.mjs', SAIDA + 'assets/js/regras.mjs');
mkdirSync(SAIDA + 'assets/img', { recursive: true });
const manifesto = JSON.parse(readFileSync(RAIZ + '.cache/imagens/manifesto.json', 'utf8')).fotos;
for (const [nome, f] of Object.entries(manifesto)) {
  if (!FOTOS[nome]) continue;
  const ficheiros = [...f.larguras.flatMap((w) => f.formatos.map((fmt) => `${nome}-${f.resumo}-${w}.${fmt}`)), `${nome}-${f.resumo}-${f.jpg}.jpg`];
  for (const x of ficheiros) cpSync(RAIZ + '.cache/imagens/' + x, SAIDA + 'assets/img/' + x);
}

// A versão de cada ficheiro (o GitHub Pages guarda tudo 10 minutos em cache: o «?v=» muda com o conteúdo)
const resumo = (f) => createHash('sha256').update(readFileSync(f)).digest('hex').slice(0, 10);
VERSAO.css = resumo(RAIZ + 'assets/css/site.css');
VERSAO.js = createHash('sha256').update(readFileSync(RAIZ + 'assets/js/site.js')).update(readFileSync(RAIZ + 'src/lib/regras.mjs')).digest('hex').slice(0, 10);
// o site.js importa as regras com o mesmo «?v=»
writeFileSync(SAIDA + 'assets/js/site.js', readFileSync(RAIZ + 'assets/js/site.js', 'utf8').replace("from './regras.mjs'", `from './regras.mjs?v=${VERSAO.js}'`));

// O catálogo que o browser lê (o carrinho recalcula tudo com as regras: o preço nunca vem da página)
const dadosBrowser = {
  versao: VERSAO.js,
  produtos: Object.fromEntries(lista.map((p) => [p.slug, {
    nome: p.nome, preco: p.preco ?? null, sobConsulta: !!p.sobConsulta, publicado: true, categoria: p.categoria,
    opcoes: p.opcoes || [], aromas: p.aromas || [], aroma: p.aroma || null, personalizacao: p.personalizacao || null,
    foto: fotoPequena(p.fotos[0]), url: url(`/produtos/${p.slug}/`),
  }])),
  aromas: catalogo.aromas.map((a) => ({ id: a.id, nome: a.nome, cor: a.cor, colecao: a.colecao, frase: a.frase, piramide: a.piramide || null, notas: a.notas || null, foto: a.foto ? fotoMedia(a.foto) : null, fotoNome: a.foto || null })),
  entrega: loja.entrega, whatsapp: loja.whatsapp,
  // a fotografia da snapbar que aparece na ficha dos queimadores quando se escolhe «Snapbar» (se o aroma não tiver a sua)
  fotoSnapbar: (() => { const s = lista.find((p) => p.slug === 'snapbar'); return s ? fotoMedia(s.fotos[0]) : null; })(),
};
mkdirSync(SAIDA + 'assets/dados', { recursive: true });
writeFileSync(SAIDA + 'assets/dados/catalogo.json', JSON.stringify(dadosBrowser));

// ── As páginas ──
const paginas = [
  P.inicio(d), P.loja(d), ...catalogo.categorias.map((c) => P.loja(d, c.id)),
  P.colecao(d, 'natal-2026'), P.colecao(d, 'outono-2026'), P.aromas(d), P.lembrancas(d),
  ...lista.map((p) => P.produto(d, p)),
  P.carrinho(d), P.finalizar(d), P.obrigado(d), P.sobre(d), P.ajuda(d), ...paginasDeTexto(loja), P.naoEncontrada(d),
];
const frases = [];
for (const pg of paginas) {
  const html = pagina(d, pg);
  const destino = pg.caminho.endsWith('.html') ? SAIDA + pg.caminho.slice(1) : SAIDA + pg.caminho.slice(1) + 'index.html';
  mkdirSync(destino.replace(/[^/]+$/, ''), { recursive: true });
  writeFileSync(destino, html);
  for (const f of procurarFrasesProibidas(html)) frases.push(`${pg.caminho}: ${f.frase || f}`);
}
if (frases.length) { console.error('Frases proibidas (legal-comum):\n' + frases.join('\n')); process.exit(1); }

// ── robots.txt e sitemap (só as páginas de destino; as legais ficam de fora, com noindex) ──
const indexaveis = paginas.filter((p) => p.indexar !== false && !p.caminho.endsWith('.html'));
writeFileSync(SAIDA + 'robots.txt', PREVIA ? 'User-agent: *\nAllow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${absoluto('/sitemap.xml')}\n`);
const hoje = new Date().toISOString().slice(0, 10);
writeFileSync(SAIDA + 'sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexaveis.map((p) => `<url><loc>${absoluto(p.caminho)}</loc><lastmod>${hoje}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(SAIDA + '.nojekyll', '');

console.log(`site: ${paginas.length} páginas (${lista.length} produtos) em _site/${BASE ? ` com base ${BASE}` : ''}${PREVIA ? ', pré-visualização (noindex)' : ''}`);
