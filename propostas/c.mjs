// PROPOSTA C — «Cheirinho»: a loja pelos aromas. Branco quente e muito ar; cada aroma tem a sua cor;
// títulos enormes numa Didone estreita (Imbue, a lembrar a palavra do logótipo), texto em Geist.
// A capa mostra três queimadores lado a lado; a secção principal é «escolhe pelo cheirinho».
import { pagina, foto, euro, esc, icone, logoPalavra, logoSimbolo, logoCompleto, catalogo, aroma, produtos, preco, daCategoria } from './comum.mjs';
import { readFileSync } from 'node:fs';
import { RAIZ } from '../src/util.mjs';

export const nome = 'Cheirinho';
const fontes = `<style>${readFileSync(RAIZ + 'propostas/fontes/fontes.css', 'utf8')}</style>`;

const css = `
:root{--fundo:#FFFDFB;--nevoa:#F6EFEB;--linha:#ECE2DC;--tinta:#1F1B1A;--tinta-2:#5E534F;--rosa:#C6A99F;--rosa-esc:#8A5E54;--natal:#8E2A2E;
--disp:'Imbue',Didot,serif;--sans:'Geist',system-ui,sans-serif;--r:22px;--gut:clamp(16px,4vw,56px);--max:1320px}
*{box-sizing:border-box;margin:0}
body{background:var(--fundo);color:var(--tinta);font:400 16px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%;height:auto} picture{display:block}
.ft>picture{width:100%;height:100%} picture img{width:100%;height:100%;object-fit:cover}
a{color:inherit;text-decoration:none} ul{padding:0;list-style:none}
h1,h2,h3{font-weight:400;text-wrap:balance}
p{text-wrap:pretty}
.contentor{max-width:var(--max);margin:0 auto;padding:0 var(--gut)}
.icone{width:22px;height:22px}.icone--p{width:18px;height:18px}
.rotulo{font:500 12.5px var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--tinta-2)}
/* topo */
.topo{border-bottom:1px solid var(--linha);background:var(--fundo);position:sticky;top:0;z-index:5}
.topo .contentor{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:68px}
.topo nav{display:flex;gap:26px;font:500 14.5px var(--sans)}
.topo .logo-simbolo{width:40px}
.topo__dir{justify-self:end;display:flex;align-items:center;gap:18px;font:500 14.5px var(--sans)}
.topo__dir a{display:flex;align-items:center;gap:8px}
.topo__menu{display:none;border:0;background:none;width:44px;height:44px;place-items:center;color:inherit}
@media (max-width:900px){.topo nav,.topo__dir .so-pc{display:none}.topo__menu{display:grid}.topo .contentor{grid-template-columns:44px 1fr 44px}.topo .logo-simbolo{justify-self:center}}
/* capa */
.capa{padding:clamp(28px,5vw,64px) 0 0;text-align:center}
.capa h1{font:300 clamp(64px,12.5vw,188px)/.86 var(--disp);letter-spacing:-.02em}
.capa h1 em{font-style:normal;color:var(--natal)}
.capa .sub{max-width:52ch;margin:clamp(18px,2.4vw,28px) auto 0;color:var(--tinta-2);font-size:clamp(16px,1.4vw,18px)}
.botoes{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:24px}
.botao{display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 26px;border-radius:999px;background:var(--tinta);color:var(--fundo);font:500 15px var(--sans)}
.botao--leve{background:var(--nevoa);color:var(--tinta)}
.tira{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,1.6vw,22px);margin-top:clamp(32px,5vw,64px);text-align:left}
.tira a{display:grid;gap:12px}
.tira .ft{aspect-ratio:4/5;border-radius:var(--r);overflow:hidden}
.tira a:nth-child(2) .ft{aspect-ratio:4/5.6;margin-top:-28px}
.tira h3{font:500 15.5px var(--sans);display:flex;justify-content:space-between;gap:10px}
.tira h3 span{color:var(--tinta-2);font-weight:400}
@media (max-width:760px){.tira{grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:74%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;position:relative;margin:28px calc(-1*var(--gut)) 0;padding:0 var(--gut);scroll-padding:0 var(--gut);scrollbar-width:none}.tira a{scroll-snap-align:start}.tira a:nth-child(2) .ft{aspect-ratio:4/5;margin-top:0}}
/* secções */
.seccao{padding:clamp(64px,9vw,128px) 0 0}
.cabeca{display:grid;gap:12px;margin-bottom:clamp(24px,3.5vw,44px)}
.cabeca h2{font:300 clamp(44px,6vw,92px)/.92 var(--disp);letter-spacing:-.01em}
.cabeca p{color:var(--tinta-2);max-width:52ch}
.cabeca--lado{grid-template-columns:minmax(0,1fr) auto;align-items:end}
.ligacao{display:inline-flex;align-items:center;gap:8px;font:500 15px var(--sans);text-decoration:underline;text-underline-offset:5px;text-decoration-color:var(--rosa)}
/* humores e aromas */
.humores{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}
.humores button{min-height:44px;padding:0 18px;border-radius:999px;border:1px solid var(--linha);background:var(--fundo);font:500 14.5px var(--sans);color:var(--tinta)}
.humores button[aria-pressed=true]{background:var(--tinta);border-color:var(--tinta);color:var(--fundo)}
.aromas{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.aroma{border-radius:var(--r);background:var(--nevoa);overflow:hidden;display:grid;grid-template-rows:auto 1fr}
.aroma__topo{height:132px;background:linear-gradient(135deg,var(--c),color-mix(in oklab,var(--c) 45%,#fff));position:relative}
.aroma__topo .ft{position:absolute;inset:0;mix-blend-mode:multiply;opacity:.9}
.aroma__txt{padding:16px 18px 18px;display:grid;gap:8px;align-content:start}
.aroma h3{font:400 30px/1 var(--disp)}
.aroma p{font-size:13.5px;color:var(--tinta-2)}
.aroma .col{font:500 11.5px var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--tinta-2)}
.aroma .preco{font:500 14px var(--sans);margin-top:6px}
@media (max-width:900px){.aromas{grid-template-columns:repeat(2,minmax(0,1fr))}.aroma__topo{height:96px}.aroma h3{font-size:26px}}
/* separadores da loja */
.separadores{display:flex;gap:6px;overflow-x:auto;overflow-y:hidden;position:relative;scrollbar-width:none;margin-bottom:22px}
.separadores a{flex:0 0 auto;min-height:44px;display:inline-flex;align-items:center;padding:0 18px;border-radius:999px;background:var(--nevoa);font:500 14.5px var(--sans)}
.separadores a[aria-current]{background:var(--tinta);color:var(--fundo)}
.grelha{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(12px,1.6vw,22px)}
.prod{display:grid;gap:10px}
.prod .ft{aspect-ratio:1;border-radius:var(--r);overflow:hidden;background:var(--nevoa)}
.prod h3{font:500 15px/1.35 var(--sans)}
.prod p{font-size:14.5px;color:var(--tinta-2)}
.prod .lim{color:var(--natal);font-size:12.5px;font-weight:500}
@media (max-width:900px){.grelha{grid-template-columns:repeat(2,minmax(0,1fr))}}
/* lembranças */
.lemb{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.lemb a{display:grid;gap:10px}
.lemb .ft{aspect-ratio:3/4;border-radius:var(--r);overflow:hidden}
.lemb h3{font:400 26px/1 var(--disp)}
.lemb__cta{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;margin-top:28px;padding:22px 26px;border-radius:var(--r);background:var(--nevoa)}
.lemb__cta p{max-width:60ch}
@media (max-width:900px){.lemb{grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:62%;overflow-x:auto;overflow-y:hidden;position:relative;scroll-snap-type:x mandatory;margin:0 calc(-1*var(--gut));padding:0 var(--gut);scroll-padding:0 var(--gut);scrollbar-width:none}.lemb a{scroll-snap-align:start}}
/* sobre */
.sobre{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(24px,5vw,80px);align-items:end}
.sobre h2{font:300 clamp(44px,5.4vw,84px)/.95 var(--disp)}
.sobre p{color:var(--tinta-2);max-width:50ch;margin-top:18px}
.numeros{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.numeros div{border-top:1px solid var(--tinta);padding-top:12px}
.numeros b{display:block;font:300 54px/1 var(--disp)}
.numeros span{font-size:14px;color:var(--tinta-2)}
@media (max-width:900px){.sobre{grid-template-columns:minmax(0,1fr)}}
/* rodapé */
.rodape{margin-top:clamp(64px,9vw,128px);border-top:1px solid var(--linha);padding:clamp(40px,6vw,64px) 0 26px}
.rodape .colunas{display:grid;grid-template-columns:minmax(0,1.3fr) repeat(3,minmax(0,1fr));gap:28px}
.rodape .logo-completo{width:104px}
.rodape p{color:var(--tinta-2);font-size:14.5px;margin-top:12px;max-width:30ch}
.rodape h3{font:500 12.5px var(--sans);letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px}
.rodape li{padding:4px 0;font-size:14.5px;color:var(--tinta-2)}
.legal{margin-top:36px;padding-top:18px;border-top:1px solid var(--linha);display:flex;flex-wrap:wrap;gap:8px 22px;justify-content:space-between;font-size:13px;color:var(--tinta-2)}
.legal div{display:flex;gap:18px;flex-wrap:wrap}
@media (max-width:900px){.rodape .colunas{grid-template-columns:repeat(2,minmax(0,1fr))}.rodape .marca{grid-column:1/-1}}
`;

const HUMOR = { doce: ['Doce', ['caramel-and-chill', 'bonjour-paris', 'biscoitos-da-avo', 'bombons-de-chocolate', 'rolo-de-canela', 'meet-me-in-dubai']], quente: ['Quente e especiado', []], frutado: ['Frutado', []], fresco: ['Fresco', []] };

export default function gerar() {
  const tres = ['queimador-casinha-de-gengibre', 'queimador-pai-natal', 'queimador-bebida-quente'].map((s) => produtos[s]);
  const aromas = HUMOR.doce[1].map(aroma).concat([aroma('wood-you'), aroma('desejo-proibido')]);
  const loja = ['queimador-correio-do-pai-natal', 'queimador-abobora', 'vela-sunday-in-cashmere', 'queimador-nuvem', 'snapbar', 'queimador-casa-do-bosque', 'vela-coffee-first', 'kit-pinta-a-tua-abobora'].map((s) => produtos[s]);
  const lemb = [['batizado', 'lem-batizado-diego'], ['casamento', 'lem-casamento-rosas'], ['padrinhos', 'lem-padrinhos-madrinha'], ['comunhao', 'lem-anjinhos-redoma']];
  const corpo = `
<header class="topo"><div class="contentor">
  <nav aria-label="Principal"><a href="#">Loja</a><a href="#">Aromas</a><a href="#">Lembranças</a><a href="#">Sobre</a></nav>
  <button class="topo__menu" aria-label="Menu">${icone('menu')}</button>
  ${logoSimbolo(40, 'logo-simbolo', "C'Candles")}
  <div class="topo__dir"><a class="so-pc" href="#">${icone('whatsapp', 'icone icone--p')} Encomendas</a><a href="#" aria-label="Carrinho">${icone('saco')} <span class="so-pc">(2)</span></a></div>
</div></header>
<main>
<section class="capa"><div class="contentor">
  <p class="rotulo">Coleção de Natal 2026 · quantidades limitadas</p>
  <h1 style="margin-top:14px">Cheirinho<br>a <em>Natal</em></h1>
  <p class="sub">Queimadores novos e oito aromas de Natal, feitos à mão em Oliveira de Azeméis. Escolhe o teu queimador e o aroma que vai com ele.</p>
  <div class="botoes"><a class="botao" href="#">Ver a coleção ${icone('seta', 'icone icone--p')}</a><a class="botao botao--leve" href="#">Escolher pelo aroma</a></div>
  <div class="tira">${tres.map((p) => `<a href="#"><div class="ft">${foto(p.fotos[0], { sizes: '(max-width:760px) 74vw, 420px', prioridade: p === tres[1] })}</div><h3>${esc(p.nome.replace('Queimador ', ''))} <span>${preco(p)}</span></h3></a>`).join('')}</div>
</div></section>

<section class="seccao"><div class="contentor">
  <div class="cabeca cabeca--lado"><div><p class="rotulo">16 aromas</p><h2 style="margin-top:12px">Escolhe pelo cheirinho</h2><p style="margin-top:14px">Cada aroma tem notas de saída, de coração e de fundo. Em snapbar, wax melts ou vela.</p></div><a class="ligacao" href="#">Todos os aromas ${icone('seta', 'icone icone--p')}</a></div>
  <div class="humores" role="group" aria-label="Filtrar aromas">${Object.entries(HUMOR).map(([k, [n]], i) => `<button aria-pressed="${i === 0}">${n}</button>`).join('')}</div>
  <div class="aromas">${aromas.map((a) => `<a class="aroma" href="#" style="--c:${a.cor}"><div class="aroma__topo">${a.foto ? `<div class="ft">${foto(a.foto, { sizes: '(max-width:900px) 46vw, 300px', alt: '' })}</div>` : ''}</div><div class="aroma__txt"><span class="col">${a.colecao === 'natal-2026' ? 'Natal' : 'Outono'}</span><h3>${esc(a.nome)}</h3><p>${esc((a.notas || [...a.piramide.saida, ...a.piramide.coracao]).slice(0, 4).join(' · '))}</p><span class="preco">desde ${euro(4)}</span></div></a>`).join('')}</div>
</div></section>

<section class="seccao"><div class="contentor">
  <div class="cabeca cabeca--lado"><div><p class="rotulo">A loja</p><h2 style="margin-top:12px">Para cada cantinho</h2></div><a class="ligacao" href="#">Ver a loja ${icone('seta', 'icone icone--p')}</a></div>
  <nav class="separadores" aria-label="Categorias"><a href="#" aria-current="page">Tudo</a>${catalogo.categorias.map((c) => `<a href="#">${esc(c.nome)}</a>`).join('')}</nav>
  <div class="grelha">${loja.map((p) => `<a class="prod" href="#"><div class="ft">${foto(p.fotos[0], { sizes: '(max-width:900px) 46vw, 300px' })}</div><h3>${esc(p.nome)}</h3><p>${preco(p)}</p></a>`).join('')}</div>
</div></section>

<section class="seccao"><div class="contentor">
  <div class="cabeca cabeca--lado"><div><p class="rotulo">Lembranças personalizadas</p><h2 style="margin-top:12px">Cada ocasião, inesquecível</h2></div><a class="ligacao" href="#">Ver lembranças ${icone('seta', 'icone icone--p')}</a></div>
  <div class="lemb">${lemb.map(([o, f]) => `<a href="#"><div class="ft">${foto(f, { sizes: '(max-width:900px) 62vw, 310px' })}</div><h3>${esc(catalogo.ocasioes.find((x) => x.id === o).nome)}</h3></a>`).join('')}</div>
  <div class="lemb__cta"><p>Batizados, comunhões, casamentos, baby showers e padrinhos: diz-nos a ocasião, a data e quantas precisas, e fazemos o orçamento.</p><a class="botao" href="#">${icone('whatsapp', 'icone icone--p')} Pedir orçamento</a></div>
</div></section>

<section class="seccao"><div class="contentor sobre">
  <div><p class="rotulo">Desde 2023</p><h2 style="margin-top:12px">Feito à mão em Oliveira de Azeméis</h2><p>A C'Candles nasceu do gosto enorme da Cristiana Moreira por velas. Cada queimador, cada aroma e cada lembrança sai das mãos dela, e há banca no Street Market a cada quinze dias.</p></div>
  <div class="numeros"><div><b>16</b><span>aromas</span></div><div><b>9</b><span>queimadores</span></div><div><b>2</b><span>coleções por ano</span></div></div>
</div></section>
</main>
<footer class="rodape"><div class="contentor">
  <div class="colunas">
    <div class="marca">${logoCompleto(104)}<p>Queimadores, aromas e lembranças feitas à mão em Oliveira de Azeméis.</p></div>
    <div><h3>Loja</h3><ul><li>Queimadores</li><li>Wax melts</li><li>Velas</li><li>Decoração</li><li>Lembranças</li></ul></div>
    <div><h3>Ajuda</h3><ul><li>Como usar wax melts</li><li>Envios e devoluções</li><li>Perguntas frequentes</li><li>Contactos</li></ul></div>
    <div><h3>Encomendas</h3><ul><li>WhatsApp</li><li>Instagram @c_candles.pt</li><li>Envios para todo o país</li><li>MB WAY · Multibanco · Cartão</li></ul></div>
  </div>
  <div class="legal"><span>© 2026 C'Candles</span><div><a href="#">Termos</a><a href="#">Privacidade</a><a href="#">Livro de Reclamações</a></div></div>
</div></footer>`;
  return pagina({ titulo: "C'Candles — proposta C «Cheirinho»", css, corpo, fontes });
}
