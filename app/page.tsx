import UrlScanForm from "@/components/UrlScanForm";

export default function HomePage() {
    return (
        <main className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white px-5 py-8 md:px-8 md:py-12">
            {/* Background pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

            <header className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
                <a className="group flex items-center gap-2 text-sm font-semibold tracking-tight" href="/">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg shadow-red-200 group-hover:bg-red-700 transition-colors">
                        <span className="text-lg font-bold">+</span>
                    </div>
                    <div>
                        SiteER{" "}
                        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
                            Emergency Room for Sick Websites
                        </span>
                    </div>
                </a>
                <nav className="flex items-center gap-6 text-sm font-medium">
                    <a className="text-black/50 hover:text-red-600 transition-colors" href="/pricing">
                        Pricing
                    </a>
                    <a className="text-black/50 hover:text-red-600 transition-colors" href="/blog">
                        Resources
                    </a>
                </nav>
            </header>

            <section className="mx-auto mt-20 grid max-w-6xl gap-10 md:grid-cols-[1.3fr_0.7fr] md:items-start">
                <div className="relative rounded-[2.5rem] border border-red-100 bg-white/70 p-8 shadow-[0_32px_80px_-40px_rgba(220,38,38,0.15)] backdrop-blur-xl md:p-12">
                    <div className="absolute -top-4 left-8 inline-flex items-center rounded-full border border-red-200 bg-white px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-red-600 shadow-sm">
                        Stop silent revenue loss
                    </div>

                    <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-6xl">
                        Is your website quietly <span className="text-red-600 italic">killing</span> your sales?
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                        Paste your URL. In 60 seconds, we diagnose where you're losing money and precisely how to fix it.
                    </p>

                    <div className="mt-10">
                        <UrlScanForm />
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                            No login required
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                            Grade your site (A-F)
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                            Shareable report link
                        </span>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white p-6 shadow-xl shadow-amber-900/5">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                            <span className="text-amber-500 font-mono">01/</span>
                            Vital Diagnostics
                        </h2>
                        <ul className="mt-6 space-y-4">
                            {[
                                { title: "Speed signals", desc: "TTFB, page weight, and interaction slowdowns." },
                                { title: "Mobile usability", desc: "Responsive layout and viewport health." },
                                { title: "SEO fundamentals", desc: "Metadata, schema, and crawlability." },
                                { title: "Conversion & trust", desc: "CTA clarity and trust-building markers." }
                            ].map((item) => (
                                <li key={item.title} className="group rounded-2xl border border-slate-100 bg-white/50 p-4 transition-all hover:border-amber-200 hover:bg-white">
                                    <div className="font-bold text-slate-900">{item.title}</div>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                                        {item.desc}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </section>

            <section className="mx-auto mt-20 grid max-w-6xl gap-6 md:grid-cols-3">
                {[
                    { step: "1", action: "Diagnose", desc: "Instant triage with grade and top failures." },
                    { step: "2", action: "Quantify", desc: "Translate weak UX into estimated monthly revenue loss." },
                    { step: "3", action: "Treat", desc: "Follow the plan or hire us for a rapid ER Fix Pack." }
                ].map((item) => (
                    <div key={item.step} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-hover hover:shadow-md">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 font-mono text-xs font-bold text-slate-400">
                            {item.step}
                        </div>
                        <div className="mt-4 font-bold text-slate-900 underline decoration-red-100 decoration-4 underline-offset-4">{item.action}</div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </section>

            <footer className="mx-auto mt-20 max-w-6xl border-t border-slate-100 pt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                © {new Date().getFullYear()} SiteER. Surgical Precision for Web Design.
            </footer>
        </main>
    );
}
