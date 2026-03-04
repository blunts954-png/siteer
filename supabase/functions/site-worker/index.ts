import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { record } = await req.json();
        const scanId = record.id;
        const siteId = record.site_id;

        // 1. Get the URL
        const { data: site } = await supabase
            .from("sites")
            .select("url")
            .eq("id", siteId)
            .single();

        if (!site) throw new Error("Site not found");

        // 2. Perform Fetch
        const start = Date.now();
        const res = await fetch(site.url, {
            headers: { "User-Agent": "SiteERBot/1.0" },
        });
        const ttfbMs = Date.now() - start;
        const html = await res.text();
        const loadMs = Date.now() - start;

        // 3. Analyze (Simplified for Edge)
        const $ = cheerio.load(html);
        const issues = [];

        // Quick checks
        if (res.status !== 200) issues.push({ category: "technical", severity: "high", description: `Site returned ${res.status}`, recommendation: "Fix server errors." });
        if (!site.url.startsWith("https")) issues.push({ category: "technical", severity: "high", description: "Not using HTTPS", recommendation: "Enable SSL." });
        if ($("h1").length === 0) issues.push({ category: "seo", severity: "high", description: "No H1 tag", recommendation: "Add a main heading." });
        if (!$('meta[name="viewport"]').length) issues.push({ category: "mobile", severity: "high", description: "No viewport tag", recommendation: "Add viewport meta." });

        // 4. Calculate Scores (Simplified)
        const score = Math.max(0, 100 - (issues.length * 15));
        const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

        // 5. Update Scan
        await supabase.from("scans").update({
            overall_grade: grade,
            speed_score: score, // simplified
            mobile_score: score,
            seo_score: score,
            trust_score: score,
            status: "completed",
            metrics: {
                ttfbMs,
                loadMs,
                charset: res.headers.get("content-type"),
            }
        }).eq("id", scanId);

        // 6. Insert Issues
        if (issues.length > 0) {
            await supabase.from("scan_issues").insert(
                issues.map(i => ({ ...i, scan_id: scanId }))
            );
        }

        return new Response(JSON.stringify({ ok: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
