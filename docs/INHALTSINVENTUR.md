# Inhaltsinventur – maler-attinger.ch → Demo

Quelle: https://www.maler-attinger.ch/ (abgerufen 15.09.2026, nur Deutsch, keine Sprachversionen).
Technik der Quellseite: PHP + Bootstrap 4, jQuery, Google Fonts (Roboto Condensed), Google Analytics (G-98Q42RQSCH),
Bootstrap-Karussells, PHP-Kontaktformular (`kontakt2.php`). Keine Karten, Videos, Downloads, Buchungslinks oder Preise.

Status: ✅ übernommen · ✏️ sprachlich angepasst (Inhalt gleich) · ⚠️ Widerspruch/prüfen · ❌ nicht übernommen (Grund)

## Seiten

| Quell-URL | Zielseite (Demo) | Inhalt | Status |
|---|---|---|---|
| /index.php | `/` | Nur ein Foto (Andreas Attinger mit Firmenwagen) + Partnerleiste + Footer; keine Texte | ✅ Foto als Hero; Hero-Text und Startseiten-Abschnitte aus Fakten der Unterseiten zusammengestellt (Gründung 1965, Übernahme 2002, Kreis 2, Leistungen, Mitgliedschaften) |
| /about.php | `/ueber-uns/` | «50 Jahre Tradition» (2 Absätze), Aus- und Weiterbildung (5 Einträge), Mitgliedschaften/Netzwerk (3), Spezielles (3) | ✅ wörtlich; Spaltentitel «Seit 1965» statt «50 Jahre Tradition» (2026 sind es 61 Jahre; der Text «über 50-jährige Tradition» bleibt wörtlich, Abschnittstitel «Über 50 Jahre Tradition») |
| /angebot.php | `/angebot/` | 6 Leistungen mit je 2–3 Stichworten + Bild | ✅ wörtlich (Titel, Stichworte, Bilder) |
| /umbau.php | `/renovation-umbau/` | Karussell, 12 Fotos, Bildtext «Umbau Rieterplatz 5, Zürich» | ✅ als Bildstrecke in numerischer Dateireihenfolge (1, 2, 4, 6, 7, 8, 10, 13, 14, 17, 19, 20); Alt-Texte neu beschrieben (Quelle hatte für alle denselben Alt-Text) |
| /arbeiten.php | `/innen-aussenarbeiten/` | Karussell, 19 Fotos; Alt-Texte «Wohnungen» (12), «Fassaden/Treppen» (4), «Garagen» (3) | ✅ als Farbkarte in Karussell-Reihenfolge, Kategorien aus den Alt-Texten, Filter; beschreibende Alt-Texte neu |
| /kontakt.php | `/kontakt/` | Name, Firma, Adresse, Tel., Mobil, Mail; Formular (Vorname*, Name*, Adresse, PLZ, Ort, Telefon, Email*, Bemerkung/Anfrage*) | ✅ Angaben wörtlich; Formular mit identischen Feldern, aber `mailto:` statt PHP-Versand («E-Mail vorbereiten») |
| /links.php | `/links/` | 6 Links mit Beschreibung | ✅ wörtlich; Adressen auf https vereinheitlicht |
| /impressum.php | `/impressum/` | Firma, Adresse, E-Mail, Vertretungsberechtigt, UID, Haftung, Links, Urheberrecht («Quelle: BrainBox Solutions») | ⚠️ Für die Demo neu strukturiert: Demo-Betreiber (Nick Holzbecher) getrennt vom dargestellten Unternehmen; Haftungs-/Link-/Urheberrechtsabsätze sinngemäss übernommen. Originaltext siehe unten. |
| /datenschutz.php | `/datenschutz/` | Generischer Text (DSG-Verweis, Cookies, Server-Logs, Google Analytics mit Privacy Shield, Google WebFonts, Tag Manager, Haftung) | ❌ nicht kopiert (beschreibt Dienste, die die Demo nicht nutzt, und verweist auf den ungültigen Privacy Shield). Neue Erklärung für die tatsächliche Demo (GitHub Pages, mailto, keine Cookies). Originaltext siehe unten. |
| (nicht vorhanden) | `/datenschutz/` + Dialog «Datenschutz-Einstellungen» | – | ✅ neu (sachliche Informationsansicht statt Cookie-Banner, siehe Begründung in docs/PRUEFBERICHT.md) |
| (nicht vorhanden) | 404 | – | ✅ neu, gestaltet |

## Wiederkehrende Elemente

| Element | Quelle | Demo | Status |
|---|---|---|---|
| Logo `images/attinger.png` | Kopf jeder Seite | Kopfzeile, Favicon (AA-Zeichen aus `apple-touch-icon.png`) | ✅ Originaldatei |
| Navigation: Home, Über uns, Angebot, Renovation / Umbau, Innenarbeiten / Aussenarbeiten, Kontakt, Links | jede Seite | Start, Über uns, Angebot, Renovation / Umbau, Innen- & Aussenarbeiten, Kontakt, Links | ✏️ Beschriftungen gekürzt |
| Partnerleiste: Umweltschutz (VUM), Ökologie (Stiftung Farbe), Züri2, Malerverband (ZMV) | jede Seite | Footer «Zertifiziert und vernetzt», gleiche 4 Links | ✅; Bilder: Umweltetikette + Züri2-Logo übernommen, VUM-Zertifikat und ZMV-Broschüren-Screenshot **nicht** (siehe Widersprüche) |
| Footer: Andreas Attinger · Maler- und Tapeziergeschäft · Hoffnungsstrasse 3 · 8038 Zürich · Tel./Mobil/Mail · Datenschutz · Impressum | jede Seite | Footer mit denselben Angaben + Datenschutz-Einstellungen + Demo-Hinweis | ✅ |
| Kopfbilder `heder_about.jpg`, `header_arbeiten.jpg`, `header_kontakt.png` | Über uns, Angebot, Kontakt | Seitenkopf derselben Seiten | ✅ |
| `kontakt_rechts.jpg` | Kontakt (rechte Spalte) | Kontakt + Hero (Handy, Hochformat) | ✅ |
| Google Analytics G-98Q42RQSCH | alle Seiten | – | ❌ bewusst weggelassen (Tracking; würde Einwilligung erfordern) |
| Google Fonts Roboto Condensed | alle Seiten | Archivo lokal | ❌ ersetzt (neues Design, keine externen Requests) |
| Meta-Keywords | index.php | – | ❌ (von Suchmaschinen ignoriert); Description übernommen/angepasst |

## Fakten (verifiziert auf der Quellseite)

Firma: Attinger Maler + Tapeziergeschäft (Logo: «Attinger Maler- + Tapeziergeschäft») · Inhaber: Andreas Attinger ·
Hoffnungsstrasse 3, 8038 Zürich · Tel. 043 399 96 60 · Mobil 079 209 59 82 · info@maler-attinger.ch ·
UID/MWST CHE-115.768.145 MWST · gegründet 1965 von Werner Attinger · Übernahme 2002 · Mitglied ZMV, Gewerbeverein Zürich 2,
Zunft Wollishofen seit 1995 (Bannerherr seit 2000) · zertifiziert VUM · Schweizer Umweltetikette · Spezialist Glasfasertapeten.

**Nicht vorhanden auf der Quellseite (und deshalb nicht in der Demo):** Öffnungszeiten, Preise, Kundenbewertungen,
Team ausser Andreas Attinger, Kurstermine, Downloads, Karte, Buchungslinks, Social-Media-Profile, Handelsregisterauszug.

## Widersprüche, Veraltetes, Prüfbedarf

1. **VUM-Zertifikat (`umweltschutz.png`)**: Scan zeigt «Andreas Attinger Malergeschäft, Mutschellenstrasse 69a, 8002 Zürich»
   (andere Adresse als Hoffnungsstrasse 3) und «gilt … längstens bis zum 4. November 2020». Enthält Unterschriften.
   → In der Demo nicht gezeigt; der Text «Zertifiziert durch die VUM» wurde als Aussage der Quellseite übernommen.
   **Kunde fragen:** aktuelles Zertifikat vorhanden? Sonst Formulierung anpassen.
2. **Firmenname** uneinheitlich: «Attinger Maler +Tapeziergeschäft» (Impressum), «Attinger Maler- + Tapeziergeschäft»
   (Logo, Kontakt), «Maler- und Tapeziergeschäft» (Footer). → Demo verwendet die Logo-Schreibweise; Impressum zitiert die Impressums-Schreibweise.
3. **«50 Jahre Tradition»** ist 2026 überholt (61 Jahre). → Titel «Über 50 Jahre Tradition», Text unverändert.
4. **`malerverband.png`** ist kein Logo, sondern ein Screenshot eines ZMV-Textes («Mut zur Farbe …») → nicht verwendet.
5. **Link-Tippfehler** auf der Quellseite: `href="https//www.zueri2.ch"` (fehlender Doppelpunkt) → in der Demo korrigiert.
6. **Stiftung Farbe** wird mit zwei Domains verlinkt (stiftungfarbe.org in der Partnerleiste, stiftungfarbe.ch auf /links) → beide beibehalten wie in der Quelle.
7. **Datenschutzerklärung der Quellseite** nennt Google Analytics mit Privacy Shield (seit 2020 ungültig) und Tag Manager
   → nicht übernommen; für die Kundenwebsite später neu prüfen (docs/UMSTELLUNG-VERCEL.md).
8. **Impressum** nennt keine Rechtsform. Demo erfindet keine. UID stammt vom Impressum der Quellseite (nicht extern verifiziert).
9. **Bildmaterial** ist teilweise klein (Leistungsbilder 398×266, Kopfbilder 1200×313) → auf grossen Bildschirmen leicht unscharf. Kunde könnte Originale liefern.

## Originaltexte der Rechtsseiten (unverändert, zur Dokumentation)

<details><summary>impressum.php (Quelle, 15.09.2026)</summary>

Attinger Maler +Tapeziergeschäft · Hoffnungsstrasse 3 · 8038 Zürich · Schweiz · E-Mail: info@maler-attinger.ch
Vertretungsberechtigte Personen: Andreas Attinger · Name des Unternehmens: Attinger Maler +Tapeziergeschäft ·
Registrationsnummer: CHE-115.768.145 · Umsatzsteuer-Identifikationsnummer: CHE-115.768.145 MWST

Haftungsausschluss: Der Autor übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen. Alle Angebote sind freibleibend. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.

Haftungsausschluss für Inhalte und Links: Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr des jeweiligen Nutzers.

Urheberrechtserklärung: Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser Website, gehören ausschliesslich Attinger Maler +Tapeziergeschäft oder den speziell genannten Rechteinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung des Urheberrechtsträgers im Voraus einzuholen. Quelle: BrainBox Solutions
</details>

<details><summary>datenschutz.php (Quelle, 15.09.2026) – Abschnittsübersicht</summary>

Abschnitte: Verantwortliche Stelle (wie Impressum) · Allgemein (Art. 13 BV, DSG) · Cookies · Server-Log-Dateien
(Browsertyp, Betriebssystem, Referrer, Hostname, Zeitpunkt) · Urheberrechte · Haftungsausschluss · Google Analytics
(Google Ireland/LLC, anonymizeIp, EU-US Privacy Shield, Opt-out-Plugin) · Google WebFonts · Google TagManager · Haftungsausschluss · Quelle: BrainBox Solutions.
Der vollständige Wortlaut liegt in der Session-Bestandsaufnahme vor und kann bei Bedarf erneut von der Quelle geholt werden;
er wird bewusst nicht in die Demo übernommen.
</details>
