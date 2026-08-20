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

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "";
    if (!accessKey) {
      console.warn("VITE_WEB3FORMS_ACCESS_KEY is not set — contact form submissions will fail.");
    }

    const formData = new FormData();
    formData.append("access_key", accessKey);
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
        console.error("Web3Forms submission failed:", result);
        toast.error("Não foi possível enviar sua mensagem. Tente novamente.");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
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
