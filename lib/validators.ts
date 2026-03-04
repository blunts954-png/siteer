const IPV4_PATTERN = /^(?:\d{1,3}\.){3}\d{1,3}$/;

function isPrivateIpv4(host: string): boolean {
    if (!IPV4_PATTERN.test(host)) {
        return false;
    }

    const octets = host.split(".").map((part) => Number(part));
    if (octets.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) {
        return true;
    }

    const [a, b] = octets;

    if (a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;

    return false;
}

function isBlockedHost(host: string): boolean {
    const normalizedHost = host.toLowerCase();

    if (
        normalizedHost === "localhost" ||
        normalizedHost.endsWith(".local") ||
        normalizedHost.endsWith(".internal") ||
        normalizedHost.endsWith(".home.arpa")
    ) {
        return true;
    }

    if (normalizedHost === "::1" || normalizedHost === "0:0:0:0:0:0:0:1") {
        return true;
    }

    if (isPrivateIpv4(normalizedHost)) {
        return true;
    }

    return false;
}

export function normalizeUrl(input: string): string {
    let value = input.trim();

    if (!value) {
        throw new Error("URL is required");
    }

    if (!/^https?:\/\//i.test(value)) {
        value = `https://${value}`;
    }

    let parsed: URL;
    try {
        parsed = new URL(value);
    } catch {
        throw new Error("Invalid URL");
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Only http and https URLs are allowed");
    }

    if (isBlockedHost(parsed.hostname)) {
        throw new Error("URL not allowed");
    }

    parsed.hash = "";
    return parsed.toString();
}
