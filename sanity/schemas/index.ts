import { adresseTyp, bildTyp, linkTyp, partnerTyp, richTextTyp } from "./objekte";
import { bausteine } from "./bausteine";
import { einstellungenTyp, leistungTyp, rechtstextTyp, referenzTyp, seiteTyp } from "./dokumente";

export const schemaTypes = [
  // Objekte
  bildTyp,
  linkTyp,
  richTextTyp,
  adresseTyp,
  partnerTyp,
  ...bausteine,
  // Dokumente
  einstellungenTyp,
  seiteTyp,
  leistungTyp,
  referenzTyp,
  rechtstextTyp,
];
