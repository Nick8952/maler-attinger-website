import type { Bild as BildTyp } from "@/lib/content/types";
import { Bild } from "./Bild";

/** Seitenkopf der Unterseiten: schmales Kopfbild (aus der Quellseite) und Titel auf dem Linienraster. */
export function Seitenkopf({ titel, kopfbild }: { titel: string; kopfbild?: BildTyp }) {
  return (
    <section className="relative">
      {kopfbild && (
        <Bild bild={kopfbild} sizes="100vw" priority className="h-40 w-full object-cover sm:h-56 lg:h-72" />
      )}
      <div className="container-seite relative">
        <div className="flex items-end gap-5 pt-8 lg:pt-12">
          <span aria-hidden="true" className="linienraster hidden h-16 w-10 shrink-0 sm:block" />
          <h1 className="schrift-display text-display-lg">{titel}</h1>
        </div>
      </div>
    </section>
  );
}
