// AS PÁGINAS da loja. Cada função devolve { caminho, titulo, descricao, corpo, ... } para o layout.
// Regras do Renato que aqui moram: categorias com a fotografia em destaque e o nome por baixo; sem secção de
// passos nem frase de fecho na página inicial; o cartão não compra (leva à ficha); separadores que são
// páginas não voltam ao topo; as garantias uma vez só, no fim da página inicial; nada de informação repetida.
import { url, esc, euro, foto, fotoJpg, fotoMedia, fotoPequena, icone, logoSimbolo, whatsapp, FOTOS } from './util.mjs';
import { opcoesDe, modoDoAroma, compravel, centimos } from './lib/regras.mjs';
import { TITULO_INICIO, DESTINOS, CATEGORIAS as SEO_CAT, COLECOES as SEO_COL, ldLoja, ldSite, ldMigalhas, ldProduto, descricaoDoProduto, resumir } from './seo.mjs';

const seta = () => icone('seta', 'icone icone--p');
const COLECAO_URL = { 'natal-2026': '/natal/', 'outono-2026': '/outono/' };
export const urlDaColecao = (id) => COLECAO_URL[id];

// ── O que se mostra num cartão ──
export function precoTexto(p) {
  if (p.sobConsulta) return 'Preço sob consulta';
  const varia = opcoesDe(p).some((o) => o.valores.some((v) => v.suplemento > 0));
  return (varia ? 'desde ' : '') + euro(p.preco);
}
function pista(p) {
  if (p.sobConsulta) return '';
  if (p._notas?.length) return p._notas.join(' · ');
  if (p.categoria === 'queimadores') return 'Sozinho ou com wax';
  if (p.aromas?.length && !opcoesDe(p).length) return `${p.peso ? p.peso + ' · ' : ''}${p.aromas.length} aromas`;
  if (p.peso) return `${p.peso}${p.detalhes?.[0]?.startsWith('Cerca de') ? ' · ' + p.detalhes[0].replace('Cerca de ', '').replace(' de queima.', '') : ''}`;
  return '';
}
export function cartao(p, { sizes = '(max-width:640px) 46vw, (max-width:1100px) 30vw, 280px', prioridade = false } = {}) {
  const segunda = p.fotos[1] && FOTOS[p.fotos[1]] ? `<div class="cartao__segunda" aria-hidden="true">${foto(p.fotos[1], { sizes, alt: '' })}</div>` : '';
  return `<article class="cartao${segunda ? ' cartao--duas' : ''}">
  <div class="cartao__foto">${foto(p.fotos[0], { sizes, prioridade })}${segunda}</div>
  <h3 class="cartao__nome"><a href="${url(`/produtos/${p.slug}/`)}${p._ancora || ''}">${esc(p.nome)}</a></h3>
  <p class="cartao__preco">${precoTexto(p)}</p>
  ${p.limitada ? '<p class="cartao__etiqueta">Edição limitada</p>' : `<p class="cartao__pista">${esc(pista(p))}</p>`}
</article>`;
}
const grelha = (lista, opts) => `<div class="grelha">${lista.map((p) => cartao(p, opts)).join('')}</div>`;

function cabeca({ etiqueta, titulo, frase, ligacao }) {
  return `<div class="cabeca"><div>${etiqueta ? `<p class="etiqueta">${etiqueta}</p>` : ''}<h2>${titulo}</h2>${frase ? `<p class="cabeca__frase">${frase}</p>` : ''}</div>${ligacao ? `<a class="ligacao" href="${url(ligacao[1])}">${ligacao[0]} ${seta()}</a>` : ''}</div>`;
}

// ── Os aromas ──
const notasTexto = (a) => (a.piramide ? [...a.piramide.saida, ...a.piramide.coracao, ...a.piramide.fundo] : a.notas || []);
function piramide(a) {
  if (a.piramide) {
    return `<dl class="piramide"><div><dt>Saída</dt><dd>${a.piramide.saida.map(esc).join(' · ')}</dd></div><div><dt>Coração</dt><dd>${a.piramide.coracao.map(esc).join(' · ')}</dd></div><div><dt>Fundo</dt><dd>${a.piramide.fundo.map(esc).join(' · ')}</dd></div></dl>`;
  }
  return `<dl class="piramide"><div><dt>Notas</dt><dd>${(a.notas || []).map(esc).join(' · ')}</dd></div></dl>`;
}
const nomeColecao = (catalogo, id) => catalogo.colecoes.find((c) => c.id === id)?.nome || '';
const curtoColecao = (id) => (id === 'natal-2026' ? 'Natal' : 'Outono');

// ═════════════════════════════ PÁGINA INICIAL ═════════════════════════════
export function inicio(d) {
  const { loja, catalogo, produtos } = d;
  const natal = catalogo.colecoes.find((c) => c.id === 'natal-2026');
  const daNatal = d.lista.filter((p) => p.colecoes?.includes('natal-2026'));
  const destaques = ['queimador-correio-do-pai-natal', 'queimador-rena', 'queimador-pai-natal', 'queimador-biscoitos-de-natal'].map((s) => produtos[s]).filter(Boolean);
  const sub = { queimadores: `${d.lista.filter((p) => p.categoria === 'queimadores').length} modelos`, 'wax-melts': `${catalogo.aromas.length} aromas`, velas: `${d.lista.filter((p) => p.categoria === 'velas').length} velas`, decoracao: `${d.lista.filter((p) => p.categoria === 'decoracao').length} peças` };
  const a = catalogo.aromas.find((x) => x.id === 'sunday-in-cashmere');
  const pills = (col) => catalogo.aromas.filter((x) => x.colecao === col).map((x) => `<a class="pilula" href="${url(`/aromas/#${x.id}`)}" style="--c:${x.cor}"><i aria-hidden="true"></i>${esc(x.nome)}</a>`).join('');
  const anel = `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="circ" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"/></defs><text><textPath href="#circ">Feito à mão · Oliveira de Azeméis ·</textPath></text></svg>`;
  const corpo = `
<section class="capa"><div class="contentor capa__grelha">
  <div class="capa__texto">
    <p class="etiqueta">Natal 2026 · Edição limitada</p>
    <h1>O Natal mais <em>cheiroso</em> de sempre.</h1>
    <p class="capa__frase">Queimadores novos e oito aromas de Natal, feitos à mão em Oliveira de Azeméis e em quantidades limitadas.</p>
    <div class="botoes"><a class="botao" href="${url('/natal/')}">Ver a coleção de Natal ${seta()}</a><a class="botao botao--claro" href="${url('/aromas/')}">Conhecer os aromas</a></div>
  </div>
  <div class="capa__fotos">
    <a class="capa__f1" href="${url('/produtos/queimador-correio-do-pai-natal/')}" tabindex="-1" aria-hidden="true">${foto('natal-correio', { sizes: '(max-width:900px) 92vw, 600px', prioridade: true, alt: '' })}</a>
    <a class="capa__f2" href="${url('/produtos/queimador-casinha-de-gengibre/')}" tabindex="-1" aria-hidden="true">${foto('natal-casinha', { sizes: '(max-width:900px) 34vw, 250px', alt: '' })}</a>
    <div class="selo">${anel}${logoSimbolo(36)}</div>
  </div>
</div></section>

<section class="seccao seccao--primeira"><div class="contentor">
  ${cabeca({ etiqueta: 'A loja', titulo: 'Para cada <em>cantinho</em>', ligacao: ['Ver a loja', '/loja/'] })}
  <div class="categorias">${catalogo.categorias.map((c) => `<a class="categoria" href="${url(`/loja/${c.id}/`)}"><div class="categoria__foto">${foto(c.foto, { sizes: '(max-width:900px) 46vw, 290px' })}</div><h3>${esc(c.nome)} <small>${sub[c.id]}</small></h3></a>`).join('')}</div>
</div></section>

<section class="seccao"><div class="contentor">
  ${cabeca({ etiqueta: natal.etiqueta, titulo: esc(natal.nome), frase: 'Escolhe o queimador e o aroma que vai com ele. Com snapbar ou wax melts, poupas 1 €.', ligacao: [`Ver a coleção (${daNatal.length})`, '/natal/'] })}
  ${grelha(destaques)}
</div></section>

<section class="seccao"><div class="contentor aromas-inicio">
  <div>
    ${cabeca({ etiqueta: `${catalogo.aromas.length} aromas`, titulo: 'Escolhe o teu <em>cheirinho</em>', frase: 'Cada aroma tem notas de saída, de coração e de fundo. Em snapbar, wax melts ou vela.' })}
    <p class="aromas-inicio__grupo">Natal</p><div class="pilulas">${pills('natal-2026')}</div>
    <p class="aromas-inicio__grupo">Outono</p><div class="pilulas">${pills('outono-2026')}</div>
  </div>
  <article class="aroma-destaque">
    <div class="aroma-destaque__foto">${foto(a.foto, { sizes: '(max-width:900px) 92vw, 300px', alt: '' })}</div>
    <div class="aroma-destaque__texto">
      <p class="etiqueta">O mais pedido</p>
      <h3>${esc(a.nome)}</h3>
      <p>${esc(a.frase)}</p>
      ${piramide(a)}
      <div class="formatos"><a href="${url(`/produtos/snapbar/#aroma=${a.id}`)}">Snapbar · ${euro(4)}</a><a href="${url('/produtos/vela-sunday-in-cashmere/')}">Vela · ${euro(13.5)}</a></div>
    </div>
  </article>
</div></section>

<section class="seccao"><div class="contentor lembrancas-inicio">
  <div class="lembrancas-inicio__texto">
    <p class="etiqueta">Lembranças personalizadas</p>
    <h2>Para quem quer cada ocasião <em>inesquecível</em></h2>
    <p>Batizados, comunhões, casamentos, baby showers e padrinhos: lembranças feitas à mão, com o nome, a data e as cores do teu dia.</p>
    <ul class="ocasioes">${catalogo.ocasioes.map((o) => `<li><a href="${url(`/lembrancas/#${o.id}`)}">${esc(o.nome)}</a></li>`).join('')}</ul>
    <div class="botoes"><a class="botao" href="${url('/lembrancas/#pedir')}">Pedir orçamento ${seta()}</a></div>
  </div>
  <div class="mosaico">
    <div>${foto('lem-padrinhos-madrinha', { sizes: '(max-width:900px) 46vw, 340px' })}</div>
    <div>${foto('lem-casamento-rosas', { sizes: '(max-width:900px) 46vw, 340px' })}</div>
    <div>${foto('lem-batizado-lucas', { sizes: '(max-width:900px) 46vw, 340px' })}</div>
  </div>
</div></section>

<section class="seccao"><div class="contentor"><div class="sobre-inicio">
  <div class="sobre-inicio__foto">${foto('natal-anjinhos', { sizes: '(max-width:900px) 92vw, 420px' })}</div>
  <div>${logoSimbolo(44)}<h2>Feito à mão, uma peça de cada vez</h2>
  <p>A C'Candles nasceu em 2023, em Oliveira de Azeméis, do gosto enorme da Cristiana Moreira por velas. Hoje são queimadores, aromas e lembranças que enchem casas e festas de cheirinho.</p>
  <a class="ligacao" href="${url('/sobre/')}">A nossa história ${seta()}</a></div>
</div></div></section>

<section class="seccao seccao--ultima"><div class="contentor"><ul class="garantias">
  <li><span class="garantias__icone">${icone('mao', 'icone icone--p')}</span><div><strong>Feito à mão</strong>Em Oliveira de Azeméis, peça a peça.</div></li>
  <li><span class="garantias__icone">${icone('carrinha', 'icone icone--p')}</span><div><strong>Envio para todo o país</strong>Em até ${esc(loja.entrega.prazo.replace('até ', ''))}.</div></li>
  <li><span class="garantias__icone">${icone('cadeado', 'icone icone--p')}</span><div><strong>Pagamento seguro</strong>MB WAY, Multibanco ou cartão.</div></li>
  <li><span class="garantias__icone">${icone('local', 'icone icone--p')}</span><div><strong>Entrega em mão</strong>Em Oliveira de Azeméis, sem portes.</div></li>
</ul></div></section>`;
  return {
    caminho: '/', titulo: `C'Candles — ${TITULO_INICIO}`,
    descricao: 'Queimadores, wax melts em 16 aromas, velas e lembranças personalizadas, feitos à mão em Oliveira de Azeméis. Coleção de Natal 2026 em quantidades limitadas.',
    corpo, ld: [ldSite(loja), ldLoja(loja)], classe: 'pagina-inicio',
  };
}

// ═════════════════════════════ LOJA E CATEGORIAS ═════════════════════════════
// Os separadores são páginas (/loja/, /loja/<categoria>/): ao trocar, a página fica onde estava
// (o site.js guarda o lugar da fila; o script em linha repõe-no antes da primeira pintura).
const LUGAR = `<script>(function(){try{var l=JSON.parse(sessionStorage.getItem('cc:lugar')||'null');if(!l||l.para!==location.pathname||Date.now()-l.t>15000)return;var f=document.querySelector('[data-separadores]');if(!f)return;document.documentElement.dataset.lugar='1';var por=function(){var r=f.getBoundingClientRect();var h=document.documentElement;var s=h.style.scrollBehavior;h.style.scrollBehavior='auto';window.scrollTo(0,r.top+window.scrollY-l.topo);h.style.scrollBehavior=s;var u=f.querySelector('ul');if(u)u.scrollLeft=l.esq||0;};por();var parar=function(){por=function(){};};['wheel','touchstart','keydown','mousedown'].forEach(function(e){addEventListener(e,parar,{once:true,passive:true});});document.addEventListener('DOMContentLoaded',function(){por();});addEventListener('load',function(){por();});if(document.fonts)document.fonts.ready.then(function(){por();});}catch(e){}})();</script>`;

function separadores(catalogo, atual) {
  const itens = [['Tudo', '/loja/', null], ['Natal', '/natal/', 'natal'], ...catalogo.categorias.map((c) => [c.nome, `/loja/${c.id}/`, c.id])];
  return `<nav class="separadores" data-separadores aria-label="Categorias"><ul>${itens.map(([n, h, id]) => `<li><a href="${url(h)}"${id === atual ? ' aria-current="page"' : ''}>${esc(n)}</a></li>`).join('')}</ul></nav>`;
}
const ordenar = (lista) => [...lista].sort((a, b) => (a.sobConsulta ? 1 : 0) - (b.sobConsulta ? 1 : 0) || (a.ordem ?? 500) - (b.ordem ?? 500));

export function loja(d, categoria = null) {
  const { catalogo } = d;
  const c = categoria ? catalogo.categorias.find((x) => x.id === categoria) : null;
  const lista = ordenar(d.lista.filter((p) => !c || p.categoria === c.id));
  const caminho = c ? `/loja/${c.id}/` : '/loja/';
  const titulo = c ? c.nome : 'Loja';
  const frase = c ? c.frase : 'Queimadores, wax melts, velas e decoração, feitos à mão em Oliveira de Azeméis. Escolhe o aroma na ficha de cada peça.';
  const corpo = `
<section class="pagina-topo"><div class="contentor">
  <h1>${esc(titulo)}</h1>
  <p class="pagina-topo__frase">${esc(frase)}</p>
</div></section>
<section class="contentor loja">
  ${separadores(catalogo, c?.id || null)}${LUGAR}
  <div class="loja__painel" data-painel>
    <p class="loja__conta">${lista.length} ${lista.length === 1 ? 'peça' : 'peças'}</p>
    ${grelha(lista)}
    ${!c ? '' : `<p class="loja__mais">Procuras lembranças para um batizado ou casamento? <a href="${url('/lembrancas/')}">Vê as lembranças personalizadas</a>.</p>`}
  </div>
</section>`;
  const seo = c ? SEO_CAT[c.id] : DESTINOS.loja;
  return {
    caminho, titulo: c ? seo?.titulo || c.nome : DESTINOS.loja.titulo, descricao: seo?.descricao || frase, corpo,
    ld: [ldMigalhas(c ? [['Início', '/'], ['Loja', '/loja/'], [c.nome, caminho]] : [['Início', '/'], ['Loja', '/loja/']])],
    imagem: c ? fotoJpg(c.foto) : undefined,
  };
}

// ═════════════════════════════ COLEÇÕES (/natal/, /outono/) ═════════════════════════════
export function colecao(d, id) {
  const { catalogo } = d;
  const c = catalogo.colecoes.find((x) => x.id === id);
  const caminho = COLECAO_URL[id];
  const lista = ordenar(d.lista.filter((p) => p.colecoes?.includes(id)));
  const aromas = catalogo.aromas.filter((a) => a.colecao === id);
  const corpo = `
<section class="colecao-capa colecao-capa--${c.tema}"><div class="contentor colecao-capa__grelha">
  <div class="colecao-capa__texto">
    <p class="etiqueta">${esc(c.etiqueta)}${c.limitada ? ' · Edição limitada' : ''}</p>
    <h1>${esc(c.nome)}</h1>
    <p>${esc(c.frase)}</p>
    <a class="ligacao" href="#pecas">Ver as ${lista.length} peças ${icone('seta', 'icone icone--p icone--baixo')}</a>
  </div>
  <div class="colecao-capa__fotos">${c.fotos.slice(0, 3).map((f, i) => `<div class="colecao-capa__f${i + 1}">${foto(f, { sizes: i ? '(max-width:900px) 30vw, 220px' : '(max-width:900px) 60vw, 420px', prioridade: i === 0 })}</div>`).join('')}</div>
</div></section>
<section class="seccao seccao--primeira"><div class="contentor">
  ${cabeca({ etiqueta: `${aromas.length} aromas`, titulo: `Os aromas de ${curtoColecao(id)}`, frase: 'Em snapbar de 35 g ou wax melts de 100 g. Toca num aroma para o escolher.' })}
  <div class="fila-aromas">${aromas.map((a) => cartaoAroma(a, catalogo)).join('')}</div>
</div></section>
<section class="seccao" id="pecas"><div class="contentor">
  ${cabeca({ titulo: 'As peças da coleção' })}
  ${grelha(lista)}
</div></section>`;
  const seo = SEO_COL[id];
  return { caminho, titulo: seo.titulo, descricao: seo.descricao, corpo, imagem: fotoJpg(c.foto), ld: [ldMigalhas([['Início', '/'], [c.nome, caminho]])] };
}

function cartaoAroma(a, catalogo, { comFormatos = true } = {}) {
  const vela = `vela-${a.id}`;
  return `<article class="aroma" id="${a.id}" style="--c:${a.cor}">
  <div class="aroma__topo">${a.foto ? foto(a.foto, { sizes: '(max-width:640px) 70vw, 300px', alt: '' }) : `<span class="aroma__inicial" aria-hidden="true">${esc(a.nome.charAt(0))}</span>`}</div>
  <div class="aroma__texto">
    <p class="aroma__col">${curtoColecao(a.colecao)}</p>
    <h3>${esc(a.nome)}</h3>
    <p class="aroma__frase">${esc(a.frase)}</p>
    ${piramide(a)}
    ${comFormatos ? `<div class="formatos"><a href="${url(`/produtos/snapbar/#aroma=${a.id}`)}">Snapbar · ${euro(4)}</a><a href="${url(`/produtos/wax-melts/#aroma=${a.id}`)}">Wax melts · ${euro(6.4)}</a>${catalogo._velas.has(vela) ? `<a href="${url(`/produtos/${vela}/`)}">Vela · ${euro(13.5)}</a>` : ''}</div>` : ''}
  </div>
</article>`;
}

// ═════════════════════════════ AROMAS ═════════════════════════════
export function aromas(d) {
  const { catalogo } = d;
  const grupo = (id) => `<section class="seccao${id === 'natal-2026' ? ' seccao--primeira' : ''}" id="${id === 'natal-2026' ? 'natal' : 'outono'}"><div class="contentor">
  ${cabeca({ etiqueta: catalogo.colecoes.find((c) => c.id === id).etiqueta, titulo: esc(nomeColecao(catalogo, id)) })}
  <div class="grelha-aromas">${catalogo.aromas.filter((a) => a.colecao === id).map((a) => cartaoAroma(a, catalogo)).join('')}</div>
</div></section>`;
  const corpo = `
<section class="pagina-topo"><div class="contentor">
  <h1>Os aromas</h1>
  <p class="pagina-topo__frase">Dezasseis cheirinhos, cada um com notas de saída, de coração e de fundo. O mesmo aroma serve a snapbar, os wax melts e, em alguns, a vela.</p>
  <nav class="saltos" aria-label="Coleções de aromas"><a href="#natal">Natal</a><a href="#outono">Outono</a><a href="${url('/ajuda/#como-usar')}">Como usar wax melts</a></nav>
</div></section>
${grupo('natal-2026')}
${grupo('outono-2026')}`;
  return { caminho: '/aromas/', titulo: DESTINOS.aromas.titulo, descricao: DESTINOS.aromas.descricao, corpo, imagem: fotoJpg('snap-sunday-in-cashmere'), ld: [ldMigalhas([['Início', '/'], ['Aromas', '/aromas/']])] };
}

// ═════════════════════════════ FICHA DO PRODUTO ═════════════════════════════
export function produto(d, p) {
  const { catalogo, loja } = d;
  const cat = catalogo.categorias.find((c) => c.id === p.categoria);
  const caminho = `/produtos/${p.slug}/`;
  const ops = opcoesDe(p);
  const modo = modoDoAroma(p);
  const aromaFixo = p.aroma ? catalogo.aromas.find((a) => a.id === p.aroma) : null;
  const base = typeof p.preco === 'number' ? centimos(p.preco) : 0;
  const etiqueta = p.colecoes?.length ? `${p.colecoes.map((c) => catalogo.colecoes.find((x) => x.id === c)?.etiqueta.replace('Coleção de ', '')).join(' · ')}${p.limitada ? ' · Edição limitada' : ''}` : esc(cat.nome);

  // A galeria: as fotografias do produto (a do aroma escolhido entra à frente, no browser)
  const fotosP = p.fotos.filter((f) => FOTOS[f]);
  const galeria = `<div class="galeria" data-galeria>
  <div class="galeria__faixa" data-faixa tabindex="0" aria-label="Fotografias de ${esc(p.nome)}">${fotosP.map((f, i) => `<figure class="galeria__foto" data-foto="${f}">${foto(f, { sizes: '(max-width:900px) 100vw, 640px', prioridade: i === 0, extra: i ? ' fetchpriority="low"' : '' })}</figure>`).join('')}</div>
  ${fotosP.length > 1 ? `<div class="galeria__nav"><span class="galeria__conta" data-conta-fotos aria-hidden="true">1/${fotosP.length}</span><div class="galeria__miniaturas">${fotosP.map((f, i) => `<button type="button" class="galeria__mini" data-ir="${i}" aria-label="Fotografia ${i + 1} de ${fotosP.length}"${i === 0 ? ' aria-current="true"' : ''}><img src="${fotoPequena(f)}" alt="" width="64" height="64" loading="lazy"></button>`).join('')}</div></div>` : ''}
</div>`;

  // As escolhas (a opção «Snapbar» leva uma miniatura da barrinha, que muda com o aroma escolhido)
  const fotoSnap = d.produtos.snapbar?.fotos?.[0];
  const valorTexto = (o, v, i) => {
    if (o.id === 'levar') {
      const total = base + v.suplemento;
      const soma = base + (v.nome.startsWith('Snapbar') ? 400 : v.nome.startsWith('Wax') ? 640 : 0);
      const poupa = v.suplemento && soma > total ? `<small>poupas ${euro((soma - total) / 100)}</small>` : '';
      const mini = v.nome.startsWith('Snapbar') && fotoSnap && FOTOS[fotoSnap] ? `<img class="opcao__miniatura" data-mini-snap src="${fotoPequena(fotoSnap)}" alt="" width="40" height="40" loading="lazy">` : '';
      return `${mini}<span class="opcao__nome">${esc(v.nome)}</span><span class="opcao__preco">${euro(total / 100)}${poupa}</span>`;
    }
    return `<span class="opcao__nome">${esc(v.nome)}</span>${v.suplemento || i === 0 ? `<span class="opcao__preco">${euro((base + v.suplemento) / 100)}</span>` : ''}`;
  };
  const opcoesHtml = ops.map((o) => `<fieldset class="escolha" data-opcao="${o.id}">
  <legend>${esc(o.nome)}</legend>
  <div class="opcoes opcoes--${o.id === 'levar' ? 'lista' : 'pilulas'}">${o.valores.map((v, i) => `<label class="opcao"><input type="radio" name="op-${o.id}" value="${i}"${i === 0 ? ' checked' : ''}${v.aroma ? ' data-pede-aroma' : ''}>${valorTexto(o, v, i)}</label>`).join('')}</div>
</fieldset>`).join('');

  const aromasDoProduto = (p.aromas || []).map((id) => catalogo.aromas.find((a) => a.id === id)).filter(Boolean);
  const grupoAromas = (col) => {
    const lista = aromasDoProduto.filter((a) => a.colecao === col);
    return lista.length ? `<p class="escolha__grupo">${curtoColecao(col)}</p><div class="opcoes opcoes--aromas">${lista.map((a) => `<label class="opcao opcao--aroma" style="--c:${a.cor}"><input type="radio" name="aroma" value="${a.id}" required><i aria-hidden="true"></i><span>${esc(a.nome)}</span></label>`).join('')}</div>` : '';
  };
  const aromaHtml = modo ? `<fieldset class="escolha escolha--aroma" data-escolha-aroma${modo === 'se-wax' ? ' data-so-com-wax hidden' : ''}>
  <legend>Aroma <span class="escolha__escolhido" data-aroma-nome></span></legend>
  ${grupoAromas('natal-2026')}${grupoAromas('outono-2026')}
  <div class="aroma-notas" data-notas hidden></div>
  <p class="campo__erro" data-erro-aroma hidden>Escolhe o aroma.</p>
</fieldset>` : '';

  const pers = p.personalizacao ? `<div class="campo">
  <label for="texto">${esc(p.personalizacao.rotulo)}${p.personalizacao.obrigatoria ? '' : ' <span class="campo__opcional">(opcional)</span>'}</label>
  <input id="texto" name="texto" type="text" maxlength="${p.personalizacao.max || 60}" autocomplete="off" aria-describedby="texto-ajuda"${p.personalizacao.obrigatoria ? ' required' : ''}>
  <p class="campo__ajuda" id="texto-ajuda">${esc(p.personalizacao.ajuda || '')} <span data-contador>0/${p.personalizacao.max || 60}</span></p>
</div>` : '';

  const comprar = compravel(p) ? `<form class="comprar" data-comprar data-slug="${p.slug}" novalidate>
  ${opcoesHtml}${aromaHtml}${pers}
  <div class="comprar__linha">
    <div class="quantidade" data-quantidade><button type="button" data-menos aria-label="Menos um">${icone('menos', 'icone icone--p')}</button><input name="qtd" type="number" inputmode="numeric" min="1" max="50" value="1" aria-label="Quantidade"><button type="button" data-mais aria-label="Mais um">${icone('mais', 'icone icone--p')}</button></div>
    <button class="botao botao--largo" type="submit" data-botao-comprar>Adicionar ao carrinho · <span data-total>${euro(base / 100)}</span></button>
  </div>
</form>` : `<div class="comprar comprar--consulta">
  <p>Esta peça faz-se por encomenda: a cor, o aroma e o preço combinam-se por mensagem.</p>
  <a class="botao botao--largo" href="${whatsapp(loja.whatsapp, `Olá! Gostava de saber o preço e a disponibilidade de: ${p.nome} (${url(caminho)})`)}" rel="noopener">${icone('whatsapp', 'icone icone--p')} Pedir pelo WhatsApp</a>
</div>`;

  const detalhes = [...(p.peso ? [`Peso: ${p.peso}`] : []), ...(p.detalhes || [])];
  const notasFixas = aromaFixo ? `<div class="ficha__notas"><p class="etiqueta">Notas de ${esc(aromaFixo.nome)}</p>${piramide(aromaFixo)}</div>` : '';
  const seguranca = ['queimadores', 'wax-melts', 'velas'].includes(p.categoria) ? `<div class="ficha__seguranca"><p class="etiqueta">Segurança</p><p>Nunca deixes uma vela ou um queimador aceso sem vigilância. Usa-o numa superfície estável e resistente ao calor, longe de crianças, animais e de coisas que ardam. Não mexas no queimador enquanto a cera estiver quente. <a href="${url('/ajuda/#como-usar')}">Como usar</a></p></div>` : '';

  // Combina com: o queimador pede wax; o wax pede um queimador; a vela pede o mesmo aroma noutro formato
  let combina = [];
  let combinaTitulo = 'Também podes gostar';
  let combinaFrase = '';
  if (p.categoria === 'queimadores') { combina = ['snapbar', 'wax-melts']; combinaTitulo = 'Completa com <em>wax</em>'; combinaFrase = 'O queimador funciona com wax melts ou com snapbar. O aroma escolhe-se na ficha de cada um.'; }
  else if (p.categoria === 'wax-melts') { combina = ['queimador-pai-natal', 'queimador-abobora', 'queimador-casinha-de-gengibre', 'queimador-nuvem']; combinaTitulo = 'Completa com um <em>queimador</em>'; }
  else if (p.categoria === 'velas' && p.aroma) { combina = ['snapbar', 'wax-melts']; combinaTitulo = 'O mesmo aroma noutros <em>formatos</em>'; combinaFrase = `${esc(aromaFixo?.nome || '')} também existe em snapbar e em wax melts, para usar num queimador.`; }
  else combina = d.lista.filter((x) => x.categoria === p.categoria && x.slug !== p.slug).slice(0, 4).map((x) => x.slug);
  const combinaLista = combina.map((s) => d.produtos[s]).filter((x) => x && x.slug !== p.slug);
  const parecidos = d.lista.filter((x) => x.categoria === p.categoria && x.slug !== p.slug && !combina.includes(x.slug)).slice(0, 4);
  const comAroma = (q) => (p.aroma && ['snapbar', 'wax-melts'].includes(q.slug) ? { ...q, _ancora: `#aroma=${p.aroma}` } : q);

  const corpo = `
<div class="contentor">
  <nav class="migalhas" aria-label="Migalhas"><a href="${url(`/loja/${cat.id}/`)}">${icone('voltar', 'icone icone--p')} ${esc(cat.nome)}</a></nav>
  <div class="ficha">
    ${galeria}
    <div class="ficha__info">
      <p class="etiqueta">${etiqueta}</p>
      <h1>${esc(p.nome)}</h1>
      <p class="ficha__preco" data-preco>${precoTexto(p)}</p>
      <p class="ficha__frase">${esc(p.frase)}</p>
      ${notasFixas}
      ${comprar}
      <ul class="ficha__entrega">
        <li>${icone('carrinha', 'icone icone--p')}<span>Envio para todo o país em ${esc(loja.entrega.prazo)}. Portes desde ${euro(Math.min(...loja.entrega.zonas.filter((z) => z.portes > 0).map((z) => z.portes)))}.</span></li>
        <li>${icone('local', 'icone icone--p')}<span>Entrega em mão em Oliveira de Azeméis, sem portes.</span></li>
        <li>${icone('troca', 'icone icone--p')}<span>Tens 14 dias para desistir depois de receberes. <a href="${url('/envios-e-devolucoes/')}">Envios e devoluções</a></span></li>
      </ul>
      ${detalhes.length ? `<ul class="ficha__detalhes">${detalhes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${seguranca}
    </div>
  </div>
</div>
${compravel(p) ? `<div class="barra-compra" data-barra-compra hidden><div class="contentor barra-compra__grelha"><div><p class="barra-compra__nome">${esc(p.nome)}</p><p class="barra-compra__preco" data-total-barra>${euro(base / 100)}</p></div><button class="botao" type="button" data-comprar-barra>Adicionar</button></div></div>` : ''}
${combinaLista.length > 2 ? `<section class="seccao"><div class="contentor">${cabeca({ titulo: combinaTitulo, frase: combinaFrase })}${grelha(combinaLista.slice(0, 4).map(comAroma))}</div></section>` : combinaLista.length ? `<section class="seccao"><div class="contentor combina"><div class="combina__texto"><h2>${combinaTitulo}</h2>${combinaFrase ? `<p>${combinaFrase}</p>` : ''}</div><div class="grelha grelha--duas">${combinaLista.map(comAroma).map((q) => cartao(q)).join('')}</div></div></section>` : ''}
${parecidos.length > 1 ? `<section class="seccao"><div class="contentor">${cabeca({ titulo: `Mais ${cat.nome.toLowerCase()}`, ligacao: ['Ver todos', `/loja/${cat.id}/`] })}${grelha(parecidos)}</div></section>` : ''}`;
  return {
    caminho, titulo: p.nome, descricao: descricaoDoProduto(p), corpo, imagem: fotoJpg(p.fotos[0]),
    ld: [ldProduto(loja, catalogo, p), ldMigalhas([['Início', '/'], [cat.nome, `/loja/${cat.id}/`], [p.nome, caminho]])],
  };
}

// ═════════════════════════════ LEMBRANÇAS ═════════════════════════════
export function lembrancas(d) {
  const { catalogo, loja } = d;
  const corpo = `
<section class="pagina-topo pagina-topo--duas"><div class="contentor pagina-topo__grelha">
  <div>
    <p class="etiqueta">Lembranças personalizadas</p>
    <h1>Para quem quer cada ocasião <em>inesquecível</em></h1>
    <p class="pagina-topo__frase">Velas, ímanes, caixinhas e raminhos feitos à mão para o teu dia, com o nome, a data e as cores que escolheres. Cada pedido é diferente: diz-nos a ocasião e fazemos o orçamento.</p>
    <div class="botoes"><a class="botao" href="#pedir">Pedir orçamento ${seta()}</a></div>
  </div>
  <div class="pagina-topo__foto">${foto('lem-padrinhos-caixas', { sizes: '(max-width:900px) 92vw, 520px', prioridade: true })}</div>
</div></section>
<nav class="contentor saltos saltos--ocasioes" aria-label="Ocasiões">${catalogo.ocasioes.map((o) => `<a href="#${o.id}">${esc(o.nome)}</a>`).join('')}</nav>
<div class="ocasioes-lista">${catalogo.ocasioes.filter((o) => o.fotos.length).map((o) => `<section class="contentor ocasiao" id="${o.id}">
  <div class="ocasiao__texto"><h2>${esc(o.nome)}</h2>${o.frase ? `<p>${esc(o.frase)}</p>` : ''}<a class="ligacao" href="#pedir" data-ocasiao="${esc(o.nome)}">Pedir orçamento ${seta()}</a></div>
  <div class="ocasiao__fotos">${o.fotos.slice(0, 3).map((f) => `<div>${foto(f, { sizes: '(max-width:760px) 62vw, 260px' })}</div>`).join('')}</div>
</section>`).join('')}</div>
<section class="seccao" id="pedir"><div class="contentor"><div class="pedido">
  <div class="pedido__texto">
    <p class="etiqueta">Pedir orçamento</p>
    <h2>Conta-nos como vai ser o teu dia</h2>
    <p>Preenche o que já souberes. Ao enviar, abre-se o WhatsApp com a mensagem escrita: é só carregar em enviar.</p>
    <p class="pedido__nota">${icone('relogio', 'icone icone--p')} Para batizados e casamentos, pede com algumas semanas de antecedência.</p>
  </div>
  <form class="formulario" data-pedido novalidate>
    <div class="campo"><label for="p-ocasiao">Ocasião</label><select id="p-ocasiao" name="ocasiao" required><option value="">Escolhe…</option>${catalogo.ocasioes.map((o) => `<option>${esc(o.nome)}</option>`).join('')}<option>Outra</option></select><p class="campo__erro" hidden>Escolhe a ocasião.</p></div>
    <div class="campo campo--metade"><label for="p-data">Data do evento <span class="campo__opcional">(opcional)</span></label><input id="p-data" name="data" type="date"></div>
    <div class="campo campo--metade"><label for="p-qtd">Quantas lembranças</label><input id="p-qtd" name="qtd" type="number" inputmode="numeric" min="1" max="999" required><p class="campo__erro" hidden>Diz-nos quantas precisas.</p></div>
    <div class="campo"><label for="p-nomes">Nomes e datas para personalizar <span class="campo__opcional">(opcional)</span></label><input id="p-nomes" name="nomes" type="text" maxlength="120" autocomplete="off"></div>
    <div class="campo"><label for="p-ideia">A tua ideia <span class="campo__opcional">(opcional)</span></label><textarea id="p-ideia" name="ideia" rows="3" maxlength="600" placeholder="Cores, tema, a peça que viste no Instagram…"></textarea></div>
    <div class="campo"><label for="p-nome">O teu nome</label><input id="p-nome" name="nome" type="text" autocomplete="name" required><p class="campo__erro" hidden>Escreve o teu nome.</p></div>
    <button class="botao botao--largo" type="submit">${icone('whatsapp', 'icone icone--p')} Enviar pelo WhatsApp</button>
    <p class="formulario__alternativa">Preferes o Instagram? <a href="https://ig.me/m/${loja.instagram}" rel="noopener">Manda mensagem para @${esc(loja.instagram)}</a>.</p>
  </form>
</div></div></section>`;
  return { caminho: '/lembrancas/', titulo: DESTINOS.lembrancas.titulo, descricao: DESTINOS.lembrancas.descricao, corpo, imagem: fotoJpg('lem-padrinhos-caixas'), ld: [ldMigalhas([['Início', '/'], ['Lembranças', '/lembrancas/']])] };
}

// ═════════════════════════════ CARRINHO, FINALIZAR, OBRIGADO ═════════════════════════════
export function carrinho(d) {
  const corpo = `
<section class="pagina-topo"><div class="contentor"><h1>Carrinho</h1></div></section>
<section class="contentor carrinho" data-pagina-carrinho>
  <div class="carrinho__linhas" data-linhas><p class="vazio__texto">A carregar…</p></div>
  <aside class="carrinho__resumo" data-resumo hidden>
    <dl class="contas"><div><dt>Subtotal</dt><dd data-subtotal></dd></div><div class="contas__nota"><dt>Portes</dt><dd>desde ${euro(Math.min(...d.loja.entrega.zonas.filter((z) => z.portes > 0).map((z) => z.portes)))} · entrega em mão sem portes</dd></div></dl>
    <a class="botao botao--largo" href="${url('/finalizar/')}">Finalizar compra ${seta()}</a>
    <p class="carrinho__seguro">${icone('cadeado', 'icone icone--p')} MB WAY, Multibanco ou cartão</p>
  </aside>
</section>
<template data-vazio><div class="vazio"><p class="vazio__texto">O carrinho está vazio.</p><div class="categorias categorias--pequenas">${d.catalogo.categorias.map((c) => `<a class="categoria" href="${url(`/loja/${c.id}/`)}"><div class="categoria__foto">${foto(c.foto, { sizes: '(max-width:900px) 46vw, 200px' })}</div><h3>${esc(c.nome)}</h3></a>`).join('')}</div></div></template>`;
  return { caminho: '/carrinho/', titulo: 'Carrinho', descricao: 'O teu carrinho na C’Candles.', corpo, indexar: false };
}

export function finalizar(d) {
  const { loja } = d;
  const zonas = loja.entrega.zonas;
  const corpo = `
<section class="contentor finalizar" data-finalizar>
  <form class="finalizar__form" data-form-finalizar novalidate>
    <h1>Finalizar compra</h1>
    <p class="aviso-previa">${icone('olho', 'icone icone--p')} <span><strong>Pré-visualização.</strong> Podes experimentar tudo: no fim não se cobra nada. Os portes são um exemplo até a loja os confirmar.</span></p>
    <fieldset class="bloco"><legend><span>1</span> Contacto</legend>
      <div class="campo"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" inputmode="email" enterkeyhint="next" required aria-describedby="email-ajuda"><p class="campo__ajuda" id="email-ajuda">Para a confirmação e o recibo.</p><p class="campo__erro" hidden></p></div>
      <div class="campo"><label for="tel">Telemóvel</label><div class="campo__prefixo"><span>+351</span><input id="tel" name="tel" type="tel" autocomplete="tel-national" inputmode="tel" enterkeyhint="next" required aria-describedby="tel-ajuda"></div><p class="campo__ajuda" id="tel-ajuda">Para o MB WAY e para a transportadora.</p><p class="campo__erro" hidden></p></div>
    </fieldset>
    <fieldset class="bloco"><legend><span>2</span> Entrega</legend>
      <div class="opcoes opcoes--lista" data-zonas>${zonas.map((z, i) => `<label class="opcao"><input type="radio" name="zona" value="${z.id}"${i === 0 ? ' checked' : ''}><span class="opcao__nome">${esc(z.nome)}<small>${z.id === 'mao' ? 'Combinamos o dia por mensagem' : `Em ${esc(loja.entrega.prazo)}`}</small></span><span class="opcao__preco">${z.portes ? euro(z.portes) : 'Grátis'}</span></label>`).join('')}</div>
      <div class="campo"><label for="nome">Nome</label><input id="nome" name="nome" type="text" autocomplete="name" enterkeyhint="next" required><p class="campo__erro" hidden></p></div>
      <div data-morada>
        <div class="campo"><label for="morada">Morada</label><input id="morada" name="morada" type="text" autocomplete="address-line1" enterkeyhint="next" required><p class="campo__erro" hidden></p></div>
        <div class="campo"><label for="andar">Andar, porta <span class="campo__opcional">(opcional)</span></label><input id="andar" name="andar" type="text" autocomplete="address-line2" enterkeyhint="next"></div>
        <div class="campo campo--metade"><label for="cp">Código postal</label><input id="cp" name="cp" type="text" inputmode="numeric" autocomplete="postal-code" placeholder="0000-000" maxlength="8" enterkeyhint="next" required><p class="campo__erro" hidden></p></div>
        <div class="campo campo--metade"><label for="localidade">Localidade</label><input id="localidade" name="localidade" type="text" autocomplete="address-level2" enterkeyhint="next" required><p class="campo__erro" hidden></p></div>
      </div>
      <div class="campo"><label for="nif">NIF <span class="campo__opcional">(opcional, para a fatura)</span></label><input id="nif" name="nif" type="text" inputmode="numeric" maxlength="9" autocomplete="off"><p class="campo__erro" hidden></p></div>
      <div class="campo"><label for="notas">Notas <span class="campo__opcional">(opcional)</span></label><textarea id="notas" name="notas" rows="2" maxlength="400" placeholder="É para oferta? Precisas para uma data?"></textarea></div>
    </fieldset>
    <fieldset class="bloco"><legend><span>3</span> Pagamento</legend>
      <div class="opcoes opcoes--lista opcoes--pagamento" data-pagamentos>
        <label class="opcao"><input type="radio" name="pagamento" value="mbway" checked><span class="opcao__nome">MB WAY<small>Recebes um pedido na app MB WAY para aceitar.</small></span><span class="selo-pagamento selo-pagamento--mbway" aria-hidden="true">MB WAY</span></label>
        <label class="opcao"><input type="radio" name="pagamento" value="cartao"><span class="opcao__nome">Cartão, Apple Pay ou Google Pay<small>Na página segura da Stripe.</small></span><span class="selo-pagamento" aria-hidden="true">${icone('cartao', 'icone icone--p')}</span></label>
        <label class="opcao"><input type="radio" name="pagamento" value="multibanco"><span class="opcao__nome">Multibanco<small>A referência aparece no fim e segue por email.</small></span><span class="selo-pagamento selo-pagamento--mb" aria-hidden="true">MB</span></label>
      </div>
    </fieldset>
    <div class="finalizar__pagar">
      <button class="botao botao--largo botao--grande" type="submit" data-pagar>Pagar <span data-total-final></span></button>
      <p class="finalizar__letra">Ao pagar aceitas os <a href="${url('/termos/')}">termos e condições</a>. Tens 14 dias para desistir da compra, exceto nas peças personalizadas (<a href="${url('/envios-e-devolucoes/')}">envios e devoluções</a>).</p>
    </div>
  </form>
  <aside class="finalizar__resumo" data-resumo-finalizar>
    <h2>Resumo</h2>
    <div data-linhas-resumo></div>
    <dl class="contas"><div><dt>Subtotal</dt><dd data-subtotal></dd></div><div><dt>Portes</dt><dd data-portes></dd></div><div class="contas__total"><dt>Total <small>com IVA</small></dt><dd data-total-resumo></dd></div></dl>
  </aside>
</section>
<dialog class="janela" data-janela-previa aria-labelledby="previa-titulo"><div class="janela__caixa">
  <h2 id="previa-titulo">Está tudo certo</h2>
  <p data-previa-texto></p>
  <p class="janela__nota">Esta é a pré-visualização da loja: quando a C'Candles ligar os pagamentos, este botão leva ao pagamento a sério e a encomenda chega por email.</p>
  <div class="janela__botoes"><a class="botao" href="${url('/obrigado/')}" data-ver-confirmacao>Ver a confirmação de exemplo</a><button class="botao botao--claro" type="button" data-fechar-janela>Voltar</button></div>
</div></dialog>
<template data-vazio-finalizar><div class="vazio"><p class="vazio__texto">O carrinho está vazio.</p><a class="botao" href="${url('/loja/')}">Ir à loja ${seta()}</a></div></template>`;
  return { caminho: '/finalizar/', titulo: 'Finalizar compra', descricao: 'Finalizar a compra na C’Candles.', corpo, indexar: false, simples: true, classe: 'pagina-finalizar' };
}

export function obrigado(d) {
  const corpo = `
<section class="contentor obrigado" data-obrigado>
  <div class="obrigado__selo">${icone('certo')}</div>
  <p class="etiqueta">Encomenda de exemplo</p>
  <h1>Obrigada<span data-nome-obrigado></span>!</h1>
  <p class="obrigado__frase">Na loja a sério, aqui aparece o número da encomenda, o que vem a seguir e, no Multibanco, a entidade e a referência para pagar. Recebes também tudo por email.</p>
  <div class="obrigado__resumo" data-resumo-obrigado hidden></div>
  <div class="botoes"><a class="botao" href="${url('/')}">Voltar ao início</a><a class="botao botao--claro" href="${url('/carrinho/')}">Ver o carrinho</a></div>
</section>`;
  return { caminho: '/obrigado/', titulo: 'Obrigada', descricao: 'Encomenda feita na C’Candles.', corpo, indexar: false };
}

// ═════════════════════════════ SOBRE E AJUDA ═════════════════════════════
export function sobre(d) {
  const { loja } = d;
  const corpo = `
<section class="pagina-topo pagina-topo--duas"><div class="contentor pagina-topo__grelha">
  <div>
    <p class="etiqueta">Desde 2023 · Oliveira de Azeméis</p>
    <h1>Uma marca que nasceu de um gosto enorme por velas</h1>
    <p class="pagina-topo__frase">A C'Candles é da Cristiana Moreira. Começou em janeiro de 2023 com um pequeno projeto de velas, e a 28 de junho desse ano passou a ter nome e página.</p>
  </div>
  <div class="pagina-topo__foto">${foto('natal-casinhas', { sizes: '(max-width:900px) 92vw, 520px', prioridade: true })}</div>
</div></section>
<section class="seccao seccao--primeira"><div class="contentor texto-largo">
  <div class="factos">
    <div><b>2023</b><span>O primeiro ano, com uma feira de Natal logo a seguir</span></div>
    <div><b>16</b><span>Aromas em 2026, de Sunday in Cashmere a Biscoitos da Avó</span></div>
    <div><b>15 em 15 dias</b><span>No Street Market de Oliveira de Azeméis</span></div>
  </div>
  <div class="texto">
    <p>Ao início, nem tudo saía como planeado, e houve uma altura em que desistiu. Quatro meses depois voltou, à procura de novos produtos que funcionassem, e não parou mais: logo a seguir a dar a conhecer as primeiras velas, veio o convite para uma feira de Natal.</p>
    <p>Hoje faz queimadores de todas as formas, wax melts e snapbar com aromas próprios, velas em copo, peças decorativas e lembranças para batizados, comunhões, casamentos e padrinhos. Tudo à mão, peça a peça, em Oliveira de Azeméis.</p>
    <p>Se quiseres conhecer as peças ao vivo, a C'Candles está no Street Market de Oliveira de Azeméis a cada quinze dias. Para tudo o resto, há o <a href="${whatsapp(loja.whatsapp)}" rel="noopener">WhatsApp</a> e o <a href="https://www.instagram.com/${loja.instagram}/" rel="noopener">Instagram</a>.</p>
  </div>
</div></section>
<section class="seccao"><div class="contentor"><div class="galeria-ocasiao galeria-ocasiao--4">${['natal-anjinhos', 'natal-aldeia', 'lem-maes-raminho', 'natal-carrossel'].map((f) => `<div>${foto(f, { sizes: '(max-width:640px) 70vw, 300px' })}</div>`).join('')}</div></div></section>`;
  return { caminho: '/sobre/', titulo: DESTINOS.sobre.titulo, descricao: DESTINOS.sobre.descricao, corpo, imagem: fotoJpg('natal-casinhas'), ld: [ldMigalhas([['Início', '/'], ['Sobre', '/sobre/']])] };
}

export function ajuda(d) {
  const { loja } = d;
  const perguntas = [
    ['Qual é a diferença entre wax melts e snapbar?', 'Os dois derretem no queimador e perfumam a casa. Os wax melts são figurinhas de cera perfumada, em embalagens de 100 g. A snapbar é uma barra de 35 g dividida em quadradinhos: partes só o que precisas, e é a forma mais barata de experimentar um aroma novo.'],
    ['Quanto tempo dura o cheirinho?', 'Depende do tamanho da divisão e da quantidade de cera. Usa um ou dois quadradinhos (ou uma figurinha) de cada vez e repete a queima até o aroma acabar; quando acabar, troca a cera.'],
    ['Os queimadores levam vela?', 'Usam uma vela de réchaud (vela de chá) por baixo, que não vem incluída, a não ser que o diga a ficha.'],
    ['Posso escolher a cor e o aroma das peças?', 'Nas peças por encomenda (como as abóboras, as árvores de Natal e as lembranças), sim: diz-nos o que preferes por WhatsApp e combinamos.'],
    ['Quanto custam os portes?', `${loja.entrega.zonas.map((z) => `${z.nome}: ${z.portes ? euro(z.portes) : 'grátis'}`).join('; ')}. Os portes aparecem antes de pagares.`],
    ['Como posso pagar?', 'MB WAY, Multibanco, cartão, Apple Pay ou Google Pay, no fim da compra.'],
    ['Fazem lembranças para batizados e casamentos?', `Sim, é uma das coisas que mais fazemos. Vê as <a href="${url('/lembrancas/')}">lembranças</a> e pede o orçamento com a data e a quantidade.`],
  ];
  const corpo = `
<section class="pagina-topo"><div class="contentor">
  <h1>Ajuda</h1>
  <p class="pagina-topo__frase">Como usar os wax melts, envios, pagamentos e lembranças. Se não encontrares a resposta, <a href="${whatsapp(loja.whatsapp)}" rel="noopener">fala connosco pelo WhatsApp</a>.</p>
</div></section>
<section class="seccao seccao--primeira" id="como-usar"><div class="contentor">
  ${cabeca({ etiqueta: 'Wax melts e snapbar', titulo: 'Como usar' })}
  <ol class="como-usar">
    <li><span>1</span><p>Acende a vela de réchaud dentro do queimador.</p></li>
    <li><span>2</span><p>Põe o wax melt, ou um ou dois quadradinhos da snapbar, na taça de cima.</p></li>
    <li><span>3</span><p>Com o calor, a cera derrete e liberta o aroma. Repete a queima até o cheirinho acabar.</p></li>
    <li><span>4</span><p>Quando acabar, limpa a taça com um pano levemente morno e põe um wax melt novo.</p></li>
  </ol>
</div></section>
<section class="seccao"><div class="contentor texto-largo">
  ${cabeca({ titulo: 'Perguntas frequentes' })}
  <div class="perguntas">${perguntas.map(([q, r]) => `<details class="pergunta"><summary>${esc(q)}${icone('mais', 'icone icone--p')}</summary><p>${r}</p></details>`).join('')}</div>
</div></section>`;
  return { caminho: '/ajuda/', titulo: DESTINOS.ajuda.titulo, descricao: DESTINOS.ajuda.descricao, corpo, ld: [ldMigalhas([['Início', '/'], ['Ajuda', '/ajuda/']])] };
}

export function naoEncontrada(d) {
  const corpo = `
<section class="contentor vazio vazio--pagina">
  ${logoSimbolo(64)}
  <h1>Esta página não existe</h1>
  <p class="vazio__texto">Pode ter mudado de sítio. Experimenta a loja ou os aromas.</p>
  <div class="botoes"><a class="botao" href="${url('/loja/')}">Ir à loja ${seta()}</a><a class="botao botao--claro" href="${url('/aromas/')}">Ver os aromas</a></div>
</section>`;
  return { caminho: '/404.html', titulo: 'Página não encontrada', descricao: 'Esta página não existe na C’Candles.', corpo, indexar: false };
}

export { resumir };
