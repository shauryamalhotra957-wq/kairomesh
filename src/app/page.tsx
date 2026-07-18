import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Check,
  ChevronRight,
  CircleDollarSign,
  CloudCog,
  Cpu,
  Fingerprint,
  Gauge,
  Leaf,
  LockKeyhole,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from "lucide-react";
import Link from "next/link";
import { HeroMesh } from "@/components/hero-mesh";
import { Reveal } from "@/components/reveal";
import { nodeOffers } from "@/lib/network-data";

const liveOffers = nodeOffers.filter((offer) => offer.status === "ready").slice(0, 6);

const proofSteps = [
  { label: "Match", detail: "Hard constraints first", icon: Gauge },
  { label: "Challenge", detail: "Fresh node evidence", icon: Fingerprint },
  { label: "Run", detail: "Bounded catalog job", icon: Cpu },
  { label: "Recover", detail: "Checkpoint failover", icon: RefreshCw },
  { label: "Receipt", detail: "Verify then settle", icon: ReceiptText },
];

export default function Home() {
  return (
    <main id="main-content">
      <section className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40 lg:min-h-[52rem] lg:pb-32">
        <div className="page-shell relative grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <div className="relative z-10">
            <Reveal>
              <span className="eyebrow"><span className="status-dot" /> Outcome cloud · receipt-carrying demo jobs</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="text-gradient mt-7 max-w-[13ch] text-[clamp(3.25rem,8.7vw,7.7rem)] font-[560] leading-[0.86] tracking-[-0.075em]">
                GPU jobs that finish.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-[clamp(1.15rem,2.25vw,1.8rem)] font-[470] leading-[1.22] tracking-[-0.035em] text-[#c6d0d9]">
                Even when hosts don&apos;t.
              </p>
              <p className="mt-6 max-w-[38rem] text-[1rem] leading-7 text-[#8f9dac] sm:text-[1.08rem]">
                KairoMesh explores a checkpointed outcome cloud for independent GPUs. The deterministic presenter explains each match, recovers its injected interruption when eligible capacity exists, and closes accepted scenarios with a tamper-evident receipt.
              </p>
            </Reveal>
            <Reveal delay={0.18} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/console" className="button-primary px-5">
                Run the interactive failure demo <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link href="/architecture" className="button-secondary px-5">
                Inspect the trust model <ShieldCheck aria-hidden="true" size={16} />
              </Link>
            </Reveal>
            <Reveal delay={0.24} className="mt-9 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/[0.08] pt-5">
              {[
                ["08", "ready GPUs"],
                ["06", "failure domains"],
                ["100%", "visible scoring"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="mono text-lg font-medium text-white sm:text-xl">{value}</p>
                  <p className="mt-1 text-[0.67rem] leading-4 text-[#6f7d8b] sm:text-xs">{label}</p>
                </div>
              ))}
            </Reveal>
          </div>
          <Reveal delay={0.15} className="relative lg:translate-y-6">
            <div className="pointer-events-none absolute -inset-20 -z-10 bg-[radial-gradient(circle,rgba(184,243,107,.08),transparent_58%)]" />
            <HeroMesh />
          </Reveal>
        </div>
      </section>

      <section aria-label="Live demo marketplace" className="border-y border-white/[0.07] bg-[#0a0e14]/75 py-4">
        <div className="page-shell flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex shrink-0 items-center gap-2 pr-4">
            <span className="status-dot" />
            <span className="mono text-[0.6rem] uppercase tracking-[0.13em] text-[#a9b5c3]">Simulated spot tape</span>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {liveOffers.map((offer) => (
              <div key={offer.id} className="min-w-0 border-l border-white/[0.08] pl-3">
                <p className="truncate text-[0.68rem] font-medium text-[#c6d0d9]">{offer.gpu}</p>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="mono text-[0.65rem] text-[#b8f36b]">${offer.pricePerHour.toFixed(2)}/h</span>
                  <span className="mono truncate text-[0.52rem] uppercase text-[#5f6d7b]">{offer.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="py-24 sm:py-32">
        <div className="page-shell">
          <Reveal>
            <p className="section-kicker">Not another GPU list</p>
            <div className="mt-5 grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <h2 className="section-title">Trust the evidence. Not the listing.</h2>
              <p className="section-copy lg:pb-1">
                Price-only marketplaces sell machines. KairoMesh sells a bounded outcome: a policy-bound job, a recovery policy, an accepted artifact, and evidence you can inspect.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-4 lg:grid-cols-12">
            <Reveal className="surface-card relative overflow-hidden p-6 sm:p-8 lg:col-span-7 lg:min-h-[27rem]">
              <div className="absolute right-0 top-0 h-44 w-44 bg-[radial-gradient(circle,rgba(101,168,255,.11),transparent_70%)]" />
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#65a8ff]/25 bg-[#65a8ff]/10 text-[#8dc0ff]"><Fingerprint aria-hidden="true" size={20} /></span>
                <span className="mono text-[0.56rem] uppercase tracking-[0.12em] text-[#687583]">Compute passport / product target</span>
              </div>
              <h3 className="mt-8 max-w-lg text-3xl font-[560] tracking-[-0.045em] text-white sm:text-4xl">A badge says yes. A production passport should show why.</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#8f9dac] sm:text-base sm:leading-7">The target contract binds fresh challenges, measured throughput, uptime history, runtime policy, and an evidence tier to every offer. This demo uses labeled fixtures.</p>
              <div className="mt-8 grid gap-2 sm:grid-cols-3">
                {[
                  ["Target identity", "fresh challenge", BadgeCheck],
                  ["Target runtime", "digest policy", LockKeyhole],
                  ["Demo history", "synthetic fixture", Gauge],
                ].map(([label, detail, Icon]) => {
                  const CardIcon = Icon as typeof BadgeCheck;
                  return (
                    <div key={label as string} className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                      <CardIcon aria-hidden="true" size={16} className="text-[#b8f36b]" />
                      <p className="mt-5 text-xs font-medium text-white">{label as string}</p>
                      <p className="mono mt-1 text-[0.56rem] uppercase tracking-[0.08em] text-[#687583]">{detail as string}</p>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.05} className="surface-card overflow-hidden p-6 sm:p-8 lg:col-span-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#b8f36b]/25 bg-[#b8f36b]/10 text-[#b8f36b]"><TimerReset aria-hidden="true" size={20} /></span>
                <span className="mono text-[0.56rem] uppercase tracking-[0.12em] text-[#687583]">Fence token / 02</span>
              </div>
              <h3 className="mt-8 text-3xl font-[560] tracking-[-0.045em] text-white">Failures become boring.</h3>
              <p className="mt-4 text-sm leading-6 text-[#8f9dac] sm:text-base sm:leading-7">In the presenter, a synthetic checkpoint digest moves to a different failure domain. The tested state model advances the fence so stale completions cannot win.</p>
              <div className="mt-8 rounded-xl border border-white/[0.07] bg-[#090d12] p-4">
                <div className="flex items-center justify-between text-[0.62rem]">
                  <span className="mono text-[#ff8d8d]">monsoon-01 / lost</span>
                  <span className="mono text-[#687583]">checkpoint 18</span>
                </div>
                <div className="my-4 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
                  <span className="h-px flex-1 bg-gradient-to-r from-[#ff6b6b]/40 to-[#65a8ff]/40" />
                  <RefreshCw aria-hidden="true" size={15} className="text-[#65a8ff]" />
                  <span className="h-px flex-1 bg-gradient-to-r from-[#65a8ff]/40 to-[#b8f36b]/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#b8f36b]" />
                </div>
                <div className="flex items-center justify-between text-[0.62rem]">
                  <span className="mono text-[#687583]">lost work / 00:42</span>
                  <span className="mono text-[#b8f36b]">aurora-05 / running</span>
                </div>
              </div>
            </Reveal>

            <Reveal className="surface-card p-6 sm:p-8 lg:col-span-4">
              <CircleDollarSign aria-hidden="true" size={22} className="text-[#b8f36b]" />
              <h3 className="mt-7 text-2xl font-[560] tracking-[-0.04em] text-white">Pay for accepted output.</h3>
              <p className="mt-3 text-sm leading-6 text-[#8f9dac]">Demo credits stay reserved until the verification policy passes.</p>
              <div className="mono mt-7 space-y-3 text-[0.62rem] uppercase tracking-[0.06em]">
                <div className="flex justify-between border-b border-white/[0.06] pb-3 text-[#a9b5c3]"><span>Buyer held</span><span>−2,740,000 μcr</span></div>
                <div className="flex justify-between border-b border-white/[0.06] pb-3 text-[#a9b5c3]"><span>Host pending</span><span>+2,493,400 μcr</span></div>
                <div className="flex justify-between text-[#b8f36b]"><span>Ledger delta</span><span>0 μcr</span></div>
              </div>
            </Reveal>

            <Reveal delay={0.05} className="surface-card p-6 sm:p-8 lg:col-span-4">
              <CloudCog aria-hidden="true" size={22} className="text-[#65a8ff]" />
              <h3 className="mt-7 text-2xl font-[560] tracking-[-0.04em] text-white">The scheduler explains itself.</h3>
              <p className="mt-3 text-sm leading-6 text-[#8f9dac]">Hard constraints filter first. Weighted evidence ranks what remains.</p>
              <div className="mt-7 space-y-3">
                {[["Reliability", 94], ["Cost", 88], ["Trust", 97], ["Carbon", 76]].map(([label, score]) => (
                  <div key={label as string} className="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-2 text-[0.65rem]">
                    <span className="text-[#a9b5c3]">{label as string}</span>
                    <span className="h-1 rounded-full bg-white/[0.06]"><span className="block h-full rounded-full bg-gradient-to-r from-[#65a8ff] to-[#b8f36b]" style={{ width: `${score}%` }} /></span>
                    <span className="mono text-right text-[#c6d0d9]">{score as number}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="surface-card p-6 sm:p-8 lg:col-span-4">
              <ReceiptText aria-hidden="true" size={22} className="text-[#f5b942]" />
              <h3 className="mt-7 text-2xl font-[560] tracking-[-0.04em] text-white">Receipts survive the UI.</h3>
              <p className="mt-3 text-sm leading-6 text-[#8f9dac]">Hash-linked events expose mutation and make the execution story portable.</p>
              <div className="mono mt-7 rounded-xl border border-white/[0.07] bg-[#090d12] p-4 text-[0.58rem] leading-5 text-[#7f8d9c]">
                <p><span className="text-[#a9b5c3]">image</span> sha256:85ef…b29a</p>
                <p><span className="text-[#a9b5c3]">output</span> sha256:02cc…7e40</p>
                <p><span className="text-[#a9b5c3]">fence</span> 00000002</p>
                <p className="mt-2 text-[#b8f36b]">✓ example failover chain / 9 blocks</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0a0e14] py-24 sm:py-28">
        <div className="page-shell">
          <Reveal className="text-center">
            <p className="section-kicker">The proof rail</p>
            <h2 className="section-title mx-auto mt-5">One job. Five legible states.</h2>
            <p className="section-copy mx-auto mt-6">The live demo makes the invisible parts of distributed compute inspectable.</p>
          </Reveal>
          <div className="relative mt-14 grid gap-3 md:grid-cols-5">
            <div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-gradient-to-r from-[#65a8ff]/10 via-[#b8f36b]/60 to-[#65a8ff]/10 md:block" />
            {proofSteps.map((step, index) => (
              <Reveal key={step.label} delay={index * 0.05} className="relative rounded-2xl border border-white/[0.07] bg-[#10151d] p-5 md:border-transparent md:bg-transparent md:text-center">
                <span className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.1] bg-[#10151d] text-[#b8f36b] shadow-[0_0_0_7px_#0a0e14]">
                  <step.icon aria-hidden="true" size={22} />
                </span>
                <p className="mt-5 text-sm font-medium text-white">{step.label}</p>
                <p className="mono mt-2 text-[0.55rem] uppercase tracking-[0.08em] text-[#687583]">{step.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="page-shell">
          <Reveal>
            <p className="section-kicker">Honest assurance</p>
            <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.82fr] lg:items-end">
              <h2 className="section-title">Trust is a policy. Not a magic badge.</h2>
              <p className="section-copy">Community hardware has real limits. KairoMesh shows what each target tier is designed to observe—and what it still cannot guarantee.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {[
              { tier: "01 / Observed target", icon: Gauge, tone: "#65a8ff", title: "Measured and replay-resistant by design.", body: "Production requires nonce-bound challenges, enrolled agent identity, benchmark history, thermals, heartbeat, and output hashes. None is live in this demo.", items: ["Fresh challenge · planned", "Health history · planned", "Demo hash-chain receipt"] },
              { tier: "02 / Isolated target", icon: Blocks, tone: "#b8f36b", title: "A bounded workload envelope.", body: "The production design adds digest-pinned templates, restricted filesystems, no inbound ports, and default-deny networking. The current app executes no containers.", items: ["Digest catalog · planned", "Read-only root · planned", "Presenter recovery"] },
              { tier: "03 / Attested", icon: LockKeyhole, tone: "#f5b942", title: "Hardware-backed where supported.", body: "A future datacenter tier for supported confidential GPUs and CPU TEEs. Consumer RTX nodes are never mislabeled private.", items: ["Remote attestation", "Policy-gated secret release", "Supported hardware only"] },
            ].map((card, index) => (
              <Reveal key={card.tier} delay={index * 0.05} className="surface-card flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]" style={{ color: card.tone }}><card.icon aria-hidden="true" size={20} /></span>
                  <span className="mono text-[0.56rem] uppercase tracking-[0.1em] text-[#687583]">{card.tier}</span>
                </div>
                <h3 className="mt-8 text-2xl font-[560] tracking-[-0.04em] text-white">{card.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#8f9dac]">{card.body}</p>
                <ul className="mt-7 space-y-3 border-t border-white/[0.07] pt-6 text-xs text-[#c6d0d9]">
                  {card.items.map((item) => <li key={item} className="flex items-center gap-3"><Check aria-hidden="true" size={14} style={{ color: card.tone }} /> {item}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-5 rounded-2xl border border-[#f5b942]/20 bg-[#f5b942]/[0.055] p-5 text-sm leading-6 text-[#c9b98c] sm:flex sm:items-start sm:gap-4">
            <ShieldCheck aria-hidden="true" className="mb-3 shrink-0 text-[#f5b942] sm:mb-0" size={19} />
            <p><strong className="font-medium text-[#f1d897]">What we do not claim:</strong> the current unsigned demo chain detects later mutation of its synthetic scenario events and attributes nobody. A future node signature could add attribution, but still would not prove arbitrary ML output was honestly computed.</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="page-shell">
          <Reveal className="relative overflow-hidden rounded-[1.5rem] border border-[#b8f36b]/20 bg-[linear-gradient(135deg,#142017,#10151d_58%,#111a26)] p-7 shadow-[0_40px_120px_rgba(0,0,0,.3)] sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[#b8f36b]/10" />
            <div className="pointer-events-none absolute -right-4 -top-10 h-56 w-56 rounded-full border border-[#65a8ff]/10" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#b8f36b]/20 bg-[#b8f36b]/10 text-[#b8f36b]"><Sparkles aria-hidden="true" size={22} /></span>
                <h2 className="mt-8 max-w-3xl text-[clamp(2.4rem,6vw,5.2rem)] font-[560] leading-[0.96] tracking-[-0.06em] text-white">Don&apos;t trust the pitch. Break the network.</h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[#a9b5c3]">Launch Mission Control, disconnect a synthetic host, watch the checkpoint presenter recover, and inspect the scenario-bound receipt and settlement model.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/console" className="button-primary min-w-52 px-5">Open mission control <ChevronRight aria-hidden="true" size={16} /></Link>
                <Link href="/providers" className="button-secondary min-w-52 px-5">Explore host economics <Leaf aria-hidden="true" size={16} /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
