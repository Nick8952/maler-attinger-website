"use client";
import { useId, useState, type FormEvent } from "react";

interface Props {
  email: string;
  hinweis?: string;
}

const FELDER = [
  { name: "vorname", label: "Vorname", pflicht: true, autoComplete: "given-name" },
  { name: "nachname", label: "Name", pflicht: true, autoComplete: "family-name" },
  { name: "adresse", label: "Adresse", pflicht: false, autoComplete: "street-address" },
  { name: "plz", label: "PLZ", pflicht: false, autoComplete: "postal-code", kurz: true },
  { name: "ort", label: "Ort", pflicht: false, autoComplete: "address-level2" },
  { name: "telefon", label: "Telefon", pflicht: false, autoComplete: "tel", typ: "tel" },
  { name: "email", label: "E-Mail", pflicht: true, autoComplete: "email", typ: "email" },
] as const;

/**
 * Kontaktformular ohne Versand-Backend: baut aus den Eingaben eine vorbefüllte E-Mail
 * und öffnet sie per mailto: im E-Mail-Programm. Felder wie auf der Quellseite.
 * Es wird nichts gespeichert oder übertragen; es gibt bewusst keine «gesendet»-Meldung.
 */
export function KontaktFormular({ email, hinweis }: Props) {
  const id = useId();
  const [geoeffnet, setGeoeffnet] = useState(false);

  function absenden(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const daten = new FormData(ev.currentTarget);
    const wert = (n: string) => String(daten.get(n) ?? "").trim();
    const angaben = [
      `Vorname: ${wert("vorname")}`,
      `Name: ${wert("nachname")}`,
      wert("adresse") ? `Adresse: ${wert("adresse")}` : null,
      wert("plz") || wert("ort") ? `PLZ / Ort: ${[wert("plz"), wert("ort")].filter(Boolean).join(" ")}` : null,
      wert("telefon") ? `Telefon: ${wert("telefon")}` : null,
      `E-Mail: ${wert("email")}`,
    ].filter((z): z is string => z !== null);
    const zeilen = [...angaben, "", "Bemerkung / Anfrage:", wert("bemerkung")];
    const betreff = `Anfrage über die Website – ${wert("vorname")} ${wert("nachname")}`.trim();
    const href = `mailto:${email}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(zeilen.join("\n"))}`;
    window.location.href = href;
    setGeoeffnet(true);
  }

  return (
    // Ohne JavaScript: action=mailto (Browser öffnet das E-Mail-Programm mit den Feldern als Text) –
    // es wird nie etwas an den Hosting-Server gesendet. Mit JavaScript baut `absenden` eine lesbare Nachricht.
    <form onSubmit={absenden} action={`mailto:${email}`} method="post" encType="text/plain" className="grid gap-5 sm:grid-cols-2">
      {FELDER.map((f) => (
        <div key={f.name} className={"kurz" in f && f.kurz ? "sm:col-span-1" : f.name === "adresse" || f.name === "email" ? "sm:col-span-2" : ""}>
          <label htmlFor={`${id}-${f.name}`} className="block text-sm font-semibold">
            {f.label}
            {f.pflicht ? <span className="text-bordeaux"> *</span> : <span className="font-normal text-tinte-2"> (optional)</span>}
          </label>
          <input
            id={`${id}-${f.name}`}
            name={f.name}
            type={"typ" in f ? f.typ : "text"}
            required={f.pflicht}
            autoComplete={f.autoComplete}
            inputMode={f.name === "plz" ? "numeric" : undefined}
            className="mt-1.5 min-h-12 w-full rounded border border-rahmen bg-kalk px-3.5 py-2.5 text-tinte placeholder:text-tinte-2/60 focus:border-tinte"
          />
        </div>
      ))}
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-bemerkung`} className="block text-sm font-semibold">
          Bemerkung / Anfrage<span className="text-bordeaux"> *</span>
        </label>
        <textarea
          id={`${id}-bemerkung`}
          name="bemerkung"
          required
          rows={6}
          className="mt-1.5 w-full rounded border border-rahmen bg-kalk px-3.5 py-2.5 text-tinte focus:border-tinte"
        />
      </div>
      <div className="sm:col-span-2">
        <p className="text-sm text-tinte-2">* Pflichtfelder</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button type="submit" className="knopf knopf-primaer">
            E-Mail vorbereiten
          </button>
          <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center text-bordeaux underline underline-offset-4">
            oder direkt an {email}
          </a>
        </div>
        <p role="status" aria-live="polite" className="mt-4 text-sm text-tinte-2">
          {geoeffnet
            ? "Ihr E-Mail-Programm sollte sich jetzt mit der vorbereiteten Nachricht geöffnet haben. Bitte prüfen und dort absenden – erst dann ist die Anfrage unterwegs. Falls sich nichts öffnet, kopieren Sie die Angaben in eine E-Mail an " + email + "."
            : hinweis}
        </p>
      </div>
    </form>
  );
}
