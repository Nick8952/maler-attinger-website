/**
 * Prüft die lokalen Inhaltsdateien (data/) auf Vollständigkeit – läuft ohne Sanity.
 *   npm run inhalt:pruefen
 * Meldet fehlende Bilder, fehlende Alt-Texte, doppelte Slugs/_keys, unbekannte Bausteine
 * und interne Links auf nicht vorhandene Seiten.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const DATA = path.resolve(process.cwd(), "data");
const json = async <T,>(p: string): Promise<T> => JSON.parse(await readFile(path.join(DATA, p), "utf8")) as T;
const fehler: string[] = [];
const bilder = await json<Record<string, unknown>>("bilder.json");
const BAUSTEINE = new Set(["textBaustein", "leistungenBaustein", "galerieBaustein", "spaltenBaustein", "kontaktBaustein", "linklisteBaustein", "bildBaustein", "aufrufBaustein", "rechtstextBaustein"]);

function bildPruefen(ref: { bild?: string; alt?: string } | undefined, ort: string) {
  if (!ref) return;
  if (!ref.bild || !bilder[ref.bild]) fehler.push(`${ort}: Bild «${ref.bild}» fehlt in bilder.json`);
  if (typeof ref.alt !== "string") fehler.push(`${ort}: Alt-Text fehlt`);
}

const seiten = (await readdir(path.join(DATA, "seiten"))).filter((f) => f.endsWith(".json"));
const slugs = new Set<string>();
const interneLinks: [string, string][] = [];
const linkSammeln = (ziel: unknown, ort: string) => {
  if (typeof ziel === "string" && ziel.startsWith("/")) interneLinks.push([ziel.replace(/\/$/, "") || "/", ort]);
};
function richTextLinks(inhalt: unknown, ort: string) {
  for (const block of (inhalt as { markDefs?: { href?: string }[] }[]) ?? []) for (const m of block.markDefs ?? []) linkSammeln(m.href, ort);
}

for (const f of seiten) {
  const s = await json<Record<string, unknown>>(`seiten/${f}`);
  const slug = s.slug as string;
  if (slugs.has(slug)) fehler.push(`Doppelter Slug: ${slug}`);
  slugs.add(slug);
  if (`${slug}.json` !== f) fehler.push(`${f}: Dateiname passt nicht zum Slug «${slug}»`);
  const hero = s.hero as Record<string, unknown> | undefined;
  if (hero) {
    bildPruefen(hero.bild as never, `${slug} hero`);
    bildPruefen(hero.bildHoch as never, `${slug} hero`);
    for (const k of ["knopf", "zweiterKnopf"]) linkSammeln((hero[k] as { ziel?: string } | undefined)?.ziel, `${slug} hero`);
  }
  bildPruefen(s.kopfbild as never, `${slug} kopfbild`);
  const keys = new Set<string>();
  for (const b of (s.bausteine as Record<string, unknown>[]) ?? []) {
    const ort = `${slug} › ${b._key}`;
    if (!BAUSTEINE.has(b._type as string)) fehler.push(`${ort}: unbekannter Baustein «${b._type}»`);
    if (keys.has(b._key as string)) fehler.push(`${ort}: doppelter _key`);
    keys.add(b._key as string);
    if ("bild" in b) bildPruefen(b.bild as never, ort);
    if ("inhalt" in b) richTextLinks(b.inhalt, ort);
    if (b._type === "spaltenBaustein") for (const sp of b.spalten as { inhalt: unknown }[]) richTextLinks(sp.inhalt, ort);
    for (const k of ["knopf", "zweiterKnopf", "weiterLink"]) linkSammeln((b[k] as { ziel?: string } | undefined)?.ziel, ort);
    if (b._type === "rechtstextBaustein") {
      try { await readFile(path.join(DATA, `rechtstexte/${b.rechtstext}.json`)); } catch { fehler.push(`${ort}: Rechtstext «${b.rechtstext}» fehlt`); }
    }
  }
}
for (const l of await json<{ id: string; bild: never }[]>("leistungen.json")) bildPruefen(l.bild, `Leistung ${l.id}`);
for (const r of await json<{ id: string; bild: never }[]>("referenzen.json")) bildPruefen(r.bild, `Referenz ${r.id}`);
const e = await json<Record<string, unknown>>("einstellungen.json");
bildPruefen(e.logo as never, "Einstellungen logo");
for (const l of [...(e.navigation as { ziel: string }[]), ...(e.rechtslinks as { ziel: string }[])]) linkSammeln(l.ziel, "Einstellungen");
for (const t of await readdir(path.join(DATA, "rechtstexte"))) richTextLinks((await json<{ inhalt: unknown }>(`rechtstexte/${t}`)).inhalt, `Rechtstext ${t}`);

for (const [ziel, ort] of interneLinks) {
  const slug = ziel === "/" ? "start" : ziel.slice(1).split("#")[0];
  if (!slugs.has(slug)) fehler.push(`${ort}: interner Link «${ziel}» zeigt auf keine Seite`);
}

if (fehler.length) {
  console.error(`✗ ${fehler.length} Problem(e):\n` + fehler.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log(`✓ Inhalte in Ordnung: ${seiten.length} Seiten, ${Object.keys(bilder).length} Bilder, ${interneLinks.length} interne Links geprüft.`);
