import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { inhaltsquelle } from "@/lib/content";
import { seitenMetadata } from "@/lib/seo";
import { Seitenkopf } from "@/components/Seitenkopf";
import { Hero } from "@/components/Hero";
import { Bausteine } from "@/components/bausteine/Bausteine";

/**
 * Alle Unterseiten kommen aus dem Inhaltsmodell «seite». Im statischen Export werden
 * sie über generateStaticParams vollständig aufgezählt; neue Seiten brauchen dort einen Rebuild.
 * Auf Vercel (ISR) können später auch neue Slugs ohne Rebuild erscheinen – dafür
 * `dynamicParams` in docs/UMSTELLUNG-VERCEL.md beachten.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await (await inhaltsquelle()).getAlleSeitenSlugs();
  return slugs.filter((s) => s !== "start").map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const q = await inhaltsquelle();
  const [seite, e] = await Promise.all([q.getSeite(slug), q.getEinstellungen()]);
  return seite ? seitenMetadata(seite, e) : {};
}

export default async function Unterseite({ params }: Props) {
  const { slug } = await params;
  if (slug === "start") notFound();
  const q = await inhaltsquelle();
  const [seite, e] = await Promise.all([q.getSeite(slug), q.getEinstellungen()]);
  if (!seite) notFound();
  return (
    <>
      {seite.hero ? <Hero hero={seite.hero} farbfaecher={[]} /> : <Seitenkopf titel={seite.titel} kopfbild={seite.kopfbild} />}
      <Bausteine bausteine={seite.bausteine} e={e} />
    </>
  );
}
