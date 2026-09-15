import { defineField, defineType, defineArrayMember } from "sanity";
import { bausteinMitglieder } from "./bausteine";

const RESERVIERTE_SLUGS = ["start", "studio", "api", "images", "fonts", "_next"];

export const einstellungenTyp = defineType({
  name: "einstellungen",
  title: "Website-Einstellungen",
  type: "document",
  groups: [
    { name: "betrieb", title: "Betrieb", default: true },
    { name: "navigation", title: "Navigation & Footer" },
    { name: "seo", title: "Suchmaschinen" },
  ],
  fields: [
    defineField({ name: "firmenname", title: "Firmenname", type: "string", group: "betrieb", validation: (r) => r.required() }),
    defineField({ name: "kurzname", title: "Kurzname", type: "string", group: "betrieb", description: "Für Kopfzeile und Seitentitel, z. B. «Maler Attinger».", validation: (r) => r.required() }),
    defineField({ name: "inhaber", title: "Inhaber / Ansprechperson", type: "string", group: "betrieb", validation: (r) => r.required() }),
    defineField({ name: "gegruendet", title: "Gründungsjahr", type: "number", group: "betrieb" }),
    defineField({ name: "adresse", title: "Adresse", type: "adresse", group: "betrieb", validation: (r) => r.required() }),
    defineField({ name: "telefon", title: "Telefon", type: "string", group: "betrieb", validation: (r) => r.required() }),
    defineField({ name: "mobil", title: "Mobil", type: "string", group: "betrieb" }),
    defineField({ name: "email", title: "E-Mail", type: "string", group: "betrieb", validation: (r) => r.required().email() }),
    defineField({ name: "uid", title: "UID / MWST-Nummer", type: "string", group: "betrieb", description: "z. B. CHE-123.456.789 MWST" }),
    defineField({ name: "logo", title: "Logo", type: "bild", group: "betrieb", validation: (r) => r.required() }),
    defineField({ name: "navigation", title: "Hauptnavigation", type: "array", group: "navigation", of: [defineArrayMember({ type: "link" })], validation: (r) => r.max(8) }),
    defineField({ name: "partner", title: "Partner / Verbände (Footer)", type: "array", group: "navigation", of: [defineArrayMember({ type: "partner" })] }),
    defineField({ name: "rechtslinks", title: "Rechtliche Links (Footer)", type: "array", group: "navigation", of: [defineArrayMember({ type: "link" })] }),
    defineField({
      name: "seo",
      title: "Suchmaschinen-Standardwerte",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "titelZusatz", title: "Titelzusatz", type: "string", description: "Wird an jeden Seitentitel angehängt, z. B. «Attinger Maler + Tapeziergeschäft, Zürich»." }),
        defineField({ name: "beschreibung", title: "Standard-Beschreibung", type: "text", rows: 3, validation: (r) => r.max(160).warning("Suchmaschinen zeigen meist nur ~160 Zeichen.") }),
        defineField({ name: "bild", title: "Vorschaubild (Social Media)", type: "bild" }),
      ],
    }),
    defineField({ name: "demoHinweis", title: "Demo-Hinweis", type: "string", group: "seo", description: "Kurzer Hinweis im Footer, solange die Seite eine Demo ist. Leer lassen nach Go-Live." }),
  ],
  preview: { prepare: () => ({ title: "Website-Einstellungen" }) },
});

export const seiteTyp = defineType({
  name: "seite",
  title: "Seite",
  type: "document",
  groups: [
    { name: "inhalt", title: "Inhalt", default: true },
    { name: "kopf", title: "Seitenkopf" },
    { name: "seo", title: "Suchmaschinen" },
  ],
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", group: "inhalt", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL-Segment",
      type: "slug",
      group: "inhalt",
      description: "«start» ist die Startseite. Sonst z. B. «angebot» → /angebot/",
      options: { source: "titel", maxLength: 60 },
      validation: (r) =>
        r.required().custom((slug) => {
          const wert = slug?.current ?? "";
          if (wert !== "start" && RESERVIERTE_SLUGS.includes(wert)) return `«${wert}» ist reserviert.`;
          if (!/^[a-z0-9-]+$/.test(wert)) return "Nur Kleinbuchstaben, Ziffern und Bindestriche.";
          return true;
        }),
    }),
    defineField({
      name: "hero",
      title: "Hero (grosser Seitenanfang)",
      type: "object",
      group: "kopf",
      description: "Für die Startseite. Unterseiten verwenden stattdessen das Kopfbild.",
      fields: [
        defineField({ name: "kurzzeile", title: "Kurzzeile", type: "string" }),
        defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
        defineField({ name: "bild", title: "Bild (Querformat)", type: "bild" }),
        defineField({ name: "bildHoch", title: "Bild (Hochformat, für Handys)", type: "bild" }),
        defineField({ name: "knopf", title: "Knopf", type: "link" }),
        defineField({ name: "zweiterKnopf", title: "Zweiter Knopf", type: "link" }),
      ],
    }),
    defineField({ name: "kopfbild", title: "Kopfbild", type: "bild", group: "kopf", description: "Schmales Bild über dem Seitentitel (Unterseiten)." }),
    defineField({ name: "bausteine", title: "Bausteine", type: "array", group: "inhalt", of: bausteinMitglieder }),
    defineField({ name: "seoTitel", title: "Seitentitel (Browser-Tab)", type: "string", group: "seo", validation: (r) => r.max(70).warning("Suchmaschinen kürzen Titel über ~70 Zeichen.") }),
    defineField({ name: "seoBeschreibung", title: "Beschreibung (Suchergebnis)", type: "text", rows: 3, group: "seo", validation: (r) => r.max(160).warning("Suchmaschinen zeigen meist nur ~160 Zeichen.") }),
  ],
  preview: { select: { title: "titel", subtitle: "slug.current" } },
});

export const leistungTyp = defineType({
  name: "leistung",
  title: "Leistung",
  type: "document",
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({ name: "punkte", title: "Stichpunkte", type: "array", of: [defineArrayMember({ type: "string" })], validation: (r) => r.required().min(1) }),
    defineField({ name: "bild", title: "Bild", type: "bild", validation: (r) => r.required() }),
    defineField({ name: "reihenfolge", title: "Reihenfolge", type: "number", validation: (r) => r.required().integer() }),
  ],
  orderings: [{ title: "Reihenfolge", name: "reihenfolge", by: [{ field: "reihenfolge", direction: "asc" }] }],
  preview: { select: { title: "titel", media: "bild" } },
});

export const referenzTyp = defineType({
  name: "referenz",
  title: "Referenzbild",
  type: "document",
  fields: [
    defineField({ name: "bild", title: "Bild", type: "bild", validation: (r) => r.required() }),
    defineField({
      name: "kategorie",
      title: "Kategorie",
      type: "string",
      options: {
        list: [
          { title: "Wohnungen", value: "wohnungen" },
          { title: "Fassaden / Treppen", value: "fassaden-treppen" },
          { title: "Garagen", value: "garagen" },
          { title: "Umbau Rieterplatz 5", value: "umbau-rieterplatz" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "bildunterschrift", title: "Bildunterschrift", type: "string" }),
    defineField({ name: "reihenfolge", title: "Reihenfolge", type: "number", validation: (r) => r.required().integer() }),
  ],
  orderings: [{ title: "Reihenfolge", name: "reihenfolge", by: [{ field: "reihenfolge", direction: "asc" }] }],
  preview: { select: { title: "bildunterschrift", subtitle: "kategorie", media: "bild" }, prepare: ({ title, subtitle, media }) => ({ title: title || subtitle, subtitle, media }) },
});

export const rechtstextTyp = defineType({
  name: "rechtstext",
  title: "Rechtstext",
  type: "document",
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "art",
      title: "Art",
      type: "string",
      options: { list: [{ title: "Impressum", value: "impressum" }, { title: "Datenschutzerklärung", value: "datenschutz" }], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "stand", title: "Stand (Datum)", type: "date" }),
    defineField({ name: "inhalt", title: "Inhalt", type: "richText", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "titel", subtitle: "stand" } },
});
