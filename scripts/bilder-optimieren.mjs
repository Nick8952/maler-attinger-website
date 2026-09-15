// Erzeugt aus den Originalen in assets/originale/ die Web-Varianten in public/images/
// und schreibt das Bildverzeichnis data/bilder.json (Masse, Farbton, Varianten).
// Aufruf: npm run bilder   (idempotent – vorhandene Dateien werden überschrieben)
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const WURZEL = path.resolve(import.meta.dirname, "..");
const QUELLE = path.join(WURZEL, "assets/originale");
const ZIEL = path.join(WURZEL, "public/images");
const BREITEN = [480, 960, 1600];

// id → Originaldatei (relativ zu assets/originale). Die id ist die stabile Referenz
// aus den Inhaltsdateien (data/*.json) und später die Sanity-Asset-Kennung im Seed.
const BILDER = {
  "logo-attinger": { datei: "attinger.png", format: "png", breiten: [600, 1200] },
  "hero-lieferwagen": { datei: "Maler_Attinger.png" },
  "hero-lieferwagen-hoch": { datei: "kontakt_rechts.jpg" },
  "kopf-ueber-uns": { datei: "heder_about.jpg" },
  "kopf-angebot": { datei: "header_arbeiten.jpg" },
  "kopf-kontakt": { datei: "header_kontakt.png" },
  "leistung-malerarbeiten": { datei: "malen.png" },
  "leistung-tapezierarbeiten": { datei: "tapete.png" },
  "leistung-spachtelarbeiten": { datei: "spachteln.png" },
  "leistung-maurerarbeiten": { datei: "maurer.png" },
  "leistung-gipserarbeiten": { datei: "gips.png" },
  "leistung-umwelt": { datei: "umwelt.png" },
  "partner-umweltetikette": { datei: "oekologie.png", breiten: [240, 480] },
  "partner-zueri2": { datei: "zueri2.png", breiten: [240, 480] },
};
for (const n of [1, 2, 4, 6, 7, 8, 10, 13, 14, 17, 19, 20]) {
  BILDER[`umbau-rieterplatz-${String(n).padStart(2, "0")}`] = { datei: `umbau/${n}.JPG` };
}
for (const n of ["001", "002", "003", "004", "009", "010", "011", "012", "013", "014", "016", "018", "020", "021", "022", "023", "024", "025", "026"]) {
  BILDER[`referenz-${n}`] = { datei: `arbeiten/image${n}.jpg` };
}

function hex(rgb) {
  return "#" + [rgb.r, rgb.g, rgb.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

// «Wandfarbe» eines Fotos: häufigster Farbbereich im mittleren Bildausschnitt,
// gemittelt über die Pixel dieses Bereichs. Transparente Pixel (Logo) zählen nicht.
async function farbtonErmitteln(bild) {
  const { data, info } = await bild
    .clone()
    .resize(96, 96, { fit: "fill" })
    .extract({ left: 14, top: 14, width: 68, height: 68 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bins = new Map();
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] < 128) continue;
    const key = `${data[i] >> 5},${data[i + 1] >> 5},${data[i + 2] >> 5}`;
    const b = bins.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    b.n++; b.r += data[i]; b.g += data[i + 1]; b.b += data[i + 2];
    bins.set(key, b);
  }
  const top = [...bins.values()].sort((a, b) => b.n - a.n)[0];
  if (!top) return "#888888";
  return hex({ r: top.r / top.n, g: top.g / top.n, b: top.b / top.n });
}

await mkdir(ZIEL, { recursive: true });
const verzeichnis = {};
for (const [id, cfg] of Object.entries(BILDER)) {
  const eingabe = sharp(path.join(QUELLE, cfg.datei)).rotate();
  const meta = await eingabe.metadata();
  const farbton = await farbtonErmitteln(eingabe);
  const breiten = (cfg.breiten ?? BREITEN).filter((b) => b <= meta.width || b === Math.min(...(cfg.breiten ?? BREITEN)));
  const quellen = [];
  for (const b of breiten) {
    const dateiname = `${id}-${b}.${cfg.format === "png" ? "png" : "webp"}`;
    let pipe = eingabe.clone().resize({ width: Math.min(b, meta.width), withoutEnlargement: true });
    pipe = cfg.format === "png" ? pipe.png({ compressionLevel: 9, palette: false }) : pipe.webp({ quality: 78 });
    const info = await pipe.toFile(path.join(ZIEL, dateiname));
    quellen.push({ breite: info.width, url: `/images/${dateiname}` });
  }
  quellen.sort((a, b) => a.breite - b.breite);
  verzeichnis[id] = {
    id,
    original: `assets/originale/${cfg.datei}`,
    breite: meta.width,
    hoehe: meta.height,
    farbton,
    quellen,
  };
  console.log(id, `${meta.width}x${meta.height}`, verzeichnis[id].farbton, quellen.map((q) => q.breite).join("/"));
}
await mkdir(path.join(WURZEL, "data"), { recursive: true });
await writeFile(path.join(WURZEL, "data/bilder.json"), JSON.stringify(verzeichnis, null, 2) + "\n");
console.log(`\n${Object.keys(verzeichnis).length} Bilder → data/bilder.json`);
