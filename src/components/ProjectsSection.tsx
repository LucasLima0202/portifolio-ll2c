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
