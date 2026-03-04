import { NextResponse } from "next/server";
import { z } from "zod";
import { consumeRateLimit, getClientIp } from "@/lib/rateLimit";
import { normalizeUrl } from "@/lib/validators";
import { checkIndexingFiles, fetchHtml } from "@/lib/scan/fetchHtml";
import { analyzeHtml } from "@/lib/scan/analyzeHtml";
import { scoreFromIssues } from "@/lib/scan/score";
import { estimateLoss } from "@/lib/scan/money";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const ScanSchema = z.object({
    url: z.string().min(1),
    estMonthlyVisitors: z.coerce.number().int().positive().optional(),
    estConvRate: z.coerce.number().positive().optional(),
    estAvgValue: z.coerce.number().positive().optional(),
});

function severityRank(severity: string): number {
    if (severity === "high") return 3;
    if (severity === "medium") return 2;
    return 1;
}

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const limiter = consumeRateLimit(`scan:${ip}`, 12, 60_000);
    if (!limiter.ok) {
        return NextResponse.json(
            {
                ok: false,
                error: "Too many scans. Please wait a minute and try again.",
            },
            { status: 429 },
        );
    }

    try {
        const supabaseAdmin = getSupabaseAdmin();
        const body = ScanSchema.parse(await request.json());
        const url = normalizeUrl(body.url);

        const fetched = await fetchHtml(url);
        const indexing = await checkIndexingFiles(fetched.finalUrl);
        const analysis = analyzeHtml(fetched, indexing);
        const scores = scoreFromIssues(analysis.issues);
        const money = estimateLoss({
            estMonthlyVisitors: body.estMonthlyVisitors,
            estConvRate: body.estConvRate,
            estAvgValue: body.estAvgValue,
            overallScore: scores.overall,
        });

        const { data: site, error: siteError } = await supabaseAdmin
            .from("sites")
            .insert({ url: fetched.finalUrl })
            .select("id,url")
            .single();

        if (siteError || !site) {
            throw new Error(siteError?.message || "Failed to store site");
        }

        const { data: scan, error: scanError } = await supabaseAdmin
            .from("scans")
            .insert({
                site_id: site.id,
                overall_grade: scores.grade,
                speed_score: scores.speed,
                mobile_score: scores.mobile,
                seo_score: scores.seo,
                trust_score: scores.trust,
                est_monthly_visitors: money.visitors,
                est_conv_rate: money.conv,
                est_avg_value: money.avg,
                est_loss_pct: money.lossPct,
                est_monthly_loss_low: money.estMonthlyLossLow,
                est_monthly_loss_high: money.estMonthlyLossHigh,
                metrics: {
                    ...analysis.metrics,
                    fetch: {
                        status: fetched.status,
                        contentType: fetched.contentType,
                        finalUrl: fetched.finalUrl,
                        ttfbMs: fetched.ttfbMs,
                        loadMs: fetched.loadMs,
                        sizeBytes: fetched.sizeBytes,
                    },
                },
            })
            .select(
                "id,overall_grade,speed_score,mobile_score,seo_score,trust_score,est_monthly_loss_low,est_monthly_loss_high,est_loss_pct,est_monthly_visitors,est_conv_rate,est_avg_value",
            )
            .single();

        if (scanError || !scan) {
            throw new Error(scanError?.message || "Failed to store scan");
        }

        if (analysis.issues.length > 0) {
            const issueRows = analysis.issues.map((issue) => ({
                scan_id: scan.id,
                category: issue.category,
                severity: issue.severity,
                description: issue.description,
                recommendation: issue.recommendation,
            }));

            const { error: issueError } = await supabaseAdmin
                .from("scan_issues")
                .insert(issueRows);

            if (issueError) {
                throw new Error(issueError.message || "Failed to store scan issues");
            }
        }

        const topIssues = analysis.issues
            .slice()
            .sort((a, b) => severityRank(b.severity) - severityRank(a.severity))
            .slice(0, 3);

        return NextResponse.json({
            ok: true,
            scanId: scan.id,
            grade: scan.overall_grade,
            scores: {
                speed: Number(scan.speed_score) || 0,
                mobile: Number(scan.mobile_score) || 0,
                seo: Number(scan.seo_score) || 0,
                trust: Number(scan.trust_score) || 0,
                overall: scores.overall,
            },
            money: {
                lossLow: Number(scan.est_monthly_loss_low) || 0,
                lossHigh: Number(scan.est_monthly_loss_high) || 0,
                lossPct: Number(scan.est_loss_pct) || 0,
                visitors: Number(scan.est_monthly_visitors) || 0,
                conv: Number(scan.est_conv_rate) || 0,
                avg: Number(scan.est_avg_value) || 0,
            },
            topIssues,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Scan failed";
        return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
}
