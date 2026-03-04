type Bucket = {
    hits: number;
    resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function consumeRateLimit(
    key: string,
    limit: number,
    windowMs: number,
): { ok: boolean; remaining: number; retryAfterMs: number } {
    const now = Date.now();
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
        buckets.set(key, { hits: 1, resetAt: now + windowMs });
        return { ok: true, remaining: limit - 1, retryAfterMs: 0 };
    }

    if (current.hits >= limit) {
        return { ok: false, remaining: 0, retryAfterMs: current.resetAt - now };
    }

    current.hits += 1;
    buckets.set(key, current);
    return { ok: true, remaining: limit - current.hits, retryAfterMs: 0 };
}

export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (!forwarded) return "unknown";

    return forwarded.split(",")[0]?.trim() || "unknown";
}
