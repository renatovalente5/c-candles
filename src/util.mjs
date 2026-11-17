// Peças comuns do gerador: caminhos, escapes, fotografias, ícones e preços.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const RAIZ = fileURLToPath(new URL('..', import.meta.url));
// --base=/c-candles --site=https://… --producao (ou as variáveis BASE, SITE_URL e PRODUCAO=1)
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3);
export const BASE = (arg('base') ?? process.env.BASE ?? '').replace(/\/$/, '');
export const SITE_URL = (arg('site') ?? process.env.SITE_URL ?? 'http://127.0.0.1:8977').replace(/\/$/, '');
export const PRODUCAO = process.argv.includes('--producao') || process.env.PRODUCAO === '1';
// a pré-visualização (GitHub Pages) não vai ao Google
export const PREVIA = !PRODUCAO;

export const lerTexto = (f) => readFileSync(RAIZ + f, 'utf8');
export const ler = (f) => JSON.parse(lerTexto(f));

export const url = (caminho = '/') => BASE + caminho;
export const absoluto = (caminho = '/') => SITE_URL + BASE + caminho;

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/** 12 → «12,00 €» (com espaço fino inseparável antes do €). */
export function euro(n) {
  return n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

// ── Fotografias ──
// As versões web (scripts/imagens.py → .cache/imagens/manifesto.json) e a descrição e o foco de
// cada uma (content/fotos.json). O build.mjs carrega-as antes de gerar as páginas.
export const MANIFESTO = RAIZ + '.cache/imagens/manifesto.json';
export const FOTOS = {};
export function carregarFotos(indice) {
  if (!existsSync(MANIFESTO)) throw new Error('faltam as imagens: correr python3 scripts/imagens.py');
  const m = JSON.parse(readFileSync(MANIFESTO, 'utf8')).fotos;
  for (const [nome, v] of Object.entries(m)) {
    if (!indice[nome]) continue;
    FOTOS[nome] = { ...v, alt: indice[nome].alt, foco: indice[nome].foco || '50% 50%' };
  }
  return FOTOS;
}
const ficheiroDe = (f, nome, w, fmt) => url(`/assets/img/${nome}-${f.resumo}-${w}.${fmt}`);
// a versão JPEG (o cartão de partilha e o JSON-LD: o WhatsApp não lê AVIF)
export const fotoJpg = (nome) => { const f = FOTOS[nome]; return f ? absoluto(`/assets/img/${nome}-${f.resumo}-${f.jpg}.jpg`) : null; };
// a miniatura do carrinho (a de 360, em WebP)
export const fotoPequena = (nome) => { const f = FOTOS[nome]; return f ? ficheiroDe(f, nome, f.larguras[0], 'webp') : ''; };
// a versão média em WebP (a fotografia que muda com o aroma, no browser)
export const fotoMedia = (nome) => { const f = FOTOS[nome]; return f ? ficheiroDe(f, nome, f.larguras[Math.min(2, f.larguras.length - 1)], 'webp') : ''; };

/** <picture> com AVIF + WebP em todas as larguras. alt '' = decorativa. */
export function foto(nome, { sizes = '100vw', classe = '', prioridade = false, lazy = !prioridade, alt, extra = '' } = {}) {
  const f = FOTOS[nome];
  if (!f) throw new Error('fotografia em falta: ' + nome);
  const set = (fmt) => f.larguras.map((w) => `${ficheiroDe(f, nome, w, fmt)} ${w}w`).join(', ');
  const meio = f.larguras[Math.min(1, f.larguras.length - 1)];
  const texto = alt === undefined ? f.alt : alt;
  return `<picture${classe ? ` class="${classe}"` : ''}>`
    + (f.formatos.includes('avif') ? `<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">` : '')
    + `<img src="${ficheiroDe(f, nome, meio, 'webp')}" srcset="${set('webp')}" sizes="${sizes}" width="${f.largura}" height="${f.altura}" alt="${esc(texto)}"`
    + ` style="object-position:${f.foco}"${prioridade ? ' fetchpriority="high"' : ''}${lazy && !prioridade ? ' loading="lazy" decoding="async"' : ''}${extra}>`
    + `</picture>`;
}

// ── A marca (o logótipo verdadeiro, recortado do fundo: _cliente/ferramentas/logotipo.py) ──
const marca = (f) => url('/assets/marca/' + f);
/** O logótipo horizontal (—— C'CANDLES —— / velas aromáticas), 530×68. */
export function logoPalavra(largura = 220, classe = 'logo-palavra') {
  return `<picture class="${classe}"><source type="image/webp" srcset="${marca('logo-palavra-240.webp')} 240w, ${marca('logo-palavra-480.webp')} 480w" sizes="${largura}px">`
    + `<img src="${marca('logo-palavra-480.png')}" width="530" height="68" alt="C'Candles, velas aromáticas"></picture>`;
}
/** O «C» com a chama, 467×493. */
export function logoSimbolo(largura = 48, classe = 'logo-simbolo', alt = '') {
  return `<picture class="${classe}"><source type="image/webp" srcset="${marca('logo-simbolo-64.webp')} 64w, ${marca('logo-simbolo-128.webp')} 128w, ${marca('logo-simbolo-256.webp')} 256w" sizes="${largura}px">`
    + `<img src="${marca('logo-simbolo-128.png')}" width="467" height="493" alt="${esc(alt)}"></picture>`;
}
/** O logótipo inteiro («C» + palavra), 530×611. */
export function logoCompleto(largura = 220, classe = 'logo-completo') {
  return `<picture class="${classe}"><source type="image/webp" srcset="${marca('logo-completo-240.webp')} 240w, ${marca('logo-completo-480.webp')} 480w" sizes="${largura}px">`
    + `<img src="${marca('logo-completo-480.png')}" width="530" height="611" alt="C'Candles, velas aromáticas"></picture>`;
}

// ── Ícones (traço de 1,6, cantos redondos: a linha fina da chama do logótipo) ──
const TRACOS = {
  menu: '<path d="M4 8h16M4 16h16"/>',
  fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
  saco: '<path d="M5.5 8.5h13l-1 11.5h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
  whatsapp: '<path d="M4.2 19.8l1.1-3.9A8 8 0 1 1 8.3 19z"/><path d="M9.1 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.2-.1.4 0 .5.5.9 1.3 1.7 2.3 2.2.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5v.5c0 .4-.2.8-.6 1-.6.3-1.5.4-2.7-.1-1.7-.7-3.2-2.2-4-3.7-.6-1.1-.6-2-.4-2.6z"/>',
  certo: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  carrinha: '<path d="M3 7h11v9H3zM14 10h3.5l3 3v3H14"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  voltar: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  menos: '<path d="M5 12h14"/>',
  chama: '<path d="M12 21c-3.3 0-5.5-2.3-5.5-5.3 0-3.6 3.3-5.4 4.2-9.7 2.9 2.2 6.8 5.6 6.8 9.7 0 3-2.2 5.3-5.5 5.3z"/><path d="M12 21c-1.3 0-2.2-.9-2.2-2.2 0-1.6 1.4-2.4 2.2-4 .9 1.6 2.2 2.4 2.2 4 0 1.3-.9 2.2-2.2 2.2z"/>',
  presente: '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-1.5-3.5-6-3.5-5 0m5 0c1.5-3.5 6-3.5 5 0"/>',
  local: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  mao: '<path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V11m0-1.5V5a1.5 1.5 0 0 1 3 0v5m0-1a1.5 1.5 0 0 1 3 0v4.5c0 4-2.7 6.5-6 6.5-2.5 0-4-1.2-5.3-3.2L4 14.7a1.5 1.5 0 0 1 2.4-1.8L8 14.5"/>',
  cadeado: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  folha: '<path d="M5 19C5 10 11 5 20 5c0 9-5 15-14 14z"/><path d="M5 19 13 11"/>',
  aspas: '<path d="M10 7c-3 1-4.5 3.5-4.5 6.5V17H10v-4H7.5c0-2 1-3.5 2.5-4zM18.5 7c-3 1-4.5 3.5-4.5 6.5V17h4.5v-4H16c0-2 1-3.5 2.5-4z"/>',
  troca: '<path d="M4 9h13l-3.5-3.5M20 15H7l3.5 3.5"/>',
  relogio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  olho: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  cartao: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18M7 14.5h3"/>',
  lixo: '<path d="M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7"/>',
};
export function icone(nome, classe = 'icone') {
  return `<svg class="${classe}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${TRACOS[nome]}</svg>`;
}

// O que ainda não foi dito (os dados legais): na pré-visualização, um marcador à vista;
// em produção as regras param a publicação antes de chegar aqui.
export const porConfirmar = (o_que) => `[por confirmar: ${o_que}]`;

/** Mensagem de WhatsApp para a loja (wa.me com o texto já escrito). */
export const whatsapp = (numero, texto = '') => `https://wa.me/${numero}${texto ? '?text=' + encodeURIComponent(texto) : ''}`;
