/* ASTRYX PRODUCT & CONTENT DATABASE */

// 1. PRODUCTS (The Marketplace)
export const products = {
  "daily-clarity-planner": {
    title: "The Daily Clarity Planner",
    category: "tools",
    tag: "Productivity",
    shortDesc: "A simple, guided system to organize your day without the overwhelm.",
    loreWhisper: "A small tool for a brighter day.",
    description: "This isn't just a to-do list. It's a framework for clearing your mind. Designed for creators who have too many ideas and not enough time.",
    features: ["Daily focus blocks", "Energy tracking", "Reflection prompts", "Printable PDF"],
    actionBtn: "Download Now", 
    gumroadLink: "#", 
    previewEmoji: "📝" 
  },
  "morning-mindset-journal": {
    title: "Morning Mindset Journal",
    category: "living",
    tag: "Wellness",
    shortDesc: "Start your day with intention and calm.",
    loreWhisper: "Here’s where your story grows.",
    description: "A 5-minute journaling routine to set a calm, positive tone for the rest of your day.",
    features: ["Gratitude prompts", "Intention setting", "Mood tracker"],
    actionBtn: "Get Journal",
    gumroadLink: "#",
    previewEmoji: "☀️"
  },
  "kids-math-pack": {
    title: "Little Math Explorers",
    category: "home",
    tag: "Family",
    shortDesc: "Fun, colorful math worksheets for ages 4-6.",
    loreWhisper: "This space is yours.",
    description: "Turn math practice into a game. Visual storytelling helps kids understand numbers.",
    features: ["Counting animals", "Simple addition", "Color-by-number"],
    actionBtn: "Download Pack",
    gumroadLink: "#",
    previewEmoji: "🦁"
  }
};

// 2. GUIDES (The Blog/Hub)
export const guides = {
  "start-journaling": {
    title: "How to Start Journaling (Without Pressure)",
    category: "hub", // Triggers Hub Theme
    date: "Guide 01",
    readTime: "3 min read",
    shortDesc: "Simple tips to build a habit that sticks.",
    // HTML Content allowed inside backticks
    content: `
      <h2 class="text-h2">Start Small</h2>
      <p class="text-body">You don't need to write a novel. Start with one sentence a day. The goal is consistency, not volume.</p>
      <br>
      <h2 class="text-h2">Set the Scene</h2>
      <p class="text-body">Find a quiet corner. Make a tea. specific time of day helps your brain recognize it's time to slow down.</p>
      <br>
      <h2 class="text-h2">Use Prompts</h2>
      <p class="text-body">Staring at a blank page is hard. Ask yourself: "What made me smile today?" or "What is one thing I learned?"</p>
    `
  },
  "calm-morning-routine": {
    title: "Building a Calm Morning Routine",
    category: "hub",
    date: "Guide 02",
    readTime: "5 min read",
    shortDesc: "Reclaim your mornings from chaos.",
    content: `
      <h2 class="text-h2">No Phones First</h2>
      <p class="text-body">The world can wait. Give yourself 10 minutes of silence before letting the noise in.</p>
      <br>
      <h2 class="text-h2">Hydrate and Move</h2>
      <p class="text-body">A glass of water and a simple stretch tells your body it's time to wake up gently.</p>
    `
  }
};
