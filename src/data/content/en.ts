import type { SiteContent } from "./pt";

export const enContent: SiteContent = {
  name: "Lucas Lima",
  brand: "LL2C",
  title: "Full-Stack Developer",
  subtitle: "Building high-performance digital solutions focused on automation, modern front-end, and scalable systems.",
  ctaText: "View Projects",

  nav: [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],

  services: [
    {
      icon: "bot",
      title: "AI Automations",
      description: "Building AI-powered flows with n8n and ManyChat",
    },
    {
      icon: "briefcase",
      title: "Freelance Services",
      description: "Website and automation development",
    },
    {
      icon: "code",
      title: "Full Stack Development",
      description: "Modern, performance-focused applications",
    },
  ],

  techSection: {
    title: "Technologies I use",
    titleBold: "every day",
    subtitle: "Modern tools for building fast, efficient, and scalable solutions.",
  },

  technologies: [
    "OpenAI",
    "MySQL",
    "n8n",
    "Supabase",
    "Vercel",
    "Python",
    "Discord",
    "React",
    "Airtable",
    "TypeScript",
    "Node.js",
    "GitHub",
    "Docker",
    "PostgreSQL",
    "Figma",
    "Next.js",
    "ManyChat",
    "Html",
  ],

  projectsSection: {
    title: "My",
    titleBold: "Projects",
    subtitle: "Some of the systems and solutions I've built in practice.",
  },

  projects: [
    {
      title: "Rise App",
      description: "Task and habit-tracking platform with streaks",
      labels: ["React", "Node.js", "Supabase"],
      cta: "Explore Project",
      featured: true,
      link: "https://risese.netlify.app/auth",
    },
    {
      title: "ChatAI - Assistente Inteligente",
      description: "AI-powered virtual assistant for automated support and ticket management.",
      labels: ["OpenAI", "Python", "Supabase", "n8n"],
      cta: "View Details",
      featured: false,
      link: "https://github.com/LucasLima0202",
    },
    {
      title: "Dashboard Controlnomy",
      description: "Metrics dashboard and financial spending analysis.",
      labels: ["React", "TypeScript", "Js"],
      cta: "View Project",
      featured: true,
      link: "https://github.com/LucasLima0202",
    },
  ],

  about: {
    title: "About",
    role: "I'm a Full Stack developer\nfocused on Front-End and Automation.",
    paragraphs: [
      "I started programming through a technical course and I'm currently pursuing a degree in Information Systems, constantly growing through further training and hands-on market practice.",
      "I have real-world freelance experience and have worked in high-performance environments, building results-driven solutions for companies.",
    ],
  },

  contact: {
    buttonText: "Send a Message",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    reasonPlaceholder: "Reason for contact",
    messagePlaceholder: "Write your message here",
    sendingLabel: "Sending...",
    subjectPrefix: "New portfolio contact",
    successToast: "Message sent! I'll get back to you soon.",
    errorToast: "Couldn't send your message. Please try again.",
  },

  social: {
    twitter: "https://twitter.com",
    github: "https://github.com/LucasLima0202",
    linkedin: "https://br.linkedin.com/in/lucas-lima-cunha-824b25210",
  },

  footer: {
    copyright: "© LL2C - Lucas Lima Cunha | All Rights Reserved.",
    socialLabel: "My socials:",
    contactLabel: "Contact",
    links: [
      { label: "Imprint", href: "#" },
      { label: "Security", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
};
