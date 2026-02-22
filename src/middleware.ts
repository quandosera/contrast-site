// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    // 1. Get environment variable
    // We check BOTH the Astro way and the standard Vercel/Node way.
    const isLocked = import.meta.env.SITE_LOCKED === "true" || process.env.SITE_LOCKED === "true";
    
    // 2. Get URL details from the context
    const url = new URL(context.request.url);
    const currentPath = url.pathname;

    // 3. Check for bypass key
    const hasBypassKey = url.searchParams.get("secret_bypass") === "contrastRadioDev2026";

    // 4. Check if already on the coming soon page
    const isComingSoonPage = currentPath.startsWith("/coming-soon");

    // 5. Exclude assets and the CMS admin panel
    const isAsset = currentPath.startsWith('/_astro') || 
                    currentPath.startsWith('/fonts') ||
                    currentPath.startsWith('/keystatic') || // Keeps your admin panel accessible
                    currentPath.includes('favicon.ico');

    // --- LOGGING ---
    // This will appear in your Vercel Dashboard -> Logs tab
    console.log(`[MW] Locked: ${isLocked} | Path: ${currentPath} | Bypass: ${hasBypassKey}`);

    // 6. The Redirect Decision
    if (isLocked && !hasBypassKey && !isComingSoonPage && !isAsset) {
        return context.redirect("/coming-soon");
    }

    // 7. Proceed normally
    return next();
});