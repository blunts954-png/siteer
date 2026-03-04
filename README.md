# SiteER: Emergency Room for Sick Websites

SiteER is a diagnostic tool that scans websites for speed, mobile usability, SEO, and trust signals, translating technical weaknesses into estimated revenue loss.

## Getting Started

### 1. Project Setup

```bash
npm install
npm run dev
```

### 2. Supabase Infrastructure

This project uses Supabase for data persistence and lead generation.

1.  Create a project at [supabase.com](https://supabase.com).
2.  Run the SQL schema located in `./supabase/schema.sql` in the Supabase SQL Editor.
3.  Configure your environment variables (see below).

### 3. Environment Variables

Create a `.env.local` file in the root:

```env
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Get from Project Settings > API)
SUPABASE_URL=https://your-project-id.supabase.co
# IMPORTANT: Use the SERVICE ROLE KEY for the admin client
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Tech Stack

-   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
-   **Backend**: Next.js Route Handlers
-   **Database**: Supabase (PostgreSQL)
-   **Scanning**: Cheerio (HTML Parsing)
-   **Validation**: Zod
-   **Styling**: Lucide React (Icons), Shadcn/UI inspired components

## Supabase Edge Functions

I've configured two Edge Functions to handle heavy processing and notifications:

1.  **`site-worker`**: Performs the actual HTML fetching and analysis asynchronously.
2.  **`notifier`**: Sends an email via Resend when a new lead is captured.

### Deployment

```bash
# 1. Login to Supabase CLI (if installed)
supabase login

# 2. Link your project
supabase link --project-ref your-project-id

# 3. Deploy functions
supabase functions deploy site-worker
supabase functions deploy notifier

# 4. Set secrets
supabase secrets set RESEND_API_KEY=your_key NEXT_PUBLIC_APP_URL=https://your-site.com
```

### Database Webhooks Setup

To trigger these functions automatically:
1.  Go to **Database > Webhooks** in the Supabase Dashboard.
2.  **Webhook 1**: Enable on `scans` table (INSERT only). Point to the `site-worker` URL.
3.  **Webhook 2**: Enable on `leads` table (INSERT only). Point to the `notifier` URL.

## Architecture

-   `/app/api/scan`: Core logic for fetching and analyzing HTML.
-   `/app/api/lead`: Captures emails and generates unique report tokens.
-   `/lib/scan`: Specialized modules for scoring, money estimation, and HTML analysis.
-   `/components`: Reusable UI elements for reports and forms.

## License

MIT
