/**
 * Gemeinsame Inhaltsstruktur der Website.
 *
 * Diese Typen sind die Schnittstelle zwischen Inhaltsquelle und Darstellung:
 * - lib/content/local.ts  liefert sie aus data/*.json (GitHub-Pages-Demo)
 * - lib/content/sanity.ts liefert sie aus Sanity (später, Vercel)
 * Seitenkomponenten kennen nur diese Typen, nie die Quelle.
 *
 * Feldnamen sind deutsch und decken sich mit den Sanity-Schemas in sanity/schemas/.
 */
import type { PortableTextBlock } from "@portabletext/types";

export type RichText = PortableTextBlock[];

/** Fertig aufbereitetes Bild – beide Provider liefern dieselbe Form. */
export interface Bild {
  /** Stabile Kennung (lokal: Schlüssel in data/bilder.json; Sanity: Asset-ID) */
  id: string;
  alt: string;
  breite: number;
  hoehe: number;
  /** Bildunterschrift, sofern redaktionell gepflegt */
  bildunterschrift?: string;
  /** Dominanter Farbton des Fotos (Hex) – für die Farbkarte */
  farbton?: string;
  /** Renditions aufsteigend nach Breite; `url` ist bereits absolut oder wurzelrelativ (ohne Unterpfad). */
  quellen: { breite: number; url: string }[];
}

export interface Link {
  titel: string;
  /** Interner Pfad («/kontakt») oder externe URL (https://…), tel: oder mailto: */
  ziel: string;
  extern?: boolean;
}

export interface Adresse {
  strasse: string;
  plz: string;
  ort: string;
  land?: string;
}

export interface Partner {
  titel: string;
  beschreibung?: string;
  url: string;
  logo?: Bild;
}

export interface Einstellungen {
  firmenname: string;
  /** Kurzform für Kopfzeile / Titel */
  kurzname: string;
  inhaber: string;
  gegruendet?: number;
  adresse: Adresse;
  telefon: string;
  mobil?: string;
  email: string;
  uid?: string;
  logo: Bild;
  navigation: Link[];
  /** Partner-/Verbandsleiste im Footer (auf der Quellseite auf jeder Seite sichtbar) */
  partner: Partner[];
  rechtslinks: Link[];
  seo: { titelZusatz: string; beschreibung: string; bild?: Bild };
  /** Hinweis auf jeder Seite, dass es sich um eine Demo handelt */
  demoHinweis?: string;
}

export interface Leistung {
  id: string;
  titel: string;
  punkte: string[];
  bild: Bild;
  reihenfolge: number;
}

export type ReferenzKategorie = "wohnungen" | "fassaden-treppen" | "garagen" | "umbau-rieterplatz";

export interface Referenz {
  id: string;
  kategorie: ReferenzKategorie;
  bild: Bild;
  /** Bildtext aus der Quelle (z. B. «Umbau Rieterplatz 5, Zürich») */
  bildunterschrift?: string;
  reihenfolge: number;
}

export const KATEGORIE_TITEL: Record<ReferenzKategorie, string> = {
  wohnungen: "Wohnungen",
  "fassaden-treppen": "Fassaden / Treppen",
  garagen: "Garagen",
  "umbau-rieterplatz": "Umbau Rieterplatz 5, Zürich",
};

export interface Rechtstext {
  id: string;
  art: "impressum" | "datenschutz";
  titel: string;
  stand?: string;
  inhalt: RichText;
}

/* ------------------------------------------------------------------ */
/* Seitenbausteine (Page-Builder)                                       */
/* ------------------------------------------------------------------ */

interface BausteinBasis {
  _key: string;
  kurzzeile?: string;
  titel?: string;
}

export interface TextBaustein extends BausteinBasis {
  _type: "textBaustein";
  inhalt: RichText;
  breite?: "schmal" | "normal";
}

export interface LeistungenBaustein extends BausteinBasis {
  _type: "leistungenBaustein";
  einleitung?: string;
  leistungen: Leistung[];
}

export interface GalerieBaustein extends BausteinBasis {
  _type: "galerieBaustein";
  text?: string;
  /** Welche Kategorien gezeigt werden; leer = alle */
  kategorien: ReferenzKategorie[];
  darstellung: "farbkarte" | "bildstrecke";
  /** Vorschau auf der Startseite: nur die ersten n Bilder + Link */
  maximal?: number;
  weiterLink?: Link;
  referenzen: Referenz[];
}

export interface SpaltenBaustein extends BausteinBasis {
  _type: "spaltenBaustein";
  spalten: { _key: string; titel: string; inhalt: RichText; alsZeitstrahl?: boolean }[];
}

export interface KontaktBaustein extends BausteinBasis {
  _type: "kontaktBaustein";
  einleitung?: string;
  formularHinweis?: string;
  bild?: Bild;
}

export interface LinklisteBaustein extends BausteinBasis {
  _type: "linklisteBaustein";
  links: { _key: string; titel: string; beschreibung?: string; url: string }[];
}

export interface BildBaustein extends BausteinBasis {
  _type: "bildBaustein";
  bild: Bild;
}

export interface AufrufBaustein extends BausteinBasis {
  _type: "aufrufBaustein";
  text?: string;
  knopf: Link;
  zweiterKnopf?: Link;
}

export interface RechtstextBaustein extends BausteinBasis {
  _type: "rechtstextBaustein";
  rechtstext: Rechtstext;
}

export type Baustein =
  | TextBaustein
  | LeistungenBaustein
  | GalerieBaustein
  | SpaltenBaustein
  | KontaktBaustein
  | LinklisteBaustein
  | BildBaustein
  | AufrufBaustein
  | RechtstextBaustein;

export interface Hero {
  kurzzeile?: string;
  titel: string;
  text?: string;
  bild?: Bild;
  /** Alternatives Hochformat für schmale Bildschirme */
  bildHoch?: Bild;
  knopf?: Link;
  zweiterKnopf?: Link;
}

export interface Seite {
  id: string;
  /** «start» für die Startseite, sonst URL-Segment */
  slug: string;
  titel: string;
  seoTitel?: string;
  seoBeschreibung?: string;
  hero?: Hero;
  /** Schmaler Seitenkopf statt Hero (Unterseiten) */
  kopfbild?: Bild;
  bausteine: Baustein[];
}

/** Vertrag, den jede Inhaltsquelle erfüllt. Alle Funktionen sind asynchron, damit Sanity später ohne Umbau passt. */
export interface Inhaltsquelle {
  getEinstellungen(): Promise<Einstellungen>;
  getSeite(slug: string): Promise<Seite | null>;
  getAlleSeitenSlugs(): Promise<string[]>;
  getLeistungen(): Promise<Leistung[]>;
  getReferenzen(kategorien?: ReferenzKategorie[]): Promise<Referenz[]>;
  getRechtstext(art: Rechtstext["art"]): Promise<Rechtstext | null>;
}
