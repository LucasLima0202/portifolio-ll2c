import { describe, it, expect } from "vitest";
import { ptContent } from "./pt";
import { enContent } from "./en";

describe("pt/en content parity", () => {
  it("keeps collection lengths in sync between languages", () => {
    expect(enContent.projects.length).toBe(ptContent.projects.length);
    expect(enContent.services.length).toBe(ptContent.services.length);
    expect(enContent.nav.length).toBe(ptContent.nav.length);
    expect(enContent.technologies.length).toBe(ptContent.technologies.length);
    expect(enContent.about.paragraphs.length).toBe(ptContent.about.paragraphs.length);
  });
});
