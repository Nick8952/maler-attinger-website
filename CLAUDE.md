# maler-attinger-website – Anweisungen für Claude Code

Verkaufs-Demo für **Attinger Maler- + Tapeziergeschäft, Zürich** (Malerbetrieb – **keine Fahrschule**).
Quelle der Inhalte: https://www.maler-attinger.ch/ (Stand 15.09.2026). Auftraggeber der Demo: Nick Holzbecher.
Die Next.js-Agent-Regeln aus `AGENTS.md` gelten zusätzlich (wird von `next dev` gepflegt):

@AGENTS.md

## Betriebsarten (eine Codebasis, zwei Ziele)

| | **GitHub Pages (JETZT)** | **Vercel + Sanity (SPÄTER)** |
|---|---|---|
| Build | `npm run build:pages` (= `npm run build`) | `npm run build:vercel` |
| Env | keine nötig | `DEPLOY_TARGET=vercel`, `CONTENT_SOURCE=sanity`, Sanity-Variablen (siehe `.env.example`) |
| Ausgabe | `out/` statisch, Unterpfad `/maler-attinger-website` | Server-Rendering, ISR, `/studio`, `/api/*` |
| Inhalte | `data/*.json` | Sanity Content Lake |
| Bilder | `public/images/*.webp` (vorgerechnet) | Sanity-CDN via `@sanity/image-url` |
| Status | **live, geprüft** | **vorbereitet, nicht angeschlossen** – erst nach Einrichtung prüfbar |

Umschaltung ausschliesslich über `lib/deploy-ziel.ts` (Betriebsart, Unterpfad, Site-URL) und `next.config.ts`.
Sanity- und Vercel-Projekte **nicht** anlegen und keine Zugänge verlangen – das macht Nick selbst.

## Architektur

- **Next.js 16 App Router, TypeScript, Tailwind v4**, Node ≥ 20.9 (lokal Node 26).
- Routen: `app/page.tsx` (Slug `start`), `app/[slug]/page.tsx` (alle Unterseiten, `generateStaticParams`), `app/not-found.tsx`.
- **Inhaltsschnittstelle `lib/content/`**: Komponenten importieren nur `lib/content` (Typen + `inhaltsquelle()`).
  `local.ts` liest `data/`, `sanity.ts` fragt GROQ ab – beide liefern dieselben Typen aus `types.ts`.
  Auswahl über `CONTENT_SOURCE=sanity`; fehlt dann die Projekt-ID, bricht der Build absichtlich ab.
- **Seitenbausteine** (`components/bausteine/Bausteine.tsx`): text, leistungen, galerie, spalten, kontakt, linkliste, bild, aufruf, rechtstext.
  Sanity-Schemas dazu in `sanity/schemas/` (deutsche Feldnamen, Hilfetexte, Validierung). Lokale JSON-Dateien sind
  bewusst wie Sanity-Dokumente aufgebaut (`_type`, `_key`, Portable Text).
- **Bilder**: Originale in `assets/originale/` (Herkunft: `assets/originale/HERKUNFT.md`), `npm run bilder` erzeugt
  `public/images/` + `data/bilder.json` (Masse, Varianten, Farbton). Inhalte referenzieren Bilder per Kennung.
  Ausgabe über `components/Bild.tsx` (`<img srcset>`, kein Next-Optimizer). Unterpfad nur über `lib/assets.ts#assetUrl`.
- **Server-Routen** (Studio, Webhook, Vorschau) liegen in `server-routes/app/` und werden nur beim Vercel-Build nach
  `app/` kopiert (`scripts/vercel-routen.mjs`; `app/studio`, `app/api` sind in `.gitignore`).
- **Schriften**: Archivo variabel (Gewicht + Breite) lokal aus `app/fonts/` – kein Google-Fonts-Request.
- **Rich Text**: Portable Text überall; Markdown → Portable Text mit `npm run text:konvertieren -- datei.md`.

## Befehle

```bash
npm run dev              # Entwicklung (lokale Inhalte, Unterpfad /maler-attinger-website)
npm run build:pages      # statischer Export nach out/ (Standard-Build)
npm run vorschau:pages   # out/ wie GitHub Pages ausliefern: http://localhost:4321/maler-attinger-website/
npm run typecheck && npm run lint && npm run inhalt:pruefen   # vor jedem Commit
npm run bilder           # Bildvarianten + data/bilder.json neu erzeugen
npm run build:vercel     # Vercel-Modus (kopiert server-routes → app/)
npm run seed -- --probe  # Import nach Sanity nur simulieren (erst nach Einrichtung wirklich ausführen)
```

Browser-Prüfung: puppeteer-core im Scratchpad gegen den Vorschau-Server (siehe docs/PRUEFBERICHT.md).

## Designregeln («Farbkarte»)

- Marke: Bordeaux `#a10e43` aus dem Logo; Grund Weiss/`#f3f0ec`; Text `#1c1a1b`/`#524c4d`. Tokens in `app/globals.css` (`@theme static`).
- Eine Schriftfamilie (Archivo) in drei Rollen: `schrift-display` (breit, 640), Lesetext, `schrift-etikett` (schmal, versal, gesperrt).
- Signatur: **Farbkarte** – Referenzfotos als Farbtonkarten mit Farbchip aus dem Foto; Farbfächer im Hero. Sekundär: das
  **Linienraster** des Logos als Hintergrundband (Hero, Seitenkopf, Footer). Nichts davon in anderen Demos wiederverwenden.
- Bewegung: nur CSS-Scroll-Erscheinen (`erscheinen`, `animation-timeline`) und kurze Hover-Übergänge; `prefers-reduced-motion` schaltet alles ab.
- Touch-Ziele ≥ 44 px, sichtbarer Fokus (blau `#1c50be`), Kontrast ≥ 4.5:1, keine Emojis als Icons.
- Keine erfundenen Zahlen, Bewertungen, Öffnungszeiten, Preise oder Versprechen – die Quellseite nennt keine.

## Datenschutz-Technik (Demo)

Keine Cookies, kein Browser-Speicher, keine externen Requests (geprüft mit Puppeteer-Request-Log). Deshalb **kein
Cookie-Banner**, sondern der Dialog «Datenschutz-Einstellungen» im Footer (ohne wirkungslose Schalter). Kontaktformular
nur `mailto:` («E-Mail vorbereiten»). Analytics der alten Website (Google Analytics) wurde **nicht** übernommen.
Kommt ein einwilligungspflichtiger Dienst dazu, zuerst docs/UMSTELLUNG-VERCEL.md, Abschnitt Datenschutz, lesen.

## SEO

Alle Seiten `noindex` (Demo). `robots.txt` im Unterpfad wirkt auf GitHub Pages nicht, deshalb nur Meta-Robots.
Indexierung erst mit `INDEXIERUNG=1` + `SITE_URL` auf der Kundendomain. JSON-LD `HousePainter` nur mit belegten Angaben.

## Deployment GitHub Pages

`.github/workflows/pages.yml`: Push auf `main` → Prüfungen → `build:pages` → Pages. Repo `Nick8952/maler-attinger-website` (public).
Demo-URL: https://nick8952.github.io/maler-attinger-website/

## Dokumentation

- `docs/INHALTSINVENTUR.md` – Quell-URL, Zielseite, Übernahmestatus, Widersprüche
- `docs/INHALTE-PFLEGEN.md` – lokale Demo-Inhalte pflegen
- `docs/SANITY-VERCEL-EINRICHTUNG.md` – spätere Einrichtung Schritt für Schritt
- `docs/UMSTELLUNG-VERCEL.md` – Checkliste GitHub Pages → Vercel (Pfade, Domain, SEO, Datenschutz)
- `docs/UEBERGABE.md` – Übergabe an den Kunden, Backup, Wartung, offene Punkte
- `docs/PRUEFBERICHT.md` – durchgeführte Tests, Codex-Review, offene Punkte

Keine Zugangsdaten in Dateien; Secrets nur in `.env.local` (ignoriert) bzw. Vercel-Env.
