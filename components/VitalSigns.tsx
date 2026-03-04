type ScanScores = {
    speed_score: number;
    mobile_score: number;
    seo_score: number;
    trust_score: number;
};

function toNumber(value: unknown): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
}

function scoreColor(score: number): string {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
}

export default function VitalSigns({ scan }: { scan: ScanScores }) {
    const rows = [
        { name: "Speed", score: toNumber(scan.speed_score) },
        { name: "Mobile", score: toNumber(scan.mobile_score) },
        { name: "Findability (SEO)", score: toNumber(scan.seo_score) },
        { name: "Conversion + Trust", score: toNumber(scan.trust_score) },
    ];

    return (
        <section className="rounded-2xl border border-black/10 bg-white/95 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Vital Signs</h2>
            <p className="mt-1 text-sm text-black/60">
                Red means urgent. Yellow means fix next. Green means stable.
            </p>
            <div className="mt-5 space-y-4">
                {rows.map((row) => (
                    <div key={row.name}>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium">{row.name}</span>
                            <span className="text-sm text-black/60">{row.score}/100</span>
                        </div>
                        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-black/10">
                            <div
                                className={`h-full rounded-full ${scoreColor(row.score)}`}
                                style={{
                                    width: `${Math.max(0, Math.min(100, row.score))}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
