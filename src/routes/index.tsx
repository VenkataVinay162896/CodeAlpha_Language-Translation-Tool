import { createFileRoute } from "@tanstack/react-router";
import { TranslatorPage } from "@/components/translator/TranslatorPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Language Translation Tool" },
      {
        name: "description",
        content:
          "Translate text between 25+ languages instantly. Free, fast, and privacy-friendly with local history and dark mode.",
      },
      { property: "og:title", content: "Language Translation Tool" },
      {
        property: "og:description",
        content:
          "Translate text between 25+ languages instantly. Free, fast, and privacy-friendly.",
      },
    ],
  }),
  component: TranslatorPage,
});
