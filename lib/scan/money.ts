export function estimateLoss(args: {
    estMonthlyVisitors?: number;
    estConvRate?: number;
    estAvgValue?: number;
    overallScore: number;
}) {
    const visitors = args.estMonthlyVisitors ?? 800;
    const conv = args.estConvRate ?? 0.04;
    const avg = args.estAvgValue ?? 250;

    const baselineRevenue = visitors * conv * avg;

    const lossPct =
        args.overallScore >= 85
            ? 0.1
            : args.overallScore >= 70
              ? 0.25
              : args.overallScore >= 55
                ? 0.4
                : 0.55;

    const low = baselineRevenue * (lossPct * 0.7);
    const high = baselineRevenue * (lossPct * 1.3);

    return {
        visitors,
        conv,
        avg,
        baselineRevenue,
        lossPct,
        estMonthlyLossLow: round10(low),
        estMonthlyLossHigh: round10(high),
    };
}

function round10(value: number): number {
    return Math.round(value / 10) * 10;
}
