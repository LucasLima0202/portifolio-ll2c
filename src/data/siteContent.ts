import { ptContent } from "./content/pt";
import { enContent } from "./content/en";
import type { SiteContent } from "./content/pt";

export const siteContent: Record<"pt" | "en", SiteContent> = {
  pt: ptContent,
  en: enContent,
};

export type { SiteContent };
