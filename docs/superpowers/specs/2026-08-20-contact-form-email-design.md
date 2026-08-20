# Contact Form → Email Design

## Context

The portfolio site (`lucas-lima-digital`) is a static Vite + React SPA with no
backend. The contact form in [`AboutContactSection.tsx`](../../../src/components/AboutContactSection.tsx)
currently builds a `wa.me` deep link using `contact.whatsappNumber`, a
placeholder value (`5500000000000`) that was never a real number — so the
form doesn't actually work today.

## Goal

Make the contact form functional: submissions are emailed to
`lucaslimacunha18@gmail.com` with a subject referencing the portfolio and the
message content the visitor typed in. WhatsApp behavior is removed entirely.

## Approach

Use **Web3Forms** (https://web3forms.com) as the delivery mechanism. It's a
client-side POST endpoint built for static sites: no backend required, and
its "access key" is meant to be public in front-end code (it only authorizes
where mail gets delivered, not a secret credential).

Alternatives considered:
- **EmailJS** — same static-site fit, but requires connecting a Gmail
  account and building a template in their dashboard. More setup for no
  functional benefit here.
- **`mailto:` link** — zero external dependency, but doesn't actually send
  anything; it just opens the visitor's local email client and requires them
  to click send themselves. Rejected because the ask is for the form to
  "just work."

Web3Forms is recommended: fastest to wire up, no dashboard template to
maintain, and includes native spam protection (see below) with no extra
library.

## Form Fields

Current fields: name, reason ("Motivo do Contato"), message.

**Adding a "Seu e-mail" field** (`type="email"`, required) so Lucas can reply
to whoever contacts him — the current form has no way to identify or respond
to the sender.

## Data Flow

1. Visitor fills name, email, reason, message and submits.
2. `handleSubmit` becomes async. It builds a `FormData` payload:
   - `access_key`: from `import.meta.env.VITE_WEB3FORMS_ACCESS_KEY`
   - `subject`: `"Novo contato pelo Portfólio – <reason>"`
   - `name`, `email`, `message`
   - `botcheck`: honeypot field value (see Spam Protection)
3. `fetch("https://api.web3forms.com/submit", { method: "POST", body: formData })`.
4. While the request is in flight, the submit button is disabled and shows
   "Enviando...".
5. On success (`response.ok` and JSON `success: true`): show a success toast
   (via the already-configured `sonner` Toaster in `App.tsx`), clear the
   form fields.
6. On failure (network error, non-ok response, or `success: false`): show an
   error toast ("Não foi possível enviar, tente novamente.") and **do not**
   clear the form, so the visitor doesn't lose what they typed.

## Spam Protection

Add a hidden honeypot input named `botcheck` to the form:
- `type="checkbox"`, visually hidden (`display: none` via a wrapper style,
  not just `sr-only`, so it's invisible rather than accessible-but-hidden),
  `tabIndex={-1}`, `autoComplete="off"`.
- Real visitors never see or fill it. Simple bots that fill every field in
  the DOM will fill it.
- Web3Forms detects a filled `botcheck` field server-side and silently
  discards the submission (no email sent), on top of their own built-in
  spam filtering.
- No visible captcha — keeps friction at zero for real visitors. Can be
  revisited later if spam volume warrants it.

## Configuration

The Web3Forms access key is stored as `VITE_WEB3FORMS_ACCESS_KEY` in a local
`.env` file (gitignored), with a `.env.example` documenting the variable
name (no real key committed). Lucas needs to create the key himself at
web3forms.com using `lucaslimacunha18@gmail.com` (requires email
confirmation, which Claude cannot do on his behalf).

## Changes Summary

- [`src/components/AboutContactSection.tsx`](../../../src/components/AboutContactSection.tsx):
  add email field, honeypot field, async submit handler, loading state,
  toast feedback, form reset on success.
- [`src/data/siteContent.ts`](../../../src/data/siteContent.ts): remove
  `contact.whatsappNumber`.
- `.env.example`: add `VITE_WEB3FORMS_ACCESS_KEY=` placeholder.
- `.gitignore`: confirm `.env` is ignored (verify during implementation).

## Testing

Project has Vitest configured (`@testing-library/react`, `jsdom`). Add a
test file for `AboutContactSection` covering:
- Submitting with valid input calls `fetch` with the right endpoint and
  form fields (mock `global.fetch`).
- A successful response clears the form and shows a success toast.
- A failed/error response keeps the entered values and shows an error
  toast.
