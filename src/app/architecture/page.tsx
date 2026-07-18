import type { Metadata } from "next";
import {
  ArrowDown,
  ArrowRight,
  Binary,
  Blocks,
  Braces,
  Check,
  CircleDollarSign,
  Code2,
  Database,
  Eye,
  FileCheck2,
  Fingerprint,
  Gauge,
  Network,
  ReceiptText,
  RefreshCw,
  Route,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  TestTube2,
  Waypoints,
} from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Architecture and trust model",
  description: "Implemented KairoMesh domain primitives, scenario UI, and clearly separated production security requirements.",
};

const implemented = [
  {
    icon: Gauge,
    title: "Explainable scheduler",
    claim: "Hard constraints, normalized factors, deterministic tie-breaking, and failure-domain diversity.",
    proof: "scheduler.ts · invariant tests",
  },
  {
    icon: Route,
    title: "Versioned state machine",
    claim: "Explicit job and attempt transitions with optimistic state versions and monotonic fencing.",
    proof: "state-machine.ts · exhaustive transitions",
  },
  {
    icon: CircleDollarSign,
    title: "Double-entry demo ledger",
    claim: "Integer microcredits, balanced entries, idempotent reserve/settle/refund, and no double settlement.",
    proof: "ledger.ts · property invariants",
  },
  {
    icon: Fingerprint,
    title: "Tamper-evident receipts",
    claim: "Canonical event serialization, SHA-256 hash links, mutation detection, and browser-side recomputation.",
    proof: "proof-chain.ts · WebCrypto verifier",
  },
  {
    icon: RefreshCw,
    title: "Checkpoint failover",
    claim: "The presenter selects a replacement after checkpoint loss; the tested domain recovery marks the old attempt lost and advances its fence.",
    proof: "requeueLostRunningAttempt · presenter demo",
  },
  {
    icon: ShieldCheck,
    title: "API boundary controls",
    claim: "Zod input validation, request-size caps, rate limits, masked errors, CSP, and restrictive headers.",
    proof: "route handlers · security headers",
  },
];

const layers = [
  { icon: Eye, code: "01", label: "Experience", detail: "Mission control, quote policy, receipt explorer", tone: "#65a8ff" },
  { icon: Braces, code: "02", label: "Control API", detail: "Validation, rate limit, quote and receipt routes", tone: "#8dc0ff" },
  { icon: Binary, code: "03", label: "Domain core", detail: "Scheduler, state machine, fencing, ledger", tone: "#b8f36b" },
  { icon: ServerCog, code: "04", label: "Future agent", detail: "Planned lease, sandbox, and checkpoint controls", tone: "#f5b942" },
  { icon: ReceiptText, code: "05", label: "Demo evidence", detail: "Synthetic events, hash chain, illustrated settlement", tone: "#b8f36b" },
];

const boundaries = [
  {
    title: "Requester is untrusted",
    icon: Braces,
    controls: ["Current: schema-bound parameters", "Current: fixed demo catalog", "Current: no shell or image URL", "Target: durable abuse controls"],
  },
  {
    title: "Job container is hostile",
    icon: Blocks,
    controls: ["Target: rootless and non-root", "Target: read-only root filesystem", "Target: no host namespaces or socket", "Target: network none by default"],
  },
  {
    title: "Provider root is untrusted",
    icon: ServerCog,
    controls: ["Target: no Community secrets", "Target: independent output checks", "Current library: fenced attempts", "Target: payout after policy pass"],
  },
  {
    title: "Network is adversarial",
    icon: Network,
    controls: ["Target: outbound-only agent", "Target: short leases and capabilities", "Target: nonces and replay rejection", "Current demo: hash-linked events"],
  },
];

export default function ArchitecturePage() {
  return (
    <main id="main-content">
      <section className="pb-20 pt-32 sm:pb-28 sm:pt-40">
        <div className="page-shell">
          <Reveal>
            <span className="eyebrow"><Code2 aria-hidden="true" size={13} className="text-[#b8f36b]" /> Architecture · implemented core + target boundaries</span>
            <h1 className="text-gradient mt-7 max-w-5xl text-[clamp(3.2rem,8.5vw,7.8rem)] font-[560] leading-[0.89] tracking-[-0.07em]">Show the work.</h1>
            <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <p className="max-w-3xl text-[clamp(1.12rem,2vw,1.55rem)] leading-[1.5] tracking-[-0.025em] text-[#b4c0cb]">
                KairoMesh is a portfolio-grade vertical slice with real domain invariants—not a claim that one web app is already a global compute cloud.
              </p>
              <p className="text-sm leading-7 text-[#7f8d9c]">
                The hosted experience runs without a GPU. Inventory, telemetry, agents, credits, and failure timing are deterministic scenario data. Scheduling, validation, state/fence rules, ledger math, hash chains, and browser verification are implemented.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["70+", "domain assertions"],
              ["0", "floating-point credits"],
              ["02", "receipt scenarios"],
              ["03", "explicit trust tiers"],
            ].map(([value, label]) => (
              <div key={label} className="surface-card p-5">
                <p className="mono text-2xl font-medium text-white sm:text-3xl">{value}</p>
                <p className="mt-2 text-[0.65rem] leading-5 text-[#687583]">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0a0e14] py-24 sm:py-28">
        <div className="page-shell">
          <Reveal>
            <p className="section-kicker">System shape</p>
            <h2 className="section-title mt-5">A modular monolith with hard seams.</h2>
            <p className="section-copy mt-6">One deployable product is the honest starting point. Pure domain modules keep economic and scheduling rules testable before infrastructure is split.</p>
          </Reveal>

          <Reveal className="surface-card mt-12 overflow-hidden p-4 sm:p-7">
            <div className="grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
              {layers.map((layer, index) => (
                <div key={layer.code} className="contents">
                  <div className="relative rounded-xl border border-white/[0.07] bg-[#090d12] p-4 lg:min-h-[12rem]">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]" style={{ color: layer.tone }}><layer.icon aria-hidden="true" size={18} /></span>
                      <span className="mono text-[0.52rem] text-[#52606d]">{layer.code}</span>
                    </div>
                    <p className="mt-6 text-sm font-medium text-white">{layer.label}</p>
                    <p className="mt-2 text-[0.62rem] leading-5 text-[#687583]">{layer.detail}</p>
                  </div>
                  {index < layers.length - 1 && (
                    <div className="flex h-7 items-center justify-center text-[#52606d] lg:h-auto lg:w-7">
                      <ArrowDown aria-hidden="true" size={15} className="lg:hidden" />
                      <ArrowRight aria-hidden="true" size={15} className="hidden lg:block" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-2 border-t border-white/[0.07] pt-5 text-[0.61rem] leading-5 text-[#687583] sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-2"><Database aria-hidden="true" size={13} className="text-[#65a8ff]" /> Production: PostgreSQL + transactional outbox + object storage</span>
              <span className="mono uppercase tracking-[0.07em]">Demo: deterministic in-process scenario</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="page-shell">
          <Reveal>
            <p className="section-kicker">Executable claims</p>
            <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.75fr] lg:items-end">
              <h2 className="section-title">The important nouns have code behind them.</h2>
              <p className="section-copy">Each card maps a product promise to an implemented primitive and a test surface.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {implemented.map((item, index) => (
              <Reveal key={item.title} delay={(index % 3) * 0.04} className="surface-card flex h-full flex-col p-6 sm:p-7">
                <item.icon aria-hidden="true" size={21} className="text-[#b8f36b]" />
                <h3 className="mt-7 text-xl font-[560] tracking-[-0.035em] text-white">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#8f9dac]">{item.claim}</p>
                <div className="mono mt-6 border-t border-white/[0.07] pt-4 text-[0.54rem] uppercase tracking-[0.07em] text-[#687583]">{item.proof}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0a0e14] py-24 sm:py-28">
        <div className="page-shell">
          <Reveal>
            <p className="section-kicker">Production trust model</p>
            <h2 className="section-title mt-5">Assume every edge can lie.</h2>
            <p className="section-copy mt-6">These cards are production design requirements, not controls running in this web demo. The target control plane is trusted; requesters, workloads, provider operators, and the public network are not.</p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {boundaries.map((boundary, index) => (
              <Reveal key={boundary.title} delay={(index % 2) * 0.05} className="surface-card p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/[0.06] text-[#ff8d8d]"><boundary.icon aria-hidden="true" size={19} /></span>
                  <h3 className="text-lg font-[560] tracking-[-0.03em] text-white">{boundary.title}</h3>
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {boundary.controls.map((control) => <li key={control} className="flex items-start gap-2 text-xs leading-5 text-[#8f9dac]"><Check aria-hidden="true" size={13} className="mt-1 shrink-0 text-[#b8f36b]" />{control}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-5 rounded-2xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/[0.045] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <ShieldAlert aria-hidden="true" size={21} className="shrink-0 text-[#ff8d8d]" />
              <div>
                <p className="text-sm font-medium text-[#ffc0c0]">Community GPUs are not confidential computing.</p>
                <p className="mt-2 text-xs leading-6 text-[#a98383]">A provider with root can potentially inspect plaintext inputs, model weights, VRAM, process memory, and outputs. Encryption at rest and in transit does not protect data in use. Sensitive workloads require genuinely supported confidential hardware plus CPU/GPU attestation before any secret is released.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="page-shell grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Reveal className="surface-card p-6 sm:p-9">
            <div className="flex items-center justify-between"><Waypoints aria-hidden="true" size={21} className="text-[#65a8ff]" /><span className="mono text-[0.54rem] uppercase tracking-[0.08em] text-[#687583]">Job state / CAS versioned</span></div>
            <h2 className="mt-8 text-3xl font-[560] tracking-[-0.045em] text-white">Only legal transitions mutate state.</h2>
            <div className="mono mt-8 overflow-x-auto rounded-xl border border-white/[0.07] bg-[#090d12] p-4 text-[0.61rem] leading-7 text-[#8f9dac]">
              <p><span className="text-[#65a8ff]">DRAFT</span> → FUNDS_HELD → QUEUED</p>
              <p className="pl-12">↓</p>
              <p>LEASED → RUNNING → VERIFYING</p>
              <p className="pl-12">↓</p>
              <p><span className="text-[#b8f36b]">SETTLED</span> | <span className="text-[#ff8d8d]">DISPUTED</span> | REFUNDED</p>
            </div>
            <p className="mt-5 text-xs leading-6 text-[#7f8d9c]">Every mutation checks the expected state version. Reassignment increments the fence. An expired attempt may remain in the audit trail but cannot become the winner.</p>
          </Reveal>

          <Reveal delay={0.05} className="surface-card p-6 sm:p-9">
            <div className="flex items-center justify-between"><FileCheck2 aria-hidden="true" size={21} className="text-[#b8f36b]" /><span className="mono text-[0.54rem] uppercase tracking-[0.08em] text-[#687583]">Claim ledger</span></div>
            <h2 className="mt-8 text-3xl font-[560] tracking-[-0.045em] text-white">Precise language is a security feature.</h2>
            <div className="mt-8 space-y-3">
              {[
                ["Tamper-evident", "Yes", "Mutating a linked event changes the computed root."],
                ["Browser-verifiable", "Yes", "WebCrypto recomputes all SHA-256 links locally."],
                ["Proof of honest ML", "No", "Receipts attribute claims; they do not prove arbitrary computation."],
                ["Live escrow", "No", "The product uses explicitly labeled demo credits."],
              ].map(([claim, answer, detail]) => (
                <div key={claim} className="grid grid-cols-[1fr_auto] gap-3 rounded-xl border border-white/[0.07] bg-[#090d12] p-3.5">
                  <div><p className="text-xs text-[#c6d0d9]">{claim}</p><p className="mt-1 text-[0.58rem] leading-4 text-[#687583]">{detail}</p></div>
                  <span className={answer === "Yes" ? "mono text-[0.6rem] text-[#b8f36b]" : "mono text-[0.6rem] text-[#f5b942]"}>{answer}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="page-shell">
          <Reveal className="relative overflow-hidden rounded-3xl border border-[#65a8ff]/20 bg-[linear-gradient(135deg,#111a26,#10151d_60%,#142017)] p-7 sm:p-12">
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <TestTube2 aria-hidden="true" size={25} className="text-[#65a8ff]" />
                <h2 className="mt-7 max-w-3xl text-[clamp(2.3rem,5vw,4.7rem)] font-[560] leading-[0.97] tracking-[-0.055em] text-white">The architecture is easier to trust when you can attack it.</h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#9ba8b5]">Use the failure and mismatch controls, then verify the resulting receipt chain in your own browser.</p>
              </div>
              <Link href="/console" className="button-primary min-w-56 px-5">Open mission control <ArrowRight aria-hidden="true" size={16} /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
