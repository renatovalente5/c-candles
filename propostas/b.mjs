// PROPOSTA B — «Serão»: quente e acolhedora, como as fotografias do Instagram (linho, tronco, luzinhas).
// Creme-latte, cacau e caramelo; o cartão de Natal em vinho com fio dourado. Títulos em Castoro (serifada
// quente, com itálico), texto em Gantari. Categorias em círculos logo a seguir à capa, como os destaques.
import { pagina, foto, euro, esc, icone, logoPalavra, logoSimbolo, logoCompleto, catalogo, aroma, produtos, preco } from './comum.mjs';
import { readFileSync } from 'node:fs';
import { RAIZ } from '../src/util.mjs';

export const nome = 'Serão';
const fontes = `<style>${readFileSync(RAIZ + 'propostas/fontes/fontes.css', 'utf8')}</style>`;

const css = `
:root{--fundo:#F5EEE6;--cartao:#FFFAF4;--linha:#E6D9CB;--tinta:#33251F;--tinta-2:#6E5A50;--caramelo:#8A5A38;--rosa:#C6A99F;--vinho:#6B1E25;--vinho-2:#561820;--creme:#F6E7D8;--ouro:#C9A45C;
--serif:'Castoro',Georgia,serif;--sans:'Gantari',system-ui,sans-serif;--r:24px;--gut:clamp(16px,4vw,44px);--max:1220px}
*{box-sizing:border-box;margin:0}
body{background:var(--fundo);color:var(--tinta);font:400 16.5px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%;height:auto} picture{display:block}
.ft>picture{width:100%;height:100%} picture img{width:100%;height:100%;object-fit:cover}
a{color:inherit;text-decoration:none} ul{padding:0;list-style:none}
h1,h2,h3{font-family:var(--serif);font-weight:400;line-height:1.1;text-wrap:balance}
p{text-wrap:pretty}
.contentor{max-width:var(--max);margin:0 auto;padding:0 var(--gut)}
.icone{width:22px;height:22px}.icone--p{width:18px;height:18px}
.sobre-titulo{font:600 13px var(--sans);letter-spacing:.08em;color:var(--caramelo);text-transform:uppercase}
/* topo */
.topo{background:var(--fundo);position:sticky;top:0;z-index:5}
.topo .contentor{display:flex;align-items:center;gap:28px;height:78px}
.topo .logo-palavra{width:200px;margin-right:auto}
.topo nav{display:flex;gap:6px}
.topo nav a{padding:10px 14px;border-radius:999px;font:500 15px var(--sans)}
.topo nav a[aria-current]{background:var(--cartao)}
.topo__saco{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:var(--cartao);position:relative}
.topo__saco b{position:absolute;top:2px;right:0;min-width:18px;height:18px;border-radius:9px;background:var(--vinho);color:#fff;font:600 10.5px/18px var(--sans);text-align:center}
.topo__menu{display:none;width:46px;height:46px;border:0;border-radius:50%;background:var(--cartao);place-items:center;color:inherit}
@media (max-width:900px){.topo nav{display:none}.topo__menu{display:grid}.topo .contentor{height:66px;gap:10px}.topo .logo-palavra{width:170px;margin:0 auto}}
/* capa */
.capa{padding:8px 0 0}
.capa__cartao{position:relative;border-radius:calc(var(--r) + 8px);overflow:hidden;min-height:clamp(520px,72vh,680px);display:grid;align-items:end;isolation:isolate}
.capa__cartao>.ft{position:absolute;inset:0;z-index:-2}
.capa__cartao::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgb(86 24 32/.94) 0%,rgb(86 24 32/.80) 34%,rgb(86 24 32/0) 66%)}
.capa__txt{color:var(--creme);padding:clamp(26px,5vw,64px);max-width:600px;display:grid;gap:18px}
.capa__txt .sobre-titulo{color:var(--ouro)}
.capa h1{font-size:clamp(44px,6vw,80px)}
.capa h1 em{color:#F3CFC0}
.capa p{font-size:18px;color:#F1DED0}
.botoes{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
.botao{display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 24px;border-radius:999px;font:600 15.5px var(--sans);background:var(--tinta);color:var(--cartao)}
.capa .botao{background:var(--creme);color:var(--vinho-2)}
.capa .botao--linha{background:transparent;color:var(--creme);box-shadow:inset 0 0 0 1.5px rgb(246 231 216/.6)}
.fio{position:absolute;right:clamp(18px,3vw,36px);top:clamp(18px,3vw,36px);display:flex;align-items:center;gap:10px;padding:8px 14px 8px 8px;border-radius:999px;background:rgb(255 250 244/.92);font:600 13px var(--sans);color:var(--vinho)}
.fio .logo-simbolo{width:30px}
@media (max-width:900px){.capa__cartao{min-height:600px}.capa__cartao::before{background:linear-gradient(0deg,rgb(86 24 32/.96) 0%,rgb(86 24 32/.82) 42%,rgb(86 24 32/0) 72%)}.capa h1{font-size:clamp(38px,10vw,48px)}.capa p{font-size:16.5px}}
/* círculos */
.circulos{display:flex;justify-content:center;gap:clamp(14px,3vw,40px);padding:clamp(28px,4vw,44px) 0 0;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;position:relative}
.circulos a{display:grid;justify-items:center;gap:10px;font:500 15px var(--sans);flex:0 0 auto}
.circulos .ft{width:clamp(84px,10vw,124px);aspect-ratio:1;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px var(--fundo),0 0 0 3.5px var(--rosa)}
@media (max-width:640px){.circulos{justify-content:flex-start;margin:0 calc(-1*var(--gut));padding-left:var(--gut);padding-right:var(--gut)}}
/* secções */
.seccao{padding:clamp(60px,8vw,108px) 0 0}
.cabeca{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:18px;margin-bottom:clamp(22px,3vw,36px)}
.cabeca h2{font-size:clamp(34px,4vw,54px)}
.cabeca h2 em{color:var(--caramelo)}
.cabeca p{color:var(--tinta-2);margin-top:8px;max-width:50ch}
.mais{display:inline-flex;gap:8px;align-items:center;font:600 15px var(--sans);color:var(--caramelo)}
/* produtos */
.grelha{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(14px,2vw,28px)}
.prod{background:var(--cartao);border-radius:var(--r);padding:10px 10px 18px;display:grid;gap:12px}
.prod .ft{aspect-ratio:1;border-radius:calc(var(--r) - 8px);overflow:hidden}
.prod__txt{padding:0 8px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;align-items:baseline}
.prod h3{font:500 18px/1.3 var(--serif)}
.prod .preco{font:600 15.5px var(--sans)}
.prod .nota{grid-column:1/-1;font-size:14px;color:var(--tinta-2)}
@media (max-width:900px){.grelha{grid-template-columns:repeat(2,minmax(0,1fr))}.prod__txt{grid-template-columns:minmax(0,1fr)}.prod h3{font-size:16px}}
/* aromas */
.fila{display:grid;grid-auto-flow:column;grid-auto-columns:clamp(220px,22vw,268px);gap:16px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;position:relative;padding-bottom:6px;scrollbar-width:thin;margin:0 calc(-1*var(--gut));padding-left:var(--gut);padding-right:var(--gut);scroll-padding:0 var(--gut)}
.aroma{scroll-snap-align:start;border-radius:var(--r);background:color-mix(in oklab,var(--c) 26%,var(--cartao));padding:22px 22px 24px;display:grid;align-content:start;gap:12px;min-height:330px;position:relative;overflow:hidden}
.aroma::after{content:"";position:absolute;right:-30px;top:-30px;width:120px;height:120px;border-radius:50%;background:var(--c);opacity:.55}
.aroma small{font:600 12px var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--tinta-2);position:relative}
.aroma h3{font-size:30px;font-style:italic;position:relative;margin-top:36px}
.aroma p{font-size:14.5px;color:var(--tinta-2)}
.aroma .notas{display:flex;flex-wrap:wrap;gap:6px}
.aroma .notas span{font-size:13px;padding:5px 10px;border-radius:999px;background:rgb(255 255 255/.6)}
.aroma .preco{margin-top:auto;font:600 14.5px var(--sans)}
/* lembranças */
.lemb{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);align-items:center}
.lemb .ft{border-radius:calc(var(--r) + 8px);overflow:hidden;aspect-ratio:4/4.4}
.lemb__cartao{background:var(--cartao);border-radius:calc(var(--r) + 8px);padding:clamp(26px,4vw,52px);margin-left:-64px;position:relative;display:grid;gap:16px;box-shadow:0 30px 60px -40px rgb(51 37 31/.45)}
.lemb__cartao h2{font-size:clamp(32px,3.6vw,48px)}
.lemb__cartao p{color:var(--tinta-2)}
.lemb__lista{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 18px;font-size:15px}
.lemb__lista li{display:flex;gap:8px;align-items:center}
.lemb__lista li::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--rosa)}
.botao--whats{background:var(--tinta)}
@media (max-width:900px){.lemb{grid-template-columns:minmax(0,1fr)}.lemb__cartao{margin:-56px 12px 0}.lemb__lista{grid-template-columns:minmax(0,1fr)}}
/* citação */
.citacao{text-align:center;display:grid;justify-items:center;gap:18px;max-width:780px;margin:0 auto}
.citacao .logo-simbolo{width:58px}
.citacao blockquote{font:400 clamp(28px,3.4vw,44px)/1.25 var(--serif);font-style:italic;text-wrap:balance}
.citacao cite{font:600 14px var(--sans);font-style:normal;color:var(--caramelo);letter-spacing:.04em}
.citacao p{color:var(--tinta-2);max-width:56ch}
/* garantias */
.garantias{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.garantias li{background:var(--cartao);border-radius:var(--r);padding:22px;display:grid;gap:8px;font-size:14.5px;color:var(--tinta-2)}
.garantias strong{color:var(--tinta);font:600 16px var(--sans)}
.garantias .icone{color:var(--caramelo)}
@media (max-width:900px){.garantias{grid-template-columns:repeat(2,minmax(0,1fr))}}
/* rodapé */
.rodape{margin-top:clamp(60px,8vw,108px);background:var(--cartao);padding:clamp(44px,6vw,72px) 0 26px;text-align:center}
.rodape .logo-completo{width:128px;margin:0 auto}
.rodape .frase{font:italic 400 19px var(--serif);margin:14px auto 26px;color:var(--tinta-2)}
.rodape .colunas{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;max-width:820px;margin:0 auto;text-align:left}
.rodape h3{font:600 13px var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--caramelo);margin-bottom:10px}
.rodape li{padding:4px 0;font-size:15px;color:var(--tinta-2)}
.redes{display:flex;gap:10px;justify-content:center;margin:30px 0 0}
.redes a{width:46px;height:46px;border-radius:50%;background:var(--fundo);display:grid;place-items:center}
.legal{margin-top:30px;padding-top:18px;border-top:1px solid var(--linha);display:flex;flex-wrap:wrap;justify-content:center;gap:8px 22px;font-size:13.5px;color:var(--tinta-2)}
@media (max-width:700px){.rodape .colunas{grid-template-columns:repeat(2,minmax(0,1fr))}.rodape .colunas>div:last-child{grid-column:1/-1}}
`;

export default function gerar() {
  const fav = ['queimador-pai-natal', 'queimador-correio-do-pai-natal', 'queimador-rena', 'snapbar', 'vela-caramel-and-chill', 'queimador-casinha-de-gengibre'].map((s) => produtos[s]);
  const nota = { 'queimador-pai-natal': 'Com snapbar 15 € · com wax melts 17,40 €', 'queimador-correio-do-pai-natal': 'Com snapbar 15 € · com wax melts 17,40 €', 'queimador-rena': 'Conjunto com snapbar 12 €', snapbar: '35 g · 16 aromas', 'vela-caramel-and-chill': '180 g · cerca de 30 horas', 'queimador-casinha-de-gengibre': 'Com snapbar 15 € · com wax melts 17,40 €' };
  const aromas = catalogo.aromas.filter((a) => a.colecao === 'natal-2026');
  const corpo = `
<header class="topo"><div class="contentor">
  <button class="topo__menu" aria-label="Menu">${icone('menu')}</button>
  ${logoPalavra(200)}
  <nav aria-label="Principal"><a href="#" aria-current="page">Loja</a><a href="#">Aromas</a><a href="#">Lembranças</a><a href="#">Sobre</a></nav>
  <a class="topo__saco" href="#" aria-label="Carrinho, 2 artigos">${icone('saco')}<b>2</b></a>
</div></header>
<main>
<section class="capa"><div class="contentor">
  <div class="capa__cartao">
    <div class="ft">${foto('natal-casinhas-2', { sizes: '(max-width:900px) 100vw, 1180px', prioridade: true })}</div>
    <span class="fio">${logoSimbolo(30)} Feito à mão em Oliveira de Azeméis</span>
    <div class="capa__txt">
      <p class="sobre-titulo">Coleção de Natal 2026 · edição limitada</p>
      <h1>A Essência do <em>Natal</em></h1>
      <p>O Natal mais cheiroso de sempre: queimadores novos e oito aromas, de Rolo de Canela a Biscoitos da Avó.</p>
      <div class="botoes"><a class="botao" href="#">Ver a coleção ${icone('seta', 'icone icone--p')}</a><a class="botao botao--linha" href="#">Os aromas de Natal</a></div>
    </div>
  </div>
  <nav class="circulos" aria-label="Categorias">${[...catalogo.categorias.map((c) => [c.nome, c.foto]), ['Lembranças', 'lem-padrinhos-caixas'], ['Natal', 'natal-casinhas']].map(([n, f]) => `<a href="#"><div class="ft">${foto(f, { sizes: '124px' })}</div>${esc(n)}</a>`).join('')}</nav>
</div></section>

<section class="seccao"><div class="contentor">
  <div class="cabeca"><div><h2>Os favoritos <em>deste serão</em></h2><p>Escolhe o queimador e o aroma que vai com ele. Com snapbar ou wax melts, poupas.</p></div><a class="mais" href="#">Ver a loja ${icone('seta', 'icone icone--p')}</a></div>
  <div class="grelha">${fav.map((p) => `<a class="prod" href="#"><div class="ft">${foto(p.fotos[0], { sizes: '(max-width:900px) 46vw, 380px' })}</div><div class="prod__txt"><h3>${esc(p.nome)}</h3><span class="preco">${preco(p)}</span><span class="nota">${nota[p.slug]}</span></div></a>`).join('')}</div>
</div></section>

<section class="seccao"><div class="contentor">
  <div class="cabeca"><div><h2>Oito aromas <em>de Natal</em></h2><p>Em snapbar de 35 g ou wax melts de 100 g. Desliza para os conhecer.</p></div><a class="mais" href="#">Todos os aromas ${icone('seta', 'icone icone--p')}</a></div>
  <div class="fila">${aromas.map((a) => `<article class="aroma" style="--c:${a.cor}"><small>Natal 2026</small><h3>${esc(a.nome)}</h3><p>${esc(a.frase)}</p><div class="notas">${(a.notas || []).slice(0, 4).map((n) => `<span>${esc(n)}</span>`).join('')}</div><p class="preco">desde ${euro(4)}</p></article>`).join('')}</div>
</div></section>

<section class="seccao"><div class="contentor lemb">
  <div class="ft">${foto('lem-casamento-rosas', { sizes: '(max-width:900px) 100vw, 640px' })}</div>
  <div class="lemb__cartao">
    <p class="sobre-titulo">Lembranças personalizadas</p>
    <h2>Para quem quer cada ocasião inesquecível</h2>
    <p>Com o nome, a data e as cores do teu dia. Diz-nos a ocasião e quantas precisas: fazemos o orçamento.</p>
    <ul class="lemb__lista">${catalogo.ocasioes.map((o) => `<li>${esc(o.nome)}</li>`).join('')}</ul>
    <div class="botoes"><a class="botao" href="#">${icone('whatsapp', 'icone icone--p')} Pedir orçamento</a></div>
  </div>
</div></section>

<section class="seccao"><div class="contentor"><div class="citacao">
  ${logoSimbolo(58)}
  <blockquote>«A marca surge de um hobby e de um gosto enorme por velas.»</blockquote>
  <cite>Cristiana Moreira, 2023</cite>
  <p>Desde então, cada queimador, cada aroma e cada lembrança sai das mãos dela, em Oliveira de Azeméis, e há banca no Street Market a cada quinze dias.</p>
  <a class="mais" href="#">A nossa história ${icone('seta', 'icone icone--p')}</a>
</div></div></section>

<section class="seccao"><div class="contentor"><ul class="garantias">
  <li>${icone('mao')}<strong>Feito à mão</strong>Em Oliveira de Azeméis, peça a peça.</li>
  <li>${icone('carrinha')}<strong>Envio para todo o país</strong>Em até 5 dias úteis.</li>
  <li>${icone('cadeado')}<strong>Pagamento seguro</strong>MB WAY, Multibanco ou cartão.</li>
  <li>${icone('local')}<strong>Entrega em mão</strong>Em Oliveira de Azeméis, sem portes.</li>
</ul></div></section>
</main>
<footer class="rodape"><div class="contentor">
  ${logoCompleto(128)}
  <p class="frase">Para quem quer cada ocasião inesquecível.</p>
  <div class="colunas">
    <div><h3>Loja</h3><ul><li>Queimadores</li><li>Wax melts</li><li>Velas</li><li>Decoração</li></ul></div>
    <div><h3>Ajuda</h3><ul><li>Como usar wax melts</li><li>Envios e devoluções</li><li>Perguntas frequentes</li><li>Contactos</li></ul></div>
    <div><h3>Fala connosco</h3><ul><li>WhatsApp</li><li>Instagram @c_candles.pt</li><li>Lembranças por orçamento</li></ul></div>
  </div>
  <div class="redes"><a href="#" aria-label="Instagram">${icone('instagram', 'icone icone--p')}</a><a href="#" aria-label="WhatsApp">${icone('whatsapp', 'icone icone--p')}</a></div>
  <div class="legal"><span>© 2026 C'Candles</span><a href="#">Termos</a><a href="#">Privacidade</a><a href="#">Livro de Reclamações</a></div>
</div></footer>`;
  return pagina({ titulo: "C'Candles — proposta B «Serão»", css, corpo, fontes });
}
