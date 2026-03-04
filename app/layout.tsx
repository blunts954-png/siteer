import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";

const fontSans = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-sans",
});

const fontMono = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
    title: "SiteER - Emergency Room for Sick Websites",
    description:
        "Paste your URL. In 60 seconds, SiteER shows how much money your website is losing and the fixes to stop the bleeding.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${fontSans.variable} ${fontMono.variable} min-h-screen text-black`}>
                {children}
            </body>
        </html>
    );
}
