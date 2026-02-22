// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    // 1. Get environment variable.
    // Note: In some Vercel contexts, process.env might be needed, but try standard Astro first.
    const isLocked = import.meta.env.SITE_LOCKED === "true";
    
    // 2. Get URL details from the context
    const url = new URL(context.request.url);
    const currentPath = url.pathname;

    // 3. Check for bypass key
    const hasBypassKey = url.searchParams.get("secret_bypass") === "contrastRadioDev2026";

    // 4. Check if already on the coming soon page
    // We check startWith to avoid infinite loops on /coming-soon and /coming-soon/
    const isComingSoonPage = currentPath.startsWith("/coming-soon");

    // 5. IMPORTANT: Don't block static assets (images, fonts, css)
    // If we block these, the coming soon page will look broken.
    // Astro assets usually start with /_astro/ or are in /public/ like favicon.ico
    const isAsset = currentPath.startsWith('/_astro') || 
                    currentPath.startsWith('/fonts') ||
                    currentPath.includes('favicon.ico');

    // --- DEBUGGING ---
    // console.log(`[MW] Locked: ${isLocked} | Path: ${currentPath} | Asset: ${isAsset}`);
    // -----------------

    // 6. The Redirect Decision
    if (isLocked && !hasBypassKey && !isComingSoonPage && !isAsset) {
        // Use context.redirect() in middleware
        return context.redirect("/coming-soon");
    }

    // 7. If not blocked, continue rendering the requested page
    return next();
});