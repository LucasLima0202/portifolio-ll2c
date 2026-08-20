# PT-BR / EN Language Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a working PT-BR / English toggle covering the entire site (including the contact form), defaulting to English, persisted via `localStorage`.

**Architecture:** A `LanguageContext` (React Context) holds the active `"pt" | "en"` language, exposed via `useLanguage()` (read/toggle) and `useSiteContent()` (returns the active language's full content object). All copy moves from the single `siteContent.ts` object into `src/data/content/pt.ts` / `en.ts`, indexed by language. Every component that currently imports `siteContent` directly switches to `useSiteContent()` instead — same property access pattern, just sourced from the hook.

**Tech Stack:** React 18 + Vite (existing), React Context (built-in, no new dependency), Vitest + Testing Library (existing, including `renderHook`).

## Global Constraints

- No new npm dependencies.
- Default language is `"en"` when `localStorage` has no valid stored value (persisted under the key `"language"`).
- Untranslated / identical in both languages: `name`, `brand`, `nav` labels, `technologies` list, `social` URLs, each project's `title`, `labels`, and `link`, and `footer.links` (dead code — rendered inside a JSX comment in `Footer.tsx`, not user-visible; keep its current English wording in both languages rather than hand-translating unseen content).
- New translatable `contact` fields (added to both `pt.ts` and `en.ts`): `namePlaceholder`, `emailPlaceholder`, `reasonPlaceholder`, `messagePlaceholder`, `sendingLabel`, `subjectPrefix`, `successToast`, `errorToast`.
- New translatable `footer` fields (added to both `pt.ts` and `en.ts`): `socialLabel`, `contactLabel`.
- `TechStackMarquee.tsx`'s bottom CTA link must read `siteContent.ctaText` (already used identically by `HeroSection`) — no new content key for it.
- `ProjectsSection.tsx` has a pre-existing, unrelated bug: the third project card's link uses `projects[1].link` instead of `projects[2].link`. Preserve this exactly when migrating the file — do not fix it.
- The exact English and Portuguese copy for every field is given verbatim in each task below — use it exactly, do not rephrase.

---

### Task 1: Split site content into pt/en data files

**Files:**
- Create: `src/data/content/pt.ts`
- Create: `src/data/content/en.ts`
- Modify: `src/data/siteContent.ts`

**Interfaces:**
- Consumes: nothing new (this task only restructures existing data).
- Produces: `export const siteContent: Record<"pt" | "en", SiteContent>` from `src/data/siteContent.ts`, and `export type SiteContent` (also re-exported from there). Later tasks import `siteContent` and `SiteContent` from `@/data/siteContent` exactly as before — only the value's shape changes (from a flat object to `{ pt, en }`).

- [ ] **Step 1: Create the Portuguese content file**

Create `src/data/content/pt.ts`:

```ts
export const ptContent = {
  name: "Lucas Lima",
  brand: "LL2C",
  title: "Full-Stack Developer",
  subtitle: "Desenvolvendo soluções digitais de alta performance com foco em automações, front-end moderno e sistemas escaláveis.",
  ctaText: "Ver Projetos",

  nav: [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],

  services: [
    {
      icon: "bot",
      title: "Automações com IA",
      description: "Criação de fluxos com IA, n8n e ManyChat",
    },
    {
      icon: "briefcase",
      title: "Serviços contratáveis",
      description: "Desenvolvimento de sites e automações",
    },
    {
      icon: "code",
      title: "Desenvolvimento Full Stack",
      description: "Aplicações modernas focadas em performance",
    },
  ],

  techSection: {
    title: "Tecnologias que utilizo",
    titleBold: "no dia a dia",
    subtitle: "Ferramentas modernas para criar soluções rápidas, eficientes e escaláveis.",
  },

  technologies: [
    "OpenAI",
    "MySQL",
    "n8n",
    "Supabase",
    "Vercel",
    "Python",
    "Discord",
    "React",
    "Airtable",
    "TypeScript",
    "Node.js",
    "GitHub",
    "Docker",
    "PostgreSQL",
    "Figma",
    "Next.js",
    "ManyChat",
    "Html",
  ],

  projectsSection: {
    title: "Meus",
    titleBold: "Projetos",
    subtitle: "Alguns dos sistemas e soluções que já desenvolvi na prática.",
  },

  projects: [
    {
      title: "Rise App",
      description: "Plataforma de gestão de tarefas, hobbys com streaks",
      labels: ["React", "Node.js", "Supabase"],
      cta: "Explorar Projeto",
      featured: true,
      link: "https://risese.netlify.app/auth",
    },
    {
      title: "ChatAI - Assistente Inteligente",
      description: "Assistente virtual com IA integrada para atendimento automatizado e gestão de tickets.",
      labels: ["OpenAI", "Python", "Supabase", "n8n"],
      cta: "Ver Detalhes",
      featured: false,
      link: "https://github.com/LucasLima0202",
    },
    {
      title: "Dashboard Controlnomy",
      description: "Painel de métricas e análise de gastos financeiros.",
      labels: ["React", "TypeScript", "Js"],
      cta: "Ver Projeto",
      featured: true,
      link: "https://github.com/LucasLima0202",
    },
  ],

  about: {
    title: "Sobre",
    role: "Sou desenvolvedor Full Stack\ncom foco Front-End e Automações.",
    paragraphs: [
      "Comecei na programação através de um curso técnico e atualmente frequentando faculdade de Sistema da Informação e desde então, venho evoluindo com formações e prática constante no mercado.",
      "Tenho experiência com projetos reais como freelancer e já atuei em ambientes de alta performance, desenvolvendo soluções para empresas com foco em resultado.",
    ],
  },

  contact: {
    buttonText: "Mande uma Mensagem",
    namePlaceholder: "Qual seu nome",
    emailPlaceholder: "Seu e-mail",
    reasonPlaceholder: "Motivo do Contato",
    messagePlaceholder: "Campo de Texto para escrever",
    sendingLabel: "Enviando...",
    subjectPrefix: "Novo contato pelo Portfólio",
    successToast: "Mensagem enviada! Vou te responder em breve.",
    errorToast: "Não foi possível enviar sua mensagem. Tente novamente.",
  },

  social: {
    twitter: "https://twitter.com",
    github: "https://github.com/LucasLima0202",
    linkedin: "https://br.linkedin.com/in/lucas-lima-cunha-824b25210",
  },

  footer: {
    copyright: "© LL2C - Lucas Lima Cunha | Todos Direitos Reservados.",
    socialLabel: "Minhas redes :",
    contactLabel: "Contato",
    links: [
      { label: "Imprint", href: "#" },
      { label: "Security", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
};

export type SiteContent = typeof ptContent;
```

- [ ] **Step 2: Create the English content file, typed against the Portuguese shape**

Create `src/data/content/en.ts`:

```ts
import type { SiteContent } from "./pt";

export const enContent: SiteContent = {
  name: "Lucas Lima",
  brand: "LL2C",
  title: "Full-Stack Developer",
  subtitle: "Building high-performance digital solutions focused on automation, modern front-end, and scalable systems.",
  ctaText: "View Projects",

  nav: [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],

  services: [
    {
      icon: "bot",
      title: "AI Automations",
      description: "Building AI-powered flows with n8n and ManyChat",
    },
    {
      icon: "briefcase",
      title: "Freelance Services",
      description: "Website and automation development",
    },
    {
      icon: "code",
      title: "Full Stack Development",
      description: "Modern, performance-focused applications",
    },
  ],

  techSection: {
    title: "Technologies I use",
    titleBold: "every day",
    subtitle: "Modern tools for building fast, efficient, and scalable solutions.",
  },

  technologies: [
    "OpenAI",
    "MySQL",
    "n8n",
    "Supabase",
    "Vercel",
    "Python",
    "Discord",
    "React",
    "Airtable",
    "TypeScript",
    "Node.js",
    "GitHub",
    "Docker",
    "PostgreSQL",
    "Figma",
    "Next.js",
    "ManyChat",
    "Html",
  ],

  projectsSection: {
    title: "My",
    titleBold: "Projects",
    subtitle: "Some of the systems and solutions I've built in practice.",
  },

  projects: [
    {
      title: "Rise App",
      description: "Task and habit-tracking platform with streaks",
      labels: ["React", "Node.js", "Supabase"],
      cta: "Explore Project",
      featured: true,
      link: "https://risese.netlify.app/auth",
    },
    {
      title: "ChatAI - Assistente Inteligente",
      description: "AI-powered virtual assistant for automated support and ticket management.",
      labels: ["OpenAI", "Python", "Supabase", "n8n"],
      cta: "View Details",
      featured: false,
      link: "https://github.com/LucasLima0202",
    },
    {
      title: "Dashboard Controlnomy",
      description: "Metrics dashboard and financial spending analysis.",
      labels: ["React", "TypeScript", "Js"],
      cta: "View Project",
      featured: true,
      link: "https://github.com/LucasLima0202",
    },
  ],

  about: {
    title: "About",
    role: "I'm a Full Stack developer\nfocused on Front-End and Automation.",
    paragraphs: [
      "I started programming through a technical course and I'm currently pursuing a degree in Information Systems, constantly growing through further training and hands-on market practice.",
      "I have real-world freelance experience and have worked in high-performance environments, building results-driven solutions for companies.",
    ],
  },

  contact: {
    buttonText: "Send a Message",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    reasonPlaceholder: "Reason for contact",
    messagePlaceholder: "Write your message here",
    sendingLabel: "Sending...",
    subjectPrefix: "New portfolio contact",
    successToast: "Message sent! I'll get back to you soon.",
    errorToast: "Couldn't send your message. Please try again.",
  },

  social: {
    twitter: "https://twitter.com",
    github: "https://github.com/LucasLima0202",
    linkedin: "https://br.linkedin.com/in/lucas-lima-cunha-824b25210",
  },

  footer: {
    copyright: "© LL2C - Lucas Lima Cunha | All Rights Reserved.",
    socialLabel: "My socials:",
    contactLabel: "Contact",
    links: [
      { label: "Imprint", href: "#" },
      { label: "Security", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
};
```

- [ ] **Step 3: Replace `siteContent.ts` with the language index**

Replace the full contents of `src/data/siteContent.ts`:

```ts
import { ptContent } from "./content/pt";
import { enContent } from "./content/en";
import type { SiteContent } from "./content/pt";

export const siteContent: Record<"pt" | "en", SiteContent> = {
  pt: ptContent,
  en: enContent,
};

export type { SiteContent };
```

- [ ] **Step 4: Verify the two content files are structurally identical**

Run: `npx tsc -b --noEmit`
Expected: no errors. (`en.ts`'s `enContent: SiteContent` annotation means a missing or mistyped key versus `pt.ts` fails here.)

Run: `npx vitest run`
Expected: the existing test suite still passes (nothing yet imports the new files, so this just confirms nothing else broke).

- [ ] **Step 5: Commit**

```bash
git add src/data/content/pt.ts src/data/content/en.ts src/data/siteContent.ts
git commit -m "feat: split site content into pt/en language files"
```

---

### Task 2: Language context, hooks, and app wiring

**Files:**
- Create: `src/contexts/LanguageContext.tsx`
- Test: `src/contexts/LanguageContext.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `siteContent`, `type SiteContent` from `@/data/siteContent` (Task 1).
- Produces:
  - `export type Language = "pt" | "en"`
  - `export const LanguageProvider: ({ children }: { children: ReactNode }) => JSX.Element`
  - `export const useLanguage: () => { language: Language; setLanguage: (language: Language) => void; toggleLanguage: () => void }` — throws `Error("useLanguage must be used within a LanguageProvider.")` outside a provider.
  - `export const useSiteContent: () => SiteContent` — returns `siteContent[language]` for the current language.
  - localStorage key used: `"language"`.

- [ ] **Step 1: Write the failing tests**

Create `src/contexts/LanguageContext.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/contexts/LanguageContext.test.tsx`
Expected: FAIL — `./LanguageContext` does not exist yet.

- [ ] **Step 3: Implement the context and hooks**

Create `src/contexts/LanguageContext.tsx`:

```tsx
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/contexts/LanguageContext.test.tsx`
Expected: PASS — all 6 tests green.

- [ ] **Step 5: Wrap the app in `LanguageProvider`**

In `src/App.tsx`, add the import and wrap the existing tree (outermost, so `Navbar` and every routed page can use the hooks):

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
```

- [ ] **Step 6: Run the full suite**

Run: `npx vitest run`
Expected: PASS (existing components still import `siteContent` directly at this point — they aren't migrated until later tasks — so this only confirms the new context and `App.tsx` compile and don't break anything).

- [ ] **Step 7: Commit**

```bash
git add src/contexts/LanguageContext.tsx src/contexts/LanguageContext.test.tsx src/App.tsx
git commit -m "feat: add language context with localStorage persistence"
```

---

### Task 3: Navbar language toggle

**Files:**
- Modify: `src/components/Navbar.tsx`
- Test: `src/components/Navbar.test.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `useSiteContent()` from `@/contexts/LanguageContext` (Task 2).
- Produces: no new exports — `Navbar` remains the default export with no props.

- [ ] **Step 1: Write the failing tests**

Create `src/components/Navbar.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "./Navbar";

const renderNavbar = () =>
  render(
    <LanguageProvider>
      <Navbar />
    </LanguageProvider>
  );

describe("Navbar language toggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to the English label and switches to Portuguese on click", () => {
    renderNavbar();

    const [toggle] = screen.getAllByRole("button", { name: /EN/ });
    fireEvent.click(toggle);

    expect(screen.getAllByRole("button", { name: /PT-BR/ }).length).toBeGreaterThan(0);
  });

  it("renders a language toggle in both the desktop menu and the opened mobile menu", () => {
    renderNavbar();

    const hamburger = screen
      .getAllByRole("button")
      .find((btn) => !/EN|PT-BR/.test(btn.textContent ?? ""));
    if (!hamburger) throw new Error("Mobile menu toggle button not found");
    fireEvent.click(hamburger);

    expect(screen.getAllByRole("button", { name: /EN/ })).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/Navbar.test.tsx`
Expected: FAIL — `Navbar` doesn't render a button with an "EN"/"PT-BR" accessible name yet (it renders a static, non-interactive badge).

- [ ] **Step 3: Implement the toggle**

Replace the full contents of `src/components/Navbar.tsx`:

```tsx
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/Navbar.test.tsx`
Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.tsx src/components/Navbar.test.tsx
git commit -m "feat: add working PT-BR/EN toggle to the navbar"
```

---

### Task 4: Migrate remaining content-consuming components

**Files:**
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/components/ServicesHighlights.tsx`
- Modify: `src/components/TechStackMarquee.tsx`
- Modify: `src/components/ProjectsSection.tsx`
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `useSiteContent()` from `@/contexts/LanguageContext` (Task 2).
- Produces: no new exports — each file keeps its existing default export and prop-less signature.

This task swaps each file's `import { siteContent } from "@/data/siteContent"` for `import { useSiteContent } from "@/contexts/LanguageContext"`, and adds `const siteContent = useSiteContent();` as the first line of the component body — every other line of JSX stays character-for-character the same, since `useSiteContent()` returns the same shape the old `siteContent` object had (plus the new `footer.socialLabel`/`footer.contactLabel` fields, and `TechStackMarquee`'s hardcoded string replaced by `siteContent.ctaText`).

No new tests — these components have no existing test coverage today, and the spec doesn't require adding any for this task; the full suite (Task 1-3's tests) and a type check are the safety net for a mechanical import swap.

- [ ] **Step 1: Migrate `HeroSection.tsx`**

Replace the full contents of `src/components/HeroSection.tsx`:

```tsx
import { useSiteContent } from "@/contexts/LanguageContext";
import { ArrowRight, Rocket } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const siteContent = useSiteContent();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/70" />

      {/* Blue glow */}
      <div className="absolute inset-0 glow-bg opacity-60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-tight animate-fade-up">
          {siteContent.name},
          <br />
          {siteContent.title}
        </h1>

        <p className="mt-6 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto animate-fade-up-delay-1">
          {siteContent.subtitle}
        </p>

        <div className="mt-10 animate-fade-up-delay-2">
          <a
            href="#projects"
            className="inline-flex items-center gap-3 bg-foreground text-background font-medium px-8 py-4 rounded-full hover:bg-foreground/90 transition-all duration-300 hover:scale-105 text-sm"
          >
            <Rocket className="w-4 h-4" />
            {siteContent.ctaText}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
```

- [ ] **Step 2: Migrate `ServicesHighlights.tsx`**

Replace the full contents of `src/components/ServicesHighlights.tsx`:

```tsx
import { useSiteContent } from "@/contexts/LanguageContext";
import { Bot, Briefcase, Code } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  bot: <Bot className="w-6 h-6" />,
  briefcase: <Briefcase className="w-6 h-6" />,
  code: <Code className="w-6 h-6" />,
};

const ServicesHighlights = () => {
  const siteContent = useSiteContent();

  return (
    <section id="services" className="relative py-8 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {siteContent.services.map((service, i) => (
            <div
              key={i}
              className="glass-card p-6 flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground bg-secondary/50">
                {iconMap[service.icon]}
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-xs mt-1">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesHighlights;
```

- [ ] **Step 3: Migrate `TechStackMarquee.tsx`**

Replace the full contents of `src/components/TechStackMarquee.tsx`. Note `techs`/`row1`/`row2` move from module scope into the component body (so they re-derive from the active language), and the bottom CTA link now reads `siteContent.ctaText` instead of the hardcoded `"Ver Projetos"`:

```tsx
import { useSiteContent } from "@/contexts/LanguageContext";

const techIcons: Record<string, string> = {
  "OpenAI": "src/assets/icon/claude.png",
  "MySQL": "https://cdn.simpleicons.org/mysql/white",
  "n8n": "https://cdn.simpleicons.org/n8n/white",
  "Supabase": "https://cdn.simpleicons.org/supabase/white",
  "Vercel": "https://cdn.simpleicons.org/vercel/white",
  "Python": "https://cdn.simpleicons.org/python/white",
  "Discord": "https://cdn.simpleicons.org/discord/white",
  "React": "https://cdn.simpleicons.org/react/white",
  "Airtable": "https://cdn.simpleicons.org/airtable/white",
  "TypeScript": "https://cdn.simpleicons.org/typescript/white",
  "Node.js": "https://cdn.simpleicons.org/nodedotjs/white",
  "GitHub": "https://cdn.simpleicons.org/github/white",
  "Docker": "https://cdn.simpleicons.org/docker/white",
  "PostgreSQL": "https://cdn.simpleicons.org/postgresql/white",
  "Figma": "https://cdn.simpleicons.org/figma/white",
  "Next.js": "https://cdn.simpleicons.org/nextdotjs/white",
  "ManyChat": "/src/assets/icon/manychat.png",
  "Html": "src/assets/icon/html.png"
};

const TechIcon = ({ name }: { name: string }) => (
  <div className="flex-shrink-0 w-14 h-14 rounded-xl border border-border flex items-center justify-center bg-secondary/30 hover:bg-secondary/60 transition-all duration-300 hover:scale-110 mx-2">
    <img
      src={techIcons[name] || `https://cdn.simpleicons.org/${name.toLowerCase().replace(/[.\s]/g, "")}/white`}
      alt={name}
      className="w-7 h-7"
      loading="lazy"
      width={28}
      height={28}
    />
  </div>
);

const TechStackMarquee = () => {
  const siteContent = useSiteContent();
  const techs = siteContent.technologies;
  const row1 = techs.slice(0, 14);
  const row2 = techs.slice(7).concat(techs.slice(0, 7));

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 glow-bg opacity-40" />

      <div className="relative z-10">
        <div className="text-center mb-16 px-6">
          <h2 className="font-display text-3xl sm:text-4xl text-muted-foreground">
            {siteContent.techSection.title}
            <br />
            <span className="text-foreground font-bold">{siteContent.techSection.titleBold}</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm max-w-lg mx-auto">
            {siteContent.techSection.subtitle}
          </p>
        </div>

        {/* Row 1 - left */}
        <div className="relative mb-4">
          <div className="absolute left-0 top-0 bottom-0 w-40 md:w-64 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-40 md:w-64 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />
          <div className="flex marquee-left">
            {[...row1, ...row1, ...row1, ...row1].map((tech, i) => (
              <TechIcon key={`r1-${i}`} name={tech} />
            ))}
          </div>
        </div>

        {/* Row 2 - right */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-40 md:w-64 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-40 md:w-64 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />
          <div className="flex marquee-right">
            {[...row2, ...row2, ...row2, ...row2].map((tech, i) => (
              <TechIcon key={`r2-${i}`} name={tech} />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 bg-foreground text-background font-medium px-8 py-3 rounded-full hover:bg-foreground/90 transition-all duration-300 hover:scale-105 text-sm"
          >
            {siteContent.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default TechStackMarquee;
```

- [ ] **Step 4: Migrate `ProjectsSection.tsx`**

Replace the full contents of `src/components/ProjectsSection.tsx`. The third card's link (`projects[1].link`) is intentionally left unchanged — see Global Constraints:

```tsx
import { useSiteContent } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import RiseIcon from "/src/assets/svg/icon_rise.svg";
const ProjectsSection = () => {
  const siteContent = useSiteContent();
  const { projects } = siteContent;

  return (
    <section id="projects" className="relative py-24 px-6">
      <div className="absolute inset-0 glow-bg opacity-30" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl text-muted-foreground">
            {siteContent.projectsSection.title}
            <br />
            <span className="text-foreground font-bold">{siteContent.projectsSection.titleBold}</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm max-w-lg mx-auto">
            {siteContent.projectsSection.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Project 1 - large card */}
          <div className="glass-card p-8 md:col-span-1 md:row-span-2 flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="flex gap-1 items-center">
               <img src={RiseIcon} alt="Ícone de destaque" className="w-10 h-10" />
              <div>
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground">{projects[0].title}</h3>
              </div>
              <div className="mt-2 border-t border-dashed border-border" />
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{projects[0].description}</p>
              <div className="flex gap-2 mt-4 flex-wrap">
                {projects[0].labels.map((l) => (
                  <span key={l} className="text-xs px-2 py-1 rounded-md border border-border text-muted-foreground">
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <a
              href={projects[0].link}
              target="_blank"
              className="mt-6 inline-flex items-center gap-2 text-sm text-foreground border border-border rounded-full px-5 py-2 w-fit hover:bg-foreground/10 transition-all duration-300"
            >
              {projects[0].cta}
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Project 2 */}
          <div className="glass-card p-8 flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground">{projects[1].title}</h3>
              <div className="mt-2 border-t border-dashed border-border" />
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{projects[1].description}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {projects[1].labels.map((l) => (
                  <span key={l} className="text-xs px-2 py-1 rounded-md border border-border text-muted-foreground">
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <a
              href={projects[1].link}
              target="_blank"
              className="mt-4 inline-flex items-center gap-2 text-sm text-foreground border border-border rounded-full px-5 py-2 w-fit hover:bg-foreground/10 transition-all duration-300"
            >
              {projects[1].cta}
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Project 3 */}
          <div className="glass-card p-8 flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground">{projects[2].title}</h3>
              <div className="mt-2 border-t border-dashed border-border" />
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{projects[2].description}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {projects[2].labels.map((l) => (
                  <span key={l} className="text-xs px-2 py-1 rounded-md border border-border text-muted-foreground">
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <a
              href={projects[1].link}
              target="_blank"
              className="mt-4 inline-flex items-center gap-2 text-sm text-foreground border border-border rounded-full px-5 py-2 w-fit hover:bg-foreground/10 transition-all duration-300"
            >
              {projects[2].cta}
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
```

- [ ] **Step 5: Migrate `Footer.tsx`**

Replace the full contents of `src/components/Footer.tsx`. The two previously-hardcoded strings ("Minhas redes :" and "Contato") now read from `siteContent.footer.socialLabel` / `siteContent.footer.contactLabel`; the commented-out `footer.links` block stays commented out, untouched:

```tsx
import { useSiteContent } from "@/contexts/LanguageContext";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const siteContent = useSiteContent();

  return (
    <footer className="px-6 pb-6">
      <div className="glass-card p-8 sm:p-12 container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
              <span className="border border-foreground/30 rounded-md px-2 py-0.5 text-sm px-3 py-3">
                  <img src="/public/favicon.svg" width={25} />
              </span>
              {siteContent.brand}
            </div>
            <p className="mt-3 text-muted-foreground text-sm">{siteContent.footer.socialLabel}</p>
            <div className="flex gap-4 mt-3">
              <a href={siteContent.social.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href={siteContent.social.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              {/* Carreira <span className="text-xs border border-border rounded-full px-2 py-0.5">Hiring</span> */}
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              {siteContent.footer.contactLabel}
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-muted-foreground">
          {/* <div className="flex flex-wrap gap-4">
            {siteContent.footer.links.map((link, i) => (
              <span key={i} className="flex items-center gap-2">
                <a href={link.href} className="hover:text-foreground transition-colors underline">{link.label}</a>
                {i < siteContent.footer.links.length - 1 && <span>|</span>}
              </span>
            ))}
          </div> */}
          <div>
            <a>
              
            </a>
          </div>
          <p>{siteContent.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

- [ ] **Step 6: Verify**

Run: `npx tsc -b --noEmit`
Expected: no errors.

Run: `npx vitest run`
Expected: PASS (all existing tests from Tasks 1-3, unaffected by these 5 files).

Run: `grep -rn "from \"@/data/siteContent\"" src/components/HeroSection.tsx src/components/ServicesHighlights.tsx src/components/TechStackMarquee.tsx src/components/ProjectsSection.tsx src/components/Footer.tsx`
Expected: no matches — confirms none of the 5 files still import `siteContent` directly.

- [ ] **Step 7: Commit**

```bash
git add src/components/HeroSection.tsx src/components/ServicesHighlights.tsx src/components/TechStackMarquee.tsx src/components/ProjectsSection.tsx src/components/Footer.tsx
git commit -m "feat: migrate remaining sections to the language-aware content hook"
```

---

### Task 5: Migrate the contact form and its tests

**Files:**
- Modify: `src/components/AboutContactSection.tsx`
- Modify: `src/components/AboutContactSection.test.tsx`

**Interfaces:**
- Consumes: `useSiteContent()` from `@/contexts/LanguageContext` (Task 2); `contact.namePlaceholder`, `.emailPlaceholder`, `.reasonPlaceholder`, `.messagePlaceholder`, `.sendingLabel`, `.subjectPrefix`, `.successToast`, `.errorToast` (Task 1).
- Produces: no new exports — `AboutContactSection` remains the default export with no props.

- [ ] **Step 1: Update the test file to expect the new (English-default) copy, wrapped in `LanguageProvider`**

Replace the full contents of `src/components/AboutContactSection.test.tsx`:

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AboutContactSection from "./AboutContactSection";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const renderWithLanguage = () =>
  render(
    <LanguageProvider>
      <AboutContactSection />
    </LanguageProvider>
  );

describe("AboutContactSection", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_WEB3FORMS_ACCESS_KEY", "test-access-key");
    global.fetch = vi.fn();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Maria" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your email"), {
      target: { value: "maria@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Reason for contact"), {
      target: { value: "Budget" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Write your message here"),
      { target: { value: "Hi, I'd like a quote." } }
    );
  };

  it("sends a POST to Web3Forms with the form data on submit", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderWithLanguage();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send a message/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    const body = options.body as FormData;
    expect(body.get("access_key")).toBe("test-access-key");
    expect(body.get("name")).toBe("Maria");
    expect(body.get("email")).toBe("maria@example.com");
    expect(body.get("message")).toBe("Hi, I'd like a quote.");
    expect(body.get("subject")).toBe("New portfolio contact – Budget");
    expect(body.get("botcheck")).toBe("");
  });

  it("shows a success toast and clears the form on success", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderWithLanguage();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send a message/i }));

    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    expect(screen.getByPlaceholderText("Your name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Your email")).toHaveValue("");
    expect(screen.getByPlaceholderText("Reason for contact")).toHaveValue("");
    expect(
      screen.getByPlaceholderText("Write your message here")
    ).toHaveValue("");
  });

  it("shows an error toast and keeps the form data when the request fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ success: false }),
    });

    renderWithLanguage();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send a message/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());

    expect(screen.getByPlaceholderText("Your name")).toHaveValue("Maria");
  });

  it("renders a hidden honeypot field that real visitors never see", () => {
    renderWithLanguage();
    const honeypot = document.querySelector(
      'input[name="botcheck"]'
    ) as HTMLInputElement;

    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute("type", "checkbox");
    expect(honeypot).toHaveStyle({ display: "none" });
    expect(honeypot.tabIndex).toBe(-1);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/AboutContactSection.test.tsx`
Expected: FAIL — the component still renders Portuguese placeholders/button text and isn't wrapped in a provider-aware content source.

- [ ] **Step 3: Migrate the component**

Replace the full contents of `src/components/AboutContactSection.tsx`:

```tsx
import { useState } from "react";
import { toast } from "sonner";
import { useSiteContent } from "@/contexts/LanguageContext";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const initialForm = { name: "", email: "", reason: "", message: "" };

const AboutContactSection = () => {
  const siteContent = useSiteContent();
  const { about, contact } = siteContent;
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const botcheckInput = e.currentTarget.elements.namedItem(
      "botcheck"
    ) as HTMLInputElement | null;

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "";
    if (!accessKey) {
      console.warn("VITE_WEB3FORMS_ACCESS_KEY is not set — contact form submissions will fail.");
    }

    const formData = new FormData();
    formData.append("access_key", accessKey);
    formData.append("subject", `${contact.subjectPrefix} – ${form.reason}`);
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("reason", form.reason);
    formData.append("message", form.message);
    formData.append("botcheck", botcheckInput?.checked ? "true" : "");

    setIsSubmitting(true);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(contact.successToast);
        setForm(initialForm);
      } else {
        console.error("Web3Forms submission failed:", result);
        toast.error(contact.errorToast);
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error(contact.errorToast);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-6">
      <div className="absolute inset-0 glow-bg opacity-20" />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Left - About */}
          <div>
            <h2 className="font-display text-5xl sm:text-6xl font-bold text-foreground">{about.title}</h2>
            <p className="mt-4 text-muted-foreground text-sm whitespace-pre-line">{about.role}</p>
            {about.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 text-muted-foreground text-sm leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* Right - Contact form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="checkbox"
              name="botcheck"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />
            <input
              type="text"
              placeholder={contact.namePlaceholder}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-foreground text-background placeholder:text-background/50 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <input
              type="email"
              placeholder={contact.emailPlaceholder}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-foreground text-background placeholder:text-background/50 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <input
              type="text"
              placeholder={contact.reasonPlaceholder}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-foreground text-background placeholder:text-background/50 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <textarea
              placeholder={contact.messagePlaceholder}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full px-5 py-4 rounded-xl bg-foreground text-background placeholder:text-background/50 text-sm outline-none resize-none focus:ring-2 focus:ring-ring"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-secondary border border-border text-foreground font-medium text-sm hover:bg-secondary/80 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? contact.sendingLabel : contact.buttonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AboutContactSection;
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/AboutContactSection.test.tsx`
Expected: PASS — all 4 tests green.

- [ ] **Step 5: Run the full suite and a type check**

Run: `npx vitest run`
Expected: PASS — every test across the project (Tasks 1-5) green.

Run: `npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/AboutContactSection.tsx src/components/AboutContactSection.test.tsx
git commit -m "feat: translate the contact form to the active language"
```
