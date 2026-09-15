import type { Hero as HeroTyp, Referenz } from "@/lib/content/types";
import { Bild } from "./Bild";
import { SmartLink } from "./SmartLink";

/**
 * Hero der Startseite: links Aussage und Knöpfe vor dem Linienraster des Logos,
 * rechts das Foto mit dem «Farbfächer» – Farbchips aus echten Aufträgen, die zur Farbkarte führen.
 */
export function Hero({ hero, farbfaecher }: { hero: HeroTyp; farbfaecher: Referenz[] }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="linienraster pointer-events-none absolute left-0 top-0 hidden h-full w-[6vw] max-w-24 lg:block" />
      <div className="container-seite grid items-center gap-10 py-10 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-6 xl:col-span-5 lg:pr-4">
          {hero.kurzzeile && <p className="schrift-etikett text-bordeaux">{hero.kurzzeile}</p>}
          <h1 className="schrift-display mt-4 text-display-xl">{hero.titel}</h1>
          {hero.text && <p className="mt-6 max-w-[34rem] text-lead text-tinte-2">{hero.text}</p>}
          {(hero.knopf || hero.zweiterKnopf) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {hero.knopf && (
                <SmartLink href={hero.knopf.ziel} className="knopf knopf-primaer">
                  {hero.knopf.titel}
                </SmartLink>
              )}
              {hero.zweiterKnopf && (
                <SmartLink href={hero.zweiterKnopf.ziel} className="knopf knopf-sekundaer">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
                  </svg>
                  {hero.zweiterKnopf.titel}
                </SmartLink>
              )}
            </div>
          )}
        </div>
        {(hero.bild || hero.bildHoch) && (
          <div className="relative lg:col-span-6 xl:col-span-7">
            <figure className="relative">
              {hero.bildHoch && (
                <Bild bild={hero.bildHoch} sizes="100vw" priority className="aspect-[4/5] w-full rounded object-cover object-[35%_100%] sm:hidden" />
              )}
              {hero.bild && (
                <Bild
                  bild={hero.bild}
                  sizes="(min-width: 64rem) 58vw, 100vw"
                  priority
                  className={`aspect-[16/10] w-full rounded object-cover object-[30%_center] ${hero.bildHoch ? "hidden sm:block" : ""}`}
                />
              )}
              {/* Farbfächer: Farbtöne aus echten Aufträgen, jeder Chip führt zur Farbkarte */}
              {farbfaecher.length > 0 && (
                <ul
                  aria-label="Farbtöne aus Aufträgen – zur Farbkarte"
                  className="absolute -bottom-4 left-4 flex gap-1.5 rounded bg-kalk p-1.5 shadow-lg sm:-left-4 sm:bottom-6 sm:flex-col"
                >
                  {farbfaecher.map((r) => (
                    <li key={r.id}>
                      <SmartLink
                        href="/innen-aussenarbeiten"
                        className="block h-11 w-11 rounded-sm ring-1 ring-black/10 transition-transform duration-200 ease-aus hover:scale-110 sm:h-10 sm:w-10"
                        style={{ backgroundColor: r.bild.farbton }}
                        title={`${r.bild.farbton} – ${r.bild.alt}`}
                        aria-label={`Farbton ${r.bild.farbton}: ${r.bild.alt}`}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </figure>
          </div>
        )}
      </div>
    </section>
  );
}
