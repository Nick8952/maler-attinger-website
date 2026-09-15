# Übergabe – Demo Attinger Maler- + Tapeziergeschäft

## Links

- Demo (öffentlich, ohne Login): https://nick8952.github.io/maler-attinger-website/
- Repository: https://github.com/Nick8952/maler-attinger-website
- Quellseite: https://www.maler-attinger.ch/

## Was ist fertig, was ist vorbereitet

| Bereich | Status |
|---|---|
| Statische Demo auf GitHub Pages, 9 Seiten + 404, Deutsch | **fertig, geprüft** (docs/PRUEFBERICHT.md) |
| Inhalte 1:1 übernommen, Inventur mit Widersprüchen | **fertig** (docs/INHALTSINVENTUR.md) |
| Impressum (Demo-Betreiber getrennt), Datenschutzerklärung, Datenschutz-Einstellungen | **fertig für die Demo**; für die Kundenwebsite neu zu fassen |
| Inhaltsschnittstelle mit lokalem Provider | **fertig** |
| Sanity-Schemas, Sanity-Provider (GROQ), Studio-Route, Vorschau, Webhook, Seed-Skript | **vorbereitet** – kompiliert lokal, **nicht** gegen ein echtes Projekt getestet |
| Vercel-Betriebsart (`npm run build:vercel`) | **vorbereitet** – Build läuft lokal mit Platzhalter-Projekt-ID durch |

## Wer macht was bei Interesse des Kunden

1. Nick: Sanity-Projekt + Vercel-Projekt anlegen, Import (docs/SANITY-VERCEL-EINRICHTUNG.md).
2. Nick + Kunde: Inhalte prüfen (offene Punkte unten), Rechtstexte für die echte Website, Domain umziehen (docs/UMSTELLUNG-VERCEL.md).
3. Kunde: pflegt Texte/Bilder im Studio unter `/studio` (Rolle Editor, Login mit E-Mail).

## Unabhängige Übergabe an den Kunden (später)

- **Code**: GitHub-Repo auf eine Organisation/ein Konto des Kunden übertragen (*Settings → Transfer*) oder als ZIP exportieren (`git archive`).
- **Inhalte**: Sanity-Projekt übertragen (*Manage → Settings → Transfer project*). Backup jederzeit mit
  `npx sanity@latest dataset export production backup.tar.gz` (enthält Dokumente und Bilder).
  Zusätzlich liegen alle Ausgangsinhalte in `data/` und alle Originalbilder in `assets/originale/` im Repo.
- **Hosting**: Vercel-Projekt übertragen (*Settings → Transfer*) oder Kunde als Owner eintragen; Domain-DNS liegt beim Registrar des Kunden.
- **Ohne Nick weiterbetreibbar**: Ja – alle Dienste (GitHub, Sanity, Vercel) sind Standardprodukte mit eigener Anmeldung; keine Abhängigkeit von Nicks Konten, sobald übertragen.

## Technische Wartung

- Abhängigkeiten: `npm outdated` / `npm update` etwa vierteljährlich; Next.js-Major-Updates mit Blick auf `AGENTS.md` (Next-Regeln) einspielen.
- Vor jedem Deploy: `npm run typecheck && npm run lint && npm run inhalt:pruefen && npm run build:pages`.
- GitHub-Actions-Workflow (`.github/workflows/pages.yml`) baut ohne Geheimnisse; bei Fehlern im Actions-Tab nachsehen.
- Bilder neu berechnen nach Änderungen in `assets/originale/`: `npm run bilder`.

## Offene Angaben / vom Kunden zu klären

1. **Aktuelles VUM-Umweltschutz-Zertifikat** – das Bild auf der alten Website ist bis 4.11.2020 befristet und trägt eine alte Adresse (Mutschellenstrasse 69a). Aussage «zertifiziert» bestätigen lassen.
2. **Rechtsform / Handelsregister** – nicht auf der alten Website; nicht erfunden. Für ein Kunden-Impressum nachfragen.
3. **Öffnungszeiten / Erreichbarkeit**, **Preise/Preisbedingungen**, **Kundenstimmen** – existieren nicht auf der Quellseite; nur ergänzen, wenn der Kunde sie liefert.
4. **Bessere Fotos** – die vorhandenen sind klein (teils 398×266 px). Originale in voller Auflösung vom Kunden erbitten.
5. **Schreibweise des Firmennamens** («Maler + Tapeziergeschäft» vs. «Maler- + Tapeziergeschäft») festlegen.
6. **Postadresse des Demo-Betreibers** – im Demo-Impressum steht nur Name + E-Mail (von Nick so gewünscht). Falls eine ladungsfähige Anschrift gewünscht ist, in `data/rechtstexte/impressum.json` ergänzen.

## Rechtlich prüfen (nicht anwaltlich geprüft)

- Demo-Impressum und -Datenschutzerklärung: nach bestem Wissen für GitHub Pages formuliert (DSG; DSGVO nur soweit anwendbar). Keine Garantie.
- Nutzung der Fotos/des Logos des Kunden in einer öffentlichen Demo: Rechteinhaber ist der Kunde; die Demo weist darauf hin und wird auf Wunsch entfernt. Bei Ablehnung Demo offline nehmen (`gh repo edit --visibility private` oder Pages deaktivieren).
- Für die Kundenwebsite: Datenschutzerklärung komplett neu (Vercel, Sanity, ggf. Formularversand, ggf. Analytics mit Einwilligung), siehe docs/UMSTELLUNG-VERCEL.md.
