import { sharedContent } from "./shared";

export const ptContent = {
  ...sharedContent,
  subtitle: "Desenvolvendo soluções digitais de alta performance com foco em automações, front-end moderno e sistemas escaláveis.",
  ctaText: "Ver Projetos",

  services: [
    {
      icon: "bot",
      title: "Automações com IA",
      description: "Criação de fluxos com IA, n8n e ManyChat",
    },
    {
      icon: "briefcase",
      title: "Serviços contratáveis",
      description: "Desenvolvimento de sites e automações",
    },
    {
      icon: "code",
      title: "Desenvolvimento Full Stack",
      description: "Aplicações modernas focadas em performance",
    },
  ],

  techSection: {
    title: "Tecnologias que utilizo",
    titleBold: "no dia a dia",
    subtitle: "Ferramentas modernas para criar soluções rápidas, eficientes e escaláveis.",
  },

  projectsSection: {
    title: "Meus",
    titleBold: "Projetos",
    subtitle: "Alguns dos sistemas e soluções que já desenvolvi na prática.",
  },

  projects: [
    {
      title: "Rise App",
      description: "Plataforma de gestão de tarefas, hobbys com streaks",
      labels: ["React", "Node.js", "Supabase"],
      cta: "Explorar Projeto",
      featured: true,
      link: "https://risese.netlify.app/auth",
    },
    {
      title: "ChatAI - Assistente Inteligente",
      description: "Assistente virtual com IA integrada para atendimento automatizado e gestão de tickets.",
      labels: ["OpenAI", "Python", "Supabase", "n8n"],
      cta: "Ver Detalhes",
      featured: false,
      link: "https://github.com/LucasLima0202",
    },
    {
      title: "Dashboard Controlnomy",
      description: "Painel de métricas e análise de gastos financeiros.",
      labels: ["React", "TypeScript", "Js"],
      cta: "Ver Projeto",
      featured: true,
      link: "https://github.com/LucasLima0202",
    },
  ],

  about: {
    title: "Sobre",
    role: "Sou desenvolvedor Full Stack\ncom foco Front-End e Automações.",
    paragraphs: [
      "Comecei na programação através de um curso técnico e atualmente frequentando faculdade de Sistema da Informação e desde então, venho evoluindo com formações e prática constante no mercado.",
      "Tenho experiência com projetos reais como freelancer e já atuei em ambientes de alta performance, desenvolvendo soluções para empresas com foco em resultado.",
    ],
  },

  contact: {
    buttonText: "Mande uma Mensagem",
    namePlaceholder: "Qual seu nome",
    emailPlaceholder: "Seu e-mail",
    reasonPlaceholder: "Motivo do Contato",
    messagePlaceholder: "Campo de Texto para escrever",
    sendingLabel: "Enviando...",
    subjectPrefix: "Novo contato pelo Portfólio",
    successToast: "Mensagem enviada! Vou te responder em breve.",
    errorToast: "Não foi possível enviar sua mensagem. Tente novamente.",
  },

  social: sharedContent.social,

  footer: {
    copyright: "© LL2C - Lucas Lima Cunha | Todos Direitos Reservados.",
    socialLabel: "Minhas redes :",
    contactLabel: "Contato",
    links: sharedContent.footerLinks,
  },
};

export type SiteContent = typeof ptContent;
