import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "solid" | "ghost";
};

export function Button({
    className,
    variant = "solid",
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                "disabled:cursor-not-allowed disabled:opacity-60",
                variant === "solid" &&
                    "bg-primary text-primary-foreground shadow-[0_8px_24px_-12px_rgba(185,28,28,0.85)] hover:brightness-95",
                variant === "ghost" && "bg-white text-black hover:bg-black/5",
                className,
            )}
            {...props}
        />
    );
}

export function Input({
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={cn(
                "h-11 w-full rounded-xl border border-black/10 bg-white/90 px-4 text-sm text-black outline-none",
                "placeholder:text-black/50 focus:border-primary/30 focus:ring-2 focus:ring-primary/15",
                className,
            )}
            {...props}
        />
    );
}

export function Card({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-black/10 bg-white/95 p-6 shadow-[0_14px_40px_-28px_rgba(0,0,0,0.6)]",
                className,
            )}
            {...props}
        />
    );
}
