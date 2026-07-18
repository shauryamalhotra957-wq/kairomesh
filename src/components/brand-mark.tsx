import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="KairoMesh home" className={cn("group inline-flex min-h-11 items-center gap-2.5", className)}>
      <svg aria-hidden="true" viewBox="0 0 38 38" className="h-8 w-8 overflow-visible">
        <path
          d="M19 2.5 33.3 10.8v16.4L19 35.5 4.7 27.2V10.8L19 2.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-white/25 transition-colors duration-200 group-hover:text-[#b8f36b]/60"
        />
        <path d="M11.6 25.6V12.4m0 6.6 10-6.6M11.6 19l10 6.6M21.6 12.4v13.2" fill="none" stroke="#b8f36b" strokeWidth="2.1" strokeLinecap="round" />
        <circle cx="11.6" cy="12.4" r="2.2" fill="#f4f7f9" />
        <circle cx="11.6" cy="25.6" r="2.2" fill="#65a8ff" />
        <circle cx="21.6" cy="12.4" r="2.2" fill="#65a8ff" />
        <circle cx="21.6" cy="25.6" r="2.2" fill="#b8f36b" />
      </svg>
      {!compact && (
        <span className="text-[0.88rem] font-semibold tracking-[-0.03em] text-white">
          Kairo<span className="text-[#b8f36b]">Mesh</span>
        </span>
      )}
    </Link>
  );
}
