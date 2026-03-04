export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            leads: {
                Row: {
                    id: string;
                    email: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    email: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    created_at?: string;
                };
                Relationships: [];
            };
            sites: {
                Row: {
                    id: string;
                    url: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    url: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    url?: string;
                    created_at?: string;
                };
                Relationships: [];
            };
            scans: {
                Row: {
                    id: string;
                    site_id: string | null;
                    created_at: string;
                    overall_grade: string;
                    speed_score: number;
                    mobile_score: number;
                    seo_score: number;
                    trust_score: number;
                    est_monthly_visitors: number | null;
                    est_conv_rate: number | null;
                    est_avg_value: number | null;
                    est_loss_pct: number | null;
                    est_monthly_loss_low: number | null;
                    est_monthly_loss_high: number | null;
                    metrics: Json;
                };
                Insert: {
                    id?: string;
                    site_id?: string | null;
                    created_at?: string;
                    overall_grade: string;
                    speed_score: number;
                    mobile_score: number;
                    seo_score: number;
                    trust_score: number;
                    est_monthly_visitors?: number | null;
                    est_conv_rate?: number | null;
                    est_avg_value?: number | null;
                    est_loss_pct?: number | null;
                    est_monthly_loss_low?: number | null;
                    est_monthly_loss_high?: number | null;
                    metrics?: Json;
                };
                Update: {
                    id?: string;
                    site_id?: string | null;
                    created_at?: string;
                    overall_grade?: string;
                    speed_score?: number;
                    mobile_score?: number;
                    seo_score?: number;
                    trust_score?: number;
                    est_monthly_visitors?: number | null;
                    est_conv_rate?: number | null;
                    est_avg_value?: number | null;
                    est_loss_pct?: number | null;
                    est_monthly_loss_low?: number | null;
                    est_monthly_loss_high?: number | null;
                    metrics?: Json;
                };
                Relationships: [
                    {
                        foreignKeyName: "scans_site_id_fkey";
                        columns: ["site_id"];
                        referencedRelation: "sites";
                        referencedColumns: ["id"];
                    },
                ];
            };
            scan_issues: {
                Row: {
                    id: string;
                    scan_id: string | null;
                    category: string;
                    severity: string;
                    description: string;
                    recommendation: string;
                };
                Insert: {
                    id?: string;
                    scan_id?: string | null;
                    category: string;
                    severity: string;
                    description: string;
                    recommendation: string;
                };
                Update: {
                    id?: string;
                    scan_id?: string | null;
                    category?: string;
                    severity?: string;
                    description?: string;
                    recommendation?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "scan_issues_scan_id_fkey";
                        columns: ["scan_id"];
                        referencedRelation: "scans";
                        referencedColumns: ["id"];
                    },
                ];
            };
            reports: {
                Row: {
                    id: string;
                    scan_id: string | null;
                    lead_id: string | null;
                    public_token: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    scan_id?: string | null;
                    lead_id?: string | null;
                    public_token: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    scan_id?: string | null;
                    lead_id?: string | null;
                    public_token?: string;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "reports_lead_id_fkey";
                        columns: ["lead_id"];
                        referencedRelation: "leads";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reports_scan_id_fkey";
                        columns: ["scan_id"];
                        referencedRelation: "scans";
                        referencedColumns: ["id"];
                    },
                ];
            };
            profiles: {
                Row: {
                    id: string;
                    email: string | null;
                    created_at: string | null;
                };
                Insert: {
                    id: string;
                    email?: string | null;
                    created_at?: string | null;
                };
                Update: {
                    id?: string;
                    email?: string | null;
                    created_at?: string | null;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};
