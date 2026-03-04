import type { Issue } from "@/lib/scan/analyzeHtml";

function clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
}

export function scoreFromIssues(issues: Issue[]) {
    let speed = 85;
    let mobile = 85;
    let seo = 85;
    let trust = 85;

    for (const issue of issues) {
        const hit =
            issue.severity === "high" ? 20 : issue.severity === "medium" ? 10 : 5;

        if (issue.category === "speed") speed -= hit;
        if (issue.category === "mobile") mobile -= hit;
        if (issue.category === "seo") seo -= hit;
        if (issue.category === "trust" || issue.category === "conversion") trust -= hit;
        if (issue.category === "technical") {
            speed -= Math.round(hit / 2);
            mobile -= hit;
            seo -= hit;
            trust -= hit;
        }
    }

    speed = clamp(speed);
    mobile = clamp(mobile);
    seo = clamp(seo);
    trust = clamp(trust);

    const overall = Math.round((speed + mobile + seo + trust) / 4);
    const grade =
        overall >= 90 ? "A" : overall >= 80 ? "B" : overall >= 70 ? "C" : overall >= 60 ? "D" : "F";

    return { speed, mobile, seo, trust, overall, grade };
}
