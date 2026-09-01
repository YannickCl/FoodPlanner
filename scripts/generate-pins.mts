/**
 * Génère les visuels Pinterest (public/pins/<slug>.png, 2000×3000) et l'image
 * Open Graph par défaut (public/og-default.png, 1200×630) à partir du manifeste.
 *
 * Usage :  npx tsx scripts/generate-pins.mts
 * Rendu via Google Chrome en mode headless (macOS par défaut ; override CHROME_BIN).
 * Après génération : commiter les PNG (ils sont servis sur chillmeals.fr).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PIN_MANIFEST } from "../src/lib/pinterest/manifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const OUT = join(ROOT, "public", "pins");
const CHROME =
  process.env.CHROME_BIN ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

mkdirSync(OUT, { recursive: true });

const logoUri =
  "data:image/png;base64," +
  readFileSync(join(ROOT, "public", "logo-mark.png")).toString("base64");

// Palette (miroir de globals.css).
const INK = "#433c48";
const INK_SOFT = "#756d79";
const GOLD = "#c1913f";
const LINE = "#ece3db";
const WHITE = "#ffffff";

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

function shoot(htmlPath: string, outPath: string, w: number, h: number) {
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--hide-scrollbars",
      "--force-device-scale-factor=2",
      "--default-background-color=00000000",
      `--screenshot=${outPath}`,
      `--window-size=${w},${h}`,
      "--virtual-time-budget=8000",
      "file://" + htmlPath,
    ],
    { stdio: "ignore" },
  );
}

function pinHtml(p: (typeof PIN_MANIFEST)[number]): string {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${p.soft};font-family:'Inter',system-ui,sans-serif;display:flex;align-items:center;justify-content:center}
.card{position:relative;width:880px;height:1380px;background:${WHITE};border-radius:44px;box-shadow:0 30px 80px rgba(67,60,72,.14);padding:72px 68px 64px;display:flex;flex-direction:column;overflow:hidden}
.card::before{content:"";position:absolute;top:0;left:0;right:0;height:14px;background:${p.accent}}
.brand{display:flex;align-items:center;gap:16px}
.brand img{width:56px;height:56px}
.brand .name{font-family:'Fraunces',Georgia,serif;font-weight:700;font-size:34px;color:${INK};letter-spacing:-.5px}
.kicker{display:inline-block;align-self:flex-start;margin-top:70px;background:${p.soft};color:${p.accent};font-weight:700;font-size:23px;letter-spacing:2px;padding:12px 22px;border-radius:999px}
.emoji{font-size:118px;line-height:1;margin-top:34px}
.title{font-family:'Fraunces',Georgia,serif;font-weight:900;color:${INK};font-size:92px;line-height:1.02;letter-spacing:-1.5px;margin-top:24px}
.sub{font-size:37px;line-height:1.35;color:${INK_SOFT};font-weight:500;margin-top:30px}
.spacer{flex:1}
.rule{height:2px;background:${LINE};margin-bottom:34px}
.foot{display:flex;align-items:center;justify-content:space-between}
.url{font-family:'Fraunces',Georgia,serif;font-weight:700;font-size:34px;color:${GOLD}}
.cta{background:${p.accent};color:${WHITE};font-weight:700;font-size:29px;padding:20px 34px;border-radius:999px;white-space:nowrap}
</style></head><body><div class="card">
<div class="brand"><img src="${logoUri}" alt=""><span class="name">Chill Meals</span></div>
<span class="kicker">${p.kicker}</span>
<div class="emoji">${p.emoji}</div>
<div class="title">${p.titleHtml}</div>
<div class="sub">${p.subHtml}</div>
<div class="spacer"></div>
<div class="rule"></div>
<div class="foot"><span class="url">chillmeals.fr</span><span class="cta">${p.cta}&nbsp;→</span></div>
</div></body></html>`;
}

function ogHtml(): string {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:#faf6f3;font-family:'Inter',system-ui,sans-serif;display:flex;align-items:center;justify-content:center}
.wrap{width:1120px;height:550px;background:${WHITE};border-radius:36px;box-shadow:0 24px 60px rgba(67,60,72,.12);padding:64px 72px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
.wrap::before{content:"";position:absolute;top:0;left:0;bottom:0;width:14px;background:${GOLD}}
.brand{display:flex;align-items:center;gap:20px;margin-bottom:28px}
.brand img{width:76px;height:76px}
.brand .name{font-family:'Fraunces',Georgia,serif;font-weight:700;font-size:52px;color:${INK}}
.h{font-family:'Fraunces',Georgia,serif;font-weight:900;font-size:66px;line-height:1.05;color:${INK};letter-spacing:-1.5px}
.p{font-size:32px;color:${INK_SOFT};margin-top:22px;font-weight:500}
.u{margin-top:28px;font-family:'Fraunces',Georgia,serif;font-weight:700;font-size:30px;color:${GOLD}}
</style></head><body><div class="wrap">
<div class="brand"><img src="${logoUri}" alt=""><span class="name">Chill Meals</span></div>
<div class="h">La fin du «&nbsp;on mange quoi ce soir&nbsp;?&nbsp;»</div>
<div class="p">Menus de la semaine, liste de courses automatique &amp; batch cooking.</div>
<div class="u">chillmeals.fr</div>
</div></body></html>`;
}

// --- Épingles ---
for (const p of PIN_MANIFEST) {
  const htmlPath = join(OUT, `${p.slug}.html`);
  const pngPath = join(OUT, `${p.slug}.png`);
  writeFileSync(htmlPath, pinHtml(p));
  shoot(htmlPath, pngPath, 1000, 1500);
  console.log("pin  ✓", p.slug);
}

// --- Image Open Graph par défaut ---
const ogHtmlPath = join(OUT, "_og.html");
writeFileSync(ogHtmlPath, ogHtml());
shoot(ogHtmlPath, join(ROOT, "public", "og-default.png"), 1200, 630);
console.log("og   ✓ og-default.png");
console.log("Terminé. Pense à supprimer les .html temporaires si besoin, puis commit les PNG.");
