export default function PricingPage() {
    return (
        <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <a className="text-sm font-semibold tracking-tight" href="/">
                    SiteER <span className="text-black/45">/ Pricing</span>
                </a>
                <a className="text-sm text-black/60 hover:text-black" href="/">
                    Run a scan
                </a>
            </header>

            <section className="mt-10">
                <h1 className="text-4xl font-semibold md:text-5xl">Stop the bleeding.</h1>
                <p className="mt-3 max-w-2xl text-black/65">
                    SiteER diagnosis is free. Pay only when you want implementation, deeper review,
                    or ongoing monitoring.
                </p>
            </section>

            <section className="mt-10 grid gap-5 md:grid-cols-3">
                <article className="rounded-2xl border border-black/10 bg-white/90 p-6 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-black/55">
                        Free ER Scan
                    </h2>
                    <p className="mt-2 text-3xl font-semibold">$0</p>
                    <ul className="mt-4 space-y-2 text-sm text-black/65">
                        <li>Grade your site (A-F)</li>
                        <li>Money leak estimate</li>
                        <li>Top issues and treatment plan</li>
                        <li>Shareable report link</li>
                    </ul>
                    <a
                        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                        href="/"
                    >
                        Start free scan
                    </a>
                </article>

                <article className="rounded-2xl border border-red-300 bg-gradient-to-b from-red-700 to-red-800 p-6 text-white shadow-[0_18px_45px_-22px_rgba(153,27,27,0.75)]">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-red-100">
                        ER Fix Pack
                    </h2>
                    <p className="mt-2 text-3xl font-semibold">$450-$1,500</p>
                    <p className="mt-2 text-sm text-red-100/90">
                        We implement the highest-impact fixes and re-scan to prove results.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-red-100">
                        <li>Speed + mobile fixes</li>
                        <li>CTA and trust improvements</li>
                        <li>SEO fundamentals cleanup</li>
                        <li>Before/after change summary</li>
                    </ul>
                    <a
                        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700"
                        href="mailto:hello@yourdomain.com?subject=SiteER%20Fix%20Pack%20Quote"
                    >
                        Get a quote
                    </a>
                </article>

                <article className="rounded-2xl border border-black/10 bg-white/90 p-6 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-black/55">
                        Deep ER Report
                    </h2>
                    <p className="mt-2 text-3xl font-semibold">$49</p>
                    <p className="mt-2 text-sm text-black/65">
                        Human review layered on top of your automated scan.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-black/65">
                        <li>30-60 minute manual review</li>
                        <li>Copy and offer clarity notes</li>
                        <li>Local SEO quick wins</li>
                        <li>Platform-specific fixes</li>
                    </ul>
                    <a
                        className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-black/5"
                        href="mailto:hello@yourdomain.com?subject=Deep%20ER%20Report"
                    >
                        Buy report
                    </a>
                </article>
            </section>
        </main>
    );
}
