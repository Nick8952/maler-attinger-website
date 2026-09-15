import "server-only";
import { defineQuery } from "next-sanity";
import { client, vorschauClient } from "@/sanity/client";
import { sanityPruefen } from "@/sanity/env";
import { BILD_PROJEKTION, sanityBild, type SanityBildRoh } from "@/sanity/bild";
import { istVorschau } from "@/lib/vorschau/status";
import type { Baustein, Einstellungen, Inhaltsquelle, Leistung, Rechtstext, Referenz, ReferenzKategorie, Seite } from "./types";

/**
 * Sanity-Inhaltsquelle (für Vercel). Liefert exakt dieselben Typen wie lib/content/local.ts.
 *
 * Cache-Strategie: veröffentlichte Inhalte werden mit dem Tag «inhalt» gecacht und per
 * Webhook (server-routes/app/api/revalidate) invalidiert. In der Entwurfsvorschau
 * (Draft Mode) wird ungecacht mit Perspektive «drafts» gelesen.
 *
 * Status: VORBEREITET – erst nach Anlegen eines Sanity-Projekts überprüfbar.
 */
export const INHALT_TAG = "inhalt";

async function abfrage<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  sanityPruefen();
  const vorschau = await istVorschau();
  const c = vorschau ? vorschauClient() : client;
  return c.fetch<T>(query, params, vorschau ? { cache: "no-store" } : { next: { revalidate: false, tags: [INHALT_TAG] } });
}

const LINK = `{ titel, ziel, extern }`;
const LEISTUNG = `{ "id": _id, titel, punkte, reihenfolge, bild ${BILD_PROJEKTION} }`;
const REFERENZ = `{ "id": _id, kategorie, bildunterschrift, reihenfolge, bild ${BILD_PROJEKTION} }`;
const RECHTSTEXT = `{ "id": _id, art, titel, stand, inhalt }`;

const BAUSTEINE = `bausteine[] {
  _key, _type, kurzzeile, titel,
  _type == "textBaustein" => { inhalt, breite },
  _type == "leistungenBaustein" => {
    einleitung,
    "leistungen": select(
      count(leistungen) > 0 => leistungen[]-> ${LEISTUNG},
      *[_type == "leistung"] | order(reihenfolge asc) ${LEISTUNG}
    )
  },
  _type == "galerieBaustein" => {
    text, kategorien, darstellung, maximal, weiterLink ${LINK},
    "referenzen": *[_type == "referenz" && (count(^.kategorien) == 0 || kategorie in ^.kategorien)] | order(reihenfolge asc) ${REFERENZ}
  },
  _type == "spaltenBaustein" => { spalten[] { _key, titel, inhalt, alsZeitstrahl } },
  _type == "kontaktBaustein" => { einleitung, formularHinweis, bild ${BILD_PROJEKTION} },
  _type == "linklisteBaustein" => { links[] { _key, titel, beschreibung, url } },
  _type == "bildBaustein" => { bild ${BILD_PROJEKTION} },
  _type == "aufrufBaustein" => { text, knopf ${LINK}, zweiterKnopf ${LINK} },
  _type == "rechtstextBaustein" => { rechtstext-> ${RECHTSTEXT} }
}`;

const EINSTELLUNGEN_QUERY = defineQuery(`*[_type == "einstellungen"][0] {
  firmenname, kurzname, inhaber, gegruendet, adresse, telefon, mobil, email, uid, demoHinweis,
  logo ${BILD_PROJEKTION},
  navigation[] ${LINK},
  partner[] { titel, beschreibung, url, logo ${BILD_PROJEKTION} },
  rechtslinks[] ${LINK},
  seo { titelZusatz, beschreibung, bild ${BILD_PROJEKTION} }
}`);

const SEITE_QUERY = defineQuery(`*[_type == "seite" && slug.current == $slug][0] {
  "id": _id, "slug": slug.current, titel, seoTitel, seoBeschreibung,
  hero { kurzzeile, titel, text, bild ${BILD_PROJEKTION}, bildHoch ${BILD_PROJEKTION}, knopf ${LINK}, zweiterKnopf ${LINK} },
  kopfbild ${BILD_PROJEKTION},
  ${BAUSTEINE}
}`);

type Roh = Record<string, unknown>;
const bildAus = (o: unknown, alt = "") => sanityBild(o as SanityBildRoh | undefined, alt);

function bausteinAufbereiten(b: Roh): Baustein {
  switch (b._type) {
    case "leistungenBaustein":
      return { ...(b as object), leistungen: ((b.leistungen as Roh[]) ?? []).map(leistungAufbereiten) } as Baustein;
    case "galerieBaustein":
      return { ...(b as object), kategorien: (b.kategorien as ReferenzKategorie[]) ?? [], referenzen: ((b.referenzen as Roh[]) ?? []).map(referenzAufbereiten) } as Baustein;
    case "kontaktBaustein":
      return { ...(b as object), bild: bildAus(b.bild) } as Baustein;
    case "bildBaustein":
      return { ...(b as object), bild: bildAus(b.bild)! } as Baustein;
    default:
      return b as unknown as Baustein;
  }
}
const leistungAufbereiten = (l: Roh): Leistung => ({ ...(l as object), bild: bildAus(l.bild, l.titel as string)! }) as Leistung;
const referenzAufbereiten = (r: Roh): Referenz => ({ ...(r as object), bild: bildAus(r.bild, (r.bildunterschrift as string) ?? "")! }) as Referenz;

export const sanityQuelle: Inhaltsquelle = {
  async getEinstellungen() {
    const e = await abfrage<Roh | null>(EINSTELLUNGEN_QUERY);
    if (!e) throw new Error("Sanity: Dokument «einstellungen» fehlt – `npm run seed` ausführen.");
    return {
      ...(e as object),
      navigation: (e.navigation as Einstellungen["navigation"]) ?? [],
      rechtslinks: (e.rechtslinks as Einstellungen["rechtslinks"]) ?? [],
      logo: bildAus(e.logo, e.kurzname as string)!,
      partner: ((e.partner as Roh[]) ?? []).map((p) => ({ ...(p as object), logo: bildAus(p.logo, p.titel as string) })),
      seo: { ...((e.seo as object) ?? {}), bild: bildAus((e.seo as Roh | undefined)?.bild) },
    } as Einstellungen;
  },

  async getSeite(slug) {
    const s = await abfrage<Roh | null>(SEITE_QUERY, { slug });
    if (!s) return null;
    const hero = s.hero as Roh | undefined;
    return {
      ...(s as object),
      hero: hero ? { ...(hero as object), bild: bildAus(hero.bild), bildHoch: bildAus(hero.bildHoch) } : undefined,
      kopfbild: bildAus(s.kopfbild),
      bausteine: ((s.bausteine as Roh[]) ?? []).map(bausteinAufbereiten),
    } as Seite;
  },

  async getAlleSeitenSlugs() {
    return abfrage<string[]>(`*[_type == "seite" && defined(slug.current)].slug.current`);
  },

  async getLeistungen() {
    return (await abfrage<Roh[]>(`*[_type == "leistung"] | order(reihenfolge asc) ${LEISTUNG}`)).map(leistungAufbereiten);
  },

  async getReferenzen(kategorien) {
    const liste = await abfrage<Roh[]>(`*[_type == "referenz" && (count($kategorien) == 0 || kategorie in $kategorien)] | order(reihenfolge asc) ${REFERENZ}`, {
      kategorien: kategorien ?? [],
    });
    return liste.map(referenzAufbereiten);
  },

  async getRechtstext(art) {
    return abfrage<Rechtstext | null>(`*[_type == "rechtstext" && art == $art][0] ${RECHTSTEXT}`, { art });
  },
};
