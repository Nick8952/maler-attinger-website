import { defineField, defineType, defineArrayMember } from "sanity";

/** Bild mit Pflicht-Alt-Text, optionaler Bildunterschrift und Farbton (Farbkarte). */
export const bildTyp = defineType({
  name: "bild",
  title: "Bild",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternativtext",
      type: "string",
      description: "Beschreibt das Bild für Screenreader und wenn es nicht geladen werden kann. Pflichtfeld.",
      validation: (r) => r.required().max(160),
    }),
    defineField({ name: "bildunterschrift", title: "Bildunterschrift", type: "string", description: "Wird sichtbar unter dem Bild angezeigt (optional)." }),
    defineField({
      name: "farbton",
      title: "Farbton (Hex)",
      type: "string",
      description: "Optionaler Wandfarbton für die Farbkarte, z. B. #b45718. Leer = automatisch aus dem Bild.",
      validation: (r) => r.regex(/^#[0-9a-fA-F]{6}$/, { name: "Hex-Farbe", invert: false }).warning("Format: #rrggbb"),
    }),
  ],
});

export const linkTyp = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Beschriftung", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "ziel",
      title: "Ziel",
      type: "string",
      description: "Interner Pfad (z. B. /kontakt), externe Adresse (https://…), tel:… oder mailto:…",
      validation: (r) => r.required(),
    }),
    defineField({ name: "extern", title: "In neuem Tab öffnen", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "titel", subtitle: "ziel" } },
});

/** Formatierter Text – bewusst kleiner Umfang: Absätze, Zwischentitel, Listen, Links, fett/kursiv. */
export const richTextTyp = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Absatz", value: "normal" },
        { title: "Zwischentitel", value: "h2" },
        { title: "Untertitel", value: "h3" },
      ],
      lists: [
        { title: "Aufzählung", value: "bullet" },
        { title: "Nummerierung", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Fett", value: "strong" },
          { title: "Kursiv", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({ name: "href", title: "Adresse", type: "string", validation: (r) => r.required() }),
              defineField({ name: "extern", title: "In neuem Tab öffnen", type: "boolean", initialValue: false }),
            ],
          },
        ],
      },
    }),
  ],
});

export const adresseTyp = defineType({
  name: "adresse",
  title: "Adresse",
  type: "object",
  fields: [
    defineField({ name: "strasse", title: "Strasse und Nr.", type: "string", validation: (r) => r.required() }),
    defineField({ name: "plz", title: "PLZ", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ort", title: "Ort", type: "string", validation: (r) => r.required() }),
    defineField({ name: "land", title: "Land", type: "string", initialValue: "Schweiz" }),
  ],
});

export const partnerTyp = defineType({
  name: "partner",
  title: "Partner / Verband",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "beschreibung", title: "Kurzbeschreibung", type: "string" }),
    defineField({ name: "url", title: "Website", type: "url", validation: (r) => r.required() }),
    defineField({ name: "logo", title: "Logo", type: "bild", description: "Optional – ohne Logo wird der Name als Textlink gezeigt." }),
  ],
  preview: { select: { title: "titel", subtitle: "url", media: "logo" } },
});
