// Einzige Stelle, an der Betriebsart, Unterpfad und öffentliche URL festgelegt werden.
// Wird von next.config.ts (Build) und von der Anwendung (Laufzeit) gelesen.
//
// Standard ohne Env-Variablen = GitHub-Pages-Demo unter dem Repository-Unterpfad.
// Für Vercel: DEPLOY_TARGET=vercel (dann kein Unterpfad, SITE_URL = Vercel-/Kundendomain).
export type DeployZiel = "pages" | "vercel";

const REPO_NAME = "maler-attinger-website";
const GITHUB_KONTO = "nick8952";

export const deployZiel: DeployZiel = process.env.DEPLOY_TARGET === "vercel" ? "vercel" : "pages";

export const basePath: string =
  deployZiel === "vercel" ? "" : (process.env.BASE_PATH ?? `/${REPO_NAME}`).replace(/\/$/, "");

export const siteUrl: string =
  process.env.SITE_URL?.replace(/\/$/, "") ??
  (deployZiel === "vercel" ? "https://maler-attinger-website.vercel.app" : `https://${GITHUB_KONTO}.github.io${basePath}`);
