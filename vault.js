/* ══════════════════════════════════════════════════════════════════════════
   THE KYNAR VAULT (Creator Edition - Placeholder Version)
   Currency: GBP (£)
   ══════════════════════════════════════════════════════════════════════════ */

const VAULT = [
    {
        id: 'finance-architect',
        category: 'planner',
        title: "The Finance Architect",
        price: "£24.00",
        tag: "Notion",
        desc: "A master system for wealth. Track income, automate budget categories, and visualize your net worth growth in one premium Notion dashboard.",
        features: ["Automated Income Tracking", "Subscription Manager", "50/30/20 Rule Built-in", "Mobile-First View"],
        bg: "var(--pastel-sage)",
        image: "assets/images/finance-mockup.png",
        checkout: "#" // PLACEHOLDER: Replace with Lemon Squeezy URL later
    },
    {
        id: 'influence-suite',
        category: 'creative',
        title: "The Influence Suite",
        price: "£35.00",
        tag: "Canva",
        desc: "Stop designing from scratch. 50+ high-conversion Instagram carousels and highlight covers designed to stop the scroll.",
        features: ["50+ Carousel Slides", "10 Highlight Icons", "Fully Editable in Canva", "Free Font Pairings"],
        bg: "var(--pastel-clay)",
        image: "assets/images/creative-mockup.png",
        checkout: "#" // PLACEHOLDER: Replace with Lemon Squeezy URL later
    },
    {
        id: 'aura-presets',
        category: 'creative',
        title: "Aura Presets",
        price: "£19.00",
        tag: "Lightroom",
        desc: "The 'Old Money' aesthetic in one click. A collection of 10 mobile Lightroom presets for creating warm, cinematic travel and lifestyle photos.",
        features: ["10 Mobile DNG Files", "Non-Destructive Editing", "Installation Guide", "Skin Tone Protection"],
        bg: "var(--pastel-sky)",
        image: "assets/images/visual-mockup.png",
        checkout: "#" // PLACEHOLDER: Replace with Lemon Squeezy URL later
    },
    {
        id: 'scribe-vault',
        category: 'code',
        title: "The Scribe Vault",
        price: "£15.00",
        tag: "AI Prompts",
        desc: "Unlock the full power of ChatGPT. A library of 100+ 'fill-in-the-blank' prompts for marketers, copywriters, and content creators.",
        features: ["100+ Tested Prompts", "Email Sequence Builders", "Blog Outline Generators", "Notion & PDF Format"],
        bg: "var(--pastel-sage)",
        image: "assets/images/code-mockup.png",
        checkout: "#" // PLACEHOLDER: Replace with Lemon Squeezy URL later
    }
];

// UTILITY: Fetch product by ID for use in product.html
function getProduct(id) {
    return VAULT.find(p => p.id === id);
}
