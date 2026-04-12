import { siteContent } from "@/data/siteContent";

const techIcons: Record<string, string> = {
  "OpenAI": "https://cdn.simpleicons.org/openai/white",
  "MySQL": "https://cdn.simpleicons.org/mysql/white",
  "n8n": "https://cdn.simpleicons.org/n8n/white",
  "Supabase": "https://cdn.simpleicons.org/supabase/white",
  "Vercel": "https://cdn.simpleicons.org/vercel/white",
  "Python": "https://cdn.simpleicons.org/python/white",
  "Excel": "https://cdn.simpleicons.org/microsoftexcel/white",
  "Discord": "https://cdn.simpleicons.org/discord/white",
  "Slack": "https://cdn.simpleicons.org/slack/white",
  "React": "https://cdn.simpleicons.org/react/white",
  "Power BI": "https://cdn.simpleicons.org/powerbi/white",
  "Airtable": "https://cdn.simpleicons.org/airtable/white",
  "LangChain": "https://cdn.simpleicons.org/langchain/white",
  "TypeScript": "https://cdn.simpleicons.org/typescript/white",
  "Node.js": "https://cdn.simpleicons.org/nodedotjs/white",
  "Tailwind": "https://cdn.simpleicons.org/tailwindcss/white",
  "GitHub": "https://cdn.simpleicons.org/github/white",
  "Docker": "https://cdn.simpleicons.org/docker/white",
  "PostgreSQL": "https://cdn.simpleicons.org/postgresql/white",
  "Figma": "https://cdn.simpleicons.org/figma/white",
  "Next.js": "https://cdn.simpleicons.org/nextdotjs/white",
  "ManyChat": "https://cdn.simpleicons.org/manychat/white",
  "Zapier": "https://cdn.simpleicons.org/zapier/white",
  "Firebase": "https://cdn.simpleicons.org/firebase/white",
};

const techs = siteContent.technologies;
const row1 = techs.slice(0, 12);
const row2 = techs.slice(12).concat(techs.slice(0, 4));

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
            {[...row1, ...row1].map((tech, i) => (
              <TechIcon key={`r1-${i}`} name={tech} />
            ))}
          </div>
        </div>

        {/* Row 2 - right */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-40 md:w-64 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-40 md:w-64 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />
          <div className="flex marquee-right">
            {[...row2, ...row2].map((tech, i) => (
              <TechIcon key={`r2-${i}`} name={tech} />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 bg-foreground text-background font-medium px-8 py-3 rounded-full hover:bg-foreground/90 transition-all duration-300 hover:scale-105 text-sm"
          >
            Ver Projetos
          </a>
        </div>
      </div>
    </section>
  );
};

export default TechStackMarquee;
