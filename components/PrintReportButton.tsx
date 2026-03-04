"use client";

import { Button } from "@/components/ui";

export default function PrintReportButton() {
    return (
        <Button
            type="button"
            variant="ghost"
            className="border border-black/10"
            onClick={() => window.print()}
        >
            Download / Print Report
        </Button>
    );
}
