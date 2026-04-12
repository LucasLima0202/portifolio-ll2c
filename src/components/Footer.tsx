import { siteContent } from "@/data/siteContent";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="px-6 pb-6">
      <div className="glass-card p-8 sm:p-12 container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
              <span className="border border-foreground/30 rounded-md px-2 py-0.5 text-sm">⌐</span>
              {siteContent.brand}
            </div>
            <p className="mt-3 text-muted-foreground text-sm">Minhas redes :</p>
            <div className="flex gap-4 mt-3">
              <a href={siteContent.social.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
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
              Careers <span className="text-xs border border-border rounded-full px-2 py-0.5">Hiring</span>
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-4">
            {siteContent.footer.links.map((link, i) => (
              <span key={i} className="flex items-center gap-2">
                <a href={link.href} className="hover:text-foreground transition-colors underline">{link.label}</a>
                {i < siteContent.footer.links.length - 1 && <span>|</span>}
              </span>
            ))}
          </div>
          <p>{siteContent.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
