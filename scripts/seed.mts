/**
 * Importskript: lokale Demo-Inhalte (data/) und freigegebene Originalbilder (assets/originale/) → Sanity.
 *
 * NUR NACH DER SANITY-EINRICHTUNG AUSFÜHREN (docs/SANITY-VERCEL-EINRICHTUNG.md).
 * Braucht in .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.
 *
 *   npm run seed            legt fehlende Dokumente an, überschreibt NICHTS Vorhandenes
 *   npm run seed -- --force ersetzt die vom Skript verwalteten Dokumente (nur die mit bekannten IDs)
 *   npm run seed -- --probe zeigt nur, was passieren würde (kein Schreibzugriff)
 *
 * Dokument-IDs sind deterministisch (einstellungen, seite-<slug>, leistung-<id>, referenz-<id>,
 * rechtstext-<art>), damit das Skript wiederholbar ist. Bilder werden anhand ihres Dateinamens
 * wiedererkannt (Sanity dedupliziert identische Dateien per Hash).
 */
import { createClient, type SanityClient } from "@sanity/client";
import nextEnv from "@next/env";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

nextEnv.loadEnvConfig(process.cwd());

const force = process.argv.includes("--force");
const probe = process.argv.includes("--probe");
const WURZEL = process.cwd();
const json = async <T,>(p: string): Promise<T> => JSON.parse(await readFile(path.join(WURZEL, "data", p), "utf8")) as T;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if ((!projectId && !probe) || (!probe && !token)) {
  console.error("Fehlend: NEXT_PUBLIC_SANITY_PROJECT_ID und/oder SANITY_API_WRITE_TOKEN in .env.local (siehe .env.example).");
  process.exit(1);
}
const client: SanityClient = createClient({ projectId: projectId ?? "probe", dataset, token, apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-15", useCdn: false });

type BildRef = { bild: string; alt: string; bildunterschrift?: string; farbton?: string };
type BildEintrag = { id: string; original: string; farbton: string };

const bilder = await json<Record<string, BildEintrag>>("bilder.json");
const assetIds = new Map<string, string>();

async function bildHochladen(id: string): Promise<string> {
  if (assetIds.has(id)) return assetIds.get(id)!;
  const eintrag = bilder[id];
  if (!eintrag) throw new Error(`Bild «${id}» fehlt in data/bilder.json`);
  const datei = path.join(WURZEL, eintrag.original);
  const dateiname = path.basename(datei);
  if (probe) {
    await readFile(datei); // Datei muss existieren
    console.log(`  [probe] würde hochladen: ${eintrag.original}`);
    assetIds.set(id, `probe-${id}`);
    return `probe-${id}`;
  }
  // Schon vorhanden? (gleicher Dateiname aus einem früheren Lauf)
  const vorhanden = await client.fetch<string | null>(`*[_type == "sanity.imageAsset" && originalFilename == $name][0]._id`, { name: dateiname });
  if (vorhanden) {
    assetIds.set(id, vorhanden);
    return vorhanden;
  }
  const asset = await client.assets.upload("image", await readFile(datei), { filename: dateiname, label: id });
  console.log(`  hochgeladen: ${eintrag.original} → ${asset._id}`);
  assetIds.set(id, asset._id);
  return asset._id;
}

async function bild(ref: BildRef | undefined) {
  if (!ref) return undefined;
  return {
    _type: "image",
    asset: { _type: "reference", _ref: await bildHochladen(ref.bild) },
    alt: ref.alt,
    ...(ref.bildunterschrift ? { bildunterschrift: ref.bildunterschrift } : {}),
    farbton: ref.farbton ?? bilder[ref.bild]?.farbton,
  };
}

const ref = (_ref: string, key?: string) => ({ _type: "reference", _ref, ...(key ? { _key: key } : {}) });

async function bausteinUmwandeln(b: Record<string, unknown>) {
  const kopie: Record<string, unknown> = { ...b };
  if (b._type === "leistungenBaustein") kopie.leistungen = ((b.leistungen as string[] | undefined) ?? []).map((id) => ref(id, id));
  if (b._type === "kontaktBaustein" || b._type === "bildBaustein") kopie.bild = await bild(b.bild as BildRef | undefined);
  if (b._type === "rechtstextBaustein") kopie.rechtstext = ref(`rechtstext-${b.rechtstext as string}`);
  return kopie;
}

const dokumente: Record<string, unknown>[] = [];

// Einstellungen
const e = await json<Record<string, unknown>>("einstellungen.json");
dokumente.push({
  ...e,
  _id: "einstellungen",
  _type: "einstellungen",
  logo: await bild(e.logo as BildRef),
  navigation: (e.navigation as Record<string, unknown>[]).map((l, i) => ({ _type: "link", _key: `nav-${i}`, ...l })),
  rechtslinks: (e.rechtslinks as Record<string, unknown>[]).map((l, i) => ({ _type: "link", _key: `recht-${i}`, ...l })),
  partner: await Promise.all((e.partner as Record<string, unknown>[]).map(async (p, i) => ({ _type: "partner", _key: `partner-${i}`, ...p, logo: await bild(p.logo as BildRef | undefined) }))),
  seo: { ...(e.seo as object), bild: await bild((e.seo as { bild?: BildRef }).bild) },
});

// Leistungen
for (const l of await json<Record<string, unknown>[]>("leistungen.json")) {
  dokumente.push({ ...l, _id: l.id as string, _type: "leistung", id: undefined, bild: await bild(l.bild as BildRef) });
}
// Referenzen
for (const r of await json<Record<string, unknown>[]>("referenzen.json")) {
  dokumente.push({ ...r, _id: r.id as string, _type: "referenz", id: undefined, bild: await bild(r.bild as BildRef) });
}
// Rechtstexte
for (const datei of await readdir(path.join(WURZEL, "data/rechtstexte"))) {
  const t = await json<Record<string, unknown>>(`rechtstexte/${datei}`);
  dokumente.push({ ...t, _id: t.id as string, _type: "rechtstext", id: undefined });
}
// Seiten
for (const datei of await readdir(path.join(WURZEL, "data/seiten"))) {
  const s = await json<Record<string, unknown>>(`seiten/${datei}`);
  const hero = s.hero as Record<string, unknown> | undefined;
  dokumente.push({
    ...s,
    _id: s.id as string,
    _type: "seite",
    id: undefined,
    slug: { _type: "slug", current: s.slug },
    hero: hero
      ? {
          ...hero,
          bild: await bild(hero.bild as BildRef | undefined),
          bildHoch: await bild(hero.bildHoch as BildRef | undefined),
          knopf: hero.knopf ? { _type: "link", ...(hero.knopf as object) } : undefined,
          zweiterKnopf: hero.zweiterKnopf ? { _type: "link", ...(hero.zweiterKnopf as object) } : undefined,
        }
      : undefined,
    kopfbild: await bild(s.kopfbild as BildRef | undefined),
    bausteine: await Promise.all((s.bausteine as Record<string, unknown>[]).map(bausteinUmwandeln)),
  });
}

// Schreiben
console.log(`${dokumente.length} Dokumente, ${assetIds.size} Bilder. Modus: ${probe ? "PROBE (kein Schreiben)" : force ? "FORCE (ersetzen)" : "nur fehlende anlegen"}`);
if (probe) {
  for (const d of dokumente) console.log(`  ${d._type}: ${d._id}`);
  process.exit(0);
}
const tx = client.transaction();
for (const d of dokumente) {
  const sauber = JSON.parse(JSON.stringify(d)); // undefined-Felder entfernen
  if (force) tx.createOrReplace(sauber);
  else tx.createIfNotExists(sauber);
}
const ergebnis = await tx.commit();
console.log(`Fertig: ${ergebnis.results.length} Operationen (${ergebnis.results.filter((r) => r.operation === "create").length} neu angelegt).`);
console.log("Nächster Schritt: im Studio prüfen (/studio) und veröffentlichen – der Seed schreibt direkt veröffentlichte Dokumente.");
