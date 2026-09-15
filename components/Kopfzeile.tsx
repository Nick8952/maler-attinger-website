import Link from "next/link";
import type { Einstellungen } from "@/lib/content/types";
import { Bild } from "./Bild";
import { MobilMenue } from "./MobilMenue";
import { telefonInternational } from "@/lib/seo";

/**
 * Kopfzeile: Lackkante (dünne Bordeaux-Linie), Logo links, Navigation rechts.
 * Unter 64rem übernimmt das Menü-Sheet (MobilMenue).
 */
export function Kopfzeile({ e }: { e: Einstellungen }) {
  return (
    <header className="sticky top-0 z-40 border-t-[3px] border-bordeaux bg-kalk/95 backdrop-blur-sm">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-bordeaux focus:px-4 focus:py-2 focus:text-white"
      >
        Zum Inhalt springen
      </a>
      <div className="container-seite flex items-center justify-between gap-6 py-3 lg:py-4">
        <Link href="/" className="flex min-h-11 shrink-0 items-center rounded" aria-label={`${e.kurzname} – zur Startseite`}>
          <Bild bild={e.logo} sizes="(min-width: 64rem) 260px, 200px" priority className="h-auto w-[200px] lg:w-[260px]" />
        </Link>
        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {e.navigation.map((l) => (
              <li key={l.ziel}>
                <Link
                  href={l.ziel}
                  className="schrift-eng inline-flex min-h-11 items-center rounded px-3 py-2 text-[0.95rem] font-medium text-tinte transition-colors hover:bg-grundierung hover:text-bordeaux"
                >
                  {l.titel}
                </Link>
              </li>
            ))}
            <li className="ml-2">
              <a href={`tel:${telefonInternational(e.telefon)}`} className="knopf knopf-primaer !min-h-11 !py-2 text-[0.95rem]">
                {e.telefon}
              </a>
            </li>
          </ul>
        </nav>
        <MobilMenue navigation={e.navigation} telefon={e.telefon} telefonLink={`tel:${telefonInternational(e.telefon)}`} email={e.email} />
      </div>
    </header>
  );
}
