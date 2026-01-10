/* js/products.js - KYNAR UNIVERSE PRODUCT DATABASE V3.0 (Complete Inventory) */

const KynarDatabase = {
    // --- KYNAR FAMILY SECTOR ---
    "preschool-bundle": {
        title: "Ultimate Preschool Bundle",
        tagline: "Educational Logic for Early Years.",
        price: "£18",
        category: "Family",
        badgeType: "Printable",
        badgeLevel: "Ages 3-5",
        meta: "100+ PAGE_REGISTRY • INSTANT_DOWNLOAD",
        description: `
            <p>Eliminate screen fatigue with over 100 pages of educational logic. Designed by early-years specialists to develop motor skills, pattern recognition, and numeracy.</p>
            <p>Physical engagement for the modern household. Simply download, print, and initiate learning protocols.</p>
        `,
        image: "assets/images/product-family-1.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/PRESCHOOL_ID",
        files: ["Tracing_Pack.pdf", "Logic_Puzzles.pdf", "Counting_Games.pdf"],
        related: ["chore-system", "meal-plan"]
    },

    "chore-system": {
        title: "Household Chore System",
        tagline: "Systematize Responsibility.",
        price: "£6",
        category: "Family",
        badgeType: "Printable",
        badgeLevel: "Visual OS",
        meta: "Interactive Chart • Habit Builder",
        description: "<p>A visual command center for household tasks. Reward logic integrated to turn chores into habit-forming achievements.</p>",
        image: "assets/images/product-family-2.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/CHORE_ID",
        files: ["Chore_Chart.pdf", "Icon_Pack.pdf", "Instructions.pdf"],
        related: ["preschool-bundle", "meal-plan"]
    },

    "meal-plan": {
        title: "Meal & Grocery Action Plan",
        tagline: "Nutritional Logistics.",
        price: "£9",
        category: "Family",
        badgeType: "Printable",
        badgeLevel: "System",
        meta: "Weekly Grid • Inventory Tracker",
        description: "<p>Reduce food waste and decision fatigue. This visual system aligns your inventory with your weekly nutritional requirements.</p>",
        image: "assets/images/product-family-3.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/MEAL_ID",
        files: ["Meal_Planner.pdf", "Shopping_List.pdf"],
        related: ["chore-system", "coloring-book"]
    },

    "coloring-book": {
        title: "Stress-Relief Coloring",
        tagline: "Analog Decompression.",
        price: "£7",
        category: "Family",
        badgeType: "Printable",
        badgeLevel: "Creative",
        meta: "High Resolution • Adult/Teen",
        description: "<p>Complex geometric patterns designed to lower cortisol levels. Print as needed for analog downtime.</p>",
        image: "assets/images/product-family-4.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/COLOR_ID",
        files: ["Pattern_Book.pdf"],
        related: ["preschool-bundle", "mood-journal"]
    },

    // --- KYNAR LIFE SECTOR ---
    "life-os-planner": {
        title: "2026 Life OS Planner",
        tagline: "Master the 2026 Timeline.",
        price: "£12",
        category: "Life",
        badgeType: "Digital PDF",
        badgeLevel: "Hyperlinked",
        meta: "JAN_DEC 2026 • 450+ PAGES",
        description: `
            <p>The 2026 Life OS is a high-performance command center. Built with precision-engineered hyperlinked tabs for instantaneous navigation between yearly vision and daily execution.</p>
            <p>Optimized for iPad and Tablet users requiring a tactile, focused organization protocol.</p>
        `,
        image: "assets/images/product-life-1.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/PLANNER_ID",
        files: ["Life_OS_2026.pdf", "User_Guide.pdf"],
        related: ["finance-dashboard", "routine-architect"]
    },

    "finance-dashboard": {
        title: "Personal Finance Dashboard",
        tagline: "Wealth Management Protocol.",
        price: "£15",
        category: "Life",
        badgeType: "Spreadsheet",
        badgeLevel: "Automated",
        meta: "Excel / Google Sheets Compatible",
        description: "<p>A robust financial architecture to track assets, liabilities, and monthly cash flow. Automated formulas provide a real-time health check of your economy.</p>",
        image: "assets/images/product-life-2.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/FINANCE_ID",
        files: ["Finance_Dashboard.xlsx", "Documentation.pdf"],
        related: ["life-os-planner", "routine-architect"]
    },

    "routine-architect": {
        title: "Routine Architect",
        tagline: "Habit Stack Construction.",
        price: "£9",
        category: "Life",
        badgeType: "Notion",
        badgeLevel: "Template",
        meta: "Notion Sync • Mobile Ready",
        description: "<p>Build and track high-performance daily loops. This Notion template uses database logic to visualize your consistency streaks.</p>",
        image: "assets/images/product-life-3.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/ROUTINE_ID",
        files: ["Template_Link.txt", "Guide.pdf"],
        related: ["mood-journal", "life-os-planner"]
    },

    "mood-journal": {
        title: "Mood & Gratitude Journal",
        tagline: "Calibrate Clarity.",
        price: "£8",
        category: "Life",
        badgeType: "PDF",
        badgeLevel: "Wellness",
        meta: "Daily Reflection • Digital_Native",
        description: "<p>A minimalist interface for emotional data logging. Track daily intentions and long-term mental trends with zero clutter.</p>",
        image: "assets/images/product-life-4.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/MOOD_ID",
        files: ["Daily_Journal.pdf"],
        related: ["life-os-planner", "coloring-book"]
    },

    // --- KYNAR TECH SECTOR ---
    "auto-invoice": {
        title: "Auto-Invoice Generator",
        tagline: "Automated Billing Protocol.",
        price: "£24",
        category: "Tech",
        badgeType: "Python Script",
        badgeLevel: "Core Utility",
        meta: "VERSION 2.1 • CLI_OPTIMIZED",
        description: `
            <p>Eliminate administrative friction. This Python script parses local CSV timesheets, calculates totals, and generates professional PDF invoices in seconds.</p>
            <p>Engineered for developers and freelancers who prioritize work over paperwork.</p>
        `,
        image: "assets/images/product-tech-1.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/INVOICE_ID",
        files: ["generator.py", "config.json", "Setup_Guide.pdf"],
        related: ["desktop-cleaner", "bulk-resizer"]
    },

    "desktop-cleaner": {
        title: "Desktop Cleaner & Organizer",
        tagline: "Restore Workspace Order.",
        price: "£8",
        category: "Tech",
        badgeType: "Python",
        badgeLevel: "Utility",
        meta: "One-Click Cleanup • Cross_Platform",
        description: "<p>A high-speed utility script that categorizes and organizes cluttered directories instantly. Keep your dev environment pristine with a single command.</p>",
        image: "assets/images/product-tech-2.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/CLEANER_ID",
        files: ["cleaner.py", "rules.json"],
        related: ["auto-invoice", "bulk-resizer"]
    },

    "bulk-resizer": {
        title: "Bulk Image Resizer CLI",
        tagline: "Media Pipeline Optimization.",
        price: "£10",
        category: "Tech",
        badgeType: "Bash/Python",
        badgeLevel: "Media",
        meta: "Lossless Compression • Batch",
        description: "<p>Process thousands of assets in minutes. Resize, compress, and rename image directories via simple CLI commands.</p>",
        image: "assets/images/product-tech-3.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/RESIZER_ID",
        files: ["resizer.sh", "requirements.txt"],
        related: ["auto-invoice", "desktop-cleaner"]
    },

    "social-scheduler": {
        title: "Social API Scheduler",
        tagline: "Headless Content Deployment.",
        price: "£18",
        category: "Tech",
        badgeType: "API Tool",
        badgeLevel: "Marketing",
        meta: "Cron Jobs • JSON Config",
        description: "<p>A lightweight bot to schedule tweets and posts via API, bypassing bloated social media dashboards.</p>",
        image: "assets/images/product-tech-4.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/SOCIAL_ID",
        files: ["bot.py", "cron_setup.txt"],
        related: ["auto-invoice", "routine-architect"]
    }
};
