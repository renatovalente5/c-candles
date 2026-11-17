// As propostas da página inicial em propostas/_site/<letra>/index.html, com as imagens, o logótipo e as letras.
//   node propostas/gerar.mjs        → servir com: python3 -m http.server 8978 --directory propostas/_site
import { mkdirSync, rmSync, cpSync, writeFileSync, existsSync } from 'node:fs';
import { RAIZ } from '../src/util.mjs';

const SAIDA = RAIZ + 'propostas/_site/';
rmSync(SAIDA, { recursive: true, force: true });
mkdirSync(SAIDA + 'assets', { recursive: true });
cpSync(RAIZ + '.cache/imagens', SAIDA + 'assets/img', { recursive: true, filter: (f) => !f.endsWith('.resumo') && !f.endsWith('manifesto.json') });
cpSync(RAIZ + 'assets/marca', SAIDA + 'assets/marca', { recursive: true });
if (existsSync(RAIZ + 'propostas/fontes')) cpSync(RAIZ + 'propostas/fontes', SAIDA + 'assets/fontes', { recursive: true });

const indice = [];
for (const letra of ['a', 'b', 'c']) {
  if (!existsSync(RAIZ + `propostas/${letra}.mjs`)) continue;
  const { default: gerar, nome } = await import(`./${letra}.mjs`);
  mkdirSync(SAIDA + letra, { recursive: true });
  writeFileSync(SAIDA + letra + '/index.html', gerar());
  indice.push(`<li><a href="${letra}/">${letra.toUpperCase()} — ${nome}</a></li>`);
}
writeFileSync(SAIDA + 'index.html', `<!doctype html><meta charset="utf-8"><title>Propostas C'Candles</title><ul>${indice.join('')}</ul>`);
console.log('propostas:', indice.length);
