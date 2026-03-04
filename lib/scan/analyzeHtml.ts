import * as cheerio from "cheerio";
import type { FetchHtmlResult } from "@/lib/scan/fetchHtml";

export type Severity = "high" | "medium" | "low";
export type IssueCategory =
    | "speed"
    | "mobile"
    | "seo"
    | "conversion"
    | "trust"
    | "technical";

export type Issue = {
    category: IssueCategory;
    severity: Severity;
    description: string;
    recommendation: string;
};

export type Analysis = {
    metrics: Record<string, unknown>;
    issues: Issue[];
};

const TRUST_WORDS = [
    "licensed",
    "insured",
    "bonded",
    "warranty",
    "guarantee",
    "certified",
    "reviews",
    "google reviews",
    "5-star",
];

const CTA_TERMS = [
    "call",
    "book",
    "schedule",
    "quote",
    "estimate",
    "contact",
    "start",
    "buy",
    "order",
    "get",
];

function textLen(value: string | null | undefined): number {
    return (value || "").trim().length;
}

function pushIssue(
    issues: Issue[],
    category: IssueCategory,
    severity: Severity,
    description: string,
    recommendation: string,
): void {
    issues.push({ category, severity, description, recommendation });
}

function hasResponsiveSignals(html: string): boolean {
    return /@media\s*\(/i.test(html) || /(sm:|md:|lg:|xl:)/i.test(html);
}

function hasBasicSchema($: cheerio.CheerioAPI): boolean {
    const nodes = $('script[type="application/ld+json"]');
    if (!nodes.length) return false;

    let found = false;
    nodes.each((_, el) => {
        if (found) return;
        const raw = $(el).html() || "";
        const normalized = raw.toLowerCase();
        if (
            normalized.includes('"@type":"organization"') ||
            normalized.includes('"@type":"localbusiness"') ||
            normalized.includes('"@type":"product"')
        ) {
            found = true;
        }
    });

    return found;
}

function hasMixedContent($: cheerio.CheerioAPI): boolean {
    const elements = $(
        "img[src],script[src],iframe[src],source[src],link[rel='stylesheet'][href]",
    ).toArray();

    for (const element of elements) {
        const source = $(element).attr("src") || $(element).attr("href") || "";
        if (source.startsWith("http://")) return true;
    }

    return false;
}

export function analyzeHtml(
    fetched: FetchHtmlResult,
    indexing?: { hasRobots: boolean; hasSitemap: boolean },
): Analysis {
    const $ = cheerio.load(fetched.html || "");
    const issues: Issue[] = [];
    const metrics: Record<string, unknown> = {
        http_status: fetched.status,
        final_url: fetched.finalUrl,
        content_type: fetched.contentType,
        ttfb_ms: fetched.ttfbMs,
        load_ms: fetched.loadMs,
        page_size_kb: Math.round(fetched.sizeBytes / 1024),
    };

    if (!fetched.contentType.includes("text/html")) {
        pushIssue(
            issues,
            "technical",
            "high",
            "The URL did not return an HTML page.",
            "Point the scan to a valid public homepage URL.",
        );
    }

    if (fetched.status >= 500) {
        pushIssue(
            issues,
            "technical",
            "high",
            `Homepage returned HTTP ${fetched.status}.`,
            "Fix server or hosting errors so the homepage is reachable.",
        );
    } else if (fetched.status >= 400) {
        pushIssue(
            issues,
            "technical",
            "medium",
            `Homepage returned HTTP ${fetched.status}.`,
            "Fix routing errors and make sure the homepage returns HTTP 200.",
        );
    }

    const isHttps = fetched.finalUrl.startsWith("https://");
    metrics.https = isHttps;
    if (!isHttps) {
        pushIssue(
            issues,
            "technical",
            "high",
            "Site is not using HTTPS.",
            "Enable SSL so visitors do not see insecure warnings.",
        );
    }

    if (isHttps && hasMixedContent($)) {
        metrics.has_mixed_content = true;
        pushIssue(
            issues,
            "technical",
            "medium",
            "Mixed content detected (HTTP assets on HTTPS page).",
            "Serve all scripts, images, and styles over HTTPS only.",
        );
    } else {
        metrics.has_mixed_content = false;
    }

    if (fetched.loadMs > 5_000) {
        pushIssue(
            issues,
            "speed",
            "high",
            `Slow response: page loaded in ${Math.round(fetched.loadMs / 100) / 10}s.`,
            "Compress images, remove heavy scripts, and use caching/CDN.",
        );
    } else if (fetched.loadMs > 3_000) {
        pushIssue(
            issues,
            "speed",
            "medium",
            `Page speed is borderline (${Math.round(fetched.loadMs / 100) / 10}s).`,
            "Trim heavy assets and optimize third-party scripts.",
        );
    }

    if (fetched.ttfbMs > 1_500) {
        pushIssue(
            issues,
            "speed",
            "medium",
            `Slow server response (TTFB ${fetched.ttfbMs}ms).`,
            "Improve hosting response time and add full-page caching.",
        );
    }

    if (fetched.sizeBytes > 1_000_000) {
        pushIssue(
            issues,
            "speed",
            "high",
            `Large HTML payload (${Math.round(fetched.sizeBytes / 1024)}KB).`,
            "Reduce page weight and defer non-critical scripts.",
        );
    }

    const title = $("title").first().text();
    metrics.title_length = textLen(title);
    if (metrics.title_length === 0) {
        pushIssue(
            issues,
            "seo",
            "high",
            "Missing <title> tag.",
            "Add a 10-70 character title with service + location.",
        );
    } else if ((metrics.title_length as number) < 10 || (metrics.title_length as number) > 70) {
        pushIssue(
            issues,
            "seo",
            "medium",
            `Title length looks off (${metrics.title_length} chars).`,
            "Keep titles concise and specific to the offer.",
        );
    }

    const h1Count = $("h1").length;
    metrics.h1_count = h1Count;
    if (h1Count === 0) {
        pushIssue(
            issues,
            "seo",
            "high",
            "No H1 heading found.",
            "Add one clear H1 that says who you help and what you do.",
        );
    } else if (h1Count > 1) {
        pushIssue(
            issues,
            "seo",
            "medium",
            `Multiple H1s found (${h1Count}).`,
            "Use one primary H1 per page for clean structure.",
        );
    }

    const metaDescription = $('meta[name="description"]').attr("content") || "";
    metrics.meta_description_length = textLen(metaDescription);
    if ((metrics.meta_description_length as number) === 0) {
        pushIssue(
            issues,
            "seo",
            "medium",
            "Missing meta description.",
            "Add a clear 120-160 character description with value proposition.",
        );
    } else if (
        (metrics.meta_description_length as number) < 50 ||
        (metrics.meta_description_length as number) > 160
    ) {
        pushIssue(
            issues,
            "seo",
            "low",
            `Meta description length looks off (${metrics.meta_description_length} chars).`,
            "Keep meta description in the 120-160 character range.",
        );
    }

    const canonical = $('link[rel="canonical"]').attr("href") || "";
    metrics.has_canonical = Boolean(canonical);
    if (!canonical) {
        pushIssue(
            issues,
            "seo",
            "low",
            "Missing canonical URL.",
            "Add a canonical tag to prevent duplicate index issues.",
        );
    }

    const viewport = $('meta[name="viewport"]').attr("content") || "";
    metrics.has_viewport = viewport.includes("width=device-width");
    if (!metrics.has_viewport) {
        pushIssue(
            issues,
            "mobile",
            "high",
            "Missing responsive viewport meta tag.",
            'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
        );
    }

    metrics.has_media_queries = hasResponsiveSignals(fetched.html);
    if (!metrics.has_media_queries) {
        pushIssue(
            issues,
            "mobile",
            "medium",
            "No responsive CSS signals found.",
            "Add responsive breakpoints to improve mobile layout behavior.",
        );
    }

    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const bodyTextLower = bodyText.toLowerCase();
    metrics.body_text_length = bodyText.length;

    const phoneMatches = bodyText.match(/(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/);
    const emailMatches = bodyText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi);
    metrics.has_phone = Boolean(phoneMatches);
    metrics.has_email = Boolean(emailMatches?.length);

    if (!metrics.has_phone && !metrics.has_email) {
        pushIssue(
            issues,
            "trust",
            "medium",
            "No obvious contact details found on the homepage.",
            "Show phone/email clearly in the header and footer.",
        );
    }

    const ctaTexts = $("a,button,input[type='submit']")
        .map((_, el) => $(el).text().trim().toLowerCase())
        .get()
        .filter(Boolean);
    const strongCtas = ctaTexts.filter((text) =>
        CTA_TERMS.some((term) => text.includes(term)),
    );
    metrics.cta_count = strongCtas.length;
    if (strongCtas.length === 0) {
        pushIssue(
            issues,
            "conversion",
            "high",
            "No clear primary call-to-action detected.",
            "Add one primary CTA above the fold (Call, Book, or Get Quote).",
        );
    }

    const trustHits = TRUST_WORDS.filter((word) => bodyTextLower.includes(word));
    metrics.trust_markers = trustHits;
    if (trustHits.length === 0) {
        pushIssue(
            issues,
            "trust",
            "medium",
            "No clear trust markers detected.",
            "Show reviews, certifications, guarantees, or years in business near the hero.",
        );
    }

    metrics.has_schema = hasBasicSchema($);
    if (!metrics.has_schema) {
        pushIssue(
            issues,
            "seo",
            "low",
            "No Organization/LocalBusiness/Product schema detected.",
            "Add basic structured data to improve search visibility.",
        );
    }

    if (bodyText.length < 500) {
        pushIssue(
            issues,
            "conversion",
            "low",
            "Homepage copy appears thin.",
            "Clarify who you serve, your offer, proof, and next step.",
        );
    }

    if (indexing) {
        metrics.has_robots = indexing.hasRobots;
        metrics.has_sitemap = indexing.hasSitemap;

        if (!indexing.hasRobots) {
            pushIssue(
                issues,
                "seo",
                "low",
                "robots.txt not found.",
                "Add robots.txt so crawlers understand crawl rules.",
            );
        }

        if (!indexing.hasSitemap) {
            pushIssue(
                issues,
                "seo",
                "low",
                "sitemap.xml not found.",
                "Add and submit a sitemap.xml in Google Search Console.",
            );
        }
    }

    return { metrics, issues };
}
