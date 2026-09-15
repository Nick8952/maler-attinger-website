import { defineField, defineType, defineArrayMember } from "sanity";

/**
 * Seitenbausteine – der begrenzte Satz, mit dem Seiten zusammengestellt werden.
 * Jeder Baustein hat `kurzzeile` (kleine Zeile über dem Titel) und `titel`.
 */
const kopfFelder = [
  defineField({ name: "kurzzeile", title: "Kurzzeile", type: "string", description: "Kleine Zeile über dem Titel, z. B. «Angebot»." }),
  defineField({ name: "titel", title: "Titel", type: "string" }),
];

const vorschau = (untertitel: string) => ({
  select: { title: "titel", kurzzeile: "kurzzeile" },
  prepare: ({ title, kurzzeile }: { title?: string; kurzzeile?: string }) => ({ title: title || kurzzeile || untertitel, subtitle: untertitel }),
});

export const textBaustein = defineType({
  name: "textBaustein",
  title: "Text",
  type: "object",
  fields: [
    ...kopfFelder,
    defineField({ name: "inhalt", title: "Inhalt", type: "richText", validation: (r) => r.required() }),
    defineField({
      name: "breite",
      title: "Breite",
      type: "string",
      options: { list: [{ title: "Schmal (Lesetext)", value: "schmal" }, { title: "Normal", value: "normal" }], layout: "radio" },
      initialValue: "schmal",
    }),
  ],
  preview: vorschau("Text"),
});

export const leistungenBaustein = defineType({
  name: "leistungenBaustein",
  title: "Leistungen",
  type: "object",
  fields: [
    ...kopfFelder,
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 3 }),
    defineField({
      name: "leistungen",
      title: "Leistungen",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "leistung" }] })],
      description: "Leer lassen = alle Leistungen in ihrer Reihenfolge.",
    }),
  ],
  preview: vorschau("Leistungen"),
});

export const galerieBaustein = defineType({
  name: "galerieBaustein",
  title: "Bildergalerie",
  type: "object",
  fields: [
    ...kopfFelder,
    defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
    defineField({
      name: "kategorien",
      title: "Kategorien",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Wohnungen", value: "wohnungen" },
          { title: "Fassaden / Treppen", value: "fassaden-treppen" },
          { title: "Garagen", value: "garagen" },
          { title: "Umbau Rieterplatz 5", value: "umbau-rieterplatz" },
        ],
      },
      description: "Leer = alle Referenzbilder.",
    }),
    defineField({
      name: "darstellung",
      title: "Darstellung",
      type: "string",
      options: { list: [{ title: "Farbkarte (Kacheln mit Farbton, Filter)", value: "farbkarte" }, { title: "Bildstrecke (grosse Bilder)", value: "bildstrecke" }], layout: "radio" },
      initialValue: "farbkarte",
      validation: (r) => r.required(),
    }),
    defineField({ name: "maximal", title: "Höchstens … Bilder", type: "number", description: "Für Vorschauen auf der Startseite. Leer = alle." }),
    defineField({ name: "weiterLink", title: "Link «alle ansehen»", type: "link" }),
  ],
  preview: vorschau("Bildergalerie"),
});

export const spaltenBaustein = defineType({
  name: "spaltenBaustein",
  title: "Spalten",
  type: "object",
  fields: [
    ...kopfFelder,
    defineField({
      name: "spalten",
      title: "Spalten",
      type: "array",
      validation: (r) => r.min(1).max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "spalte",
          fields: [
            defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
            defineField({ name: "inhalt", title: "Inhalt", type: "richText", validation: (r) => r.required() }),
            defineField({ name: "alsZeitstrahl", title: "Als Zeitstrahl darstellen", type: "boolean", description: "Für chronologische Listen (z. B. Ausbildung).", initialValue: false }),
          ],
          preview: { select: { title: "titel" } },
        }),
      ],
    }),
  ],
  preview: vorschau("Spalten"),
});

export const kontaktBaustein = defineType({
  name: "kontaktBaustein",
  title: "Kontakt und Anfrage",
  type: "object",
  fields: [
    ...kopfFelder,
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 3 }),
    defineField({ name: "formularHinweis", title: "Hinweis unter dem Formular", type: "text", rows: 3 }),
    defineField({ name: "bild", title: "Bild", type: "bild" }),
  ],
  preview: vorschau("Kontakt"),
});

export const linklisteBaustein = defineType({
  name: "linklisteBaustein",
  title: "Linkliste",
  type: "object",
  fields: [
    ...kopfFelder,
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "eintrag",
          fields: [
            defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
            defineField({ name: "beschreibung", title: "Beschreibung", type: "text", rows: 2 }),
            defineField({ name: "url", title: "Adresse", type: "url", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "titel", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: vorschau("Linkliste"),
});

export const bildBaustein = defineType({
  name: "bildBaustein",
  title: "Grosses Bild",
  type: "object",
  fields: [...kopfFelder, defineField({ name: "bild", title: "Bild", type: "bild", validation: (r) => r.required() })],
  preview: { select: { title: "bild.alt", media: "bild" }, prepare: ({ title, media }) => ({ title: title || "Bild", subtitle: "Grosses Bild", media }) },
});

export const aufrufBaustein = defineType({
  name: "aufrufBaustein",
  title: "Handlungsaufruf",
  type: "object",
  fields: [
    ...kopfFelder,
    defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
    defineField({ name: "knopf", title: "Knopf", type: "link", validation: (r) => r.required() }),
    defineField({ name: "zweiterKnopf", title: "Zweiter Knopf", type: "link" }),
  ],
  preview: vorschau("Handlungsaufruf"),
});

export const rechtstextBaustein = defineType({
  name: "rechtstextBaustein",
  title: "Rechtstext",
  type: "object",
  fields: [
    defineField({ name: "rechtstext", title: "Rechtstext", type: "reference", to: [{ type: "rechtstext" }], validation: (r) => r.required() }),
  ],
  preview: { select: { title: "rechtstext.titel" }, prepare: ({ title }) => ({ title: title || "Rechtstext", subtitle: "Rechtstext" }) },
});

export const bausteine = [
  textBaustein,
  leistungenBaustein,
  galerieBaustein,
  spaltenBaustein,
  kontaktBaustein,
  linklisteBaustein,
  bildBaustein,
  aufrufBaustein,
  rechtstextBaustein,
];

export const bausteinMitglieder = bausteine.map((b) => defineArrayMember({ type: b.name }));
