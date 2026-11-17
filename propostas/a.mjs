// PROPOSTA A — «Porcelana»: clara e editorial, o rosa do «C» como fio condutor, títulos numa Didone
// (Libre Bodoni, como a palavra do logótipo) com itálico nas palavras quentes, texto em Be Vietnam Pro.
import { pagina, foto, euro, esc, icone, logoPalavra, logoSimbolo, logoCompleto, catalogo, daColecao, daCategoria, aroma, produtos, preco, loja } from './comum.mjs';
import { readFileSync } from 'node:fs';
import { RAIZ } from '../src/util.mjs';

export const nome = 'Porcelana';
const SUB = { queimadores: '9 modelos', 'wax-melts': '16 aromas', velas: '9 velas', decoracao: '8 peças' };

const fontes = `<style>${readFileSync(RAIZ + 'propostas/fontes/fontes.css', 'utf8')}</style>`;

const css = `
:root{--fundo:#FBF8F5;--areia:#F3EBE6;--areia-2:#EADDD6;--rosa:#C6A99F;--rosa-esc:#8A5E54;--tinta:#2A2120;--tinta-2:#62514C;--natal:#7A1C22;--ouro:#B8954F;
--serif:'Libre Bodoni',Georgia,serif;--sans:'Be Vietnam Pro',system-ui,sans-serif;--r:28px;--r-s:20px;--gut:clamp(16px,4vw,48px);--max:1240px}
*{box-sizing:border-box;margin:0}
html{-webkit-text-size-adjust:100%}
body{background:var(--fundo);color:var(--tinta);font:400 16px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%;height:auto}
picture{display:block}
.ft>picture,.f1>picture,.f2>picture{width:100%;height:100%}
picture img{width:100%;height:100%;object-fit:cover}
a{color:inherit;text-decoration:none}
h1,h2,h3{font-family:var(--serif);font-weight:400;line-height:1.08;letter-spacing:-.01em;text-wrap:balance}
em{font-style:italic}
p{text-wrap:pretty}
.contentor{max-width:var(--max);margin:0 auto;padding:0 var(--gut)}
.etiqueta{font:500 12px/1.4 var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--rosa-esc)}
.icone{width:22px;height:22px}
.icone--p{width:18px;height:18px}
/* topo */
.topo{position:sticky;top:0;z-index:10;background:color-mix(in oklab,var(--fundo) 92%,transparent);backdrop-filter:saturate(1.2) blur(14px);-webkit-backdrop-filter:saturate(1.2) blur(14px);border-bottom:1px solid transparent}
.topo .contentor{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:72px}
.topo nav{display:flex;gap:34px;font:500 14px var(--sans);letter-spacing:.02em}
.topo nav a{padding:8px 0;color:var(--tinta-2)}
.topo nav a[aria-current]{color:var(--tinta)}
.topo .logo-palavra{justify-self:center;width:210px}
.topo__dir{justify-self:end;display:flex;gap:6px}
.topo__dir a,.topo__menu{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;position:relative}
.topo__menu{display:none;background:none;border:0;color:inherit}
.conta{position:absolute;top:6px;right:4px;min-width:17px;height:17px;border-radius:9px;background:var(--tinta);color:var(--fundo);font:600 10px/17px var(--sans);text-align:center;padding:0 4px}
@media (max-width:900px){.topo .contentor{grid-template-columns:44px 1fr 44px;height:64px}.topo nav{display:none}.topo__menu{display:grid}.topo .logo-palavra{width:172px}}
/* capa */
.capa{padding:clamp(24px,5vw,56px) 0 clamp(56px,8vw,112px)}
.capa .contentor{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,6fr);gap:clamp(24px,5vw,72px);align-items:center}
.capa__texto{display:grid;gap:22px;align-content:center}
.capa h1{font-size:clamp(40px,5.2vw,76px)}
.capa h1 em{color:var(--rosa-esc)}
.capa p.lead{font-size:clamp(16px,1.4vw,18px);color:var(--tinta-2);max-width:34ch}
.botoes{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:6px}
.botao{display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 26px;border-radius:999px;background:var(--tinta);color:var(--fundo);font:500 15px var(--sans);letter-spacing:.01em}
.botao--claro{background:transparent;color:var(--tinta);box-shadow:inset 0 0 0 1px var(--areia-2)}
.capa__fotos{position:relative;aspect-ratio:1/1.02}
.capa__fotos .f1{position:absolute;inset:0 0 0 18%;border-radius:var(--r);overflow:hidden}
.capa__fotos .f2{position:absolute;left:0;bottom:-6%;width:42%;aspect-ratio:4/5;border-radius:var(--r-s);overflow:hidden;box-shadow:0 0 0 8px var(--fundo)}
.selo{position:absolute;right:-14px;top:-14px;width:118px;height:118px;border-radius:50%;background:var(--fundo);display:grid;place-items:center;box-shadow:0 0 0 1px var(--areia-2)}
.selo svg{width:104px;height:104px;animation:roda 28s linear infinite}
.selo text{font:500 9.4px var(--sans);letter-spacing:.32em;text-transform:uppercase;fill:var(--rosa-esc)}
.selo .logo-simbolo{position:absolute;width:38px}
@keyframes roda{to{rotate:360deg}}
@media (prefers-reduced-motion:reduce){.selo svg{animation:none}}
@media (max-width:900px){.capa h1{font-size:clamp(38px,10.5vw,48px)}.capa .contentor{grid-template-columns:minmax(0,1fr)}.capa__fotos{order:-1;aspect-ratio:1/.92}.capa__fotos .f1{inset:0 0 0 0}.capa__fotos .f2{width:33%;left:-4px;bottom:-9%}.selo{right:8px;top:8px;width:96px;height:96px}.selo svg{width:86px;height:86px}.capa__texto{padding-top:34px}}
/* secções */
.seccao{padding:clamp(56px,8vw,112px) 0}
.cabeca{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:clamp(24px,3.5vw,44px)}
.cabeca h2{font-size:clamp(34px,4.2vw,56px)}
.cabeca p{color:var(--tinta-2);max-width:46ch;margin-top:10px}
.ligacao{display:inline-flex;align-items:center;gap:8px;font:500 15px var(--sans);border-bottom:1px solid var(--rosa);padding-bottom:3px;white-space:nowrap}
/* categorias */
.cats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(12px,1.8vw,24px)}
.cat .ft{aspect-ratio:4/5;border-radius:var(--r-s);overflow:hidden;background:var(--areia)}
.cat h3{font-size:clamp(20px,2vw,27px);margin-top:14px;display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.cat h3 small{font:400 13px var(--sans);color:var(--tinta-2)}
@media (max-width:900px){.cats{grid-template-columns:repeat(2,minmax(0,1fr))}}
/* produtos */
.grelha{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(12px,1.8vw,24px)}
.prod .ft{aspect-ratio:4/5;border-radius:var(--r-s);overflow:hidden;background:var(--areia)}
.prod h3{font:500 15.5px/1.35 var(--sans);margin-top:14px;letter-spacing:0}
.prod .preco{font:400 15px var(--sans);color:var(--tinta-2);margin-top:2px}
.prod .lim{font:500 11px var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--natal);margin-top:8px}
@media (max-width:900px){.grelha{grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:68%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;margin:0 calc(-1*var(--gut));padding:0 var(--gut);scroll-padding:0 var(--gut);position:relative;scrollbar-width:none}.grelha>*{scroll-snap-align:start}}
/* aromas */
.aromas{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:clamp(24px,5vw,72px);align-items:center}
.aromas__lista h3{font:500 12px var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--tinta-2);margin:26px 0 12px}
.pilulas{display:flex;flex-wrap:wrap;gap:8px}
.pilula{display:inline-flex;align-items:center;gap:9px;min-height:44px;padding:0 16px 0 12px;border-radius:999px;background:var(--areia);font:400 14.5px var(--sans)}
.pilula i{width:14px;height:14px;border-radius:50%;background:var(--c);box-shadow:inset 0 0 0 1px rgb(0 0 0/.08)}
.pilula[aria-pressed=true]{background:var(--tinta);color:var(--fundo)}
.aroma-card{background:var(--areia);border-radius:var(--r);overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.aroma-card .ft{position:relative;min-height:420px}.aroma-card .ft picture{position:absolute;inset:0}
.aroma-card__txt{padding:clamp(22px,3vw,36px);display:grid;gap:14px;align-content:center}
.aroma-card h3{font-size:clamp(28px,3vw,40px)}
.aroma-card h3 em{display:block;font-size:.5em;color:var(--rosa-esc);margin-bottom:6px;font-family:var(--sans);font-style:normal;font-weight:500;letter-spacing:.2em;text-transform:uppercase}
.piramide{display:grid;gap:10px;font-size:14.5px}
.piramide div{display:grid;grid-template-columns:76px 1fr;gap:10px;padding-top:10px;border-top:1px solid var(--areia-2)}
.piramide dt{font:500 11.5px/1.9 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--tinta-2)}
.formatos{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}
.formatos a{display:inline-flex;gap:8px;align-items:center;min-height:44px;padding:0 16px;border-radius:999px;background:var(--fundo);font:500 14px var(--sans)}
@media (max-width:900px){.aromas{grid-template-columns:minmax(0,1fr)}.aroma-card{grid-template-columns:minmax(0,1fr)}.aroma-card .ft{min-height:0;aspect-ratio:16/11}}
/* lembranças */
.lemb{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:clamp(24px,5vw,72px);align-items:center}
.lemb h2{font-size:clamp(34px,4.2vw,56px)}
.lemb p{color:var(--tinta-2);margin:18px 0 22px;max-width:44ch}
.ocasioes{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 26px}
.ocasioes span{padding:9px 14px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--areia-2);font-size:14px}
.mosaico{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:auto auto;gap:clamp(10px,1.4vw,18px)}
.mosaico .ft{border-radius:var(--r-s);overflow:hidden;aspect-ratio:4/5}
.mosaico .ft:first-child{grid-row:span 2;aspect-ratio:auto}
@media (max-width:900px){.lemb{grid-template-columns:minmax(0,1fr)}}
/* sobre */
.sobre{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1fr);gap:clamp(24px,5vw,72px);align-items:center;background:var(--areia);border-radius:calc(var(--r) + 8px);padding:clamp(22px,4vw,56px)}
.sobre .ft{border-radius:var(--r-s);overflow:hidden;aspect-ratio:1}
.sobre h2{font-size:clamp(30px,3.4vw,46px);margin:14px 0 16px}
.sobre p{color:var(--tinta-2);max-width:48ch}
.sobre .logo-simbolo{width:46px}
@media (max-width:900px){.sobre{grid-template-columns:minmax(0,1fr)}}
/* garantias */
.garantias{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;border-top:1px solid var(--areia-2);padding-top:32px}
.garantias li{list-style:none;display:grid;grid-template-columns:40px 1fr;gap:12px;align-items:start;font-size:14.5px;color:var(--tinta-2)}
.garantias strong{display:block;color:var(--tinta);font-weight:500}
.garantias .ic{width:40px;height:40px;border-radius:50%;background:var(--areia);display:grid;place-items:center;color:var(--rosa-esc)}
@media (max-width:900px){.garantias{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:420px){.garantias{grid-template-columns:minmax(0,1fr)}}
ul{padding:0}
/* rodapé */
.rodape{margin-top:clamp(56px,8vw,96px);padding:clamp(40px,6vw,72px) 0 28px;border-top:1px solid var(--areia-2)}
.rodape .colunas{display:grid;grid-template-columns:minmax(0,1.4fr) repeat(3,minmax(0,1fr));gap:32px}
.rodape .logo-completo{width:116px}
.rodape p{color:var(--tinta-2);font-size:14.5px;margin-top:14px;max-width:30ch}
.rodape h3{font:500 12px var(--sans);letter-spacing:.2em;text-transform:uppercase;margin-bottom:14px}
.rodape li{list-style:none;font-size:14.5px;color:var(--tinta-2);padding:5px 0}
.redes{display:flex;gap:8px;margin-top:18px}
.redes a{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px var(--areia-2)}
.legal{display:flex;flex-wrap:wrap;gap:8px 22px;justify-content:space-between;margin-top:44px;padding-top:20px;border-top:1px solid var(--areia-2);font-size:13px;color:var(--tinta-2)}
.legal div{display:flex;flex-wrap:wrap;gap:8px 20px}
@media (max-width:900px){.rodape .colunas{grid-template-columns:repeat(2,minmax(0,1fr))}.rodape .marca{grid-column:1/-1}}
`;

const anel = `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="circ" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"/></defs><text><textPath href="#circ">Feito à mão · Oliveira de Azeméis ·</textPath></text></svg>`;

function cartao(p) {
  return `<a class="prod" href="#"><div class="ft">${foto(p.fotos[0], { sizes: '(max-width:900px) 68vw, 290px' })}</div><h3>${esc(p.nome)}</h3><p class="preco">${preco(p)}</p>${p.limitada ? '<p class="lim">Edição limitada</p>' : ''}</a>`;
}

export default function gerar() {
  const natal = ['queimador-correio-do-pai-natal', 'queimador-rena', 'queimador-pai-natal', 'queimador-biscoitos-de-natal'].map((s) => produtos[s]);
  const a = aroma('sunday-in-cashmere');
  const pills = (col) => catalogo.aromas.filter((x) => x.colecao === col).map((x) => `<button class="pilula" style="--c:${x.cor}" aria-pressed="${x.id === a.id}"><i></i>${esc(x.nome)}</button>`).join('');
  const corpo = `
<header class="topo"><div class="contentor">
  <nav aria-label="Principal"><a href="#" aria-current="page">Loja</a><a href="#">Aromas</a><a href="#">Lembranças</a><a href="#">Sobre</a></nav>
  <button class="topo__menu" aria-label="Menu">${icone('menu')}</button>
  ${logoPalavra(210)}
  <div class="topo__dir"><a href="#" aria-label="Carrinho">${icone('saco')}<span class="conta">2</span></a></div>
</div></header>
<main>
<section class="capa"><div class="contentor">
  <div class="capa__texto">
    <p class="etiqueta">Natal 2026 · Edição limitada</p>
    <h1>O Natal mais <em>cheiroso</em> de sempre.</h1>
    <p class="lead">Queimadores novos e oito aromas de Natal, feitos à mão em Oliveira de Azeméis e em quantidades limitadas.</p>
    <div class="botoes"><a class="botao" href="#">Ver a coleção ${icone('seta', 'icone icone--p')}</a><a class="botao botao--claro" href="#">Conhecer os aromas</a></div>
  </div>
  <div class="capa__fotos">
    <div class="f1">${foto('natal-correio', { sizes: '(max-width:900px) 100vw, 640px', prioridade: true })}</div>
    <div class="f2">${foto('natal-casinha', { sizes: '(max-width:900px) 40vw, 260px' })}</div>
    <div class="selo">${anel}${logoSimbolo(38)}</div>
  </div>
</div></section>

<section class="seccao" style="padding-top:0"><div class="contentor">
  <div class="cabeca"><div><p class="etiqueta">A loja</p><h2>Para cada <em>cantinho</em></h2></div><a class="ligacao" href="#">Ver tudo ${icone('seta', 'icone icone--p')}</a></div>
  <div class="cats">${catalogo.categorias.map((c) => `<a class="cat" href="#"><div class="ft">${foto(c.foto, { sizes: '(max-width:900px) 46vw, 290px' })}</div><h3>${esc(c.nome)} <small>${SUB[c.id]}</small></h3></a>`).join('')}</div>
</div></section>

<section class="seccao" style="padding-top:0"><div class="contentor">
  <div class="cabeca"><div><p class="etiqueta">Coleção de Natal 2026</p><h2>A Essência do Natal</h2></div><a class="ligacao" href="#">Ver a coleção ${icone('seta', 'icone icone--p')}</a></div>
  <div class="grelha">${natal.map(cartao).join('')}</div>
</div></section>

<section class="seccao" style="padding-top:0"><div class="contentor aromas">
  <div class="aromas__lista">
    <p class="etiqueta">16 aromas</p>
    <div class="cabeca" style="margin-bottom:0"><div><h2>Escolhe o teu <em>cheirinho</em></h2><p>Snapbar, wax melts ou vela: cada aroma tem as suas notas de saída, de coração e de fundo.</p></div></div>
    <h3>Natal</h3><div class="pilulas">${pills('natal-2026')}</div>
    <h3>Outono</h3><div class="pilulas">${pills('outono-2026')}</div>
  </div>
  <article class="aroma-card">
    <div class="ft">${foto(a.foto, { sizes: '(max-width:900px) 100vw, 320px' })}</div>
    <div class="aroma-card__txt">
      <h3><em>Outono</em>${esc(a.nome)}</h3>
      <p style="color:var(--tinta-2)">${esc(a.frase)}</p>
      <dl class="piramide"><div><dt>Saída</dt><dd>${a.piramide.saida.join(', ')}</dd></div><div><dt>Coração</dt><dd>${a.piramide.coracao.join(', ')}</dd></div><div><dt>Fundo</dt><dd>${a.piramide.fundo.join(', ')}</dd></div></dl>
      <div class="formatos"><a href="#">Snapbar · ${euro(4)}</a><a href="#">Vela · ${euro(13.5)}</a></div>
    </div>
  </article>
</div></section>

<section class="seccao" style="padding-top:0"><div class="contentor lemb">
  <div>
    <p class="etiqueta">Lembranças personalizadas</p>
    <h2>Para quem quer cada ocasião <em>inesquecível</em></h2>
    <p>Batizados, comunhões, casamentos, baby showers e padrinhos: lembranças feitas à mão, com o nome, a data e as cores do teu dia.</p>
    <div class="ocasioes">${catalogo.ocasioes.map((o) => `<span>${esc(o.nome)}</span>`).join('')}</div>
    <div class="botoes"><a class="botao" href="#">${icone('whatsapp', 'icone icone--p')} Pedir orçamento</a><a class="ligacao" href="#">Ver lembranças ${icone('seta', 'icone icone--p')}</a></div>
  </div>
  <div class="mosaico">
    <div class="ft">${foto('lem-batizado-diego', { sizes: '(max-width:900px) 50vw, 360px' })}</div>
    <div class="ft">${foto('lem-casamento-rosas', { sizes: '(max-width:900px) 50vw, 360px' })}</div>
    <div class="ft">${foto('lem-padrinhos-caixas', { sizes: '(max-width:900px) 50vw, 360px' })}</div>
  </div>
</div></section>

<section class="seccao" style="padding-top:0"><div class="contentor"><div class="sobre">
  <div class="ft">${foto('natal-anjinhos', { sizes: '(max-width:900px) 90vw, 420px' })}</div>
  <div>${logoSimbolo(46)}<h2>Feito à mão, uma peça de cada vez</h2>
  <p>A C'Candles nasceu em 2023, em Oliveira de Azeméis, do gosto enorme da Cristiana Moreira por velas. Hoje são queimadores, aromas e lembranças que enchem casas e festas de cheirinho, e uma banca no Street Market de Oliveira de Azeméis a cada quinze dias.</p>
  <div class="botoes" style="margin-top:22px"><a class="ligacao" href="#">A nossa história ${icone('seta', 'icone icone--p')}</a></div></div>
</div></div></section>

<section class="contentor"><ul class="garantias">
  <li><span class="ic">${icone('mao', 'icone icone--p')}</span><div><strong>Feito à mão</strong>Em Oliveira de Azeméis.</div></li>
  <li><span class="ic">${icone('carrinha', 'icone icone--p')}</span><div><strong>Envio para todo o país</strong>Em até 5 dias úteis.</div></li>
  <li><span class="ic">${icone('cadeado', 'icone icone--p')}</span><div><strong>Pagamento seguro</strong>MB WAY, Multibanco ou cartão.</div></li>
  <li><span class="ic">${icone('local', 'icone icone--p')}</span><div><strong>Entrega em mão</strong>Em Oliveira de Azeméis.</div></li>
</ul></section>
</main>
<footer class="rodape"><div class="contentor">
  <div class="colunas">
    <div class="marca">${logoCompleto(116)}<p>Queimadores, aromas e lembranças feitas à mão em Oliveira de Azeméis.</p><div class="redes"><a href="#" aria-label="Instagram">${icone('instagram', 'icone icone--p')}</a><a href="#" aria-label="WhatsApp">${icone('whatsapp', 'icone icone--p')}</a></div></div>
    <div><h3>Loja</h3><ul><li>Queimadores</li><li>Wax melts</li><li>Velas</li><li>Decoração</li><li>Lembranças</li></ul></div>
    <div><h3>Ajuda</h3><ul><li>Como usar wax melts</li><li>Envios e devoluções</li><li>Perguntas frequentes</li><li>Contactos</li></ul></div>
    <div><h3>Encomendas</h3><ul><li>WhatsApp</li><li>Instagram @c_candles.pt</li><li>Envios para todo o país</li><li>MB WAY · Multibanco · Cartão</li></ul></div>
  </div>
  <div class="legal"><span>© 2026 C'Candles</span><div><a href="#">Termos</a><a href="#">Privacidade</a><a href="#">Livro de Reclamações</a></div></div>
</div></footer>`;
  return pagina({ titulo: "C'Candles — proposta A «Porcelana»", css, corpo, fontes });
}
