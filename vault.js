/* ══════════════════════════════════════════════════════════════════════════
   KYNAR DATA VAULT (Product Database)
   Version: 4.1
   ══════════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════════
   1. PRODUCT INVENTORY
   ══════════════════════════════════════════════════════════════════════════ */

const VAULT = [
  {
    id: "finance-architect",
    category: "personal",
    status: "coming-soon",
    title: "The Finance Tracker",
    shortDesc: "Complete wealth management",
    price: "£24.00",
    tag: "Organization",
    desc: "A complete personal finance and wealth tracker for everyone. Manage your income, automate your budget, and watch your savings grow in one intuitive dashboard.",
    features: [
      "Simple Income Tracking",
      "Monthly Budget Planner",
      "Savings Goal Tracker",
      "Mobile-Friendly Design",
    ],
    bg: "var(--pastel-sage)",
    image: "assets/images/finance-mockup.png",
    checkout: "#",
  },

  {
    id: "influence-suite",
    category: "creative",
    status: "coming-soon",
    title: "The Social Suite",
    shortDesc: "Ready-to-use creative templates",
    price: "£35.00",
    tag: "Creative",
    desc: "Professional social media templates for any occasion. 50+ editable designs created to help you share your story beautifully and effortlessly.",
    features: [
      "50+ Social Templates",
      "Versatile Design Style",
      "Easy Canva Editing",
      "Step-by-Step Guide",
    ],
    bg: "var(--pastel-clay)",
    image: "assets/images/creative-mockup.png",
    checkout: "#",
  },

  {
    id: "aura-presets",
    category: "creative",
    status: "coming-soon",
    title: "Aura Photo Filters",
    shortDesc: "Cinematic lifestyle presets",
    price: "£19.00",
    tag: "Photography",
    desc: "Transform your photos in seconds. A collection of 10 essential mobile filters designed to give your everyday memories a warm, cinematic feel.",
    features: [
      "10 One-Click Filters",
      "Works for All Photos",
      "Easy Mobile Setup",
      "Natural Look Preserved",
    ],
    bg: "var(--pastel-sky)",
    image: "assets/images/visual-mockup.png",
    checkout: "#",
  },

  {
    id: "scribe-vault",
    category: "work",
    status: "coming-soon",
    title: "The Prompt Library",
    shortDesc: "AI prompts for every task",
    price: "£15.00",
    tag: "AI Tools",
    desc: "The ultimate AI prompt library for every task. Over 100+ tested prompts to help you write better emails, plan projects, and get more done with ChatGPT.",
    features: [
      "100+ Multi-use Prompts",
      "Daily Productivity Hacks",
      "Creative Writing Aids",
      "Instant Digital Access",
    ],
    bg: "var(--pastel-clay)",
    image: "assets/images/code-mockup.png",
    checkout: "#",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   2. DATA ACCESSORS
   ══════════════════════════════════════════════════════════════════════════ */

// Retrieve a single product object by its ID string
function getProduct(id) {
  return VAULT.find((p) => p.id === id);
}
