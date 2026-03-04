import UrlScanForm from "@/components/UrlScanForm";

export default function HomePage() {
    return (
        <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <a className="text-sm font-semibold tracking-tight" href="/">
                    SiteER{" "}
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-black/45">
                        Emergency Room for Sick Websites
                    </span>
                </a>
                <nav className="flex items-center gap-4 text-sm">
                    <a className="text-black/60 hover:text-black" href="/pricing">
                        Pricing
                    </a>
                    <a className="text-black/60 hover:text-black" href="/blog">
                        Resources
                    </a>
                </nav>
            </header>

            <section className="mt-12 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
                <div className="rounded-3xl border border-red-200/70 bg-white/85 p-6 shadow-[0_30px_70px_-45px_rgba(185,28,28,0.7)] backdrop-blur md:p-8">
                    <div className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 font-mono text-xs uppercase tracking-wider text-red-700">
                        Stop silent revenue loss
                    </div>
                    <h1 className="mt-4 text-4xl font-semibold leading-tight text-balance md:text-5xl">
                        Is your website quietly killing your sales?
                    </h1>
                    <p className="mt-4 max-w-2xl text-base text-black/68">
                        Paste your URL. In 60 seconds, we estimate how much revenue your site is
                        leaking and show the top fixes to stop the bleeding.
                    </p>

                    <div className="mt-8">
                        <UrlScanForm />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2 text-xs text-black/60">
                        <span className="rounded-full bg-black/5 px-3 py-1">
                            No login required
                        </span>
                        <span className="rounded-full bg-black/5 px-3 py-1">
                            Grade your site (A-F)
                        </span>
                        <span className="rounded-full bg-black/5 px-3 py-1">
                            Shareable report link
                        </span>
                    </div>
                </div>

                <aside className="rounded-3xl border border-amber-200/80 bg-gradient-to-b from-amber-50 to-white p-6 shadow-[0_30px_70px_-45px_rgba(180,83,9,0.7)]">
                    <h2 className="text-lg font-semibold">What SiteER checks</h2>
                    <ul className="mt-4 space-y-3 text-sm">
                        <li className="rounded-xl border border-black/10 bg-white/80 p-3">
                            <span className="font-semibold">Speed signals</span>
                            <p className="mt-1 text-black/65">
                                TTFB, total load time, page weight, and obvious slowdowns.
                            </p>
                        </li>
                        <li className="rounded-xl border border-black/10 bg-white/80 p-3">
                            <span className="font-semibold">Mobile usability</span>
                            <p className="mt-1 text-black/65">
                                Viewport, responsive CSS signals, and basic mobile fit checks.
                            </p>
                        </li>
                        <li className="rounded-xl border border-black/10 bg-white/80 p-3">
                            <span className="font-semibold">SEO fundamentals</span>
                            <p className="mt-1 text-black/65">
                                Title, H1, meta description, canonical, schema, robots, sitemap.
                            </p>
                        </li>
                        <li className="rounded-xl border border-black/10 bg-white/80 p-3">
                            <span className="font-semibold">Conversion & trust</span>
                            <p className="mt-1 text-black/65">
                                CTA clarity, visible contact info, and trust markers.
                            </p>
                        </li>
                    </ul>
                </aside>
            </section>

            <section className="mt-12 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
                    <div className="font-semibold">1) Diagnose</div>
                    <p className="mt-2 text-sm text-black/65">
                        Instant triage with grade and top failures.
                    </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
                    <div className="font-semibold">2) Quantify</div>
                    <p className="mt-2 text-sm text-black/65">
                        Translate weak UX into estimated lost revenue.
                    </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
                    <div className="font-semibold">3) Treat</div>
                    <p className="mt-2 text-sm text-black/65">
                        Follow the plan or hire us for a rapid ER Fix Pack.
                    </p>
                </div>
            </section>

            <footer className="mt-12 border-t border-black/10 pt-5 text-xs text-black/55">
                © {new Date().getFullYear()} SiteER. Stop your website from quietly killing sales.
            </footer>
        </main>
    );
}
