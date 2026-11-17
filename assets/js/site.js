// C'CANDLES — o que mexe no browser: o carrinho (gaveta e página), a ficha (escolhas, aroma, preço ao vivo,
// galeria, barra de compra), o finalizar (validação, portes, total), as lembranças (mensagem de WhatsApp),
// o menu do telemóvel, os separadores que não voltam ao topo e as entradas ao descer.
// O preço nunca vem da página: refaz-se com as regras (./regras.mjs, cópia de src/lib/regras.mjs).
import { conferirEscolha, linhaDoCarrinho, portesDe, centimos, opcoesDe, modoDoAroma, compravel, LIMITES } from './regras.mjs';

const BASE = document.documentElement.dataset.base || '';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
const euro = (c) => (c / 100).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const menosMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const ICONE = (d) => `<svg class="icone icone--p" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const MAIS = ICONE('<path d="M12 5v14M5 12h14"/>');
const MENOS = ICONE('<path d="M5 12h14"/>');

// ── O catálogo (uma vez por página) ──
let catalogoP = null;
const catalogo = () => (catalogoP ||= fetch(`${BASE}/assets/dados/catalogo.json`).then((r) => { if (!r.ok) throw new Error('catálogo'); return r.json(); }));

// ── O carrinho (localStorage) ──
const CHAVE = 'cc:carrinho:v1';
function lerCarrinho() {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) || '[]');
    return Array.isArray(v) ? v.filter((l) => l && typeof l.slug === 'string' && Number.isInteger(l.qtd)) : [];
  } catch { return []; }
}
function gravarCarrinho(linhas) {
  try { localStorage.setItem(CHAVE, JSON.stringify(linhas)); } catch { avisar('Não foi possível guardar o carrinho neste browser.'); }
  contarCarrinho();
}
const idDaLinha = (l) => l.slug + '|' + JSON.stringify([l.opcoes || {}, l.aroma || '', (l.texto || '').trim()]);
function juntar(nova) {
  const linhas = lerCarrinho();
  const id = idDaLinha(nova);
  const ja = linhas.find((l) => idDaLinha(l) === id);
  if (ja) ja.qtd = Math.min(LIMITES.quantidade[1], ja.qtd + nova.qtd); else linhas.push(nova);
  gravarCarrinho(linhas);
}
function contarCarrinho() {
  const n = lerCarrinho().reduce((s, l) => s + l.qtd, 0);
  for (const el of $$('[data-conta]')) { el.textContent = String(n); el.hidden = n === 0; }
  const saco = $('.topo__saco');
  if (saco) saco.setAttribute('aria-label', n ? `Carrinho, ${n} ${n === 1 ? 'artigo' : 'artigos'}` : 'Carrinho, vazio');
}
addEventListener('storage', (e) => { if (e.key === CHAVE) { contarCarrinho(); desenharTudo(); } });

/** As linhas recalculadas: [{ linha, p, r }] (r.ok false = a linha já não se compra). */
async function linhasCalculadas() {
  const cat = await catalogo();
  return lerCarrinho().map((linha) => {
    const p = cat.produtos[linha.slug];
    const r = p ? linhaDoCarrinho(p, linha, cat.aromas) : { ok: false, erro: 'Este produto já não está à venda.' };
    return { linha, p, r };
  });
}

function linhaHtml({ linha, p, r }, i, { editar = true } = {}) {
  const nome = p ? esc(p.nome) : 'Produto indisponível';
  const resumo = r.ok ? r.resumo.map(esc).join(' · ') : '';
  return `<div class="linha" data-i="${i}">
  <div class="linha__foto">${p?.foto ? `<img src="${esc(p.foto)}" alt="" width="84" height="104" loading="lazy">` : ''}</div>
  <div>
    ${p ? `<a class="linha__nome" href="${esc(p.url)}${linha.aroma ? `#aroma=${esc(linha.aroma)}` : ''}">${nome}</a>` : `<span class="linha__nome">${nome}</span>`}
    ${resumo ? `<p class="linha__resumo">${resumo}</p>` : ''}
    ${!r.ok ? `<p class="linha__erro">${esc(r.erro)}</p>` : ''}
    ${editar ? `<div class="linha__acoes">${r.ok ? `<div class="quantidade quantidade--pequena"><button type="button" data-linha-menos aria-label="Menos um">${MENOS}</button><input type="number" inputmode="numeric" min="1" max="${LIMITES.quantidade[1]}" value="${linha.qtd}" aria-label="Quantidade de ${nome}" data-linha-qtd><button type="button" data-linha-mais aria-label="Mais um">${MAIS}</button></div>` : ''}<button type="button" class="linha__remover" data-linha-remover>Remover</button></div>` : `<p class="linha__resumo">Quantidade: ${linha.qtd}</p>`}
  </div>
  <p class="linha__preco">${r.ok ? euro(r.total) : ''}</p>
</div>`;
}

let ultimaRemovida = null;
function ligarLinhas(raiz) {
  raiz.addEventListener('click', (e) => {
    const el = e.target.closest('[data-i]');
    if (!el) return;
    const i = Number(el.dataset.i);
    const linhas = lerCarrinho();
    if (!linhas[i]) return;
    if (e.target.closest('[data-linha-mais]')) { linhas[i].qtd = Math.min(LIMITES.quantidade[1], linhas[i].qtd + 1); gravarCarrinho(linhas); desenharTudo(); }
    else if (e.target.closest('[data-linha-menos]')) {
      if (linhas[i].qtd > 1) { linhas[i].qtd -= 1; gravarCarrinho(linhas); desenharTudo(); } else remover(i);
    } else if (e.target.closest('[data-linha-remover]')) remover(i);
  });
  raiz.addEventListener('change', (e) => {
    const inp = e.target.closest('[data-linha-qtd]');
    if (!inp) return;
    const i = Number(inp.closest('[data-i]').dataset.i);
    const linhas = lerCarrinho();
    const q = Math.round(Number(inp.value));
    if (!linhas[i]) return;
    if (!Number.isFinite(q) || q < 1) { remover(i); return; }
    linhas[i].qtd = Math.min(LIMITES.quantidade[1], q);
    gravarCarrinho(linhas); desenharTudo();
  });
}
async function remover(i) {
  const linhas = lerCarrinho();
  const [tirada] = linhas.splice(i, 1);
  gravarCarrinho(linhas);
  ultimaRemovida = { linha: tirada, i };
  const cat = await catalogo();
  avisar(`Tiraste ${cat.produtos[tirada.slug]?.nome || 'o produto'} do carrinho.`, { desfazer: () => { const l = lerCarrinho(); l.splice(ultimaRemovida.i, 0, ultimaRemovida.linha); gravarCarrinho(l); desenharTudo(); } });
  desenharTudo();
}

// ── Gaveta do carrinho ──
const gaveta = $('#gaveta');
async function desenharGaveta() {
  if (!gaveta) return;
  const corpo = $('[data-linhas]', gaveta);
  const pe = $('[data-pe]', gaveta);
  let calc;
  try { calc = await linhasCalculadas(); } catch { corpo.innerHTML = '<p class="vazio__texto">Não foi possível abrir o carrinho. Verifica a ligação e tenta outra vez.</p>'; return; }
  if (!calc.length) {
    corpo.innerHTML = `<div class="vazio"><p class="vazio__texto">O carrinho está vazio.</p><a class="botao" href="${BASE}/loja/">Ir à loja</a></div>`;
    pe.hidden = true;
    return;
  }
  corpo.innerHTML = calc.map((c, i) => linhaHtml(c, i)).join('');
  $('[data-subtotal]', gaveta).textContent = euro(calc.reduce((s, c) => s + (c.r.ok ? c.r.total : 0), 0));
  pe.hidden = false;
}
function abrirGaveta(aviso = '') {
  if (!gaveta) { location.href = `${BASE}/carrinho/`; return; }
  const av = $('[data-aviso]', gaveta);
  av.textContent = aviso; av.hidden = !aviso;
  desenharGaveta();
  if (!gaveta.open) gaveta.showModal();
}
if (gaveta) {
  ligarLinhas($('[data-linhas]', gaveta));
  gaveta.addEventListener('click', (e) => { if (e.target === gaveta || e.target.closest('[data-fechar]')) gaveta.close(); });
}
for (const a of $$('[data-abrir-carrinho]')) a.addEventListener('click', (e) => { if (e.button || e.metaKey || e.ctrlKey) return; e.preventDefault(); abrirGaveta(); });

// ── Página do carrinho ──
const paginaCarrinho = $('[data-pagina-carrinho]');
async function desenharPaginaCarrinho() {
  if (!paginaCarrinho) return;
  const lista = $('[data-linhas]', paginaCarrinho);
  const resumo = $('[data-resumo]', paginaCarrinho);
  let calc;
  try { calc = await linhasCalculadas(); } catch { lista.innerHTML = '<p class="vazio__texto">Não foi possível abrir o carrinho.</p>'; return; }
  if (!calc.length) { lista.innerHTML = $('template[data-vazio]').innerHTML; resumo.hidden = true; return; }
  lista.innerHTML = calc.map((c, i) => linhaHtml(c, i)).join('');
  $('[data-subtotal]', resumo).textContent = euro(calc.reduce((s, c) => s + (c.r.ok ? c.r.total : 0), 0));
  resumo.hidden = false;
}
if (paginaCarrinho) ligarLinhas($('[data-linhas]', paginaCarrinho));
function desenharTudo() { desenharGaveta(); desenharPaginaCarrinho(); desenharFinalizar(); }

// ── Aviso flutuante ──
let avisoT;
function avisar(texto, { desfazer } = {}) {
  const el = $('[data-aviso-flutuante]');
  if (!el) return;
  el.innerHTML = esc(texto) + (desfazer ? ' <button type="button" class="linha__remover" style="color:inherit;margin-left:8px">Desfazer</button>' : '');
  el.style.pointerEvents = desfazer ? 'auto' : 'none';
  if (desfazer) $('button', el).addEventListener('click', () => { desfazer(); el.classList.remove('aviso-flutuante--visto'); }, { once: true });
  el.classList.add('aviso-flutuante--visto');
  clearTimeout(avisoT);
  avisoT = setTimeout(() => { el.classList.remove('aviso-flutuante--visto'); el.style.pointerEvents = 'none'; }, desfazer ? 5000 : 2600);
}

// ── Topo e menu do telemóvel ──
const topo = $('.topo');
const aoRolar = () => topo?.classList.toggle('topo--rolado', scrollY > 8);
addEventListener('scroll', aoRolar, { passive: true }); aoRolar();
const menu = $('#menu');
const botaoMenu = $('[data-menu]');
const ICONE_MENU = botaoMenu?.innerHTML;
function fecharMenu() {
  if (!menu || menu.hidden) return;
  menu.hidden = true;
  document.documentElement.classList.remove('menu-aberto');
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.innerHTML = ICONE_MENU;
}
botaoMenu?.addEventListener('click', () => {
  if (!menu.hidden) { fecharMenu(); return; }
  menu.hidden = false;
  document.documentElement.classList.add('menu-aberto');
  botaoMenu.setAttribute('aria-expanded', 'true');
  botaoMenu.innerHTML = `${ICONE('<path d="M6 6l12 12M18 6 6 18"/>').replace('icone--p', '')}<span class="topo__rotulo">Fechar</span>`;
  $('a', menu)?.focus({ preventScroll: true });
});
addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });
matchMedia('(min-width: 901px)').addEventListener('change', (m) => { if (m.matches) fecharMenu(); });

// ── Separadores que são páginas: a página fica onde estava ──
const separadores = $('[data-separadores]');
if (separadores) {
  const ul = $('ul', separadores);
  separadores.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    try { sessionStorage.setItem('cc:lugar', JSON.stringify({ para: new URL(a.href).pathname, topo: separadores.getBoundingClientRect().top, esq: ul.scrollLeft, t: Date.now() })); } catch { /* sem sessionStorage: abre no topo */ }
  });
  if (!document.documentElement.dataset.lugar) {
    const atual = $('[aria-current]', ul);
    if (atual && ul.scrollWidth > ul.clientWidth) ul.scrollLeft = atual.offsetLeft - (ul.clientWidth - atual.offsetWidth) / 2;
  }
}

// ── Galeria da ficha ──
for (const g of $$('[data-galeria]')) {
  const faixa = $('[data-faixa]', g);
  const minis = $$('[data-ir]', g);
  const conta = $('[data-conta-fotos]', g);
  const total = $$('.galeria__foto', faixa).length;
  const ir = (i) => faixa.scrollTo({ left: i * faixa.clientWidth, behavior: menosMovimento() ? 'auto' : 'smooth' });
  minis.forEach((b) => b.addEventListener('click', () => ir(Number(b.dataset.ir))));
  let raf = 0;
  faixa.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const i = Math.round(faixa.scrollLeft / Math.max(1, faixa.clientWidth));
      minis.forEach((b, k) => (k === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
      if (conta) conta.textContent = `${i + 1}/${total}`;
    });
  }, { passive: true });
  faixa.addEventListener('keydown', (e) => {
    const i = Math.round(faixa.scrollLeft / Math.max(1, faixa.clientWidth));
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(Math.min(total - 1, i + 1)); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); ir(Math.max(0, i - 1)); }
  });
}

// ── Ficha do produto: escolhas, aroma, preço ao vivo, juntar ao carrinho ──
const form = $('[data-comprar]');
if (form) ligarFicha(form);
async function ligarFicha(form) {
  const slug = form.dataset.slug;
  const cat = await catalogo().catch(() => null);
  const p = cat?.produtos[slug];
  if (!p) return;
  const base = centimos(p.preco);
  const ops = opcoesDe(p);
  const modo = modoDoAroma(p);
  const grupoAroma = $('[data-escolha-aroma]', form);
  const notas = $('[data-notas]', form);
  const nomeAroma = $('[data-aroma-nome]', form);
  const erroAroma = $('[data-erro-aroma]', form);
  const qtd = $('input[name="qtd"]', form);
  const totalEls = [$('[data-total]', form), $('[data-total-barra]')].filter(Boolean);
  const precoEl = $('[data-preco]');
  const texto = $('#texto', form);
  const contador = $('[data-contador]', form);
  const trocaFoto = slug === 'snapbar';
  const primeira = $('.galeria__foto', document);
  const primeiraOriginal = primeira?.innerHTML;

  const escolha = () => ({
    opcoes: Object.fromEntries(ops.map((o) => [o.id, Number(form.querySelector(`input[name="op-${o.id}"]:checked`)?.value ?? 0)])),
    aroma: form.querySelector('input[name="aroma"]:checked')?.value || '',
    texto: texto?.value || '',
  });
  const pedeAroma = () => modo === 'sempre' || (modo === 'se-wax' && ops.some((o) => {
    const i = escolha().opcoes[o.id];
    return o.valores[i]?.aroma;
  }));
  function atualizar() {
    const e = escolha();
    let unit = base;
    for (const o of ops) unit += o.valores[e.opcoes[o.id]]?.suplemento || 0;
    const q = Math.min(LIMITES.quantidade[1], Math.max(1, Math.round(Number(qtd.value) || 1)));
    for (const el of totalEls) el.textContent = euro(unit * q);
    if (precoEl) precoEl.textContent = euro(unit);
    if (grupoAroma && modo === 'se-wax') grupoAroma.hidden = !pedeAroma();
    const a = cat.aromas.find((x) => x.id === e.aroma);
    if (nomeAroma) nomeAroma.textContent = a ? a.nome : '';
    if (notas) {
      if (a) {
        const pir = a.piramide ? `<dl class="piramide"><div><dt>Saída</dt><dd>${a.piramide.saida.map(esc).join(' · ')}</dd></div><div><dt>Coração</dt><dd>${a.piramide.coracao.map(esc).join(' · ')}</dd></div><div><dt>Fundo</dt><dd>${a.piramide.fundo.map(esc).join(' · ')}</dd></div></dl>` : `<dl class="piramide"><div><dt>Notas</dt><dd>${(a.notas || []).map(esc).join(' · ')}</dd></div></dl>`;
        notas.innerHTML = `<p>${esc(a.frase)}</p>${pir}`;
        notas.hidden = false;
      } else notas.hidden = true;
    }
    if (trocaFoto && primeira) {
      if (a?.foto) { primeira.innerHTML = `<img src="${esc(a.foto)}" alt="Snapbar ${esc(a.nome)}" width="720" height="900" style="width:100%;height:100%;object-fit:cover">`; }
      else if (primeira.innerHTML !== primeiraOriginal) primeira.innerHTML = primeiraOriginal;
      const faixa = $('[data-faixa]');
      if (faixa && faixa.scrollLeft) faixa.scrollTo({ left: 0 });
    }
    if (a) { erroAroma && (erroAroma.hidden = true); grupoAroma?.classList.remove('campo--erro'); }
  }
  form.addEventListener('change', (e) => {
    atualizar();
    if (e.target.name === 'aroma') history.replaceState(null, '', `#aroma=${e.target.value}`);
  });
  texto?.addEventListener('input', () => { if (contador) contador.textContent = `${texto.value.length}/${texto.maxLength}`; });
  $('[data-menos]', form).addEventListener('click', () => { qtd.value = Math.max(1, (Number(qtd.value) || 1) - 1); atualizar(); });
  $('[data-mais]', form).addEventListener('click', () => { qtd.value = Math.min(LIMITES.quantidade[1], (Number(qtd.value) || 1) + 1); atualizar(); });
  qtd.addEventListener('input', atualizar);

  // #aroma=… vem da página dos aromas ou do carrinho («editar»)
  const pedido = new URLSearchParams(location.hash.slice(1)).get('aroma');
  if (pedido) {
    const r = form.querySelector(`input[name="aroma"][value="${CSS.escape(pedido)}"]`);
    if (r) {
      r.checked = true;
      if (modo === 'se-wax') { const snap = form.querySelector('input[data-pede-aroma]'); if (snap) snap.checked = true; }
    }
  }
  atualizar();

  function adicionar() {
    const e = escolha();
    if (pedeAroma() && !e.aroma) {
      erroAroma.hidden = false;
      grupoAroma.classList.add('campo--erro');
      grupoAroma.scrollIntoView({ behavior: menosMovimento() ? 'auto' : 'smooth', block: 'center' });
      form.querySelector('input[name="aroma"]')?.focus({ preventScroll: true });
      return;
    }
    const q = Math.min(LIMITES.quantidade[1], Math.max(1, Math.round(Number(qtd.value) || 1)));
    const linha = { slug, opcoes: e.opcoes, aroma: pedeAroma() ? e.aroma : '', texto: e.texto.trim(), qtd: q };
    const r = conferirEscolha(p, linha, cat.aromas);
    if (!r.ok) { avisar(r.erro); return; }
    juntar(linha);
    abrirGaveta(`Juntaste ${q > 1 ? q + ' × ' : ''}${p.nome} ao carrinho.`);
  }
  form.addEventListener('submit', (e) => { e.preventDefault(); adicionar(); });
  $('[data-comprar-barra]')?.addEventListener('click', adicionar);

  // A barra de compra aparece quando o botão principal sai do ecrã (telemóvel)
  const barra = $('[data-barra-compra]');
  const botao = $('[data-botao-comprar]', form);
  if (barra && botao && 'IntersectionObserver' in window) {
    barra.hidden = false;
    new IntersectionObserver(([en]) => barra.classList.toggle('barra-compra--vista', !en.isIntersecting && en.boundingClientRect.top < 0), { threshold: 0 }).observe(botao);
  }
}

// ── Finalizar ──
const fin = $('[data-finalizar]');
const formFin = $('[data-form-finalizar]');
async function desenharFinalizar() {
  if (!fin) return;
  let calc;
  try { calc = await linhasCalculadas(); } catch { return; }
  const validas = calc.filter((c) => c.r.ok);
  if (!validas.length) { fin.innerHTML = $('template[data-vazio-finalizar]').innerHTML; return; }
  const cat = await catalogo();
  $('[data-linhas-resumo]', fin).innerHTML = calc.map((c, i) => linhaHtml(c, i, { editar: false })).join('');
  const sub = validas.reduce((s, c) => s + c.r.total, 0);
  const zona = formFin.querySelector('input[name="zona"]:checked')?.value || 'continente';
  const portes = portesDe({ entrega: cat.entrega }, zona, sub);
  $('[data-subtotal]', fin).textContent = euro(sub);
  $('[data-portes]', fin).textContent = portes === null ? 'a confirmar' : portes === 0 ? 'Grátis' : euro(portes);
  const total = sub + (portes || 0);
  $('[data-total-resumo]', fin).textContent = euro(total);
  $('[data-total-final]', fin).textContent = euro(total);
  fin.dataset.total = String(total);
}
if (formFin) {
  const morada = $('[data-morada]', formFin);
  const cp = $('#cp', formFin);
  const tel = $('#tel', formFin);
  const nif = $('#nif', formFin);
  const mostrarMorada = () => {
    const mao = formFin.querySelector('input[name="zona"]:checked')?.value === 'mao';
    morada.hidden = mao;
    for (const i of $$('input[required]', morada)) i.disabled = mao;
  };
  formFin.addEventListener('change', (e) => { if (e.target.name === 'zona') { mostrarMorada(); desenharFinalizar(); } });
  mostrarMorada();
  cp.addEventListener('input', () => {
    const d = cp.value.replace(/\D/g, '').slice(0, 7);
    cp.value = d.length > 4 ? `${d.slice(0, 4)}-${d.slice(4)}` : d;
    if (d.length === 7) validar(cp);
  });
  tel.addEventListener('input', () => { const d = tel.value.replace(/\D/g, ''); if (d.length === 9) validar(tel); });
  const nifValido = (v) => {
    if (!/^\d{9}$/.test(v)) return false;
    const s = [...v.slice(0, 8)].reduce((a, c, i) => a + Number(c) * (9 - i), 0);
    const ctrl = 11 - (s % 11);
    return Number(v[8]) === (ctrl >= 10 ? 0 : ctrl);
  };
  const REGRAS = {
    email: (v) => (!v ? 'Escreve o teu email.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Este email não parece certo. Ex.: nome@gmail.com'),
    tel: (v) => { const d = v.replace(/\D/g, '').replace(/^351/, ''); return !d ? 'Escreve o teu telemóvel.' : /^9[1236]\d{7}$/.test(d) ? '' : 'O telemóvel tem 9 algarismos e começa por 9.'; },
    nome: (v) => (v.trim().length >= 2 ? '' : 'Escreve o teu nome.'),
    morada: (v) => (v.trim().length >= 4 ? '' : 'Escreve a morada (rua e número).'),
    cp: (v) => (!v ? 'Escreve o código postal.' : /^\d{4}-\d{3}$/.test(v) ? '' : 'O código postal tem 7 algarismos, ex.: 3720-123.'),
    localidade: (v) => (v.trim().length >= 2 ? '' : 'Escreve a localidade.'),
    nif: (v) => (!v || nifValido(v.replace(/\D/g, '')) ? '' : 'Este NIF não é válido. Confirma os 9 algarismos.'),
  };
  function validar(input) {
    const regra = REGRAS[input.name];
    if (!regra || input.disabled) return true;
    const erro = regra(input.value);
    const campo = input.closest('.campo');
    const el = $('.campo__erro', campo);
    campo.classList.toggle('campo--erro', !!erro);
    if (el) { el.textContent = erro; el.hidden = !erro; }
    input.setAttribute('aria-invalid', erro ? 'true' : 'false');
    if (el) { el.id ||= `erro-${input.name}`; input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby')?.replace(el.id, '').trim(), erro ? el.id : ''].filter(Boolean).join(' ')); }
    return !erro;
  }
  formFin.addEventListener('focusout', (e) => { const i = e.target; if (i.matches('input') && (i.value || i.getAttribute('aria-invalid') === 'true')) validar(i); });
  formFin.addEventListener('input', (e) => { const i = e.target; if (i.getAttribute('aria-invalid') === 'true') validar(i); });
  const janela = $('[data-janela-previa]');
  janela?.addEventListener('click', (e) => { if (e.target === janela || e.target.closest('[data-fechar-janela]')) janela.close(); });
  formFin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const campos = $$('input', formFin).filter((i) => REGRAS[i.name]);
    const maus = campos.filter((i) => !validar(i));
    if (maus.length) { maus[0].focus(); maus[0].scrollIntoView({ block: 'center', behavior: menosMovimento() ? 'auto' : 'smooth' }); return; }
    const calc = (await linhasCalculadas()).filter((c) => c.r.ok);
    const total = Number(fin.dataset.total || 0);
    const pag = formFin.querySelector('input[name="pagamento"]:checked').value;
    const dados = Object.fromEntries(new FormData(formFin));
    try { sessionStorage.setItem('cc:ultima', JSON.stringify({ nome: dados.nome, pagamento: pag, total, linhas: calc.map((c) => ({ nome: c.p.nome, resumo: c.r.resumo, qtd: c.linha.qtd, total: c.r.total, foto: c.p.foto })) })); } catch { /* sem sessão: a confirmação de exemplo fica sem resumo */ }
    const telTxt = (dados.tel || '').replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    $('[data-previa-texto]', janela).textContent = pag === 'mbway'
      ? `Com MB WAY, chegava agora ao telemóvel ${telTxt} um pedido de ${euro(total)} para aceitares na app (tens 4 minutos).`
      : pag === 'multibanco'
        ? `Com Multibanco, aparecia a entidade e a referência para pagares ${euro(total)}; a referência seguia também por email.`
        : `Com cartão, Apple Pay ou Google Pay, seguias para a página segura da Stripe para pagar ${euro(total)}.`;
    janela.showModal();
  });
}

// ── Obrigado (exemplo) ──
const obrigado = $('[data-obrigado]');
if (obrigado) {
  try {
    const u = JSON.parse(sessionStorage.getItem('cc:ultima') || 'null');
    if (u) {
      $('[data-nome-obrigado]').textContent = u.nome ? `, ${u.nome.trim().split(/\s+/)[0]}` : '';
      const r = $('[data-resumo-obrigado]');
      const meio = { mbway: 'MB WAY', multibanco: 'Multibanco', cartao: 'Cartão' }[u.pagamento] || '';
      r.innerHTML = `<p class="etiqueta">Encomenda CC-EXEMPLO</p>${u.linhas.map((l) => `<div class="linha" style="grid-template-columns:56px minmax(0,1fr) auto"><div class="linha__foto" style="width:56px;height:70px">${l.foto ? `<img src="${esc(l.foto)}" alt="" width="56" height="70">` : ''}</div><div><p class="linha__nome">${esc(l.nome)}</p><p class="linha__resumo">${l.resumo.map(esc).join(' · ')}${l.resumo.length ? ' · ' : ''}Quantidade: ${l.qtd}</p></div><p class="linha__preco">${euro(l.total)}</p></div>`).join('')}<dl class="contas"><div class="contas__total"><dt>Total pago${meio ? ` com ${meio}` : ''}</dt><dd>${euro(u.total)}</dd></div></dl>`;
      r.hidden = false;
    }
  } catch { /* sem resumo */ }
}

// ── Lembranças: o pedido de orçamento vai pelo WhatsApp, já escrito ──
const pedido = $('[data-pedido]');
if (pedido) {
  for (const l of $$('[data-ocasiao]')) l.addEventListener('click', () => { const sel = $('#p-ocasiao'); if (sel) sel.value = l.dataset.ocasiao; });
  pedido.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    for (const c of $$('[required]', pedido)) {
      const vazio = !String(c.value).trim();
      const campo = c.closest('.campo');
      campo.classList.toggle('campo--erro', vazio);
      const er = $('.campo__erro', campo);
      if (er) er.hidden = !vazio;
      if (vazio && ok) { c.focus(); ok = false; }
    }
    if (!ok) return;
    const d = Object.fromEntries(new FormData(pedido));
    const data = d.data ? new Date(d.data + 'T12:00').toLocaleDateString('pt-PT') : '';
    const linhas = ['Olá! Gostava de pedir um orçamento de lembranças.', `• Ocasião: ${d.ocasiao}`, data && `• Data: ${data}`, `• Quantidade: ${d.qtd}`, d.nomes && `• Personalização: ${d.nomes}`, d.ideia && `• Ideia: ${d.ideia}`, `O meu nome é ${d.nome}.`].filter(Boolean);
    const cat = await catalogo().catch(() => null);
    const numero = cat?.whatsapp || '351938142706';
    location.href = `https://wa.me/${numero}?text=${encodeURIComponent(linhas.join('\n'))}`;
  });
}

// ── Entradas ao descer: só o que está abaixo do ecrã quando a página abre; uma fila que desliza entra inteira ──
const ALVOS = '.seccao .cabeca, .categoria, .cartao, .aroma-destaque, .pilulas, .mosaico, .sobre-inicio, .garantias, .galeria-ocasiao, .pedido, .como-usar, .perguntas, .fila-aromas, .grelha-aromas .aroma, .factos';
if (!menosMovimento() && 'IntersectionObserver' in window) {
  const alvos = $$(ALVOS).filter((el) => !el.parentElement.closest(ALVOS) && el.getBoundingClientRect().top >= innerHeight && el.getBoundingClientRect().width > 0);
  const io = new IntersectionObserver((entradas) => {
    let k = 0;
    for (const en of entradas) {
      if (!en.isIntersecting) continue;
      const el = en.target;
      el.style.setProperty('--d', String(Math.min(k++, 5) * 0.08));
      el.classList.add('revelado');
      el.addEventListener('animationend', () => { el.classList.remove('revelar', 'revelado'); el.style.removeProperty('--d'); }, { once: true });
      io.unobserve(el);
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  for (const el of alvos) { el.classList.add('revelar'); io.observe(el); }
}

contarCarrinho();
desenharTudo();
