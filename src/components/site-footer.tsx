import { Code2 } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#07090d] py-10">
      <div className="page-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-md text-sm leading-6 text-[#7f8d9c]">
            A research-grade demonstration of outcome-based scheduling, failover, and tamper-evident GPU compute receipts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#a9b5c3]">
          <Link href="/architecture" className="inline-flex min-h-11 items-center hover:text-white">Trust model</Link>
          <Link href="/blueprint" className="inline-flex min-h-11 items-center hover:text-white">Startup blueprint</Link>
          <Link href="https://github.com/shauryamalhotra957-wq/kairomesh" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:text-white">
            <Code2 aria-hidden="true" size={15} /> Source code
          </Link>
        </div>
      </div>
      <div className="page-shell mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-[0.65rem] leading-5 text-[#7f8d9c] sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 KairoMesh. Working product concept.</span>
        <span className="mono uppercase tracking-[0.08em]">Demo network · simulated credits · no live customer data</span>
      </div>
    </footer>
  );
}
