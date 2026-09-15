import Link from "next/link";
import type { Einstellungen } from "@/lib/content/types";
import { Bild } from "./Bild";
import { DatenschutzEinstellungen } from "./DatenschutzEinstellungen";
import { telefonInternational } from "@/lib/seo";

export function Fusszeile({ e }: { e: Einstellungen }) {
  return (
    <footer className="mt-abschnitt">
      {/* Partner-/Verbandsleiste – auf der Quellseite auf jeder Seite sichtbar */}
      <section aria-labelledby="partner-titel" className="border-t border-linie bg-grundierung">
        <div className="container-seite py-10">
          <h2 id="partner-titel" className="schrift-etikett text-tinte-2">
            Umweltschutz, Ökologie und Verbände
          </h2>
          <ul className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {e.partner.map((p) => (
              <li key={p.url}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-11 items-center gap-4 rounded hover:text-bordeaux"
                >
                  {p.logo ? (
                    <Bild bild={p.logo} sizes="64px" className="h-16 w-16 shrink-0 rounded object-contain bg-kalk p-1 ring-1 ring-linie" />
                  ) : (
                    <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-kalk ring-1 ring-linie">
                      <span className="linienraster block h-8 w-8" />
                    </span>
                  )}
                  <span>
                    <span className="block font-semibold group-hover:underline">{p.titel}</span>
                    {p.beschreibung && <span className="block text-sm text-tinte-2">{p.beschreibung}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="bg-tinte text-white">
        <div className="container-seite grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="schrift-display text-2xl">{e.firmenname}</p>
            <p className="mt-2 text-white/80">
              {e.inhaber}
              <br />
              {e.adresse.strasse}
              <br />
              {e.adresse.plz} {e.adresse.ort}
            </p>
            <div aria-hidden="true" className="linienraster-hell mt-6 h-6 w-40" />
          </div>
          <div>
            <h2 className="schrift-etikett text-white/60">Kontakt</h2>
            <ul className="mt-3 space-y-1">
              <li>
                <a href={`tel:${telefonInternational(e.telefon)}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  Tel. {e.telefon}
                </a>
              </li>
              {e.mobil && (
                <li>
                  <a href={`tel:${telefonInternational(e.mobil)}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                    Mobil {e.mobil}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${e.email}`} className="inline-flex min-h-11 items-center break-all underline-offset-4 hover:underline">
                  {e.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="schrift-etikett text-white/60">Rechtliches</h2>
            <ul className="mt-3 space-y-1">
              {e.rechtslinks.map((l) => (
                <li key={l.ziel}>
                  <Link href={l.ziel} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                    {l.titel}
                  </Link>
                </li>
              ))}
              <li>
                <DatenschutzEinstellungen />
              </li>
            </ul>
          </div>
        </div>
        {e.demoHinweis && (
          <div className="border-t border-white/15">
            <p className="container-seite py-4 text-sm text-white/70">{e.demoHinweis}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
