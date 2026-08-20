# PT-BR / EN Language Toggle Design

## Context

The site's entire copy lives in one object, [`src/data/siteContent.ts`](../../../src/data/siteContent.ts), written in Portuguese, consumed directly by seven components (`Navbar`, `HeroSection`, `ServicesHighlights`, `TechStackMarquee`, `ProjectsSection`, `AboutContactSection`, `Footer`). The Navbar already shows a static, non-functional "🇧🇷 pt-br" badge (desktop only, `Navbar.tsx:39-41`) implying language support that doesn't exist.

## Goal

Add a working PT-BR / English toggle covering the entire site (all copy, including the contact form's placeholders and toast messages), defaulting to **English**, with the user's choice remembered across visits via `localStorage`.

## Approach

No new dependency. The site already centralizes all copy in one object — duplicating that object per language and selecting via React Context is simpler and more consistent with the existing pattern than introducing a translation-key library (`react-i18next` etc.), which would require rewriting every component to call `t("some.key")` instead of reading plain object properties, for no benefit at this scale (~120 lines of content, one flat locale switch, no pluralization/interpolation needs beyond a single `${reason}` substitution already in the contact form).

## File Structure

- `src/data/content/pt.ts` — Portuguese content object (current copy, plus new contact-form fields — see Content below).
- `src/data/content/en.ts` — English content object, identical shape, translated.
- `src/data/siteContent.ts` — becomes a thin index: `export const siteContent = { pt: ptContent, en: enContent }` plus `export type SiteContent = typeof ptContent`. `pt.ts`'s shape is the source of truth for the type; `en.ts` is typed against it so the two can never drift out of structural sync (a missing key in `en.ts` is a compile error).
- `src/contexts/LanguageContext.tsx` — new file:
  - `type Language = "pt" | "en"`
  - `LanguageProvider` — wraps the app, holds `language` state, initializes from `localStorage.getItem("language")` (falls back to `"en"` if absent or not a valid `Language`), persists on every change via `useEffect`.
  - `useLanguage()` — returns `{ language, setLanguage, toggleLanguage }`; throws if called outside the provider (matches the existing `useSidebar`-style context-hook pattern already used in `src/components/ui/sidebar.tsx`).
  - `useSiteContent()` — returns `siteContent[language]`, i.e., the active language's full content object. Existing call sites change from `siteContent.about` to `useSiteContent().about` — same shape, so only the import/access line changes in each component, not the JSX.
- `src/App.tsx` — wrap the existing provider tree with `<LanguageProvider>`, outermost (so it's available everywhere, including `Navbar` which sits above the routed pages).

## Component Changes

Each of the 7 consuming components: replace `import { siteContent } from "@/data/siteContent"` with `import { useSiteContent } from "@/contexts/LanguageContext"`, and `siteContent.x` reads become `useSiteContent().x` (destructured once per component, matching the existing `const { about, contact } = siteContent` style).

`TechStackMarquee.tsx:24` currently reads `const techs = siteContent.technologies` at **module scope** (evaluated once at import time, outside the component). This must move inside the component body so it re-reads reactively when the language (and thus the object reference) changes — even though the `technologies` array's contents are identical in both languages (proper nouns aren't translated), the value must come from the hook to stay consistent with the rest of the component and avoid a second, parallel content-access pattern.

**Navbar toggle:** replace the static badge (`Navbar.tsx:39-41`) with a button:
```tsx
<button
  onClick={toggleLanguage}
  className="text-xs border border-border rounded-full px-3 py-1 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
>
  {language === "pt" ? "🇧🇷 PT-BR" : "🇺🇸 EN"}
</button>
```
Shown in both the desktop menu (where the badge already lives, `hidden md:flex` block) and added to the mobile menu (`Navbar.tsx:60-73`), which currently has no language indicator at all.

## Content

Shared across both languages (untranslated — proper nouns, URLs, tech names): `name`, `brand`, `nav` labels (already English words: "Home", "Services", "Projects", "Contact" — kept as-is in both, since they already function as language-neutral UI labels in the current Portuguese version), `technologies`, `social` URLs, each project's `title`, `labels`, and `link`.

Translated per language — full copy below. `pt.ts` keeps the site's current wording (with new contact-form fields added, since those strings are currently hardcoded inside `AboutContactSection.tsx` rather than living in `siteContent`); `en.ts` is the English translation.

| Key | pt | en |
|---|---|---|
| `title` | Full-Stack Developer | Full-Stack Developer |
| `subtitle` | Desenvolvendo soluções digitais de alta performance com foco em automações, front-end moderno e sistemas escaláveis. | Building high-performance digital solutions focused on automation, modern front-end, and scalable systems. |
| `ctaText` | Ver Projetos | View Projects |
| `services[0].title` / `.description` | Automações com IA / Criação de fluxos com IA, n8n e ManyChat | AI Automations / Building AI-powered flows with n8n and ManyChat |
| `services[1].title` / `.description` | Serviços contratáveis / Desenvolvimento de sites e automações | Freelance Services / Website and automation development |
| `services[2].title` / `.description` | Desenvolvimento Full Stack / Aplicações modernas focadas em performance | Full Stack Development / Modern, performance-focused applications |
| `techSection.title` / `.titleBold` / `.subtitle` | Tecnologias que utilizo / no dia a dia / Ferramentas modernas para criar soluções rápidas, eficientes e escaláveis. | Technologies I use / every day / Modern tools for building fast, efficient, and scalable solutions. |
| `projectsSection.title` / `.titleBold` / `.subtitle` | Meus / Projetos / Alguns dos sistemas e soluções que já desenvolvi na prática. | My / Projects / Some of the systems and solutions I've built in practice. |
| `projects[0].description` / `.cta` | Plataforma de gestão de tarefas, hobbys com streaks / Explorar Projeto | Task and habit-tracking platform with streaks / Explore Project |
| `projects[1].description` / `.cta` | Assistente virtual com IA integrada para atendimento automatizado e gestão de tickets. / Ver Detalhes | AI-powered virtual assistant for automated support and ticket management. / View Details |
| `projects[2].description` / `.cta` | Painel de métricas e análise de gastos financeiros. / Ver Projeto | Metrics dashboard and financial spending analysis. / View Project |
| `about.title` | Sobre | About |
| `about.role` | Sou desenvolvedor Full Stack\ncom foco Front-End e Automações. | I'm a Full Stack developer\nfocused on Front-End and Automation. |
| `about.paragraphs[0]` | Comecei na programação através de um curso técnico e atualmente frequentando faculdade de Sistema da Informação e desde então, venho evoluindo com formações e prática constante no mercado. | I started programming through a technical course and I'm currently pursuing a degree in Information Systems, constantly growing through further training and hands-on market practice. |
| `about.paragraphs[1]` | Tenho experiência com projetos reais como freelancer e já atuei em ambientes de alta performance, desenvolvendo soluções para empresas com foco em resultado. | I have real-world freelance experience and have worked in high-performance environments, building results-driven solutions for companies. |
| `contact.buttonText` | Mande uma Mensagem | Send a Message |
| `contact.namePlaceholder` *(new)* | Qual seu nome | Your name |
| `contact.emailPlaceholder` *(new)* | Seu e-mail | Your email |
| `contact.reasonPlaceholder` *(new)* | Motivo do Contato | Reason for contact |
| `contact.messagePlaceholder` *(new)* | Campo de Texto para escrever | Write your message here |
| `contact.sendingLabel` *(new)* | Enviando... | Sending... |
| `contact.subjectPrefix` *(new)* | Novo contato pelo Portfólio | New portfolio contact |
| `contact.successToast` *(new)* | Mensagem enviada! Vou te responder em breve. | Message sent! I'll get back to you soon. |
| `contact.errorToast` *(new)* | Não foi possível enviar sua mensagem. Tente novamente. | Couldn't send your message. Please try again. |
| `footer.copyright` | © LL2C - Lucas Lima Cunha \| Todos Direitos Reservados. | © LL2C - Lucas Lima Cunha \| All Rights Reserved. |
| `footer.links` | Aviso Legal, Segurança, Privacidade (href `#`, unchanged) | Imprint, Security, Privacy (href `#`, unchanged) |

## Contact Form Changes

`AboutContactSection.tsx` currently hardcodes its placeholders, button loading label, subject-line prefix, and toast strings in Portuguese. These move into `contact.*` (new fields above) and are read from `useSiteContent()` alongside the existing `about`/`contact` destructure. The subject sent to Web3Forms becomes `` `${contact.subjectPrefix} – ${form.reason}` `` — functionally identical to today, just using the localized prefix instead of a hardcoded string.

## Existing Test Impact

`src/components/AboutContactSection.test.tsx` queries elements by their current Portuguese placeholder text (e.g. `getByPlaceholderText("Qual seu nome")`) and asserts on the Portuguese button label and toast copy. Since the site's default language becomes English, every one of those queries must be updated to the English strings, and `render(<AboutContactSection />)` must be wrapped in `<LanguageProvider>` (a small test helper, e.g. `renderWithLanguage`, avoids repeating the wrapper in each test).

## New Tests

- `LanguageContext`: defaults to `"en"` when `localStorage` is empty; reads a previously stored `"pt"`/`"en"` value on init; `toggleLanguage` flips the value and persists it; `useSiteContent()` returns the `pt` object when language is `"pt"` and the `en` object when `"en"`; `useLanguage()`/`useSiteContent()` throw when called outside `LanguageProvider`.
- `Navbar`: clicking the language toggle button switches its own label from "🇺🇸 EN" to "🇧🇷 PT-BR" (and back), asserted in both the desktop and mobile toggle instances. Confirming that *other* components' text reacts to the same state change is already covered by the `LanguageContext` unit tests (`useSiteContent()` returns the right object per language) — the Navbar test only needs to prove the button itself is wired to `toggleLanguage` and re-renders with the current language's label.

## Error Handling / Edge Cases

- Invalid or corrupted `localStorage` value (e.g., manually edited to `"fr"`): treated as absent, falls back to `"en"`.
- `localStorage` unavailable (e.g., privacy mode blocking it in some browsers): reads/writes are wrapped so a thrown exception doesn't crash the app — language simply doesn't persist for that session, defaulting to `"en"` each load.
