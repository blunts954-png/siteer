import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

let cachedClient: SupabaseClient<Database> | null = null;

function isHttpUrl(value: string): boolean {
    return /^https?:\/\//i.test(value);
}

export function getSupabaseAdmin() {
    if (cachedClient) return cachedClient;

    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    if (!isHttpUrl(url)) {
        throw new Error("SUPABASE_URL must start with http:// or https://");
    }

    cachedClient = createClient<Database>(url, serviceKey, {
        auth: { persistSession: false },
    });

    return cachedClient;
}
