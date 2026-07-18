import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "KairoMesh — GPU jobs with receipts",
    template: "%s · KairoMesh",
  },
  description:
    "A research-grade outcome-cloud demo for checkpointed GPU scheduling, failover, output policy checks, and tamper-evident receipts.",
  keywords: ["GPU cloud", "distributed compute", "verifiable compute", "GPU marketplace", "ML infrastructure"],
  authors: [{ name: "KairoMesh" }],
  applicationName: "KairoMesh",
  category: "technology",
  openGraph: {
    title: "KairoMesh — GPU jobs that finish",
    description: "Checkpoint. Recover. Verify. Settle on accepted output.",
    type: "website",
    siteName: "KairoMesh",
  },
  twitter: {
    card: "summary_large_image",
    title: "KairoMesh — GPU jobs with receipts",
    description: "The outcome cloud for independent GPUs.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080b10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
