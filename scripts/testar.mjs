// Testes rápidos do conteúdo e das regras (correm antes de cada publicação):  node scripts/testar.mjs
// O caminho da compra no browser prova-se à parte (Playwright, no Chromium e no WebKit).
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as R from '../src/lib/regras.mjs';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const ler = (f) => JSON.parse(readFileSync(RAIZ + f, 'utf8'));
const loja = ler('content/loja.json');
const catalogo = ler('content/catalogo.json');
const fotos = ler('content/fotos.json');
const produtos = Object.fromEntries(readdirSync(RAIZ + 'content/produtos').filter((f) => f.endsWith('.json')).map((f) => [f.slice(0, -5), ler('content/produtos/' + f)]));

let ok = 0;
const falhas = [];
const conferir = (cond, msg) => (cond ? ok++ : falhas.push(msg));

// 1. Nenhum problema que bloqueie ou esconda produtos
const probs = R.problemas({ loja, catalogo, produtos, fotos });
conferir(!probs.some((p) => p.classe !== 'avisa'), 'problemas no conteúdo: ' + probs.map((p) => p.mensagem).join(' | '));

// 2. Os preços das legendas do Instagram (out–nov 2026)
const preco = (slug, escolha = {}) => R.conferirEscolha(produtos[slug], escolha, catalogo.aromas);
conferir(preco('queimador-pai-natal').unitario === 1200, 'queimador 12 €');
conferir(preco('queimador-pai-natal', { opcoes: { levar: 1 }, aroma: 'rolo-de-canela' }).unitario === 1500, 'queimador + snapbar 15 €');
conferir(preco('queimador-pai-natal', { opcoes: { levar: 2 }, aroma: 'rolo-de-canela' }).unitario === 1740, 'queimador + wax melts 17,40 €');
conferir(preco('queimador-casa-do-bosque', { opcoes: { levar: 1 }, aroma: 'wood-you' }).unitario === 2050, 'Casa do Bosque + snapbar 20,50 €');
conferir(preco('queimador-casa-do-bosque', { opcoes: { levar: 2 }, aroma: 'wood-you' }).unitario === 2290, 'Casa do Bosque + wax melts 22,90 €');
conferir(preco('queimador-rena', { opcoes: { levar: 1 }, aroma: 'bengala-doce' }).unitario === 1200, 'Conjunto Rena 12 €');
conferir(preco('snapbar', { aroma: 'coffee-first' }).unitario === 400, 'snapbar 4 €');
conferir(preco('wax-melts', { aroma: 'coffee-first' }).unitario === 640, 'wax melts 6,40 €');
conferir(preco('vela-coffee-first').unitario === 1350, 'vela 13,50 €');
conferir(preco('bosque-encantado', { opcoes: { peca: 1 } }).unitario === 400, 'esquilo 4 €');
conferir(preco('bosque-encantado', { opcoes: { peca: 2 } }).unitario === 450, 'pinha 4,50 €');
conferir(preco('kit-pinta-a-tua-abobora').unitario === 1260, 'kit abóbora 12,60 €');

// 3. As regras recusam o que a página não deixa fazer
conferir(!preco('queimador-pai-natal', { opcoes: { levar: 1 } }).ok, 'snapbar sem aroma é recusado');
conferir(!preco('queimador-pai-natal', { opcoes: { levar: 9 } }).ok, 'opção que não existe é recusada');
conferir(!preco('snapbar', { aroma: 'nao-existe' }).ok, 'aroma que não existe é recusado');
conferir(!preco('anjinhos').ok, 'peça sob consulta não se compra');
conferir(R.linhaDoCarrinho(produtos['vela-coffee-first'], { qtd: 0 }, catalogo.aromas).ok === false, 'quantidade 0 recusada');
conferir(R.linhaDoCarrinho(produtos['vela-coffee-first'], { qtd: 51 }, catalogo.aromas).ok === false, 'quantidade 51 recusada');
conferir(R.portesDe(loja, 'mao', 5000) === 0, 'entrega em mão sem portes');
conferir(R.portesDe(loja, 'continente', 1000) === 490, 'portes do continente 4,90 €');

// 4. Cada aroma tem notas e cor; as velas apontam para aromas que existem
for (const a of catalogo.aromas) conferir(/^#[0-9A-F]{6}$/i.test(a.cor) && (a.piramide || a.notas?.length), `aroma ${a.id} com cor e notas`);
for (const [slug, p] of Object.entries(produtos)) for (const f of p.fotos) conferir(Boolean(fotos[f]?.alt), `${slug}: a fotografia ${f} tem descrição`);

// 5. Nada de frases proibidas pelo Renato nos textos do conteúdo
const tudo = JSON.stringify({ loja, catalogo, produtos });
conferir(!/obrigação de pagar/i.test(tudo), 'sem «obrigação de pagar»');
conferir(!R.problemas.toString().includes('eco-friendly'), 'sem alegações ecológicas nas regras');
conferir(!/ecol[óo]gic|sustent[áa]ve|eco-?friendly|biodegrad/i.test(tudo), 'sem alegações ecológicas no conteúdo');

console.log(`${ok} testes certos${falhas.length ? `, ${falhas.length} falhas:\n - ` + falhas.join('\n - ') : ''}`);
process.exit(falhas.length ? 1 : 0);
