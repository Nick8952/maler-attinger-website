"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Link as LinkTyp } from "@/lib/content/types";

interface Props {
  navigation: LinkTyp[];
  telefon: string;
  telefonLink: string;
  email: string;
}

/** Menü-Sheet für schmale Bildschirme: natives <dialog>, Tastatur + Screenreader inklusive. */
export function MobilMenue({ navigation, telefon, telefonLink, email }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const pfad = usePathname();

  // Beim Seitenwechsel schliessen
  useEffect(() => {
    ref.current?.close();
  }, [pfad]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center gap-2 rounded px-3 py-2 font-semibold text-tinte hover:bg-grundierung"
        onClick={() => ref.current?.showModal()}
        aria-haspopup="dialog"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h16M3 11h16M3 16h16" />
        </svg>
        Menü
      </button>
      <dialog
        ref={ref}
        aria-label="Menü"
        className="sperrt-scrollen m-0 h-dvh max-h-none w-full max-w-none bg-kalk p-0 text-tinte backdrop:bg-tinte/70 sm:ml-auto sm:w-[26rem]"
        onClick={(ev) => {
          if (ev.target === ref.current) ref.current?.close();
        }}
      >
        <div className="flex h-full flex-col border-t-[3px] border-bordeaux">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="schrift-etikett text-tinte-2">Menü</span>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded hover:bg-grundierung"
              onClick={() => ref.current?.close()}
              aria-label="Menü schliessen"
              autoFocus
            >
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 5l12 12M17 5L5 17" />
              </svg>
            </button>
          </div>
          <nav aria-label="Hauptnavigation" className="px-2">
            <ul>
              {navigation.map((l) => {
                const aktiv = l.ziel === "/" ? pfad === "/" : pfad?.startsWith(l.ziel);
                return (
                  <li key={l.ziel}>
                    <Link
                      href={l.ziel}
                      aria-current={aktiv ? "page" : undefined}
                      className={`schrift-display flex min-h-12 items-center rounded px-3 py-2 text-2xl hover:bg-grundierung ${aktiv ? "text-bordeaux" : ""}`}
                    >
                      {l.titel}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-auto space-y-3 border-t border-linie px-5 py-6">
            <a href={telefonLink} className="knopf knopf-primaer w-full">
              {telefon} anrufen
            </a>
            <a href={`mailto:${email}`} className="knopf knopf-sekundaer w-full">
              {email}
            </a>
          </div>
        </div>
      </dialog>
    </div>
  );
}
