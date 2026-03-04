create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text,
    created_at timestamptz default now()
);

create table if not exists public.leads (
    id uuid primary key default uuid_generate_v4(),
    email text not null,
    created_at timestamptz default now()
);

create table if not exists public.sites (
    id uuid primary key default uuid_generate_v4(),
    url text not null,
    created_at timestamptz default now()
);

create table if not exists public.scans (
    id uuid primary key default uuid_generate_v4(),
    site_id uuid references public.sites(id) on delete cascade,
    created_at timestamptz default now(),
    overall_grade text not null,
    speed_score int not null,
    mobile_score int not null,
    seo_score int not null,
    trust_score int not null,
    est_monthly_visitors int,
    est_conv_rate numeric,
    est_avg_value numeric,
    est_loss_pct numeric,
    est_monthly_loss_low numeric,
    est_monthly_loss_high numeric,
    status text default 'pending',
    metrics jsonb default '{}'::jsonb
);

create table if not exists public.scan_issues (
    id uuid primary key default uuid_generate_v4(),
    scan_id uuid references public.scans(id) on delete cascade,
    category text not null,
    severity text not null,
    description text not null,
    recommendation text not null
);

create table if not exists public.reports (
    id uuid primary key default uuid_generate_v4(),
    scan_id uuid references public.scans(id) on delete cascade,
    lead_id uuid references public.leads(id) on delete set null,
    public_token text not null unique,
    created_at timestamptz default now()
);

create index if not exists scans_site_id_idx on public.scans(site_id);
create index if not exists scan_issues_scan_id_idx on public.scan_issues(scan_id);
create index if not exists reports_public_token_idx on public.reports(public_token);
