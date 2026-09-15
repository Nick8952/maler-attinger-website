"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { KATEGORIE_TITEL, type Referenz, type ReferenzKategorie } from "@/lib/content/types";
import { Bild } from "./Bild";

interface Props {
  referenzen: Referenz[];
  darstellung: "farbkarte" | "bildstrecke";
  /** Filterchips nur, wenn mehr als eine Kategorie vorkommt */
  mitFilter?: boolean;
}

/**
 * Galerie mit zwei Darstellungen:
 * - Farbkarte: Kacheln wie Farbtonkarten (Foto + Farbchip + Farbwert), filterbar nach Kategorie.
 * - Bildstrecke: grosse Bilder untereinander/zweispaltig mit Bildunterschrift.
 * Beide öffnen eine Lightbox (<dialog>, Pfeiltasten, Esc).
 */
export function Galerie({ referenzen, darstellung, mitFilter = true }: Props) {
  const kategorien = useMemo(() => [...new Set(referenzen.map((r) => r.kategorie))], [referenzen]);
  const [filter, setFilter] = useState<ReferenzKategorie | "alle">("alle");
  const sichtbar = filter === "alle" ? referenzen : referenzen.filter((r) => r.kategorie === filter);
  const [offen, setOffen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const filterId = useId();
  const zeigeFilter = mitFilter && kategorien.length > 1;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (offen !== null && !d.open) d.showModal();
    if (offen === null && d.open) d.close();
  }, [offen]);

  const weiter = (schritt: number) =>
    setOffen((i) => (i === null ? null : (i + schritt + sichtbar.length) % sichtbar.length));

  return (
    <div>
      {zeigeFilter && (
        <div role="group" aria-labelledby={filterId} className="erscheinen mb-8 flex flex-wrap items-center gap-2">
          <span id={filterId} className="schrift-etikett mr-2 text-tinte-2">
            Filter
          </span>
          {(["alle", ...kategorien] as const).map((k) => {
            const aktiv = filter === k;
            return (
              <button
                key={k}
                type="button"
                aria-pressed={aktiv}
                onClick={() => setFilter(k)}
                className={`schrift-eng inline-flex min-h-11 items-center rounded-full border px-4 text-[0.95rem] font-medium transition-colors ${
                  aktiv ? "border-bordeaux bg-bordeaux text-white" : "border-linie bg-kalk text-tinte hover:border-tinte"
                }`}
              >
                {k === "alle" ? `Alle (${referenzen.length})` : `${KATEGORIE_TITEL[k]} (${referenzen.filter((r) => r.kategorie === k).length})`}
              </button>
            );
          })}
        </div>
      )}

      {darstellung === "farbkarte" ? (
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:gap-6" aria-live="polite">
          {sichtbar.map((r, i) => (
            <li key={r.id} className="erscheinen">
              <button
                type="button"
                onClick={() => setOffen(i)}
                className="group block w-full overflow-hidden rounded bg-kalk text-left ring-1 ring-linie transition-shadow duration-200 hover:shadow-lg focus-visible:shadow-lg"
                aria-label={`${r.bild.alt} – vergrössern`}
              >
                <Bild bild={r.bild} sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 33vw, 50vw" className="aspect-[4/3] w-full object-cover" />
                <span className="flex items-stretch gap-3 p-2.5 sm:p-3">
                  <span
                    aria-hidden="true"
                    className="w-9 shrink-0 self-stretch rounded-sm ring-1 ring-black/10 transition-[width] duration-300 ease-aus group-hover:w-14 sm:w-11"
                    style={{ backgroundColor: r.bild.farbton }}
                  />
                  <span className="min-w-0">
                    <span className="schrift-etikett block text-tinte-2">{KATEGORIE_TITEL[r.kategorie]}</span>
                    <span className="schrift-eng mt-1 block text-sm font-semibold tabular-nums uppercase">{r.bild.farbton}</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ol className="grid gap-6 md:grid-cols-2 lg:gap-8" aria-live="polite">
          {sichtbar.map((r, i) => (
            <li key={r.id} className={`erscheinen ${i % 3 === 0 ? "md:col-span-2" : ""}`}>
              <figure>
                <button
                  type="button"
                  onClick={() => setOffen(i)}
                  className="block w-full overflow-hidden rounded ring-1 ring-linie hover:shadow-lg"
                  aria-label={`${r.bild.alt} – vergrössern`}
                >
                  <Bild
                    bild={r.bild}
                    sizes={i % 3 === 0 ? "(min-width: 76rem) 76rem, 100vw" : "(min-width: 48rem) 50vw, 100vw"}
                    className={`w-full object-cover ${i % 3 === 0 ? "aspect-[21/10]" : "aspect-[4/3]"}`}
                  />
                </button>
                <figcaption className="mt-2 flex items-baseline justify-between gap-3 text-sm text-tinte-2">
                  <span>
                    <span className="schrift-eng font-semibold tabular-nums text-tinte">{String(i + 1).padStart(2, "0")}</span>
                    {" · "}
                    {r.bild.alt}
                  </span>
                  {r.bildunterschrift && <span className="schrift-etikett shrink-0">{r.bildunterschrift}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      )}

      <dialog
        ref={dialog}
        aria-label="Bild vergrössert"
        className="sperrt-scrollen m-auto h-dvh max-h-none w-full max-w-none bg-tinte p-0 backdrop:bg-tinte/90"
        onClose={() => setOffen(null)}
        onClick={(ev) => {
          if (ev.target === dialog.current) setOffen(null);
        }}
        onKeyDown={(ev) => {
          if (ev.key === "ArrowRight") weiter(1);
          if (ev.key === "ArrowLeft") weiter(-1);
        }}
      >
        {offen !== null && sichtbar[offen] && (
          <div className="flex h-full flex-col text-white">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p className="schrift-eng min-w-0 truncate text-sm text-white/85">
                <span className="font-semibold tabular-nums">{offen + 1}/{sichtbar.length}</span>
                {" · "}
                {KATEGORIE_TITEL[sichtbar[offen].kategorie]}
                {sichtbar[offen].bildunterschrift ? ` · ${sichtbar[offen].bildunterschrift}` : ""}
              </p>
              <button
                type="button"
                onClick={() => setOffen(null)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded hover:bg-white/10"
                aria-label="Schliessen"
                autoFocus
              >
                <svg width="24" height="24" viewBox="0 0 22 22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l12 12M17 5L5 17" />
                </svg>
              </button>
            </div>
            <figure className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
              <Bild key={sichtbar[offen].id} bild={sichtbar[offen].bild} sizes="100vw" className="max-h-full w-auto max-w-full rounded object-contain" />
              <figcaption className="sr-only">{sichtbar[offen].bild.alt}</figcaption>
              {sichtbar.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => weiter(-1)}
                    aria-label="Vorheriges Bild"
                    className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-tinte/70 hover:bg-bordeaux sm:left-4"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => weiter(1)}
                    aria-label="Nächstes Bild"
                    className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-tinte/70 hover:bg-bordeaux sm:right-4"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
                  </button>
                </>
              )}
            </figure>
            <p className="px-4 pb-4 text-center text-sm text-white/85 sm:px-6">
              <span className="inline-block h-3 w-3 -mb-px mr-2 rounded-sm ring-1 ring-white/30" style={{ backgroundColor: sichtbar[offen].bild.farbton }} aria-hidden="true" />
              {sichtbar[offen].bild.alt}
            </p>
          </div>
        )}
      </dialog>
    </div>
  );
}
