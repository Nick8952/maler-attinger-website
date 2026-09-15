import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import type { RichText as RichTextTyp } from "@/lib/content/types";
import { istExternerLink } from "@/lib/assets";

const komponenten: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      if (istExternerLink(href)) {
        const extern = href.startsWith("http");
        return (
          <a href={href} {...(extern ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {children}
          </a>
        );
      }
      return <Link href={href}>{children}</Link>;
    },
  },
};

export function RichText({ inhalt, className }: { inhalt: RichTextTyp; className?: string }) {
  return (
    <div className={`fliesstext ${className ?? ""}`}>
      <PortableText value={inhalt} components={komponenten} />
    </div>
  );
}
