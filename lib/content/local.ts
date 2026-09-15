import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type {
  Baustein,
  Bild,
  Einstellungen,
  Inhaltsquelle,
  Leistung,
  Rechtstext,
  Referenz,
  ReferenzKategorie,
  Seite,
} from "./types";

/**
 * Lokale Inhaltsquelle: liest die JSON-Dateien in data/.
 *
 * Die Dateien sind bewusst wie Sanity-Dokumente aufgebaut (gleiche Feldnamen, Bausteine mit
 * _type/_key, Rich Text als Portable Text). Bilder werden per Kennung referenziert
 * (`{ "bild": "hero-lieferwagen", "alt": "…" }`) und über data/bilder.json aufgelöst,
 * das `npm run bilder` erzeugt.
 */

const DATA = path.resolve(process.cwd(), "data");

interface BildEintrag {
  id: string;
  breite: number;
  hoehe: number;
  farbton: string;
  quellen: { breite: number; url: string }[];
}
interface BildReferenz {
  bild: string;
  alt: string;
  bildunterschrift?: string;
  farbton?: string;
}

async function json<T>(datei: string): Promise<T> {
  const text = await readFile(path.join(DATA, datei), "utf8");
  return JSON.parse(text) as T;
}

let bilderCache: Record<string, BildEintrag> | undefined;
async function bilder(): Promise<Record<string, BildEintrag>> {
  bilderCache ??= await json<Record<string, BildEintrag>>("bilder.json");
  return bilderCache;
}

async function bild(ref: BildReferenz | undefined, kontext: string): Promise<Bild | undefined> {
  if (!ref) return undefined;
  const eintrag = (await bilder())[ref.bild];
  if (!eintrag) throw new Error(`Bild «${ref.bild}» (${kontext}) fehlt in data/bilder.json – \`npm run bilder\` ausführen?`);
  if (!ref.alt && ref.alt !== "") throw new Error(`Bild «${ref.bild}» (${kontext}) hat keinen Alt-Text.`);
  return {
    id: eintrag.id,
    alt: ref.alt,
    breite: eintrag.breite,
    hoehe: eintrag.hoehe,
    farbton: ref.farbton ?? eintrag.farbton,
    bildunterschrift: ref.bildunterschrift,
    quellen: eintrag.quellen,
  };
}
async function bildPflicht(ref: BildReferenz, kontext: string): Promise<Bild> {
  const b = await bild(ref, kontext);
  if (!b) throw new Error(`Pflichtbild fehlt: ${kontext}`);
  return b;
}

/* ---------- Rohformen der JSON-Dateien ---------- */
type Roh<T, Ersetzen extends string, Mit> = Omit<T, Ersetzen> & Record<Ersetzen, Mit>;

type RohLeistung = Roh<Leistung, "bild", BildReferenz>;
type RohReferenz = Roh<Referenz, "bild", BildReferenz>;
type RohEinstellungen = Omit<Einstellungen, "logo" | "partner" | "seo"> & {
  logo: BildReferenz;
  partner: (Omit<Einstellungen["partner"][number], "logo"> & { logo?: BildReferenz })[];
  seo: Omit<Einstellungen["seo"], "bild"> & { bild?: BildReferenz };
};
type RohBaustein =
  | (Omit<Extract<Baustein, { _type: "leistungenBaustein" }>, "leistungen"> & { leistungen?: string[] })
  | (Omit<Extract<Baustein, { _type: "galerieBaustein" }>, "referenzen">)
  | (Omit<Extract<Baustein, { _type: "kontaktBaustein" }>, "bild"> & { bild?: BildReferenz })
  | (Omit<Extract<Baustein, { _type: "bildBaustein" }>, "bild"> & { bild: BildReferenz })
  | (Omit<Extract<Baustein, { _type: "rechtstextBaustein" }>, "rechtstext"> & { rechtstext: Rechtstext["art"] })
  | Extract<Baustein, { _type: "textBaustein" | "spaltenBaustein" | "linklisteBaustein" | "aufrufBaustein" }>;
type RohSeite = Omit<Seite, "hero" | "kopfbild" | "bausteine"> & {
  hero?: Omit<NonNullable<Seite["hero"]>, "bild" | "bildHoch"> & { bild?: BildReferenz; bildHoch?: BildReferenz };
  kopfbild?: BildReferenz;
  bausteine: RohBaustein[];
};

async function leistungen(): Promise<Leistung[]> {
  const roh = await json<RohLeistung[]>("leistungen.json");
  const liste = await Promise.all(roh.map(async (l) => ({ ...l, bild: await bildPflicht(l.bild, `Leistung ${l.id}`) })));
  return liste.sort((a, b) => a.reihenfolge - b.reihenfolge);
}

async function referenzen(kategorien?: ReferenzKategorie[]): Promise<Referenz[]> {
  const roh = await json<RohReferenz[]>("referenzen.json");
  const liste = await Promise.all(roh.map(async (r) => ({ ...r, bild: await bildPflicht(r.bild, `Referenz ${r.id}`) })));
  return liste
    .filter((r) => !kategorien?.length || kategorien.includes(r.kategorie))
    .sort((a, b) => a.reihenfolge - b.reihenfolge);
}

async function rechtstext(art: Rechtstext["art"]): Promise<Rechtstext | null> {
  try {
    return await json<Rechtstext>(`rechtstexte/${art}.json`);
  } catch {
    return null;
  }
}

async function baustein(roh: RohBaustein, seite: string): Promise<Baustein> {
  const ort = `Seite ${seite}, Baustein ${roh._key}`;
  switch (roh._type) {
    case "leistungenBaustein": {
      const alle = await leistungen();
      const auswahl = roh.leistungen?.length ? alle.filter((l) => roh.leistungen!.includes(l.id)) : alle;
      return { ...roh, leistungen: auswahl };
    }
    case "galerieBaustein":
      return { ...roh, referenzen: await referenzen(roh.kategorien) };
    case "kontaktBaustein":
      return { ...roh, bild: await bild(roh.bild, ort) };
    case "bildBaustein":
      return { ...roh, bild: await bildPflicht(roh.bild, ort) };
    case "rechtstextBaustein": {
      const text = await rechtstext(roh.rechtstext);
      if (!text) throw new Error(`Rechtstext «${roh.rechtstext}» fehlt (${ort}).`);
      return { ...roh, rechtstext: text };
    }
    default:
      return roh;
  }
}

export const lokaleQuelle: Inhaltsquelle = {
  async getEinstellungen() {
    const roh = await json<RohEinstellungen>("einstellungen.json");
    return {
      ...roh,
      logo: await bildPflicht(roh.logo, "Einstellungen: Logo"),
      partner: await Promise.all(roh.partner.map(async (p) => ({ ...p, logo: await bild(p.logo, `Partner ${p.titel}`) }))),
      seo: { ...roh.seo, bild: await bild(roh.seo.bild, "Einstellungen: SEO-Bild") },
    };
  },

  async getSeite(slug) {
    let roh: RohSeite;
    try {
      roh = await json<RohSeite>(`seiten/${slug}.json`);
    } catch {
      return null;
    }
    return {
      ...roh,
      hero: roh.hero
        ? { ...roh.hero, bild: await bild(roh.hero.bild, `Hero ${slug}`), bildHoch: await bild(roh.hero.bildHoch, `Hero ${slug}`) }
        : undefined,
      kopfbild: await bild(roh.kopfbild, `Kopfbild ${slug}`),
      bausteine: await Promise.all(roh.bausteine.map((b) => baustein(b, slug))),
    };
  },

  async getAlleSeitenSlugs() {
    const dateien = await readdir(path.join(DATA, "seiten"));
    return dateien.filter((d) => d.endsWith(".json")).map((d) => d.replace(/\.json$/, ""));
  },

  getLeistungen: leistungen,
  getReferenzen: referenzen,
  getRechtstext: rechtstext,
};
