const posts = [
    {
        title: "5 Website Mistakes That Cost Local Businesses the Most",
        summary:
            "How weak mobile UX, missing trust proof, and broken CTAs quietly cut lead volume.",
    },
    {
        title: "How to Fix Slow Mobile Pages in Under an Hour",
        summary:
            "A practical speed-first checklist for business owners and small teams.",
    },
    {
        title: "Why Is My Website Not Bringing In Customers?",
        summary:
            "A non-technical diagnostic framework to spot and fix conversion leaks fast.",
    },
];

export default function BlogPage() {
    return (
        <main className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12">
            <header className="flex items-center justify-between gap-4">
                <a className="text-sm font-semibold tracking-tight" href="/">
                    SiteER <span className="text-black/45">/ Resources</span>
                </a>
                <a className="text-sm text-black/60 hover:text-black" href="/">
                    Free scan
                </a>
            </header>

            <h1 className="mt-10 text-4xl font-semibold">Resources</h1>
            <p className="mt-2 max-w-2xl text-black/65">
                Content for business owners who want more leads from the same traffic.
            </p>

            <div className="mt-8 space-y-4">
                {posts.map((post) => (
                    <article
                        key={post.title}
                        className="rounded-2xl border border-black/10 bg-white/90 p-6 shadow-sm"
                    >
                        <h2 className="text-xl font-semibold">{post.title}</h2>
                        <p className="mt-2 text-sm text-black/65">{post.summary}</p>
                        <a
                            className="mt-4 inline-flex text-sm font-semibold text-red-700 underline decoration-red-300 underline-offset-2"
                            href="/"
                        >
                            Run a free SiteER check
                        </a>
                    </article>
                ))}
            </div>
        </main>
    );
}
