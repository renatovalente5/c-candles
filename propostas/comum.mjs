// O material comum das propostas da página inicial: o conteúdo verdadeiro (content/), as fotografias em
// versões web (.cache/imagens) e o logótipo recortado. Cada proposta (a.mjs, b.mjs, c.mjs) só desenha.
import { readFileSync, readdirSync } from 'node:fs';
import { RAIZ, carregarFotos, foto, euro, esc, icone, logoPalavra, logoSimbolo, logoCompleto } from '../src/util.mjs';

export const ler = (f) => JSON.parse(readFileSync(RAIZ + f, 'utf8'));
export const loja = ler('content/loja.json');
export const catalogo = ler('content/catalogo.json');
export const fotos = ler('content/fotos.json');
carregarFotos(fotos);
export const produtos = Object.fromEntries(readdirSync(RAIZ + 'content/produtos').filter((f) => f.endsWith('.json'))
  .map((f) => [f.slice(0, -5), { slug: f.slice(0, -5), ...ler('content/produtos/' + f) }]));
export const lista = Object.values(produtos).filter((p) => p.publicado !== false).sort((a, b) => (a.ordem ?? 500) - (b.ordem ?? 500));
export const daColecao = (id) => lista.filter((p) => (p.colecoes || []).includes(id));
export const daCategoria = (id) => lista.filter((p) => p.categoria === id);
export const aroma = (id) => catalogo.aromas.find((a) => a.id === id);
export const colecao = (id) => catalogo.colecoes.find((c) => c.id === id);
export const preco = (p) => (p.sobConsulta ? 'Sob consulta' : (p.opcoes?.some((o) => o.valores.some((v) => v.suplemento > 0)) ? 'desde ' : '') + euro(p.preco));

export { foto, euro, esc, icone, logoPalavra, logoSimbolo, logoCompleto };

/** A página: <head> com as letras e o CSS da proposta. */
export function pagina({ titulo, css, corpo, fontes = '' }) {
  return `<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title><meta name="robots" content="noindex">
<link rel="icon" href="/assets/marca/icone-32.png">${fontes}
<style>${css}</style></head><body>${corpo}</body></html>`;
}
