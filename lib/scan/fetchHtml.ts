export type FetchHtmlResult = {
    ok: boolean;
    status: number;
    contentType: string;
    html: string;
    finalUrl: string;
    headers: Record<string, string>;
    ttfbMs: number;
    loadMs: number;
    sizeBytes: number;
};

const SCAN_USER_AGENT =
    "SiteERBot/1.0 (+https://siteer.app) Website audit for business owners";

export async function fetchHtml(url: string): Promise<FetchHtmlResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const start = Date.now();

    try {
        const res = await fetch(url, {
            method: "GET",
            redirect: "follow",
            signal: controller.signal,
            headers: {
                "User-Agent": SCAN_USER_AGENT,
                Accept: "text/html,application/xhtml+xml",
            },
        });

        const ttfbMs = Date.now() - start;
        const contentType = res.headers.get("content-type") || "";
        let html = "";

        if (contentType.includes("text/html")) {
            html = await res.text();
            if (html.length > 1_000_000) {
                html = html.slice(0, 1_000_000);
            }
        }

        return {
            ok: res.ok,
            status: res.status,
            contentType,
            html,
            finalUrl: res.url,
            headers: Object.fromEntries(res.headers.entries()) as Record<string, string>,
            ttfbMs,
            loadMs: Date.now() - start,
            sizeBytes: Buffer.byteLength(html, "utf8"),
        };
    } finally {
        clearTimeout(timeout);
    }
}

async function safeHead(url: string): Promise<boolean> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);

    try {
        const response = await fetch(url, {
            method: "GET",
            redirect: "follow",
            signal: controller.signal,
            headers: {
                "User-Agent": SCAN_USER_AGENT,
                Accept: "text/plain,text/xml,application/xml,*/*",
            },
        });

        return response.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timeout);
    }
}

export async function checkIndexingFiles(
    finalUrl: string,
): Promise<{ hasRobots: boolean; hasSitemap: boolean }> {
    const base = new URL(finalUrl);
    const robotsUrl = new URL("/robots.txt", base).toString();
    const sitemapUrl = new URL("/sitemap.xml", base).toString();

    const [hasRobots, hasSitemap] = await Promise.all([
        safeHead(robotsUrl),
        safeHead(sitemapUrl),
    ]);

    return { hasRobots, hasSitemap };
}
