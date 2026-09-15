"use client";
/**
 * Sanity Studio – wird unter /studio eingebettet, sobald DEPLOY_TARGET=vercel gesetzt ist
 * (siehe server-routes/app/studio). In der GitHub-Pages-Demo ist das Studio nicht enthalten.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId, studioUrl } from "./sanity/env";
import { deDELocale } from "@sanity/locale-de-de";

export default defineConfig({
  name: "maler-attinger",
  title: "Maler Attinger – Inhalte",
  basePath: studioUrl,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    deDELocale(),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Inhalte")
          .items([
            S.listItem().title("Website-Einstellungen").id("einstellungen").child(S.document().schemaType("einstellungen").documentId("einstellungen")),
            S.divider(),
            S.documentTypeListItem("seite").title("Seiten"),
            S.documentTypeListItem("leistung").title("Leistungen"),
            S.documentTypeListItem("referenz").title("Referenzbilder"),
            S.documentTypeListItem("rechtstext").title("Rechtstexte"),
          ]),
    }),
    presentationTool({
      previewUrl: {
        previewMode: { enable: "/api/vorschau/aktivieren", disable: "/api/vorschau/beenden" },
      },
      resolve: {
        mainDocuments: [{ route: "/:slug", filter: `_type == "seite" && slug.current == $slug` }, { route: "/", filter: `_type == "seite" && slug.current == "start"` }],
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // Einstellungen sind ein Einzeldokument: nicht duplizieren/löschen.
    actions: (prev, ctx) => (ctx.schemaType === "einstellungen" ? prev.filter((a) => !["duplicate", "delete", "unpublish"].includes(a.action ?? "")) : prev),
  },
});
