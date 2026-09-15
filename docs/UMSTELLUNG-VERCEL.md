# Checkliste: GitHub Pages → Vercel (+ Sanity, Kundendomain)

Alle Punkte betreffen die spätere Umstellung. Solange sie offen sind, läuft die Demo unverändert auf GitHub Pages.

## Konfiguration

- [ ] `DEPLOY_TARGET=vercel` in Vercel setzen → `next.config.ts` verzichtet auf `output: 'export'`, `basePath`, `trailingSlash`
      und den Stub für `next-sanity/visual-editing` (alles automatisch über `lib/deploy-ziel.ts`).
- [ ] `CONTENT_SOURCE=sanity` + Sanity-Variablen (docs/SANITY-VERCEL-EINRICHTUNG.md). Ohne Projekt-ID bricht der Build ab – gewollt.
- [ ] Build Command `npm run build:vercel`.
- [ ] `SITE_URL` auf die tatsächliche Domain setzen (Canonical, Open Graph, JSON-LD `url`).

## Pfade und Assets

- [ ] Unterpfad entfällt: `assetUrl()` liefert dann wurzelrelative Pfade; `next/link` ohne Präfix. Nichts im Code zu ändern.
- [ ] Bilder: mit `CONTENT_SOURCE=sanity` kommen alle Bilder vom Sanity-CDN (`sanity/bild.ts`, Hotspot/Crop aktiv).
      `public/images/` wird nur noch für lokale Inhalte gebraucht; kann bleiben.
- [ ] Optional: `components/Bild.tsx` auf `next/image` mit Vercel-Optimierer umstellen (aktuell `<img srcset>`, funktioniert auf beiden Zielen).

## Domain

- [ ] Vercel → Domains: `maler-attinger.ch` + `www.maler-attinger.ch` hinzufügen; DNS beim Registrar des Kunden (A/ALIAS + CNAME laut Vercel).
- [ ] Weiterleitung `maler-attinger.ch` → `www` (oder umgekehrt) in Vercel festlegen.
- [ ] Alte PHP-Adressen weiterleiten (in `next.config.ts` → `redirects()`, nur im Vercel-Modus möglich):
      `/index.php → /`, `/about.php → /ueber-uns`, `/angebot.php → /angebot`, `/umbau.php → /renovation-umbau`,
      `/arbeiten.php → /innen-aussenarbeiten`, `/kontakt.php → /kontakt`, `/links.php → /links`,
      `/impressum.php → /impressum`, `/datenschutz.php → /datenschutz` (alle 301).
- [ ] GitHub-Pages-Demo danach abschalten oder mit Hinweis «umgezogen» stehen lassen (bleibt `noindex`).

## SEO

- [ ] `INDEXIERUNG=1` setzen → Meta-Robots `index, follow`; vorher **nicht** (Demo bleibt aus dem Index).
- [ ] `app/sitemap.ts` und `app/robots.ts` ergänzen (bewusst nicht in der Demo: `robots.txt` im Unterpfad wirkt auf GitHub Pages nicht,
      und eine Sitemap für eine noindex-Seite wäre widersprüchlich). Sitemap aus `getAlleSeitenSlugs()`.
- [ ] Google Search Console: Domain bestätigen, Sitemap einreichen, alte URLs prüfen.
- [ ] Google Business Profile des Kunden auf die neue Adresse zeigen lassen (falls vorhanden).
- [ ] JSON-LD (`lib/seo.ts`) bleibt; ggf. `openingHoursSpecification` ergänzen, sobald der Kunde Öffnungszeiten nennt.

## Datenschutz und Rechtstexte

- [ ] **Impressum**: Demo-Betreiber-Abschnitt entfernen; Kunde als Betreiber; Rechtsform und ggf. Handelsregister-Angaben vom Kunden bestätigen lassen.
- [ ] **Datenschutzerklärung** neu fassen (Rechtstext-Dokument im Studio) – mindestens:
  - Verantwortlicher = Attinger Maler + Tapeziergeschäft.
  - Hosting **Vercel Inc.** (USA; Serverstandort/Region, Data-Privacy-Framework-Status prüfen; Vercel-Logs/IP-Adressen).
  - **Sanity** (Sanity AS, Norwegen/EU – Datenlage prüfen): liefert Inhalte und Bilder (`cdn.sanity.io`) → beim Seitenaufruf wird
    das Sanity-CDN kontaktiert (IP-Adresse). Kein Cookie für Besucher; Draft-Mode-Cookie nur für Redakteure.
  - E-Mail-Kontakt (bleibt `mailto`, solange kein Formularversand eingebaut wird).
  - Betroffenenrechte, Stand, Ansprechperson.
- [ ] **Cookie-Banner**: erst nötig, wenn ein einwilligungspflichtiger Dienst dazukommt (Analytics, Karte, Video, externe Schriften).
  Dann einen echten Einwilligungsdialog («Alle akzeptieren» / «Nur notwendige» / «Einstellungen», gleichwertig, nichts vorausgewählt,
  Dienste erst nach Einwilligung laden, Widerruf über «Datenschutz-Einstellungen» im Footer) anstelle von
  `components/DatenschutzEinstellungen.tsx` einbauen. Die alte Website nutzte Google Analytics – **nicht** ohne Banner übernehmen.
- [ ] Kontaktformular mit echtem Versand (z. B. Vercel Function + E-Mail-Dienst) → Datenschutzerklärung um den Dienst, Spam-Schutz und Speicherung ergänzen.

## Inhaltsaktualisierung

- [ ] Sanity-Webhook → `/api/revalidate` (Tag `inhalt`), Secret gesetzt (docs/SANITY-VERCEL-EINRICHTUNG.md, Abschnitt 7).
- [ ] Neue Seiten: Deploy Hook oder `dynamicParams = true`.
- [ ] `data/*.json` bleibt als Backup/Ausgangszustand im Repo; nach dem Import ist Sanity die Quelle der Wahrheit.

## Nach dem Umzug testen

- [ ] Alle Seiten direkt aufrufen und neu laden, 404 prüfen, Weiterleitungen der alten PHP-URLs.
- [ ] Studio-Login des Kunden, Publish → Website aktualisiert.
- [ ] Externe Requests erneut protokollieren (jetzt: Vercel + `cdn.sanity.io`) und mit der Datenschutzerklärung abgleichen.
