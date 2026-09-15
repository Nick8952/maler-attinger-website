import type { Baustein, Einstellungen } from "@/lib/content/types";
import { Abschnitt } from "../Abschnitt";
import { RichText } from "../RichText";
import { Bild } from "../Bild";
import { Galerie } from "../Galerie";
import { SmartLink } from "../SmartLink";
import { KontaktFormular } from "../KontaktFormular";
import { telefonInternational } from "@/lib/seo";

/**
 * Rendert die Bausteinliste einer Seite. Jeder Baustein kennt nur seine Daten aus lib/content –
 * woher sie kommen (JSON oder Sanity), ist hier unsichtbar.
 */
export function Bausteine({ bausteine, e }: { bausteine: Baustein[]; e: Einstellungen }) {
  return (
    <>
      {bausteine.map((b, i) => {
        const hintergrund = b._type === "aufrufBaustein" || b._type === "leistungenBaustein" ? "grundierung" : "kalk";
        const id = b._key;
        switch (b._type) {
          case "textBaustein":
            return (
              <Abschnitt key={id} id={id} kurzzeile={b.kurzzeile} titel={b.titel} schmal>
                <RichText inhalt={b.inhalt} className={`erscheinen ${b.breite === "normal" ? "" : "max-w-[44rem]"}`} />
              </Abschnitt>
            );

          case "rechtstextBaustein":
            return (
              <Abschnitt key={id} id={id} kurzzeile="Rechtliches" titel={b.rechtstext.titel} text={b.rechtstext.stand ? `Stand: ${datumFormatieren(b.rechtstext.stand)}` : undefined} schmal>
                <RichText inhalt={b.rechtstext.inhalt} className="max-w-[44rem]" />
              </Abschnitt>
            );

          case "leistungenBaustein":
            return (
              <Abschnitt key={id} id={id} kurzzeile={b.kurzzeile} titel={b.titel} text={b.einleitung} hintergrund={hintergrund}>
                <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                  {b.leistungen.map((l, n) => (
                    <li key={l.id} className="erscheinen">
                      <article className="flex h-full flex-col overflow-hidden rounded bg-kalk ring-1 ring-linie">
                        <Bild bild={l.bild} sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 50vw, 100vw" className="aspect-[3/2] w-full object-cover" />
                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex items-baseline gap-3">
                            <span className="schrift-eng text-sm font-semibold tabular-nums text-bordeaux" aria-hidden="true">
                              {String(n + 1).padStart(2, "0")}
                            </span>
                            <h3 className="schrift-display text-xl">{l.titel}</h3>
                          </div>
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {l.punkte.map((p) => (
                              <li key={p} className="schrift-eng rounded-full bg-grundierung px-3 py-1 text-[0.9rem] font-medium">
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </article>
                    </li>
                  ))}
                </ol>
              </Abschnitt>
            );

          case "galerieBaustein": {
            const liste = b.maximal ? b.referenzen.slice(0, b.maximal) : b.referenzen;
            return (
              <Abschnitt key={id} id={id} kurzzeile={b.kurzzeile} titel={b.titel} text={b.text}>
                <Galerie referenzen={liste} darstellung={b.darstellung} mitFilter={!b.maximal} />
                {b.weiterLink && (
                  <p className="erscheinen mt-8">
                    <SmartLink href={b.weiterLink.ziel} className="knopf knopf-sekundaer">
                      {b.weiterLink.titel}
                      <Pfeil />
                    </SmartLink>
                  </p>
                )}
              </Abschnitt>
            );
          }

          case "spaltenBaustein":
            return (
              <Abschnitt key={id} id={id} kurzzeile={b.kurzzeile} titel={b.titel}>
                <div className={`grid gap-8 md:grid-cols-2 ${b.spalten.length >= 4 ? "lg:grid-cols-4" : b.spalten.length === 3 ? "lg:grid-cols-3" : ""}`}>
                  {b.spalten.map((s) => (
                    <div key={s._key} className="erscheinen border-t-2 border-bordeaux pt-4">
                      <h3 className="schrift-display text-xl">{s.titel}</h3>
                      <RichText inhalt={s.inhalt} className={`mt-3 text-[1rem] ${s.alsZeitstrahl ? "zeitstrahl" : ""}`} />
                    </div>
                  ))}
                </div>
              </Abschnitt>
            );

          case "kontaktBaustein":
            return (
              <Abschnitt key={id} id={id} kurzzeile={b.kurzzeile} titel={b.titel} text={b.einleitung}>
                <div className="grid gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <address className="not-italic">
                      <p className="schrift-display text-xl">{e.inhaber}</p>
                      <p className="mt-1 text-tinte-2">
                        {e.firmenname}
                        <br />
                        {e.adresse.strasse}
                        <br />
                        {e.adresse.plz} {e.adresse.ort}
                      </p>
                      <ul className="mt-5 space-y-2">
                        <li>
                          <a href={`tel:${telefonInternational(e.telefon)}`} className="inline-flex min-h-11 items-center gap-2 font-semibold hover:text-bordeaux">
                            <span className="schrift-etikett w-14 text-tinte-2">Tel.</span> {e.telefon}
                          </a>
                        </li>
                        {e.mobil && (
                          <li>
                            <a href={`tel:${telefonInternational(e.mobil)}`} className="inline-flex min-h-11 items-center gap-2 font-semibold hover:text-bordeaux">
                              <span className="schrift-etikett w-14 text-tinte-2">Mobil</span> {e.mobil}
                            </a>
                          </li>
                        )}
                        <li>
                          <a href={`mailto:${e.email}`} className="inline-flex min-h-11 items-center gap-2 font-semibold break-all hover:text-bordeaux">
                            <span className="schrift-etikett w-14 shrink-0 text-tinte-2">Mail</span> {e.email}
                          </a>
                        </li>
                      </ul>
                    </address>
                    {b.bild && (
                      <Bild bild={b.bild} sizes="(min-width: 64rem) 30vw, 100vw" className="mt-8 hidden aspect-[4/5] w-full rounded object-cover lg:block" />
                    )}
                  </div>
                  <div className="erscheinen lg:col-span-8">
                    <KontaktFormular email={e.email} hinweis={b.formularHinweis} />
                  </div>
                </div>
              </Abschnitt>
            );

          case "linklisteBaustein":
            return (
              <Abschnitt key={id} id={id} kurzzeile={b.kurzzeile} titel={b.titel} schmal>
                <ul className="divide-y divide-linie border-y border-linie">
                  {b.links.map((l) => (
                    <li key={l._key} className="erscheinen">
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid min-h-14 items-center gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6"
                      >
                        <span>
                          <span className="block font-semibold group-hover:text-bordeaux group-hover:underline">{l.titel}</span>
                          {l.beschreibung && <span className="block text-[0.95rem] text-tinte-2">{l.beschreibung}</span>}
                        </span>
                        <span className="schrift-eng inline-flex items-center gap-1 text-sm text-tinte-2">
                          {l.url.replace(/^https?:\/\//, "")}
                          <Pfeil />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Abschnitt>
            );

          case "bildBaustein":
            return (
              <section key={id} className="container-seite py-abschnitt">
                <figure className="erscheinen">
                  <Bild bild={b.bild} sizes="(min-width: 76rem) 76rem, 100vw" className="aspect-[16/9] w-full rounded object-cover object-[30%_center]" />
                  {b.bild.bildunterschrift && <figcaption className="mt-3 text-sm text-tinte-2">{b.bild.bildunterschrift}</figcaption>}
                </figure>
              </section>
            );

          case "aufrufBaustein":
            return (
              <section key={id} className={`py-abschnitt ${i === bausteine.length - 1 ? "bg-bordeaux text-white" : "bg-grundierung"}`}>
                <div className="container-seite erscheinen grid items-end gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-8">
                    {b.kurzzeile && <p className={`schrift-etikett ${i === bausteine.length - 1 ? "text-white/70" : "text-bordeaux"}`}>{b.kurzzeile}</p>}
                    {b.titel && <h2 className="schrift-display mt-3 text-display-md">{b.titel}</h2>}
                    {b.text && <p className={`mt-4 max-w-[40rem] text-lead ${i === bausteine.length - 1 ? "text-white/85" : "text-tinte-2"}`}>{b.text}</p>}
                  </div>
                  <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
                    <SmartLink href={b.knopf.ziel} className={`knopf ${i === bausteine.length - 1 ? "bg-white text-bordeaux hover:bg-grundierung" : "knopf-primaer"}`}>
                      {b.knopf.titel}
                    </SmartLink>
                    {b.zweiterKnopf && (
                      <SmartLink
                        href={b.zweiterKnopf.ziel}
                        className={`knopf ${i === bausteine.length - 1 ? "text-white shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.5)] hover:shadow-[inset_0_0_0_1.5px_#fff]" : "knopf-sekundaer"}`}
                      >
                        {b.zweiterKnopf.titel}
                      </SmartLink>
                    )}
                  </div>
                </div>
              </section>
            );
        }
      })}
    </>
  );
}

function Pfeil() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function datumFormatieren(iso: string): string {
  const [j, m, t] = iso.split("-").map(Number);
  if (!j || !m || !t) return iso;
  return `${t}. ${["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"][m - 1]} ${j}`;
}
