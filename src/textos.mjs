// Contactos e páginas legais. Os dados da empresa e os portes vêm de content/loja.json (o que ainda não foi
// dito aparece «[por confirmar: …]» na pré-visualização); os textos da lei vêm da legal-comum.
// Regras do Renato: a identificação NÃO vai no rodapé (vai aqui: Contactos, Termos, Privacidade); o
// Livro de Reclamações só no rodapé, discreto; o WhatsApp só como ligação, sem o número.
import {
  COMO_SE_FAZ_A_ENCOMENDA, LIVRE_RESOLUCAO, SEM_LIVRE_RESOLUCAO_PERSONALIZADO, FORMULARIO_LIVRE_RESOLUCAO,
  textoGarantia, ralHtml, destinatariosHtml, direitosHtml,
} from '../legal-comum/index.mjs';
import { url, esc, euro, icone, porConfirmar, whatsapp, foto } from './util.mjs';
import { DESTINOS } from './seo.mjs';
import { ldMigalhas } from './seo.mjs';

const valor = (v, falta) => (typeof v === 'string' && v.trim() ? esc(v.trim()) : porConfirmar(falta));
const identificacao = (e) => `<ul class="identificacao">
  <li><span>Nome</span> ${valor(e.nome, 'nome ou firma')}</li>
  <li><span>NIF</span> ${valor(e.nif, 'NIF')}</li>
  <li><span>Morada</span> ${valor(e.morada, 'morada')}</li>
  <li><span>Email</span> ${e.email ? `<a href="mailto:${esc(e.email)}">${esc(e.email)}</a>` : porConfirmar('email')}</li>
</ul>`;

function texto(caminho, titulo, frase, html, descricao, { indexar = true } = {}) {
  return {
    caminho, titulo, descricao: descricao || frase, indexar,
    corpo: `<section class="pagina-topo"><div class="contentor"><h1>${esc(titulo)}</h1>${frase ? `<p class="pagina-topo__frase">${frase}</p>` : ''}</div></section>
<section class="seccao seccao--primeira"><div class="contentor texto-largo"><div class="texto">${html}</div></div></section>`,
  };
}

export function paginasDeTexto(loja) {
  const e = loja.empresa;
  const ent = loja.entrega;
  const meios = loja.pagamentos.meios;
  const meiosTexto = `${meios.slice(0, -1).join(', ')} ou ${meios.at(-1)}`;
  const portes = ent.zonas.map((z) => `<li>${esc(z.nome)}: ${typeof z.portes === 'number' ? (z.portes === 0 ? 'sem portes' : euro(z.portes)) : 'confirmamos antes do pagamento'}</li>`).join('');
  const notaExemplo = ent.porConfirmar ? `<p class="nota-previa">${porConfirmar('os portes e a transportadora; os valores são um exemplo')}</p>` : '';
  const comoSeFaz = COMO_SE_FAZ_A_ENCOMENDA({ canal: 'site', pagamentos: meios, linguas: ['português'], urlTermos: url('/termos/'), prazoConfirmacao: 'no próprio dia', arquivo: '10 anos' });

  const contactos = {
    caminho: '/contactos/', titulo: DESTINOS.contactos.titulo, descricao: DESTINOS.contactos.descricao,
    ld: [ldMigalhas([['Início', '/'], ['Contactos', '/contactos/']])],
    corpo: `<section class="pagina-topo pagina-topo--duas"><div class="contentor pagina-topo__grelha">
  <div>
    <h1>Contactos</h1>
    <p class="pagina-topo__frase">Respondemos por WhatsApp e no Instagram. Para lembranças, diz-nos a ocasião, a data e quantas precisas.</p>
    <div class="cartoes-contacto">
      <a class="cartao-contacto" href="${whatsapp(loja.whatsapp, 'Olá! ')}" rel="noopener"><span class="cartao-contacto__icone">${icone('whatsapp')}</span><span><strong>WhatsApp</strong>Enviar uma mensagem</span>${icone('seta', 'icone icone--p')}</a>
      <a class="cartao-contacto" href="https://www.instagram.com/${loja.instagram}/" rel="noopener"><span class="cartao-contacto__icone">${icone('instagram')}</span><span><strong>Instagram</strong>@${esc(loja.instagram)}</span>${icone('seta', 'icone icone--p')}</a>
      <div class="cartao-contacto"><span class="cartao-contacto__icone">${icone('local')}</span><span><strong>Oliveira de Azeméis</strong>Entregas em mão e o Street Market, a cada quinze dias</span></div>
    </div>
  </div>
  <div class="pagina-topo__foto">${foto('outono-casa-do-bosque', { sizes: '(max-width:900px) 92vw, 520px', prioridade: true })}</div>
</div></section>
<section class="seccao seccao--primeira"><div class="contentor texto-largo"><div class="texto"><h2>Quem vende</h2>${identificacao(e)}</div></div></section>`,
  };

  return [
    contactos,
    texto('/envios-e-devolucoes/', 'Envios e devoluções', `Enviamos para todo o país em ${esc(ent.prazo)}.`, `
<h2>Portes</h2>
<ul>${portes}</ul>
${notaExemplo}
<p>Os portes aparecem antes de pagares. Na entrega em mão combinamos o dia e o sítio por mensagem.</p>
<h2>Prazos</h2>
<p>As peças em stock seguem em ${esc(ent.prazo)}. As lembranças e as peças por encomenda têm o prazo que combinarmos contigo antes de pagares.</p>
<h2>Devoluções</h2>
<p>${LIVRE_RESOLUCAO}</p>
<p>${SEM_LIVRE_RESOLUCAO_PERSONALIZADO}</p>
<h2>Se chegar partido ou diferente do que pediste</h2>
<p>Diz-nos logo, com uma fotografia, e resolvemos. ${textoGarantia({ feitoAMao: true })}</p>
<h2>Como pedir</h2>
<p>Por <a href="${whatsapp(loja.whatsapp)}" rel="noopener">WhatsApp</a>, por <a href="https://ig.me/m/${loja.instagram}" rel="noopener">mensagem no Instagram</a> ou por email para ${e.email ? `<a href="mailto:${esc(e.email)}">${esc(e.email)}</a>` : porConfirmar('email')}. Também podes usar este formulário:</p>
<pre>${esc(FORMULARIO_LIVRE_RESOLUCAO)}</pre>`, 'Portes, prazos de envio e devoluções na C’Candles: 14 dias para devolver as peças sem personalização.', { indexar: false }),

    texto('/termos/', 'Termos e condições', 'As condições das compras na loja online da C’Candles.', `
<h2>1. Quem vende</h2>
${identificacao(e)}
<h2>2. Como se faz a encomenda</h2>
${comoSeFaz}
<h2>3. Preços e pagamento</h2>
<p>Os preços incluem IVA. Os portes aparecem antes da encomenda. Paga-se por ${meiosTexto}, no fim da encomenda. Com Multibanco, a encomenda só avança depois de a referência ser paga e fica sem efeito se não for paga dentro do prazo indicado.</p>
<h2>4. Peças personalizadas e por encomenda</h2>
<p>As lembranças e as peças personalizadas fazem-se depois de combinados o texto, as cores e o prazo. O texto é usado exatamente como foi escrito no pedido.</p>
<h2>5. Prazos e entrega</h2>
<p>As peças em stock seguem para todo o país em ${esc(ent.prazo)}. A entrega em mão em Oliveira de Azeméis não tem portes e combina-se por mensagem.</p>
<h2>6. Direito de livre resolução</h2>
<p>${LIVRE_RESOLUCAO}</p>
<p>${SEM_LIVRE_RESOLUCAO_PERSONALIZADO}</p>
<h2>7. Garantia</h2>
<p>${textoGarantia({ feitoAMao: true })}</p>
<h2>8. Segurança das velas e dos wax melts</h2>
<p>Não deixes velas ou queimadores acesos sem vigilância, usa-os numa superfície estável e resistente ao calor, longe de crianças, animais e materiais inflamáveis.</p>
<h2>9. Litígios e reclamações</h2>
${ralHtml({ ambito: 'local', concelhos: [loja.localidade] })}
<p>Pode também usar o <a href="https://www.livroreclamacoes.pt/inicio" rel="noopener">Livro de Reclamações Eletrónico</a>.</p>`,
    'Termos e condições da loja online da C’Candles.', { indexar: false }),

    texto('/privacidade/', 'Política de privacidade', 'Que dados pedimos, para quê, e os teus direitos.', `
<h2>Quem trata os dados</h2>
${identificacao(e)}
<h2>Que dados e para quê</h2>
<ul>
  <li><strong>Encomendas:</strong> nome, email, telemóvel, NIF (se o deres), morada e o texto das peças personalizadas, para fazer, enviar e faturar a encomenda (execução do contrato e obrigações fiscais). Guardamos as encomendas 10 anos, como a lei fiscal obriga.</li>
  <li><strong>Mensagens e pedidos de orçamento:</strong> o que nos escreves por WhatsApp, Instagram ou email, para responder (12 meses).</li>
  <li><strong>Carrinho:</strong> fica guardado só no teu browser (armazenamento local), para não o perderes entre páginas. Não usamos cookies nem estatísticas.</li>
</ul>
<h2>A quem os damos</h2>
${destinatariosHtml({ alojamento: 'github', pagamentos: 'stripe', instagram: true }, { formato: 'lista' })}
<h2>Os teus direitos</h2>
${direitosHtml({ email: e.email || porConfirmar('email') })}`,
    'Política de privacidade da C’Candles.', { indexar: false }),
  ];
}
