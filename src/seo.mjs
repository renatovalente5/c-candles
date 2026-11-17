// O QUE O GOOGLE LÊ: os títulos e as descrições das páginas de destino e os dados estruturados (JSON-LD)
// da loja, do site, das migalhas e dos produtos. Os títulos vão sem « · C'Candles», que o layout junta.
// O testar.mjs confere que nenhum título passa de 65 caracteres e que as descrições ficam entre 50 e 160.
import { absoluto, fotoJpg } from './util.mjs';

export const TITULO_INICIO = 'Queimadores, wax melts e velas aromáticas feitas à mão';

export const DESTINOS = {
  loja: { titulo: 'Loja: queimadores, wax melts, velas e decoração', descricao: 'Queimadores, snapbar e wax melts em 16 aromas, velas em copo e peças decorativas, feitos à mão em Oliveira de Azeméis. Envio para todo o país.' },
  aromas: { titulo: 'Os aromas: notas de saída, coração e fundo', descricao: 'Os 16 aromas da C’Candles, de Sunday in Cashmere a Biscoitos da Avó: as notas de cada um, para escolheres o teu cheirinho.' },
  lembrancas: { titulo: 'Lembranças personalizadas para batizados e casamentos', descricao: 'Lembranças personalizadas para batizados, comunhões, casamentos, baby showers e padrinhos, feitas à mão em Oliveira de Azeméis. Pede o teu orçamento.' },
  sobre: { titulo: 'Sobre a C’Candles', descricao: 'A C’Candles nasceu em 2023, em Oliveira de Azeméis, do gosto da Cristiana Moreira por velas. Tudo feito à mão, peça a peça.' },
  contactos: { titulo: 'Contactos', descricao: 'Fala com a C’Candles por WhatsApp ou Instagram. Oliveira de Azeméis, envios para todo o país.' },
  ajuda: { titulo: 'Perguntas frequentes e como usar wax melts', descricao: 'Como usar wax melts e snapbar no queimador, quanto tempo dura o aroma, envios, pagamentos e lembranças personalizadas.' },
};

export const CATEGORIAS = {
  queimadores: { titulo: 'Queimadores de wax melts', descricao: 'Queimadores em forma de casinha, abóbora, nuvem, Pai Natal e rena, sozinhos ou com snapbar ou wax melts no aroma que escolheres.' },
  'wax-melts': { titulo: 'Wax melts e snapbar em 16 aromas', descricao: 'Snapbar de 35 g e wax melts de 100 g, em aromas de Outono e de Natal: Sunday in Cashmere, Coffee First, Rolo de Canela e mais.' },
  velas: { titulo: 'Velas aromáticas em copo e velas de figura', descricao: 'Velas aromáticas em copo de 180 g, com cerca de 30 horas de queima, e velas de figura para decorar a casa no Natal.' },
  decoracao: { titulo: 'Peças decorativas feitas à mão', descricao: 'Anjinhos, casinhas de luz, carrosséis, folhas e abóboras decorativas feitas à mão, para os cantinhos da casa em cada estação.' },
};

export const COLECOES = {
  'natal-2026': { titulo: 'A Essência do Natal, coleção de Natal 2026', descricao: 'A coleção de Natal 2026 da C’Candles: queimadores do Pai Natal, casinha de gengibre, rena e oito aromas de Natal, em quantidades limitadas.' },
  'outono-2026': { titulo: 'A Magia do Outono, coleção de Outono 2026', descricao: 'A coleção de Outono 2026 da C’Candles: queimadores abóbora, nuvem e casa do bosque, velas em copo e oito aromas de outono.' },
};

/** Uma descrição até `max` caracteres, cortada numa palavra (com reticências se cortou). */
export function resumir(texto, max = 155) {
  const t = String(texto ?? '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const corte = t.slice(0, max - 1);
  return corte.slice(0, corte.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '') + '…';
}

export function descricaoDoProduto(p) {
  const f = String(p.frase ?? '').trim();
  const fim = 'Feito à mão pela C’Candles, em Oliveira de Azeméis.';
  return resumir(f.length < 110 ? `${f}${f && !/[.!?…]$/.test(f) ? '.' : ''} ${fim}`.trim() : f);
}

// ── Dados estruturados (schema.org) ──
const id = (marca) => absoluto('/') + '#' + marca;
const LINK_DEVOLUCOES = () => absoluto('/envios-e-devolucoes/');
const devolucoes = () => ({
  '@type': 'MerchantReturnPolicy', applicableCountry: 'PT', returnPolicyCountry: 'PT',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow', merchantReturnDays: 14,
  returnMethod: 'https://schema.org/ReturnByMail', returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
  merchantReturnLink: LINK_DEVOLUCOES(),
});

export const ldSite = (loja) => ({
  '@context': 'https://schema.org', '@type': 'WebSite', '@id': id('site'), name: loja.nome, alternateName: 'C_CANDLES', url: absoluto('/'),
  inLanguage: 'pt-PT', publisher: { '@id': id('loja') },
});

export function ldLoja(loja) {
  const e = loja.empresa || {};
  const so = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
  const nif = so(e.nif)?.replace(/\s/g, '');
  return {
    '@context': 'https://schema.org', '@type': 'OnlineStore', '@id': id('loja'), name: loja.nome, url: absoluto('/'),
    logo: absoluto('/assets/marca/logo-completo-480.png'), description: loja.descricao,
    sameAs: [`https://www.instagram.com/${loja.instagram}/`],
    address: { '@type': 'PostalAddress', ...(so(e.morada) ? { streetAddress: so(e.morada) } : {}), addressLocality: loja.localidade, addressCountry: 'PT' },
    ...(so(e.nome) ? { legalName: so(e.nome) } : {}),
    ...(nif ? { vatID: 'PT' + nif } : {}),
    ...(so(e.email) ? { email: so(e.email) } : {}),
    hasMerchantReturnPolicy: devolucoes(),
  };
}

export const ldMigalhas = (itens) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: itens.map(([name, caminho], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absoluto(caminho) })),
});

export function ldProduto(loja, catalogo, p) {
  const pagina = absoluto(`/produtos/${p.slug}/`);
  const base = {
    '@context': 'https://schema.org', '@type': 'Product', '@id': pagina + '#produto', name: p.nome,
    description: descricaoDoProduto(p), sku: p.slug, category: catalogo.categorias.find((c) => c.id === p.categoria)?.nome,
    image: p.fotos.slice(0, 6).map(fotoJpg).filter(Boolean), brand: { '@type': 'Brand', name: loja.nome },
  };
  if (p.sobConsulta || typeof p.preco !== 'number') return base;
  return {
    ...base,
    offers: {
      '@type': 'Offer', url: pagina, price: p.preco.toFixed(2), priceCurrency: 'EUR',
      availability: p.esgotado ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': id('loja') }, hasMerchantReturnPolicy: devolucoes(),
    },
  };
}
