# Spätere Einrichtung: Sanity (CMS) und Vercel (Hosting)

Status: **vorbereitet, nicht eingerichtet.** Nichts in diesem Dokument wurde gegen ein echtes Sanity-Projekt oder
Vercel-Projekt getestet. Lokal geprüft wurde: `npm run build:vercel` kompiliert mit Studio- und API-Routen
(mit Platzhalter-Projekt-ID und lokalen Inhalten), `npm run seed -- --probe` stellt alle 49 Dokumente zusammen.

Voraussetzungen: Sanity-Konto (sanity.io), Vercel-Konto, Zugriff auf das GitHub-Repo `Nick8952/maler-attinger-website`.

## 1. Sanity-Projekt anlegen

1. `npx sanity@latest login` (Browser-Login).
2. Projekt anlegen – **eigenes Projekt**, nicht das einer anderen Demo:
   `npx sanity@latest projects create "Maler Attinger"` oder unter https://www.sanity.io/manage → *Create project*.
   Dataset `production` (public ist in Ordnung: nur veröffentlichte Website-Inhalte).
3. Projekt-ID notieren (z. B. `ab12cd34`).
4. Tokens unter *Manage → API → Tokens*:
   - `Viewer`-Token → `SANITY_API_READ_TOKEN` (Vorschau)
   - `Editor`-Token → `SANITY_API_WRITE_TOKEN` (nur für den Import, danach löschen oder lokal behalten)
5. CORS unter *Manage → API → CORS origins*: `http://localhost:3000` (mit Credentials) und später die Vercel-/Kundendomain.

## 2. Lokal verbinden

```bash
cp .env.example .env.local
# eintragen: DEPLOY_TARGET=vercel, CONTENT_SOURCE=sanity, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET=production,
#            SANITY_API_READ_TOKEN, SANITY_API_WRITE_TOKEN, SANITY_REVALIDATE_SECRET (frei wählen, z. B. `openssl rand -hex 24`)
```

## 3. Inhalte importieren

```bash
npm run seed -- --probe   # zeigt, was angelegt würde (49 Dokumente, 45 Bilder)
npm run seed              # legt nur fehlende Dokumente an – überschreibt nichts
npm run seed -- --force   # ersetzt die vom Skript verwalteten Dokumente (nur bei Bedarf)
```

Der Import lädt die Originale aus `assets/originale/` als Sanity-Assets hoch (einmalig; Sanity erkennt identische
Dateien) und schreibt die Dokumente **direkt als veröffentlicht**. Deterministische IDs: `einstellungen`,
`seite-<slug>`, `leistung-*`, `referenz-*`, `rechtstext-*`.

## 4. Studio lokal prüfen

```bash
npm run dev:vercel      # Studio: http://localhost:3000/studio
```

Prüfen: Einstellungen (Einzeldokument), Seiten, Leistungen, Referenzbilder, Rechtstexte. Presentation-Tool
(Vorschau) funktioniert erst, wenn `SANITY_API_READ_TOKEN` gesetzt ist – siehe Schritt 6.

## 5. Vercel-Projekt

1. https://vercel.com/new → GitHub-Repo importieren. Framework Next.js wird erkannt.
2. **Build Command** überschreiben: `npm run build:vercel` (kopiert die Server-Routen nach `app/`).
3. Environment Variables (Production + Preview):
   `DEPLOY_TARGET=vercel`, `CONTENT_SOURCE=sanity`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
   `NEXT_PUBLIC_SANITY_API_VERSION=2026-09-15`, `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`,
   `SITE_URL=https://<projekt>.vercel.app`. **Kein** `BASE_PATH`, **kein** `INDEXIERUNG` (bleibt noindex bis Go-Live).
4. Deploy. Danach prüfen: Startseite, alle Unterseiten, `/studio` (Login), `/api/revalidate` (POST ohne Signatur → 401).
5. Sanity CORS um die Vercel-Domain ergänzen (mit Credentials), sonst lädt das Studio nicht.

## 6. Vorschau und Visual Editing

- `sanity.config.ts` enthält das Presentation-Tool mit `previewMode.enable = /api/vorschau/aktivieren`.
  `next-sanity` prüft dort das Vorschau-Geheimnis automatisch (Studio und Website müssen dieselbe Projekt-ID nutzen).
- Ablauf: Studio → *Presentation* → Seite wählen → Draft Mode wird gesetzt → Website rendert Entwürfe (`perspective: drafts`,
  ungecacht) und zeigt das Visual-Editing-Overlay (`lib/vorschau/VorschauWerkzeuge.tsx`) samt «Vorschau beenden».
- Für Vercel Preview-Deployments dieselben Variablen setzen.
- Stega-Markierungen werden in Metadaten/JSON-LD entfernt (`stegaClean` in `lib/seo.ts`).

## 7. Inhaltsaktualisierung (ISR + Webhook)

- Veröffentlichte Inhalte werden mit Cache-Tag `inhalt` gecacht (`lib/content/sanity.ts`).
- Sanity → *Manage → API → Webhooks → Create*: URL `https://<domain>/api/revalidate`, Dataset `production`,
  Trigger *Create/Update/Delete*, Projection `{_type}`, HTTP POST, **Secret = `SANITY_REVALIDATE_SECRET`**.
- Test: im Studio einen Text ändern → Publish → Seite neu laden (Sekunden).
- **Neue Seiten (neuer Slug)**: `app/[slug]/page.tsx` hat `dynamicParams = false` (Pflicht für den statischen Export).
  Auf Vercel erscheinen neue Slugs deshalb erst nach einem Rebuild. Zwei Optionen: (a) in Vercel einen *Deploy Hook*
  anlegen und als zweiten Sanity-Webhook für `_type == "seite"` eintragen, oder (b) `dynamicParams` auf `true` setzen,
  sobald der GitHub-Pages-Export nicht mehr gebraucht wird.

## 8. Zugriffsrechte

- Sanity → *Manage → Members*: Kunde als **Editor** einladen (kann Inhalte pflegen, keine Schemas/Tokens).
- Nick bleibt Administrator. Für die endgültige Übergabe kann das Projekt auf eine Organisation des Kunden übertragen werden
  (*Manage → Settings → Transfer*).
- Vercel: Kunde optional als Member; Domain-Verwaltung siehe docs/UMSTELLUNG-VERCEL.md.

## 9. Was erst nach der Einrichtung überprüfbar ist

- GROQ-Abfragen in `lib/content/sanity.ts` gegen echte Daten (Struktur ist mit `data/` identisch, aber ungetestet).
- Studio-Oberfläche, Validierungen, deutsche Sprachdatei, Presentation-Tool, Draft Mode, Webhook-Signaturprüfung.
- Seed-Upload (nur `--probe` lokal geprüft).
