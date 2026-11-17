// Capturas das propostas: telemóvel (390×844, página inteira) e computador (1440×900, primeiro ecrã e
// página inteira), no Chromium. node propostas/capturar.mjs <url-base> <pasta-saida> a b c
import { mkdirSync } from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT || '/Users/renatovalente/Websites/carimbo/node_modules/playwright/index.mjs');
const [base, saida, ...props] = process.argv.slice(2);
mkdirSync(saida, { recursive: true });
const browser = await chromium.launch();
for (const p of props) {
  for (const [nome, vp, mobile] of [['telemovel', { width: 390, height: 844 }, true], ['computador', { width: 1440, height: 900 }, false]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
    const pg = await ctx.newPage();
    const erros = [];
    pg.on('pageerror', (e) => erros.push(String(e)));
    pg.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
    await pg.goto(`${base}/${p}/`, { waitUntil: 'networkidle' });
    await pg.evaluate(() => document.fonts.ready);
    // as imagens «lazy» só carregam perto do ecrã: descer até ao fim e voltar
    await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
    await pg.waitForLoadState('networkidle');
    await pg.waitForTimeout(400);
    const larg = await pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    await pg.screenshot({ path: `${saida}/${p}-${nome}-ecra.jpg`, quality: 82, type: 'jpeg' });
    await pg.screenshot({ path: `${saida}/${p}-${nome}-inteira.jpg`, quality: 78, type: 'jpeg', fullPage: true });
    console.log(p, nome, 'transborda:', larg.sw > larg.cw ? `SIM (${larg.sw} > ${larg.cw})` : 'não', erros.length ? 'ERROS: ' + erros.join(' | ') : '');
    await ctx.close();
  }
}
await browser.close();
