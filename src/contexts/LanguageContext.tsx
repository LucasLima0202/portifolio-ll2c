import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { siteContent, type SiteContent } from "@/data/siteContent";

export type Language = "pt" | "en";

const STORAGE_KEY = "language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const isLanguage = (value: string | null): value is Language =>
  value === "pt" || value === "en";

const getInitialLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isLanguage(stored) ? stored : "en";
  } catch {
    return "en";
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // localStorage unavailable (e.g. privacy mode) — language just won't persist
    }
  }, [language]);

  const setLanguage = (next: Language) => setLanguageState(next);
  const toggleLanguage = () =>
    setLanguageState((current) => (current === "pt" ? "en" : "pt"));

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }
  return context;
};

export const useSiteContent = (): SiteContent => {
  const { language } = useLanguage();
  return siteContent[language];
};
