# Lokale Demo-Inhalte pflegen

Solange kein Sanity angeschlossen ist, sind die Dateien in `data/` die einzige Inhaltsquelle.
Nach jeder Änderung: `npm run inhalt:pruefen`, dann `npm run build:pages` (oder Push auf `main` → automatischer Deploy).

## Dateien

| Datei | Inhalt |
|---|---|
| `data/einstellungen.json` | Firma, Adresse, Telefon, E-Mail, UID, Logo, Navigation, Partnerleiste, Rechtslinks, SEO-Standard, Demo-Hinweis |
| `data/seiten/<slug>.json` | Eine Seite: Titel, SEO, Hero (nur Start) oder Kopfbild, `bausteine[]` |
| `data/leistungen.json` | Die sechs Angebots-Kacheln |
| `data/referenzen.json` | Alle Referenzbilder mit Kategorie, Reihenfolge, Alt-Text (Farbton optional überschreibbar) |
| `data/rechtstexte/{impressum,datenschutz}.json` | Rechtstexte als Portable Text |
| `data/bilder.json` | **Generiert** von `npm run bilder` – nicht von Hand ändern |

## Texte ändern

Kurze Felder (`titel`, `text`, `einleitung`, `punkte`) direkt in der JSON-Datei bearbeiten.
Formatierter Text (`inhalt`) ist Portable Text. Am einfachsten: Text als Markdown schreiben und umwandeln:

```bash
npm run text:konvertieren -- mein-text.md > /tmp/pt.json   # Ausgabe in das Feld "inhalt" einfügen
```

Unterstützt: Absätze, `##`/`###` Zwischentitel, `-` Listen, `1.` Nummerierungen, `**fett**`, `*kursiv*`, `[Link](/kontakt)`.

## Neue Seite

1. `data/seiten/<slug>.json` anlegen (Vorlage: `angebot.json`), `id: "seite-<slug>"`, `slug` = Dateiname.
2. Link in `data/einstellungen.json` → `navigation` ergänzen.
3. Bausteine kombinieren: `textBaustein`, `leistungenBaustein`, `galerieBaustein`, `spaltenBaustein`, `kontaktBaustein`,
   `linklisteBaustein`, `bildBaustein`, `aufrufBaustein`, `rechtstextBaustein` (Felder siehe `lib/content/types.ts`).
   Jeder Baustein braucht einen eindeutigen `_key`.

## Bilder

1. Originaldatei nach `assets/originale/` legen und in `assets/originale/HERKUNFT.md` eintragen (Quelle, Rechte).
2. In `scripts/bilder-optimieren.mjs` unter `BILDER` eine Kennung → Datei eintragen.
3. `npm run bilder` ausführen (erzeugt WebP-Varianten in `public/images/` und `data/bilder.json`).
4. In den Inhalten per `{ "bild": "<kennung>", "alt": "…" }` referenzieren. Alt-Text ist Pflicht.

Bilder in `public/images/` sind generiert und committet, damit der Pages-Build ohne `sharp` auskommt.

## Farbtöne der Farbkarte

`npm run bilder` liest den häufigsten Farbbereich aus der Bildmitte. Stimmt er nicht, in `data/referenzen.json`
beim Bild `"farbton": "#rrggbb"` setzen – das überschreibt den automatischen Wert.

## Regeln

- Keine Angaben erfinden (Preise, Öffnungszeiten, Bewertungen). Was nicht belegt ist, bleibt weg.
- Kundenzitate wörtlich lassen. Rechtstexte nur mit Rückfrage ändern.
- Nach Änderungen an der Struktur (neue Felder) auch `lib/content/types.ts`, `lib/content/sanity.ts` und `sanity/schemas/` nachziehen,
  damit Demo und späteres CMS dasselbe Modell haben.
