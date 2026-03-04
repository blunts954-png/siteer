import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { consumeRateLimit, getClientIp } from "@/lib/rateLimit";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const LeadSchema = z.object({
    email: z.string().email(),
    scanId: z.string().uuid().or(z.string().min(1)),
});

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const limiter = consumeRateLimit(`lead:${ip}`, 20, 60_000);
    if (!limiter.ok) {
        return NextResponse.json(
            {
                ok: false,
                error: "Too many submissions. Please wait and try again.",
            },
            { status: 429 },
        );
    }

    try {
        const supabaseAdmin = getSupabaseAdmin();
        const body = LeadSchema.parse(await request.json());
        const email = body.email.trim().toLowerCase();

        const { data: lead, error: leadError } = await supabaseAdmin
            .from("leads")
            .insert({ email })
            .select("id,email")
            .single();

        if (leadError || !lead) {
            throw new Error(leadError?.message || "Failed to capture lead");
        }

        const token = crypto.randomBytes(16).toString("hex");

        const { data: report, error: reportError } = await supabaseAdmin
            .from("reports")
            .insert({
                scan_id: body.scanId,
                lead_id: lead.id,
                public_token: token,
            })
            .select("public_token")
            .single();

        if (reportError || !report) {
            throw new Error(reportError?.message || "Failed to create report link");
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        return NextResponse.json({
            ok: true,
            reportUrl: `${appUrl}/scan/${report.public_token}`,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Lead capture failed";
        return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
}
