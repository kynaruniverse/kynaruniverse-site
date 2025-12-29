/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: KYNAR SECURE VAULT
 * ══════════════════════════════════════════════════════════════════════════
 * @description Handles secure asset retrieval. Generates time-bombed 
 * download links from Supabase Storage so assets cannot be stolen.
 */

import { supabase } from './supabase-config.js';

// 1. GLOBAL DOWNLOAD FUNCTION
// Attached to window so it can be called by onclick="..." in HTML
window.downloadProduct = async (filePath) => {
    
    // UI Feedback
    if(window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = "wait";

    try {
        console.log(`Vault: Requesting access for ${filePath}...`);

        // 2. CHECK AUTH (Double Security)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("Unauthorized: Please log in to access the vault.");
        }

        // 3. GENERATE SIGNED URL (Valid for 60 seconds)
        // Assumes your Supabase Storage bucket is named 'products'
        const { data, error } = await supabase
            .storage
            .from('products')
            .createSignedUrl(filePath, 60, {
                download: true // Forces browser to download instead of open
            });

        if (error) throw error;

        // 4. TRIGGER DOWNLOAD
        // We create a temporary invisible link and click it
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.setAttribute('download', filePath.split('/').pop()); // Cleanup filename
        document.body.appendChild(link);
        link.click();
        link.remove();

        console.log("Vault: Asset secured and transferred.");

    } catch (err) {
        console.error("Vault Error:", err);
        alert(`Access Denied: ${err.message}`);
    } finally {
        document.body.style.cursor = originalCursor;
    }
};

console.log("Kynar Vault: Secure Protocol Active");
