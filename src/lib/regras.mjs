/* AS REGRAS DOS DADOS DA C'CANDLES, NUM SÓ SÍTIO.
 *
 * Quem as lê: o gerador do site (src/build.mjs), o carrinho no browser (assets/js/site.js recebe uma cópia
 * em assets/js/regras.mjs) e, quando houver, o painel e o Worker dos pagamentos. Por isso é um ES module
 * puro: nenhum import, nada de node:*, fs, process ou require.
 *
 * O preço de uma linha do carrinho NUNCA vem do browser: refaz-se aqui a partir do produto e da escolha
 * (o índice de cada opção, o aroma, o texto). A forma veio das lojas da Franja Kids e da LF Mobile.
 *
 * Um produto (content/produtos/<slug>.json):
 *   nome, categoria, colecoes[], preco (euros) | sobConsulta: true, frase, fotos[], destaque, ordem, publicado,
 *   limitada?, peso?, detalhes[]?,
 *   opcoes?: [{ id, nome, valores: [{ nome, suplemento (euros), aroma?: true }] }]   (uma escolha de cada)
 *   aromas?: [id…]      o aroma escolhe-se (sempre, ou só quando o valor escolhido tem aroma: true)
 *   aroma?: id          o aroma é fixo (as velas)
 *   personalizacao?: { rotulo, ajuda, obrigatoria, max }
 */

export const FICHEIROS = Object.freeze({ loja: 'content/loja.json', catalogo: 'content/catalogo.json', fotos: 'content/fotos.json' });
export const PASTAS = Object.freeze({ produtos: 'content/produtos', fotos: 'media/fotos' });
export const LIMITES = Object.freeze({ quantidade: [1, 50], texto: 120 });

export const centimos = (v) => Math.round(Number(v) * 100);
const eObjecto = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export const noSite = (p) => eObjecto(p) && p.publicado !== false;
export const compravel = (p) => noSite(p) && !p.sobConsulta && typeof p.preco === 'number' && Number.isFinite(p.preco) && p.preco > 0;

/** As opções de um produto, já limpas (suplementos em cêntimos). */
export function opcoesDe(p) {
  return (Array.isArray(p?.opcoes) ? p.opcoes : []).filter((o) => eObjecto(o) && Array.isArray(o.valores) && o.valores.length)
    .map((o) => ({ id: String(o.id), nome: String(o.nome), valores: o.valores.map((v) => ({ nome: String(v.nome), suplemento: centimos(v.suplemento || 0), aroma: v.aroma === true })) }));
}

/** O aroma escolhe-se? 'sempre' | 'se-wax' (só quando o valor escolhido o pede) | null */
export function modoDoAroma(p) {
  if (!Array.isArray(p?.aromas) || !p.aromas.length) return null;
  return opcoesDe(p).some((o) => o.valores.some((v) => v.aroma)) ? 'se-wax' : 'sempre';
}

/** O preço mais baixo (o «desde») e se há variação, em cêntimos. */
export function precoBase(p) {
  if (!compravel(p)) return null;
  const base = centimos(p.preco);
  const variaveis = opcoesDe(p).some((o) => o.valores.some((v) => v.suplemento > 0));
  return { base, desde: variaveis };
}

/**
 * Confere uma escolha e devolve o preço unitário.
 * escolha = { opcoes: { <id>: <índice> }, aroma: <id>, texto: <string> }
 * → { ok: true, unitario (cêntimos), resumo: [linhas legíveis] } | { ok: false, erro, campo }
 */
export function conferirEscolha(p, escolha = {}, aromasDoCatalogo = []) {
  if (!compravel(p)) return { ok: false, erro: 'Este produto não se compra no site.', campo: null };
  const e = eObjecto(escolha) ? escolha : {};
  let unitario = centimos(p.preco);
  const resumo = [];
  let pedeAroma = modoDoAroma(p) === 'sempre';
  for (const o of opcoesDe(p)) {
    const i = Number(e.opcoes?.[o.id] ?? 0);
    if (!Number.isInteger(i) || i < 0 || i >= o.valores.length) return { ok: false, erro: `Escolhe uma opção em «${o.nome}».`, campo: o.id };
    const v = o.valores[i];
    unitario += v.suplemento;
    if (o.valores.length > 1) resumo.push(`${o.nome}: ${v.nome}`);
    if (v.aroma) pedeAroma = true;
  }
  if (pedeAroma) {
    const a = String(e.aroma || '');
    if (!a) return { ok: false, erro: 'Escolhe o aroma.', campo: 'aroma' };
    if (!p.aromas.includes(a)) return { ok: false, erro: 'Esse aroma não existe para este produto.', campo: 'aroma' };
    const nome = aromasDoCatalogo.find((x) => x.id === a)?.nome || a;
    resumo.push(`Aroma: ${nome}`);
  }
  const pers = p.personalizacao;
  if (eObjecto(pers)) {
    const t = String(e.texto ?? '').replace(/\s+/g, ' ').trim();
    if (pers.obrigatoria && !t) return { ok: false, erro: `Escreve ${String(pers.rotulo).toLowerCase()}.`, campo: 'texto' };
    if (t.length > Math.min(pers.max || LIMITES.texto, LIMITES.texto)) return { ok: false, erro: 'O texto é comprido demais.', campo: 'texto' };
    if (t) resumo.push(`${pers.rotulo}: ${t}`);
  }
  return { ok: true, unitario, resumo };
}

/** Os portes de uma zona (cêntimos), com os portes grátis a partir de um valor. null = por confirmar. */
export function portesDe(loja, zonaId, subtotal) {
  const z = (loja?.entrega?.zonas || []).find((x) => x.id === zonaId);
  if (!z || typeof z.portes !== 'number') return null;
  const gratis = loja.entrega.gratisAPartirDe;
  if (typeof gratis === 'number' && subtotal >= centimos(gratis) && zonaId !== 'mao') return 0;
  return centimos(z.portes);
}

/** Uma linha do carrinho recalculada: { ok, unitario, total, resumo } */
export function linhaDoCarrinho(p, linha, aromas) {
  const q = Number(linha?.qtd);
  if (!Number.isInteger(q) || q < LIMITES.quantidade[0] || q > LIMITES.quantidade[1]) return { ok: false, erro: 'Quantidade inválida.' };
  const r = conferirEscolha(p, linha, aromas);
  return r.ok ? { ...r, qtd: q, total: r.unitario * q } : r;
}

/* ── Problemas do conteúdo (o gerador pára com os que bloqueiam e esconde os produtos que não se podem mostrar) ── */
export function problemas({ loja, catalogo, produtos, fotos }) {
  const lista = [];
  const add = (classe, chave, mensagem) => lista.push({ classe, chave, mensagem });
  if (!eObjecto(loja) || !loja.nome) add('bloqueia', 'loja', 'Falta o nome da loja.');
  if (!eObjecto(catalogo) || !Array.isArray(catalogo.categorias)) add('bloqueia', 'catalogo', 'O catálogo não tem categorias.');
  const cats = new Set((catalogo?.categorias || []).map((c) => c.id));
  const cols = new Set((catalogo?.colecoes || []).map((c) => c.id));
  const aromas = new Set((catalogo?.aromas || []).map((a) => a.id));
  for (const [slug, p] of Object.entries(produtos || {})) {
    if (!eObjecto(p)) { add('bloqueia', `produto:${slug}`, `O produto «${slug}» não se lê.`); continue; }
    if (!p.nome) add('neutraliza', `produto:${slug}:nome`, `O produto «${slug}» não tem nome.`);
    if (!cats.has(p.categoria)) add('neutraliza', `produto:${slug}:categoria`, `«${p.nome}» está numa categoria que não existe (${p.categoria}).`);
    for (const c of p.colecoes || []) if (!cols.has(c)) add('avisa', `produto:${slug}:colecao`, `«${p.nome}» está numa coleção que não existe (${c}).`);
    if (!p.sobConsulta && !compravel(p)) add('neutraliza', `produto:${slug}:preco`, `«${p.nome}» não tem preço nem está «sob consulta».`);
    if (!Array.isArray(p.fotos) || !p.fotos.length) add('neutraliza', `produto:${slug}:fotos`, `«${p.nome}» não tem fotografias.`);
    for (const f of p.fotos || []) if (!fotos?.[f]) add('neutraliza', `produto:${slug}:foto`, `«${p.nome}» usa a fotografia «${f}», que não existe.`);
    for (const a of [...(p.aromas || []), ...(p.aroma ? [p.aroma] : [])]) if (!aromas.has(a)) add('neutraliza', `produto:${slug}:aroma`, `«${p.nome}» usa o aroma «${a}», que não existe.`);
  }
  return lista;
}
