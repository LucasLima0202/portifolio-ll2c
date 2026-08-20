# Contact Form → Email Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio contact form actually send an email to `lucaslimacunha18@gmail.com` (with a portfolio-related subject and the visitor's message), replacing the currently-broken WhatsApp deep link.

**Architecture:** Client-side `fetch` POST from `AboutContactSection.tsx` to the Web3Forms API (`https://api.web3forms.com/submit`), using a public access key read from `import.meta.env.VITE_WEB3FORMS_ACCESS_KEY`. A hidden honeypot field (`botcheck`) is read directly off the DOM form element (not React state) so it still catches bots that fill inputs via raw DOM manipulation. Success/error feedback uses the `sonner` toaster already mounted in `App.tsx`.

**Tech Stack:** React 18 + Vite (existing), `sonner` (existing dependency, no new packages), Vitest + Testing Library (existing).

## Global Constraints

- No new npm dependencies — Web3Forms needs nothing beyond `fetch`, which is already used by the pattern this repo follows (spec explicitly rejected EmailJS partly to avoid extra setup).
- Only honeypot spam protection — no visible captcha (per approved spec).
- WhatsApp behavior (`contact.whatsappNumber`, the `wa.me` link) must be fully removed, not just unused.
- Destination email is fixed: `lucaslimacunha18@gmail.com` (configured on the Web3Forms account side, not in this repo's code — the repo only holds the access key).
- Real access key is never committed; only `.env.example` with a placeholder is tracked.

---

### Task 1: Rewrite the contact form to submit via Web3Forms

**Files:**
- Modify: `src/components/AboutContactSection.tsx`
- Create: `.env.example`
- Modify: `.gitignore`
- Test: `src/components/AboutContactSection.test.tsx`

**Interfaces:**
- Consumes: `siteContent.about`, `siteContent.contact.buttonText` from [`src/data/siteContent.ts`](../../../src/data/siteContent.ts) (unchanged shape — `contact.whatsappNumber` is deliberately *not* referenced anymore by this task, so Task 2 can delete it safely).
- Produces: `AboutContactSection` default export — no props, no change to how it's consumed from [`src/pages/Index.tsx`](../../../src/pages/Index.tsx).

- [ ] **Step 1: Add the env var placeholder and ignore real env files**

Create `.env.example` at the project root:

```
VITE_WEB3FORMS_ACCESS_KEY=
```

Open `.gitignore` and add, after the existing `*.local` line:

```
.env
.env.*
!.env.example
```

- [ ] **Step 2: Write the failing tests for the new submit behavior**

Create `src/components/AboutContactSection.test.tsx`:

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import AboutContactSection from "./AboutContactSection";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("AboutContactSection", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_WEB3FORMS_ACCESS_KEY", "test-access-key");
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText("Qual seu nome"), {
      target: { value: "Maria" },
    });
    fireEvent.change(screen.getByPlaceholderText("Seu e-mail"), {
      target: { value: "maria@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Motivo do Contato"), {
      target: { value: "Orçamento" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Campo de Texto para escrever"),
      { target: { value: "Olá, gostaria de um orçamento." } }
    );
  };

  it("sends a POST to Web3Forms with the form data on submit", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<AboutContactSection />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /mande uma mensagem/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    const body = options.body as FormData;
    expect(body.get("access_key")).toBe("test-access-key");
    expect(body.get("name")).toBe("Maria");
    expect(body.get("email")).toBe("maria@example.com");
    expect(body.get("message")).toBe("Olá, gostaria de um orçamento.");
    expect(body.get("subject")).toBe("Novo contato pelo Portfólio – Orçamento");
    expect(body.get("botcheck")).toBe("");
  });

  it("shows a success toast and clears the form on success", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<AboutContactSection />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /mande uma mensagem/i }));

    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    expect(screen.getByPlaceholderText("Qual seu nome")).toHaveValue("");
    expect(screen.getByPlaceholderText("Seu e-mail")).toHaveValue("");
    expect(screen.getByPlaceholderText("Motivo do Contato")).toHaveValue("");
    expect(
      screen.getByPlaceholderText("Campo de Texto para escrever")
    ).toHaveValue("");
  });

  it("shows an error toast and keeps the form data when the request fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ success: false }),
    });

    render(<AboutContactSection />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /mande uma mensagem/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());

    expect(screen.getByPlaceholderText("Qual seu nome")).toHaveValue("Maria");
  });

  it("renders a hidden honeypot field that real visitors never see", () => {
    render(<AboutContactSection />);
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

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run src/components/AboutContactSection.test.tsx`
Expected: FAIL — `AboutContactSection` still uses `window.open`/`wa.me`, has no email field, no honeypot, and never calls `fetch`.

- [ ] **Step 4: Implement the functional contact form**

Replace the full contents of `src/components/AboutContactSection.tsx`:

```tsx
import { useState } from "react";
import { toast } from "sonner";
import { siteContent } from "@/data/siteContent";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const initialForm = { name: "", email: "", reason: "", message: "" };

const AboutContactSection = () => {
  const { about, contact } = siteContent;
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const botcheckInput = e.currentTarget.elements.namedItem(
      "botcheck"
    ) as HTMLInputElement | null;

    const formData = new FormData();
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "");
    formData.append("subject", `Novo contato pelo Portfólio – ${form.reason}`);
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
        toast.success("Mensagem enviada! Vou te responder em breve.");
        setForm(initialForm);
      } else {
        toast.error("Não foi possível enviar sua mensagem. Tente novamente.");
      }
    } catch {
      toast.error("Não foi possível enviar sua mensagem. Tente novamente.");
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
              placeholder="Qual seu nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-foreground text-background placeholder:text-background/50 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-foreground text-background placeholder:text-background/50 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <input
              type="text"
              placeholder="Motivo do Contato"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-foreground text-background placeholder:text-background/50 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <textarea
              placeholder="Campo de Texto para escrever"
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
              {isSubmitting ? "Enviando..." : contact.buttonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AboutContactSection;
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/components/AboutContactSection.test.tsx`
Expected: PASS — all 4 tests green.

- [ ] **Step 6: Commit**

```bash
git add src/components/AboutContactSection.tsx src/components/AboutContactSection.test.tsx .env.example .gitignore
git commit -m "feat: send contact form submissions to email via Web3Forms"
```

---

### Task 2: Remove the now-unused WhatsApp config

**Files:**
- Modify: `src/data/siteContent.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `siteContent.contact` now has only `{ buttonText: string }` — confirmed no other file reads `contact.whatsappNumber` after Task 1.

- [ ] **Step 1: Remove `whatsappNumber` from the contact object**

In `src/data/siteContent.ts`, change:

```ts
  contact: {
    buttonText: "Mande uma Mensagem",
    whatsappNumber: "5500000000000",
  },
```

to:

```ts
  contact: {
    buttonText: "Mande uma Mensagem",
  },
```

- [ ] **Step 2: Verify nothing else references the removed field**

Run: `grep -rn "whatsappNumber\|wa.me" src`
Expected: no matches.

- [ ] **Step 3: Run the full test suite and a type check**

Run: `npx vitest run`
Expected: PASS — all tests across the project green.

Run: `npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/siteContent.ts
git commit -m "chore: remove unused WhatsApp contact config"
```

---

## After implementation (manual, outside this plan)

Lucas needs to:
1. Go to https://web3forms.com, submit `lucaslimacunha18@gmail.com` to generate an access key (confirms via email).
2. Create a local `.env` file (gitignored) with `VITE_WEB3FORMS_ACCESS_KEY=<the real key>`.
3. Add the same variable to whatever hosting platform builds this site (e.g. Vercel/Netlify project environment variables), since the build needs it at build time (`import.meta.env` is inlined by Vite at build time, not read at runtime).
