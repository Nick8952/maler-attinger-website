import type { ReactNode } from "react";

interface Props {
  kurzzeile?: string;
  titel?: string;
  text?: string;
  id?: string;
  hintergrund?: "kalk" | "grundierung";
  children: ReactNode;
  /** Titelzeile schmal halten (Lesetext) */
  schmal?: boolean;
}

/** Einheitlicher Abschnittskopf für alle Bausteine: Etikett, Titel, optionaler Text. */
export function Abschnitt({ kurzzeile, titel, text, id, hintergrund = "kalk", children, schmal }: Props) {
  return (
    <section id={id} className={`py-abschnitt ${hintergrund === "grundierung" ? "bg-grundierung" : ""}`} aria-labelledby={titel && id ? `${id}-titel` : undefined}>
      <div className="container-seite">
        {(kurzzeile || titel || text) && (
          <header className={`erscheinen mb-10 ${schmal ? "max-w-[44rem]" : "max-w-[52rem]"}`}>
            {kurzzeile && <p className="schrift-etikett text-bordeaux">{kurzzeile}</p>}
            {titel && (
              <h2 id={id ? `${id}-titel` : undefined} className="schrift-display mt-3 text-display-md">
                {titel}
              </h2>
            )}
            {text && <p className="mt-4 text-lead text-tinte-2">{text}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
