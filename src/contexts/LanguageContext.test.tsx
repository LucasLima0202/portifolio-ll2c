import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { LanguageProvider, useLanguage, useSiteContent } from "./LanguageContext";

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to English when localStorage has no stored language", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe("en");
  });

  it("reads a previously stored language on init", () => {
    localStorage.setItem("language", "pt");
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe("pt");
  });

  it("falls back to English when the stored value is not a valid language", () => {
    localStorage.setItem("language", "fr");
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe("en");
  });

  it("toggleLanguage flips the language and persists it to localStorage", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.toggleLanguage();
    });
    expect(result.current.language).toBe("pt");
    expect(localStorage.getItem("language")).toBe("pt");

    act(() => {
      result.current.toggleLanguage();
    });
    expect(result.current.language).toBe("en");
    expect(localStorage.getItem("language")).toBe("en");
  });

  it("useSiteContent returns the content object matching the current language", () => {
    const { result } = renderHook(
      () => ({ ...useLanguage(), content: useSiteContent() }),
      { wrapper }
    );

    expect(result.current.content.contact.buttonText).toBe("Send a Message");

    act(() => {
      result.current.toggleLanguage();
    });

    expect(result.current.content.contact.buttonText).toBe("Mande uma Mensagem");
  });

  it("useLanguage throws when called outside a LanguageProvider", () => {
    expect(() => renderHook(() => useLanguage())).toThrow(
      "useLanguage must be used within a LanguageProvider."
    );
  });
});
