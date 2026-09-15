import type { Metadata } from "next";
import { stegaClean } from "@sanity/client/stega";
import type { Einstellungen, Seite } from "./content/types";
import { siteUrl } from "./deploy-ziel";

/** Indexierung nur, wenn ausdrücklich freigegeben (nach Go-Live auf der Kundendomain). */
export const indexierungErlaubt = process.env.INDEXIERUNG === "1";

/** Entfernt Stega-Markierungen (Visual Editing) aus Strings, bevor sie in Metadaten/JSON-LD landen. */
const sauber = (s: string | undefined) => (s ? stegaClean(s) : undefined);

export function seitenMetadata(seite: Seite, e: Einstellungen): Metadata {
  const titel = sauber(seite.seoTitel) ?? sauber(seite.titel) ?? "";
  const beschreibung = sauber(seite.seoBeschreibung) ?? sauber(e.seo.beschreibung);
  const pfad = seite.slug === "start" ? "/" : `/${seite.slug}/`;
  const bild = seite.hero?.bild ?? e.seo.bild;
  const bildUrl = bild ? bild.quellen[bild.quellen.length - 1]?.url : undefined;
  return {
    title: seite.slug === "start" ? `${sauber(e.kurzname)} – ${titel}` : titel,
    description: beschreibung,
    alternates: { canonical: pfad },
    openGraph: {
      title: `${titel} | ${sauber(e.seo.titelZusatz)}`,
      description: beschreibung,
      url: pfad,
      siteName: sauber(e.firmenname),
      locale: "de_CH",
      type: "website",
      images: bildUrl ? [{ url: bildUrl.startsWith("http") ? bildUrl : `${siteUrl}${bildUrl}`, width: bild?.breite, height: bild?.hoehe, alt: sauber(bild?.alt) }] : undefined,
    },
    robots: indexierungErlaubt ? { index: true, follow: true } : { index: false, follow: false },
  };
}

/**
 * Strukturierte Daten für den Betrieb – ausschliesslich belegte Angaben
 * (Name, Adresse, Telefon, E-Mail, Gründungsjahr, Inhaber). Keine Öffnungszeiten,
 * Bewertungen oder Preise, weil die Quellseite keine nennt.
 */
export function betriebJsonLd(e: Einstellungen): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HousePainter",
    name: sauber(e.firmenname),
    url: siteUrl,
    telephone: telefonInternational(e.telefon),
    email: sauber(e.email),
    foundingDate: e.gegruendet ? String(e.gegruendet) : undefined,
    founder: e.gegruendet ? { "@type": "Person", name: "Werner Attinger" } : undefined,
    employee: { "@type": "Person", name: sauber(e.inhaber), jobTitle: "Geschäftsinhaber" },
    address: {
      "@type": "PostalAddress",
      streetAddress: sauber(e.adresse.strasse),
      postalCode: sauber(e.adresse.plz),
      addressLocality: sauber(e.adresse.ort),
      addressCountry: "CH",
    },
    vatID: sauber(e.uid),
    areaServed: { "@type": "City", name: "Zürich" },
  };
}

export function telefonInternational(tel: string): string {
  const ziffern = tel.replace(/\D/g, "");
  return ziffern.startsWith("0") ? `+41${ziffern.slice(1)}` : `+${ziffern}`;
}

/** JSON-LD sicher in ein <script> einbetten: «<» wird escaped, damit kein HTML entsteht. */
export function jsonLdSicher(daten: unknown): string {
  return JSON.stringify(daten).replace(/</g, "\\u003c");
}
