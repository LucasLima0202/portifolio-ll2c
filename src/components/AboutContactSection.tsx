import { useState } from "react";
import { siteContent } from "@/data/siteContent";

const AboutContactSection = () => {
  const { about, contact } = siteContent;
  const [form, setForm] = useState({ name: "", reason: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${form.name}. Motivo: ${form.reason}. ${form.message}`;
    window.open(
      `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
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
              type="text"
              placeholder="Qual seu nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              className="w-full py-4 rounded-full bg-secondary border border-border text-foreground font-medium text-sm hover:bg-secondary/80 transition-all duration-300"
            >
              {contact.buttonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AboutContactSection;
