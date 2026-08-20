import { useState, useEffect } from "react";
import { useLanguage, useSiteContent } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const siteContent = useSiteContent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const languageLabel = language === "pt" ? "🇧🇷 PT-BR" : "🇺🇸 EN";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <a href="#home" className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
          <span className=" rounded-md px-2 py-0.5 text-sm">
            <img src="/public/favicon.svg" width={25} />
          </span>
          {siteContent.brand}
        </a>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          {siteContent.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={toggleLanguage}
            className="text-xs border border-border rounded-full px-3 py-1 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            {languageLabel}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border px-6 py-4 space-y-4">
          {siteContent.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={toggleLanguage}
            className="text-xs border border-border rounded-full px-3 py-1 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            {languageLabel}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
