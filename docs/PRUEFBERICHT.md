# Prüfbericht – Demo maler-attinger-website (15.09.2026)

Alle Tests sind **Geräteemulation** (Chrome headless via puppeteer-core auf macOS) – keine Tests auf echten
Geräten. CMS-/Vercel-Funktionen wurden **nicht** live geprüft (nicht eingerichtet).

## Build und Code

| Prüfung | Ergebnis |
|---|---|
| `npm run typecheck` (tsc --noEmit) | ✅ fehlerfrei |
| `npm run lint` (ESLint, next/core-web-vitals) | ✅ fehlerfrei |
| `npm run inhalt:pruefen` | ✅ 9 Seiten, 45 Bilder, 20 interne Links |
| `npm run build:pages` ohne jede Env-Variable | ✅ 11 Routen statisch (9 Seiten, 404, Start) |
| `npm run build:vercel` mit Platzhalter-Projekt-ID | ✅ kompiliert inkl. `/studio`, `/api/revalidate`, `/api/vorschau/*` (Funktion ungetestet) |
| `npm run seed -- --probe` | ✅ stellt 49 Dokumente + 45 Bilder zusammen, ohne zu schreiben |

## GitHub Pages (live)

- Workflow `GitHub Pages` erfolgreich (Build + Deploy), Pages-Quelle «GitHub Actions», Repo public, HTTPS erzwungen.
- Direktaufruf mit `curl`: `/`, `/ueber-uns/`, `/angebot/`, `/renovation-umbau/`, `/innen-aussenarbeiten/`, `/kontakt/`,
  `/links/`, `/impressum/`, `/datenschutz/` → **200**; `/gibtsnicht/` → **404 mit gestalteter Seite**; `/kontakt` (ohne Slash) → 200 (Redirect).
- Alle referenzierten CSS/JS/Bild-Dateien unter `/maler-attinger-website/...` → 200 (Unterpfad korrekt).
- `<meta name="robots" content="noindex, nofollow">` und Canonical mit Unterpfad auf jeder Seite; JSON-LD `HousePainter` vorhanden.
- Reload/Deep-Link der Unterseiten funktioniert (echte `index.html` pro Ordner durch `trailingSlash`).

## Responsive (Emulation, fullPage-Screenshots + DOM-Audit)

| Breite | Seiten | Horizontaler Überlauf | Elemente breiter als Viewport | Bilder ohne alt |
|---|---|---|---|---|
| 360 | alle 9 + 404 | keiner (nach Fix: Silbentrennung im H1 «Datenschutzerklärung») | keine | 0 |
| 390 | alle 9 + 404 | keiner | keine | 0 |
| 768 | Start, Innen/Aussen, Kontakt, Datenschutz (live) | keiner | keine | 0 |
| 1440 | alle 9 + 404 | keiner | keine | 0 |

Visuell geprüft (Screenshots): Start 390/1440, Über uns 1440, Innen/Aussen 1440, Kontakt 1440, Datenschutz 360, Menü 390,
Lightbox 390, Datenschutz-Dialog 1440. Behoben: leere Galerie-Kacheln in Screenshots (Lazy-Loading, kein Bug), zu grosse
Hero-Schrift bei 1440, Hochformat-Hero-Ausschnitt (Person war abgeschnitten), Lightbox-Hintergrund auf Mobile.

## Touch-Ziele (≥ 44 × 44 px)

Audit aller `a, button, input, textarea` pro Seite: alle interaktiven Elemente ≥ 44 px, inkl. Farbfächer-Chips (44 px),
Logo-Link, Filter-Chips, Formularfelder (48 px), Footer-Links. Fliesstext-Links (z. B. E-Mail-Adressen im Impressum)
sind inline und erhalten eine unsichtbar vergrösserte Klickfläche (`padding-block`), gemessen 43–44 px.
Einzige bewusste Ausnahme: der Skip-Link (1×1 px, bis er fokussiert wird).

## Interaktion (Puppeteer)

| Test | Ergebnis |
|---|---|
| Mobiles Menü öffnen → Fokus auf «Menü schliessen», Tab-Reihenfolge, Esc schliesst | ✅ |
| Galerie-Filter «Fassaden / Treppen» → 4 Kacheln | ✅ |
| Lightbox öffnen, Pfeil rechts → «Bild 2 von 4», Esc schliesst, Live-Region für Bildwechsel | ✅ |
| Datenschutz-Dialog öffnen/Esc; Link «Datenschutzerklärung» schliesst Dialog und navigiert | ✅ |
| Kontaktformular: `mailto:` mit Betreff «Anfrage über die Website – Anna Muster» und Body (nur ausgefüllte Felder) | ✅ |
| Kontaktformular ohne JavaScript: `action=mailto`, kein Request an den Server | ✅ |
| Leeres Formular → native Pflichtfeld-Validierung, kein Submit | ✅ |
| Tastatur: erster Tab = Skip-Link; Fokusring 3 px blau, auf dunklen Flächen weiss, ohne Einblend-Verzögerung | ✅ |
| `prefers-reduced-motion: reduce` → alle Scroll-Reveals sofort sichtbar (opacity 1) | ✅ |
| Variable Schrift Archivo: Breitenachse aktiv (62 % vs. 125 % = 212 vs. 386 px) | ✅ |
| Sprachwechsel | entfällt (Quellseite nur Deutsch) |

## Kontraste (rechnerisch, Codex + eigene Prüfung)

Bordeaux `#a10e43` auf Weiss 7,9:1 · `#524c4d` auf Weiss 8,4:1 · Weiss auf `#1c1a1b` 17,3:1 · Weiss/70 auf `#1c1a1b` 9:1 ·
Etikett auf Bordeaux: nach Fix Weiss/90 (> 4,5:1) · Formularränder `#857d7b` auf Weiss ≈ 3,6:1 · Fokusring blau auf Weiss 5,5:1, weiss auf Bordeaux 7,9:1.

## Datenschutztechnik

Request-Protokoll mit Puppeteer über alle Seiten (lokal **und** live auf nick8952.github.io), jeweils vor jeder Interaktion,
nach Öffnen des Datenschutz-Dialogs, nach Formular-Absenden und nach erneutem Laden:

- Externe Requests (andere Origin als die Website): **keine** – Schriften, Bilder, Skripte kommen alle von der Website.
- `document.cookie`: leer · `localStorage`: 0 Einträge · `sessionStorage`: 0 Einträge (auf jeder Seite, auch nach Interaktionen).
- Zustände «vor Auswahl / nach Ablehnung / nach Zustimmung / nach Widerruf» existieren nicht, weil es nichts einzuwilligen gibt –
  deshalb **kein Cookie-Banner**, sondern die Informationsansicht «Datenschutz-Einstellungen» (ohne wirkungslose Schalter).
- Einzige Datenbearbeitung: GitHub-Pages-Zugriffsprotokoll (IP-Adresse) – in der Datenschutzerklärung beschrieben.
- Kontaktformular: keine Übertragung an den Server, mit und ohne JavaScript.

## Codex-Prüfung (unabhängige Zweitmeinung, Lesezugriff)

**Runde 1 – Architektur (vor der Umsetzung):** 12 Punkte, davon umgesetzt: Build ohne Env-Variablen mit festen Defaults,
`assetUrl`-Helfer für den Unterpfad, Server-Routen ausserhalb `app/` statt temporärem Verschieben, Portable Text lokal,
sichtbarer Fehler statt stillem Rückfall bei fehlender Sanity-Konfiguration, `stegaClean` in Metadaten, `<`-Escaping in JSON-LD,
`robots.txt` im Unterpfad als wirkungslos erkannt → nur Meta-noindex, keine wirkungslosen Schalter im Datenschutz-Dialog.

**Runde 2 – Implementierung (vor Übergabe):** 18 Punkte. Umgesetzt (17):
1. Formular ohne JavaScript hätte per GET an GitHub gesendet → `action=mailto`, `method=post`, `enctype=text/plain` (getestet).
2. Leere `SITE_URL`/`BASE_PATH` aus `.env.example` brachen den Build → leere Werte = Standard, `BASE_PATH` auskommentiert.
3. `build:pages` erzwingt jetzt `DEPLOY_TARGET=pages` (cross-env, auch Windows); `dev` räumt Vercel-Routen weg.
4. Seed: `_type` für `bild`, `spalte`, `eintrag`, `link` ergänzt.
5. Vier SEO-Beschreibungen > 160 Zeichen gekürzt; Längenregeln als Warnung modelliert.
6. GROQ: `coalesce(count(^.kategorien), 0)` – Galerie ohne Kategorien lieferte sonst nichts.
7. Pflichtlisten (`punkte`, `spalten`, `links`) im Schema `required`, Provider normalisiert auf `[]`, Pflichtbilder werfen Fehler.
8. Datenschutz-Dialog schliesst bei Linkklick/Pfadwechsel.
9. Kontraste: Etikett auf Bordeaux, weisser Fokusring auf dunklen Flächen, Formularränder 3:1.
10. Hero: «seit 1965 im Kreis 2» → «seit 1965.» (Standort seit Gründung nicht belegt).
11. Footer-Titel «Zertifiziert und vernetzt» → «Umweltschutz, Ökologie und Verbände»; Zertifikat-Aussage bleibt als Übernahme
    der Quellseite im Text, offener Punkt beim Kunden (docs/UEBERGABE.md).
12. Datenschutzerklärung: Gmail (Google LLC, USA) als E-Mail-Anbieter des Betreibers ergänzt.
13. Visual Editing: eigener `refresh`-Handler (router.refresh bei Mutationen) und `locations` im Presentation-Tool.
14. `extern` wird in RichText, SmartLink, Hero und Bausteinen durchgereicht.
15. Leistungs-Auswahl in beiden Providern nach `reihenfolge` sortiert.
16. Seed-Dedupe nicht mehr per Dateiname (Sanity dedupliziert per Inhalts-Hash).
17. Lightbox: `role="status"`-Live-Region für Bildnummer/Beschreibung.
Nicht umgesetzt (18): Runtime-Validierung der Provider-Ergebnisse mit einem Schema-Validator – bewusst offen gelassen
(Sanity-Modus ist noch nicht aktiv; `inhalt:pruefen` deckt den lokalen Modus ab).

Codex hat nicht ausgeführt: Build, Browser-/Screenreader-Tests, echten Sanity-Import, Vercel-End-to-End.

## Verwendete Skills

`frontend-design` (Designkonzept, Signatur «Farbkarte», Restraint-Kritik), `ui-ux-pro-max` (Design-System-Suche:
Pattern «Trust & Authority», Stil «Swiss/Minimalism»; Checkliste Touch/Fokus/Kontrast/Reduced Motion; die vorgeschlagene
Navy/Gold-Palette wurde bewusst durch die Markenfarbe aus dem Logo ersetzt). Nicht verwendet: banner-design, brand, design,
design-system, slides, ui-styling (nicht einschlägig – keine shadcn-Komponenten, keine Präsentation). Kein installierter Skill
für Next.js/Sanity/SEO/Sicherheit/Tests vorhanden – stattdessen die Next-16-Dokumentation aus `node_modules/next/dist/docs`
und die installierten Typdefinitionen von next-sanity gelesen.

## Offene Punkte

- Tests auf echten Geräten (iOS Safari, Android Chrome) stehen aus.
- Screenreader-Durchlauf (VoiceOver/NVDA) nicht durchgeführt; Struktur (Landmarks, Labels, Live-Regionen) nur im DOM geprüft.
- Alles unter «vorbereitet» (Sanity, Vercel, Studio, Vorschau, Webhook, Seed-Upload) ist erst nach Einrichtung überprüfbar.
- Inhaltliche Rückfragen an den Kunden: docs/UEBERGABE.md.
