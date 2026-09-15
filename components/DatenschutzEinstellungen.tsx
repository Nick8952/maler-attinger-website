"use client";
import { useRef } from "react";
import Link from "next/link";

/**
 * «Datenschutz-Einstellungen» – bewusst ohne Schalter: Diese Demo setzt keine Cookies,
 * nutzt keinen Browser-Speicher und lädt nichts von Drittanbietern. Es gibt also nichts,
 * in das eingewilligt oder das widerrufen werden könnte. Statt eines irreführenden
 * Banners zeigt dieser Dialog transparent den tatsächlichen Stand.
 * Kommt später ein einwilligungspflichtiger Dienst dazu (z. B. Karte, Analytics),
 * gehört hier ein echter Einwilligungsdialog hin (siehe docs/UMSTELLUNG-VERCEL.md).
 */
export function DatenschutzEinstellungen() {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="inline-flex min-h-11 items-center text-left underline-offset-4 hover:underline"
        aria-haspopup="dialog"
      >
        Datenschutz-Einstellungen
      </button>
      <dialog
        ref={ref}
        aria-labelledby="ds-titel"
        className="sperrt-scrollen m-auto w-[calc(100%-2rem)] max-w-xl rounded-lg bg-kalk p-0 text-tinte shadow-2xl backdrop:bg-tinte/70"
        onClick={(ev) => {
          if (ev.target === ref.current) ref.current?.close();
        }}
      >
        <form method="dialog" className="border-t-[3px] border-bordeaux p-6 sm:p-8">
          <p className="schrift-etikett text-tinte-2">Datenschutz-Einstellungen</p>
          <h2 id="ds-titel" className="schrift-display mt-2 text-2xl">
            Hier gibt es nichts einzustellen – und das ist Absicht.
          </h2>
          <dl className="mt-6 divide-y divide-linie border-y border-linie text-[0.95rem]">
            <Zeile begriff="Cookies" wert="Keine. Weder notwendige noch optionale." />
            <Zeile begriff="Browser-Speicher" wert="Keiner (kein Local Storage, kein Session Storage)." />
            <Zeile begriff="Statistik / Tracking" wert="Keine Analyse- oder Werbedienste." />
            <Zeile begriff="Inhalte von Drittanbietern" wert="Keine. Schriften, Bilder und Skripte kommen von dieser Website selbst." />
            <Zeile begriff="Hosting" wert="GitHub Pages protokolliert beim Aufruf Ihre IP-Adresse zu Sicherheitszwecken. Das lässt sich technisch nicht abwählen." />
            <Zeile begriff="Kontaktformular" wert="Öffnet nur Ihr E-Mail-Programm. Diese Website speichert und sendet nichts." />
          </dl>
          <p className="mt-5 text-sm text-tinte-2">
            Weil keine einwilligungspflichtigen Dienste im Einsatz sind, gibt es keinen Cookie-Banner und keine Schalter, die nichts bewirken würden.
            Details: <Link href="/datenschutz" className="text-bordeaux underline underline-offset-4">Datenschutzerklärung</Link>.
          </p>
          <div className="mt-6 flex justify-end">
            <button type="submit" className="knopf knopf-primaer" autoFocus>
              Schliessen
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

function Zeile({ begriff, wert }: { begriff: string; wert: string }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="font-semibold">{begriff}</dt>
      <dd className="text-tinte-2">{wert}</dd>
    </div>
  );
}
