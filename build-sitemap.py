import os
import datetime

# CONFIGURATION
BASE_URL = "https://kynaruniverse.co.uk"
IGNORE_FILES = [
    "checkout.html",
    "success.html",
    "account.html",
    "404.html",
    "google-site-verification.html" # Example if you add one later
]

# PRIORITY RULES (0.0 to 1.0)
PRIORITY_MAP = {
    "index.html": "1.0",
    "shop-tech.html": "0.9",
    "shop-life.html": "0.9",
    "shop-family.html": "0.9",
    "hub.html": "0.8",
    "product": "0.8", # Matches any file starting with 'product'
    "about.html": "0.7",
    "legal.html": "0.3"
}

def get_priority(filename):
    if filename in PRIORITY_MAP:
        return PRIORITY_MAP[filename]
    # Check for partial matches (like product-*.html)
    for key in PRIORITY_MAP:
        if filename.startswith(key):
            return PRIORITY_MAP[key]
    return "0.5" # Default

def generate_sitemap():
    files = [f for f in os.listdir('.') if f.endswith('.html')]
    today = datetime.date.today().isoformat()
    
    xml_content = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_content.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    print(f"🔍 Scanning directory... Found {len(files)} HTML files.")

    for filename in files:
        if filename in IGNORE_FILES:
            print(f"   Skipping private file: {filename}")
            continue

        priority = get_priority(filename)
        # Handle index.html as the root URL too
        if filename == "index.html":
            # Add root domain
            xml_content.append(f"""    <url>
        <loc>{BASE_URL}/</loc>
        <lastmod>{today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>""")

        # Add the specific file
        xml_content.append(f"""    <url>
        <loc>{BASE_URL}/{filename}</loc>
        <lastmod>{today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>{priority}</priority>
    </url>""")
        
        print(f"   + Added: {filename} (Priority: {priority})")

    xml_content.append('</urlset>')

    with open("sitemap.xml", "w") as f:
        f.write("\n".join(xml_content))
    
    print("\n✅ SUCCESS: sitemap.xml generated successfully.")

if __name__ == "__main__":
    generate_sitemap()
