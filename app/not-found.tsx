import Link from "next/link";
import { inhaltsquelle } from "@/lib/content";

export const metadata = { title: "Seite nicht gefunden" };

/** 404 – wird im Export als 404.html ausgegeben; GitHub Pages liefert sie bei unbekannten Adressen. */
export default async function NichtGefunden() {
  const e = await (await inhaltsquelle()).getEinstellungen();
  return (
    <section className="container-seite py-abschnitt">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="schrift-etikett text-bordeaux">Fehler 404</p>
          <h1 className="schrift-display mt-3 text-display-lg">Diese Wand gibt es hier nicht.</h1>
          <p className="mt-5 max-w-[34rem] text-lead text-tinte-2">
            Die Adresse ist falsch geschrieben oder die Seite wurde verschoben. Über das Menü finden Sie alles Weitere – oder Sie rufen direkt an.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="knopf knopf-primaer">
              Zur Startseite
            </Link>
            <Link href="/kontakt" className="knopf knopf-sekundaer">
              Kontakt
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="hidden lg:col-span-5 lg:block">
          <div className="grid grid-cols-3 gap-2">
            {["#b45718", "#195170", "#adb752", "#7287af", "#993135", "#8a7819"].map((f) => (
              <span key={f} className="aspect-square rounded-sm" style={{ backgroundColor: f }} />
            ))}
          </div>
          <p className="schrift-etikett mt-3 text-tinte-2">Farbtöne aus Aufträgen von {e.kurzname}</p>
        </div>
      </div>
    </section>
  );
}
