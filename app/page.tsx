import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { inhaltsquelle } from "@/lib/content";
import { seitenMetadata } from "@/lib/seo";
import { Hero } from "@/components/Hero";
import { Bausteine } from "@/components/bausteine/Bausteine";

export async function generateMetadata(): Promise<Metadata> {
  const q = await inhaltsquelle();
  const [seite, e] = await Promise.all([q.getSeite("start"), q.getEinstellungen()]);
  return seite ? seitenMetadata(seite, e) : {};
}

export default async function Startseite() {
  const q = await inhaltsquelle();
  const [seite, e] = await Promise.all([q.getSeite("start"), q.getEinstellungen()]);
  if (!seite) notFound();
  // Farbfächer im Hero: die sechs kräftigsten Farbtöne aus den Referenzen, in Originalreihenfolge
  const alle = (await q.getReferenzen(["wohnungen", "fassaden-treppen", "garagen"])).filter((r) => r.bild.farbton);
  const kraeftigste = new Set([...alle].sort((a, b) => sattheit(b.bild.farbton!) - sattheit(a.bild.farbton!)).slice(0, 6).map((r) => r.id));
  const farbfaecher = alle.filter((r) => kraeftigste.has(r.id));
  return (
    <>
      {seite.hero && <Hero hero={seite.hero} farbfaecher={farbfaecher} />}
      <Bausteine bausteine={seite.bausteine} e={e} />
    </>
  );
}

/** Farbsättigung (Chroma) eines Hex-Werts – zum Auswählen der kräftigsten Töne. */
function sattheit(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return Math.max(r, g, b) - Math.min(r, g, b);
}
