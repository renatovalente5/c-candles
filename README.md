# C'Candles — loja online

Site da **C'Candles** (@c_candles.pt): queimadores, wax melts e snapbar em 16 aromas, velas em copo, peças
decorativas e lembranças personalizadas, feitos à mão em Oliveira de Azeméis.

- Pré-visualização: https://renatovalente5.github.io/c-candles/ (noindex; o pagamento ainda não está ligado)
- Conteúdo: `content/` (loja, catálogo com categorias, coleções, aromas e ocasiões; um JSON por produto) e
  `media/fotos/` (as fotografias originais, do Instagram da marca)
- Regras dos preços e das escolhas: `src/lib/regras.mjs` (o carrinho no browser usa a mesma cópia)

```sh
python3 scripts/imagens.py     # versões web das fotografias (AVIF/WebP/JPEG, com cache)
node scripts/testar.mjs        # testes do conteúdo e dos preços
node src/build.mjs             # gera _site/ (com --base=/c-candles para o GitHub Pages)
```
