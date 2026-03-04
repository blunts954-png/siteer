"use client";

import { useState } from "react";
import type { Issue } from "@/lib/scan/analyzeHtml";
import ReportTeaser from "@/components/ReportTeaser";
import { Button, Input } from "@/components/ui";

type TeaserPayload = {
    ok: boolean;
    scanId: string;
    grade: string;
    scores: {
        speed: number;
        mobile: number;
        seo: number;
        trust: number;
        overall: number;
    };
    money: {
        lossLow: number;
        lossHigh: number;
        lossPct: number;
    };
    topIssues: Issue[];
    error?: string;
};

export default function UrlScanForm() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teaser, setTeaser] = useState<TeaserPayload | null>(null);

    async function runScan() {
        setLoading(true);
        setError(null);
        setTeaser(null);

        try {
            const response = await fetch("/api/scan", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const payload = (await response.json()) as TeaserPayload;
            if (!response.ok || !payload.ok) {
                throw new Error(payload.error || "Scan failed");
            }

            setTeaser(payload);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Scan failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex w-full flex-col gap-3 md:flex-row">
                <Input
                    placeholder="yourwebsite.com"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    autoComplete="url"
                />
                <Button type="button" onClick={runScan} disabled={!url || loading}>
                    {loading ? "Scanning..." : "Scan My Site"}
                </Button>
            </div>
            {error ? (
                <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </p>
            ) : null}
            {teaser ? <ReportTeaser teaser={teaser} onClose={() => setTeaser(null)} /> : null}
        </>
    );
}
