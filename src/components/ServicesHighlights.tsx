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
