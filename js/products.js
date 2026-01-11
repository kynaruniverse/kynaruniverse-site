/* js/products.js - KYNAR UNIVERSE PRODUCT DATABASE V3.0 (Complete Inventory) */

const KynarDatabase = {
    // --- KYNAR FAMILY SECTOR (SECTOR_03) ---
    "preschool-bundle": {
        title: "EARLY_LOGIC_INITIATION_KIT",
        tagline: "Cognitive Pattern Recognition // Ages 3-5",
        price: "£18",
        category: "Family",
        badgeType: "PRINTABLE_PDF",
        badgeLevel: "LEVEL_1",
        meta: "100+ PAGES • INSTANT_DEPLOY",
        description: `
            <p><strong>[OBJECTIVE]</strong> Eliminate screen dependency. Establish neural pathways for pattern recognition, numeracy, and fine motor control.</p>
            <p><strong>[EXECUTION]</strong> 100+ pages of high-contrast logic puzzles. Download, print, and initiate early-years training protocols.</p>
        `,
        image: "assets/images/product-family-1.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/PRESCHOOL_ID",
        files: ["Logic_Core.pdf", "Pattern_Recognition.pdf", "Counting_Matrix.pdf"],
        related: ["chore-system", "meal-plan"]
    },

    "chore-system": {
        title: "DOMESTIC_OPS_GRID",
        tagline: "Visual Responsibility Matrix.",
        price: "£6",
        category: "Family",
        badgeType: "VISUAL_OS",
        badgeLevel: "SYSTEM",
        meta: "HABIT_BUILDER • CHART_LOGIC",
        description: "<p><strong>[SYSTEM]</strong> A visual command center for household logistics. Gamify maintenance tasks to increase compliance and habit retention.</p>",
        image: "assets/images/product-family-2.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/CHORE_ID",
        files: ["Ops_Chart.pdf", "Icon_Pack_V2.pdf", "Protocol_Guide.pdf"],
        related: ["preschool-bundle", "meal-plan"]
    },

    "meal-plan": {
        title: "NUTRITION_LOGISTICS_PLAN",
        tagline: "Inventory & Caloric Management.",
        price: "£9",
        category: "Family",
        badgeType: "SYSTEM_PDF",
        badgeLevel: "LOGISTICS",
        meta: "WEEKLY_GRID • ZERO_WASTE",
        description: "<p><strong>[OPTIMIZATION]</strong> Eliminate decision fatigue. Align inventory with nutritional requirements using this weekly tactical grid.</p>",
        image: "assets/images/product-family-3.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/MEAL_ID",
        files: ["Meal_Grid.pdf", "Inventory_Tracker.pdf"],
        related: ["chore-system", "coloring-book"]
    },

    "coloring-book": {
        title: "ANALOG_DECOMPRESSION_KIT",
        tagline: "Cortisol Reduction Patterns.",
        price: "£7",
        category: "Family",
        badgeType: "CREATIVE",
        badgeLevel: "RESTORE",
        meta: "GEOMETRIC • HIGH_RES",
        description: "<p><strong>[RECOVERY]</strong> Complex geometric data for analog processing. Lower stress levels through manual color application.</p>",
        image: "assets/images/product-family-4.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/COLOR_ID",
        files: ["Pattern_Matrix.pdf"],
        related: ["preschool-bundle", "mood-journal"]
    },

    // --- KYNAR LIFE SECTOR (SECTOR_02) ---
    "life-os-planner": {
        title: "LIFE_OS_2026_CORE",
        tagline: "Timeline Architecture & Command.",
        price: "£12",
        category: "Life",
        badgeType: "DIGITAL_PDF",
        badgeLevel: "HYPERLINKED",
        meta: "JAN_DEC 2026 • 450+ NODES",
        description: `
            <p><strong>[COMMAND]</strong> The 2026 Life OS is a high-performance navigation tool. Instant hyperlink jumps between yearly vision and daily execution.</p>
            <p><strong>[SPECS]</strong> Optimized for iPad/Tablet. Zero-lag navigation. Distraction-free grid.</p>
        `,
        image: "assets/images/product-life-1.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/PLANNER_ID",
        files: ["Life_OS_2026.pdf", "Install_Guide.pdf"],
        related: ["finance-dashboard", "routine-architect"]
    },

    "finance-dashboard": {
        title: "WEALTH_DASHBOARD_XLS",
        tagline: "Capital Flow Visualization.",
        price: "£15",
        category: "Life",
        badgeType: "XLS / SHEETS",
        badgeLevel: "AUTOMATED",
        meta: "MACRO_VBA • REAL_TIME",
        description: "<p><strong>[FINANCE]</strong> A robust architecture for asset tracking. Automated formulas provide a real-time health check of your economic engine.</p>",
        image: "assets/images/product-life-2.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/FINANCE_ID",
        files: ["Finance_Core.xlsx", "Documentation.pdf"],
        related: ["life-os-planner", "routine-architect"]
    },

    "routine-architect": {
        title: "HABIT_STACK_ARCHITECT",
        tagline: "Consistency Algorithms.",
        price: "£9",
        category: "Life",
        badgeType: "NOTION",
        badgeLevel: "TEMPLATE",
        meta: "SYNC_ENABLED • DATABASE",
        description: "<p><strong>[LOGIC]</strong> Build high-performance daily loops. Use database logic to visualize and enforce consistency streaks.</p>",
        image: "assets/images/product-life-3.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/ROUTINE_ID",
        files: ["Template_Access.txt", "Guide.pdf"],
        related: ["mood-journal", "life-os-planner"]
    },

    "mood-journal": {
        title: "CLARITY_LOG_V1",
        tagline: "Emotional Data Logging.",
        price: "£8",
        category: "Life",
        badgeType: "PDF",
        badgeLevel: "WELLNESS",
        meta: "DAILY_REFLECT • MINIMAL",
        description: "<p><strong>[INPUT]</strong> A minimalist terminal for emotional data. Track intentions and mental trends with zero UI clutter.</p>",
        image: "assets/images/product-life-4.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/MOOD_ID",
        files: ["Daily_Log.pdf"],
        related: ["life-os-planner", "coloring-book"]
    },

    // --- KYNAR TECH SECTOR (SECTOR_01) ---
    "auto-invoice": {
        title: "AUTO_INVOICE_GEN_V2",
        tagline: "Automated Revenue Capture.",
        price: "£24",
        category: "Tech",
        badgeType: "PYTHON_CLI",
        badgeLevel: "UTILITY",
        meta: "CLI_OPTIMIZED • CSV_PARSE",
        description: `
            <p><strong>[AUTOMATION]</strong> Eliminate administrative friction. Parses local timesheets and compiles PDF invoices in < 0.4s.</p>
            <p><strong>[TARGET]</strong> Developers and Freelancers prioritizing code over paperwork.</p>
        `,
        image: "assets/images/product-tech-1.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/INVOICE_ID",
        files: ["generator.py", "config.json", "Setup_Guide.pdf"],
        related: ["desktop-cleaner", "bulk-resizer"]
    },

    "desktop-cleaner": {
        title: "SYSTEM_CLEANER_SCRIPT",
        tagline: "Workspace Entropy Reduction.",
        price: "£8",
        category: "Tech",
        badgeType: "PYTHON",
        badgeLevel: "MAINTENANCE",
        meta: "ONE_CLICK • RECURSIVE",
        description: "<p><strong>[CLEANUP]</strong> Categorize and organize cluttered directories instantly. Keep your dev environment pristine with a single command.</p>",
        image: "assets/images/product-tech-2.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/CLEANER_ID",
        files: ["cleaner.py", "rules.json"],
        related: ["auto-invoice", "bulk-resizer"]
    },

    "bulk-resizer": {
        title: "MEDIA_OPTIMIZER_CLI",
        tagline: "Batch Asset Processing.",
        price: "£10",
        category: "Tech",
        badgeType: "BASH / PY",
        badgeLevel: "MEDIA",
        meta: "LOSSLESS • BATCH_OPS",
        description: "<p><strong>[PIPELINE]</strong> Process thousands of assets. Resize, compress, and rename image directories via simple terminal commands.</p>",
        image: "assets/images/product-tech-3.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/RESIZER_ID",
        files: ["resizer.sh", "requirements.txt"],
        related: ["auto-invoice", "desktop-cleaner"]
    },

    "social-scheduler": {
        title: "HEADLESS_SOCIAL_BOT",
        tagline: "API Content Deployment.",
        price: "£18",
        category: "Tech",
        badgeType: "API_TOOL",
        badgeLevel: "MARKETING",
        meta: "CRON_JOBS • JSON_CONFIG",
        description: "<p><strong>[DEPLOY]</strong> A lightweight bot to schedule broadcasts via API. Bypass bloated dashboards and GUIs.</p>",
        image: "assets/images/product-tech-4.jpg",
        lsLink: "https://kynar.lemonsqueezy.com/checkout/buy/SOCIAL_ID",
        files: ["bot.py", "cron_setup.txt"],
        related: ["auto-invoice", "routine-architect"]
    }
};

