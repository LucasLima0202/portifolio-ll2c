import { siteContent } from "@/data/siteContent";
import { ArrowRight, Rocket } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
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
