/* ══════════════════════════════════════════════════════════════════════════
   KYNAR DATA VAULT (Product Database)
   Version: 6.0 - Secure Asset Mapping
   ══════════════════════════════════════════════════════════════════════════ */

const VAULT = [
  // --- PERSONAL (Life & Flow) ---
  {
    id: "finance-architect",
    category: "personal",
        status: "coming-soon",     actionLabel: "Arriving Soon",
    title: "The Finance Tracker",
    shortDesc: "Complete wealth management",
    price: "£24.00",
    tag: "Organization",
    desc: "A complete personal finance and wealth tracker. Manage income, automate budgets, and watch savings grow in one intuitive dashboard.",
    features: ["Income Tracking", "Monthly Budgeting", "Savings Goals", "Mobile-Ready"],
    bg: "var(--bg-surface)",
    image: "assets/images/finance-mockup.webp",
    previewUrl: "#",
    checkout: "#",
    file: "finance-tracker-v1.zip" // Mapped for .htaccess security
  },
  {
    id: "notion-life-os",
    category: "personal",
        status: "active",     actionLabel: "Authorize Download",
    title: "Life OS Dashboard",
    shortDesc: "The ultimate Notion system",
    price: "£45.00",
    tag: "Notion",
    desc: "The only Notion template you need to manage your life. Projects, tasks, habits, and journals in one connected ecosystem.",
    features: ["Task Management", "Habit Tracker", "Journaling Suite", "Second Brain Logic"],
    bg: "var(--bg-surface)",
    image: "assets/images/visual-mockup.webp",
    previewUrl: "https://notion.so/kynar-preview",
    checkout: "#",
    file: "kynar-life-os.zip"
  },
  
  // --- WORK (Business & Growth) ---
  {
    id: "scribe-vault",
    category: "work",
        status: "active",     actionLabel: "Authorize Download",
    title: "The Prompt Library",
    shortDesc: "AI prompts for every task",
    price: "£15.00",
    tag: "AI Tools",
    desc: "Over 100+ tested prompts to help you write better emails, plan projects, and get more done with ChatGPT.",
    features: ["100+ Multi-use Prompts", "Productivity Hacks", "Creative Writing Aids", "Instant Access"],
    bg: "var(--bg-surface)",
    image: "assets/images/code-mockup.webp",
    previewUrl: "#",
    checkout: "#",
    file: "scribe-prompt-library.zip"
  },
  {
    id: "saas-starter-kit",
    category: "work",
        status: "active",     actionLabel: "Authorize Download",
    title: "Next.js SaaS Kit",
    shortDesc: "Launch your app in hours",
    price: "£99.00",
    tag: "Code",
    desc: "A production-ready Next.js boilerplate with Auth, Stripe, and Database integration pre-configured.",
    features: ["Next.js 14 Setup", "Stripe Integration", "Supabase Auth", "Tailwind UI"],
    bg: "var(--bg-surface)",
    image: "assets/images/code-mockup.webp",
    previewUrl: "https://demo.kynar.co.uk",
    checkout: "#",
    file: "nextjs-saas-starter.zip"
  },

  // --- CREATIVE (Content & Style) ---
  {
    id: "influence-suite",
    category: "creative",
        status: "active",     actionLabel: "Authorize Download",
    title: "The Social Suite",
    shortDesc: "Ready-to-use creative templates",
    price: "£35.00",
    tag: "Creative",
    desc: "Professional social media templates for any occasion. 50+ editable designs created for beautiful storytelling.",
    features: ["50+ Social Templates", "Versatile Style", "Canva Editable", "Step-by-Step Guide"],
    bg: "var(--bg-surface)",
    image: "assets/images/creative-mockup.webp",
    previewUrl: "#",
    checkout: "#",
    file: "social-suite-templates.zip"
  },
  {
    id: "aura-presets",
    category: "creative",
        status: "active",     actionLabel: "Authorize Download",
    title: "Aura Photo Filters",
    shortDesc: "Cinematic lifestyle presets",
    price: "£19.00",
    tag: "Photography",
    desc: "Transform your photos in seconds with 10 essential mobile filters designed for a warm, cinematic feel.",
    features: ["10 One-Click Filters", "Works for All Photos", "Mobile Setup", "Natural Look"],
    bg: "var(--bg-surface)",
    image: "assets/images/visual-mockup.webp",
    previewUrl: "#",
    checkout: "#",
    file: "aura-lifestyle-presets.zip"
  },

  // --- EDUCATION ---
  {
    id: "homeschool-pack-v1",
    category: "work",
        status: "coming-soon",     actionLabel: "Arriving Soon",
    title: "Homeschool Worksheets",
    shortDesc: "Educational assets for kids",
    price: "£12.00",
    tag: "Education",
    desc: "A massive bundle of printable worksheets covering Math, English, and Science for early learners.",
    features: ["Printable PDF", "300+ Pages", "Curriculum Aligned", "Reusable Assets"],
    bg: "var(--bg-surface)",
    image: "assets/images/finance-mockup.webp",
    previewUrl: "#",
    checkout: "#",
    file: "homeschool-bundle-v1.zip"
  },

  // --- ASSETS & CODE ---
  {
    id: "icon-system-v1",
    category: "creative",
        status: "active",     actionLabel: "Authorize Download",
    title: "Kynar Icon System",
    shortDesc: "Minimalist SVG icon set",
    price: "£20.00",
    tag: "Assets",
    desc: "200+ custom-designed minimalist SVG icons. Perfect for web projects, apps, and presentation decks.",
    features: ["SVG & PNG Formats", "Vector Optimized", "Commercial License", "Figma File Included"],
    bg: "var(--bg-surface)",
    image: "assets/images/creative-mockup.webp",
    previewUrl: "#",
    checkout: "#",
    file: "kynar-icon-system-v1.zip"
  }
];

/* ══════════════════════════════════════════════════════════════════════════
   2. DATA ACCESSORS
   ══════════════════════════════════════════════════════════════════════════ */

// High-Fidelity Data Lock
VAULT.forEach(Object.freeze);
Object.freeze(VAULT);

export { VAULT };



export function getProduct(id) {
  return VAULT.find((p) => p.id === id) || null;
}

export function getByCategory(cat) {
  return VAULT.filter((p) => p.category === cat);
}



