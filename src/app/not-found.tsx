import { ArrowLeft, Radar, SquareTerminal } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-[78dvh] items-center pb-24 pt-32 sm:pt-40">
      <div className="page-shell">
        <div className="surface-card relative overflow-hidden p-7 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-[#65a8ff]/10" />
          <div className="pointer-events-none absolute right-10 top-8 h-40 w-40 rounded-full border border-[#b8f36b]/10" />
          <Radar aria-hidden="true" size={26} className="text-[#65a8ff]" />
          <p className="section-kicker mt-8">Route not found · 404</p>
          <h1 className="text-gradient mt-5 max-w-4xl text-[clamp(3.2rem,9vw,7.4rem)] font-[560] leading-[0.9] tracking-[-0.07em]">
            This node left the mesh.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#a9b5c3]">
            The address does not map to a KairoMesh surface. Return to the product story or open the deterministic failure presenter.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="button-primary px-5"><ArrowLeft aria-hidden="true" size={16} /> Back home</Link>
            <Link href="/console" className="button-secondary px-5"><SquareTerminal aria-hidden="true" size={16} /> Open Mission Control</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
