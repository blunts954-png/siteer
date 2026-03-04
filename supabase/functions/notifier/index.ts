import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
    try {
        const { record } = await req.json();
        const email = record.email;

        if (!RESEND_API_KEY) {
            console.error("RESEND_API_KEY not set");
            return new Response("Config Error", { status: 500 });
        }

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "SiteER <reports@yourdomain.com>",
                to: email,
                subject: "Your Website Health Report is Ready",
                html: `
          <h1>Your SiteER Report</h1>
          <p>We've finished analyzing your website.</p>
          <p>Click the link below to see your grade and the estimated monthly revenue you're losing.</p>
          <a href="${Deno.env.get("NEXT_PUBLIC_APP_URL")}">View My Full Report</a>
          <br/><br/>
          <p>Best,<br/>The SiteER Team</p>
        `,
            }),
        });

        const data = await res.json();
        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
});
