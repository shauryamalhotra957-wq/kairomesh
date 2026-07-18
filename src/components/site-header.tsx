"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "./brand-mark";

const navigation = [
  { href: "/#product", label: "Product" },
  { href: "/architecture", label: "Architecture" },
  { href: "/providers", label: "For hosts" },
  { href: "/blueprint", label: "Blueprint" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#080b10]/78 backdrop-blur-xl">
      <div className="page-shell flex h-[4.35rem] items-center justify-between">
        <BrandMark />
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="button-quiet min-h-11 px-3.5 text-[0.78rem]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <span className="mono mr-1 inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.12em] text-[#a9b5c3]">
            <span className="status-dot" /> Demo online
          </span>
          <Link href="/console" className="button-primary min-h-10 px-4 py-2">
            Open console <ArrowUpRight aria-hidden="true" size={15} strokeWidth={2.2} />
          </Link>
        </div>
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white md:hidden"
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-white/[0.07] bg-[#080b10] px-4 pb-5 pt-3 md:hidden">
          <div className="mx-auto flex max-w-xl flex-col gap-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-xl px-3 text-sm text-[#c6d0d9] hover:bg-white/5 hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link href="/console" onClick={() => setOpen(false)} className="button-primary mt-3 w-full">
              Open live console <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
