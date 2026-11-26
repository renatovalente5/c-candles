// O ESQUELETO de todas as páginas: <head> (SEO, partilha, letras, CSS), o topo, o menu de ecrã inteiro do
// telemóvel (FORA do <header>: o vidro do topo faria dele a caixa do position:fixed), a gaveta do carrinho,
// o rodapé e os scripts. Desenho A «Porcelana» (propostas/a.mjs), escolhido para o site a 17 nov 2026.
import { livroReclamacoes } from '../legal-comum/index.mjs';
import { url, absoluto, esc, icone, logoPalavra, logoCompleto, PREVIA, BASE, whatsapp } from './util.mjs';

export const VERSAO = { css: '', js: '' }; // preenchido pelo build (resumo dos ficheiros: cache do GitHub Pages)
export const MENU = [
  ['Natal', '/natal/'],
  ['Loja', '/loja/'],
  ['Aromas', '/aromas/'],
  ['Lembranças', '/lembrancas/'],
  ['Sobre', '/sobre/'],
];
// No telemóvel, em vez do botão «Menu»: uma barra de secções por baixo do logótipo (pedido da Cristiana, 26 nov 2026)
export const MENU_TELEMOVEL = [
  ['Natal', '/natal/'],
  ['Queimadores', '/loja/queimadores/'],
  ['Wax melts', '/loja/wax-melts/'],
  ['Velas', '/loja/velas/'],
  ['Lembranças', '/lembrancas/'],
];

function topo(caminho, { simples = false } = {}) {
  const atual = (h) => (caminho === h || (h !== '/' && caminho.startsWith(h)) || (h === '/loja/' && (caminho.startsWith('/produtos/') || caminho.startsWith('/outono/'))) ? ' aria-current="page"' : '');
  if (simples) {
    return `<header class="topo topo--simples"><div class="contentor topo__grelha">
  <a class="topo__voltar" href="${url('/carrinho/')}">${icone('voltar', 'icone icone--p')}<span>Carrinho</span></a>
  <a class="topo__logo" href="${url('/')}" aria-label="C'Candles, página inicial">${logoPalavra(200)}</a>
  <span class="topo__seguro">${icone('cadeado', 'icone icone--p')}<span>Pagamento seguro</span></span>
</div></header>`;
  }
  return `<header class="topo"><div class="contentor topo__grelha">
  <nav class="topo__nav" aria-label="Principal">${MENU.map(([n, h]) => `<a href="${url(h)}"${atual(h)}>${n}</a>`).join('')}</nav>
  <button class="topo__botao topo__menu" type="button" aria-expanded="false" aria-controls="menu" data-menu>${icone('menu')}<span class="topo__rotulo">Menu</span></button>
  <a class="topo__logo" href="${url('/')}" aria-label="C'Candles, página inicial">${logoPalavra(210)}</a>
  <div class="topo__dir">
    <a class="topo__botao topo__saco" href="${url('/carrinho/')}" data-abrir-carrinho aria-label="Carrinho">${icone('saco')}<span class="topo__conta" data-conta hidden>0</span></a>
  </div>
</div>
<nav class="topo__links" aria-label="Secções">${MENU_TELEMOVEL.map(([n, h]) => `<a href="${url(h)}"${caminho.startsWith(h) ? ' aria-current="page"' : ''}>${n}</a>`).join('')}</nav>
</header>`;
}

function menuTelemovel(loja, catalogo) {
  const cats = catalogo.categorias.map((c) => `<li><a href="${url(`/loja/${c.id}/`)}">${esc(c.nome)}</a></li>`).join('');
  return `<div class="menu" id="menu" hidden>
  <nav aria-label="Menu" class="menu__nav">
    <p class="etiqueta">Loja</p>
    <ul class="menu__grande">${cats}<li><a href="${url('/lembrancas/')}">Lembranças</a></li></ul>
    <p class="etiqueta">Coleções</p>
    <ul class="menu__medio"><li><a href="${url('/natal/')}">A Essência do Natal</a></li><li><a href="${url('/outono/')}">A Magia do Outono</a></li><li><a href="${url('/aromas/')}">Os aromas</a></li></ul>
    <ul class="menu__pequeno"><li><a href="${url('/sobre/')}">Sobre</a></li><li><a href="${url('/ajuda/')}">Ajuda</a></li><li><a href="${url('/contactos/')}">Contactos</a></li></ul>
  </nav>
  <div class="menu__fundo"><a class="botao botao--claro" href="${whatsapp(loja.whatsapp)}" rel="noopener">${icone('whatsapp', 'icone icone--p')} WhatsApp</a><a class="botao botao--claro" href="https://www.instagram.com/${loja.instagram}/" rel="noopener">${icone('instagram', 'icone icone--p')} Instagram</a></div>
</div>`;
}

function gaveta() {
  return `<dialog class="gaveta" id="gaveta" aria-labelledby="gaveta-titulo">
  <div class="gaveta__caixa">
    <div class="gaveta__topo"><h2 id="gaveta-titulo">Carrinho</h2><button class="topo__botao" type="button" data-fechar aria-label="Fechar o carrinho">${icone('fechar')}</button></div>
    <p class="gaveta__aviso" data-aviso hidden role="status"></p>
    <div class="gaveta__corpo" data-linhas></div>
    <div class="gaveta__pe" data-pe hidden>
      <dl class="contas"><div><dt>Subtotal</dt><dd data-subtotal></dd></div><div class="contas__nota"><dt>Portes</dt><dd>Calculados no passo seguinte</dd></div></dl>
      <a class="botao botao--largo" href="${url('/finalizar/')}">Finalizar compra ${icone('seta', 'icone icone--p')}</a>
      <button class="botao botao--claro botao--largo" type="button" data-fechar>Continuar a ver</button>
    </div>
  </div>
</dialog>`;
}

function rodape(loja, catalogo) {
  return `<footer class="rodape"><div class="contentor">
  <div class="rodape__colunas">
    <div class="rodape__marca">
      <a href="${url('/')}" aria-label="C'Candles, página inicial">${logoCompleto(112)}</a>
      <p>Queimadores, aromas e lembranças feitos à mão em Oliveira de Azeméis.</p>
      <div class="redes"><a href="https://www.instagram.com/${loja.instagram}/" rel="noopener" aria-label="Instagram da C'Candles">${icone('instagram', 'icone icone--p')}</a><a href="${whatsapp(loja.whatsapp)}" rel="noopener" aria-label="WhatsApp da C'Candles">${icone('whatsapp', 'icone icone--p')}</a></div>
    </div>
    <div><h2>Loja</h2><ul><li><a href="${url('/natal/')}">Natal</a></li>${catalogo.categorias.map((c) => `<li><a href="${url(`/loja/${c.id}/`)}">${esc(c.nome)}</a></li>`).join('')}<li><a href="${url('/lembrancas/')}">Lembranças</a></li><li><a href="${url('/aromas/')}">Aromas</a></li></ul></div>
    <div><h2>Ajuda</h2><ul><li><a href="${url('/ajuda/#como-usar')}">Como usar wax melts</a></li><li><a href="${url('/ajuda/')}">Perguntas frequentes</a></li><li><a href="${url('/envios-e-devolucoes/')}">Envios e devoluções</a></li><li><a href="${url('/sobre/')}">Sobre</a></li><li><a href="${url('/contactos/')}">Contactos</a></li></ul></div>
    <div><h2>Encomendas</h2><ul class="rodape__lista">
      <li>${icone('whatsapp', 'icone icone--p')}<a href="${whatsapp(loja.whatsapp)}" rel="noopener">WhatsApp</a></li>
      <li>${icone('instagram', 'icone icone--p')}<a href="https://www.instagram.com/${loja.instagram}/" rel="noopener">@${esc(loja.instagram)}</a></li>
      <li>${icone('carrinha', 'icone icone--p')}<span>Envios para todo o país</span></li>
      <li>${icone('cadeado', 'icone icone--p')}<span>MB WAY, Multibanco e cartão</span></li>
    </ul></div>
  </div>
  <div class="rodape__legal"><span>© ${new Date().getFullYear()} C'Candles</span><div><a href="${url('/termos/')}">Termos</a><a href="${url('/privacidade/')}">Privacidade</a><a href="${url('/envios-e-devolucoes/')}">Devoluções</a>${livroReclamacoes({ classe: 'lr-discreto' })}</div></div>
</div></footer>`;
}

/**
 * Uma página inteira.
 * { caminho, titulo, descricao, corpo, indexar, imagem (URL absoluto do og:image), ld: [objectos], simples, classe }
 */
export function pagina({ loja, catalogo }, { caminho, titulo, descricao, corpo, indexar = true, imagem, ld = [], simples = false, classe = '' }) {
  const tituloCompleto = caminho === '/' ? titulo : `${titulo} · C'Candles`;
  const robots = PREVIA || !indexar ? '<meta name="robots" content="noindex">' : '';
  const og = imagem || absoluto('/assets/marca/partilha.jpg');
  return `<!doctype html>
<html lang="pt-PT" data-base="${BASE}"${classe ? ` class="${classe}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>@media (prefers-reduced-motion: no-preference){@view-transition{navigation:auto}}</style>
<title>${esc(tituloCompleto)}</title>
<meta name="description" content="${esc(descricao)}">
${robots}
<link rel="canonical" href="${absoluto(caminho)}">
<meta name="theme-color" content="#FBF8F5">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_PT"><meta property="og:site_name" content="C'Candles">
<meta property="og:title" content="${esc(tituloCompleto)}"><meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${absoluto(caminho)}"><meta property="og:image" content="${esc(og)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${url('/assets/marca/favicon.ico')}" sizes="32x32"><link rel="icon" href="${url('/assets/marca/icone-192.png')}" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="${url('/assets/marca/icone-180.png')}">
<link rel="preload" href="${url('/assets/fontes/libre-bodoni-400-700-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${url('/assets/css/site.css')}?v=${VERSAO.css}">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')}
<script type="module" src="${url('/assets/js/site.js')}?v=${VERSAO.js}"></script>
</head>
<body>
<a class="saltar" href="#conteudo">Saltar para o conteúdo</a>
${topo(caminho, { simples })}
${simples ? '' : menuTelemovel(loja, catalogo)}
<main id="conteudo">
${corpo}
</main>
${simples ? `<footer class="rodape rodape--simples"><div class="contentor rodape__legal"><span>© ${new Date().getFullYear()} C'Candles</span><div><a href="${url('/termos/')}">Termos</a><a href="${url('/privacidade/')}">Privacidade</a><a href="${url('/envios-e-devolucoes/')}">Devoluções</a>${livroReclamacoes({ classe: 'lr-discreto' })}</div></div></footer>` : rodape(loja, catalogo)}
${gaveta()}
<div class="aviso-flutuante" role="status" aria-live="polite" data-aviso-flutuante></div>
</body>
</html>
`;
}
