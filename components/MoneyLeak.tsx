type MoneyScan = {
    est_monthly_loss_low: number | string | null;
    est_monthly_loss_high: number | string | null;
    est_loss_pct: number | string | null;
    est_monthly_visitors?: number | string | null;
};

function toCurrency(value: number | string | null): string {
    const numeric = Number(value) || 0;
    return numeric.toLocaleString();
}

export default function MoneyLeak({ scan }: { scan: MoneyScan }) {
    const pct = Math.round((Number(scan.est_loss_pct) || 0) * 100);
    const visitorsLost = Math.round(
        (Number(scan.est_monthly_visitors) || 0) * (Number(scan.est_loss_pct) || 0),
    );

    return (
        <section className="rounded-2xl border border-black/10 bg-white/95 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Emergency Summary</h2>
            <p className="mt-2 text-sm text-black/65">
                Based on speed, mobile, SEO, and trust signals, your site likely leaks:
            </p>
            <div className="mt-4 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-amber-50 p-4">
                <div className="text-xs uppercase tracking-wider text-black/55">
                    Estimated monthly revenue loss
                </div>
                <div className="mt-1 text-3xl font-semibold">
                    ${toCurrency(scan.est_monthly_loss_low)} - $
                    {toCurrency(scan.est_monthly_loss_high)}
                </div>
                <div className="mt-2 text-sm text-black/65">
                    Risk band: about {pct}% conversion drag
                </div>
                {visitorsLost > 0 ? (
                    <div className="mt-1 text-sm text-black/65">
                        Estimated visitors at risk monthly: {visitorsLost}
                    </div>
                ) : null}
            </div>
            <p className="mt-4 text-xs text-black/55">
                Estimates are directional and used for prioritization.
            </p>
        </section>
    );
}
