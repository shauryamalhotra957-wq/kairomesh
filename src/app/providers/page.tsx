import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  CircleDollarSign,
  CloudCog,
  Cpu,
  Gauge,
  Leaf,
  LockKeyhole,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import Link from "next/link";
import { ProviderCalculator } from "@/components/provider-calculator";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "For GPU hosts",
  description:
    "Model simulated GPU-host earnings and inspect the controls, isolation boundaries, and evidence KairoMesh is designed to give providers.",
};

const hostControls = [
  {
    icon: TimerReset,
    title: "Your availability window",
    body: "Choose when a node can accept work. Planned drain mode finishes or checkpoints the active shard before returning the GPU to you.",
    detail: "Schedule · pause · drain",
  },
  {
    icon: Gauge,
    title: "Your operating limits",
    body: "Set a temperature ceiling, bandwidth cap, storage allowance, and the workload classes you are willing to serve.",
    detail: "Thermals · network · storage",
  },
  {
    icon: LockKeyhole,
    title: "A bounded workload",
    body: "The production target is digest-pinned images, least privilege, restricted networking, ephemeral credentials, and explicit resource quotas.",
    detail: "Pinned · isolated · inspectable",
  },
];

const onboardingSteps = [
  {
    number: "01",
    icon: Cpu,
    title: "Measure",
    body: "The host agent inspects GPU, VRAM, driver, network, storage, and supported isolation capabilities before an offer exists.",
  },
  {
    number: "02",
    icon: Gauge,
    title: "Bound",
    body: "You choose the schedule, thermal ceiling, network allowance, workload types, and price floor shown to the scheduler.",
  },
  {
    number: "03",
    icon: CloudCog,
    title: "Serve",
    body: "Eligible jobs arrive as pinned workload envelopes. Heartbeats and checkpoints make interruptions visible and recoverable.",
  },
  {
    number: "04",
    icon: CircleDollarSign,
    title: "Settle",
    body: "The target settlement flow releases payment after declared output checks pass and the receipt closes—not merely because time elapsed.",
  },
];

export default function ProvidersPage() {
  return (
    <main id="main-content">
      <section className="relative overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-40">
        <div className="page-shell relative grid gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:gap-14">
          <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-96 w-96 rounded-full bg-[#b8f36b]/[0.045] blur-3xl" />
          <div>
            <Reveal>
              <span className="eyebrow"><span className="status-dot" /> For GPU hosts · simulated economics</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="text-gradient mt-7 max-w-[11ch] text-[clamp(3.25rem,8.4vw,7.2rem)] font-[560] leading-[0.88] tracking-[-0.072em]">
                Idle silicon. Clear terms.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-2xl text-[1rem] leading-7 text-[#a9b5c3] sm:text-[1.08rem] sm:leading-8">
                KairoMesh is designed to turn spare GPU windows into bounded, checkpointable jobs—without asking hosts to surrender their schedule, thermal limits, network policy, or right to stop.
              </p>
            </Reveal>
            <Reveal delay={0.18} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#earnings-calculator" className="button-primary px-5">
                Estimate net earnings <CircleDollarSign aria-hidden="true" size={16} />
              </a>
              <Link href="/console" className="button-secondary px-5">
                Open live console <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </Reveal>
            <Reveal delay={0.24} className="mt-8 flex max-w-2xl gap-3 rounded-xl border border-[#f5b942]/18 bg-[#f5b942]/[0.05] p-4 text-xs leading-5 text-[#c9b98c]">
              <ShieldCheck aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-[#f5b942]" />
              <p>
                <strong className="font-medium text-[#f1d897]">Research demo:</strong> this page models a proposed provider contract. It does not enroll hardware, quote a guaranteed rate, or issue live payouts.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="relative">
            <div className="pointer-events-none absolute -inset-16 -z-10 bg-[radial-gradient(circle,rgba(101,168,255,.09),transparent_60%)]" />
            <div className="surface-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#b8f36b]/20 bg-[#b8f36b]/10 text-[#b8f36b]">
                    <Cpu aria-hidden="true" size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">Host policy preview</p>
                    <p className="mono mt-1 text-[0.52rem] uppercase tracking-[0.1em] text-[#687583]">monsoon-01 · local draft</p>
                  </div>
                </div>
                <span className="mono rounded-full border border-[#65a8ff]/20 bg-[#65a8ff]/10 px-2.5 py-1.5 text-[0.52rem] uppercase tracking-[0.08em] text-[#8dc0ff]">
                  Not published
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-7 gap-1.5" aria-label="Example weekly GPU availability: eighteen hours per day">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                    <div key={`${day}-${index}`} className="text-center">
                      <span className="mono text-[0.52rem] text-[#687583]">{day}</span>
                      <div className="mt-2 grid h-24 grid-rows-6 gap-1 rounded-lg border border-white/[0.06] bg-black/20 p-1.5">
                        {[0, 1, 2, 3, 4, 5].map((slot) => (
                          <span
                            key={slot}
                            className={`rounded-sm ${slot < 5 ? "bg-gradient-to-r from-[#65a8ff]/60 to-[#b8f36b]/60" : "bg-white/[0.045]"}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mono mt-3 flex justify-between text-[0.52rem] uppercase tracking-[0.08em] text-[#5f6d7b]">
                  <span>18 h / day available</span>
                  <span>6 h reserved locally</span>
                </div>

                <dl className="mt-6 divide-y divide-white/[0.07] rounded-xl border border-white/[0.07] bg-[#090d12] px-4">
                  {[
                    ["Thermal ceiling", "78 °C"],
                    ["Network allowance", "300 Mbps"],
                    ["Runtime policy", "Isolated"],
                    ["Interruption mode", "Checkpoint + drain"],
                  ].map(([term, value]) => (
                    <div key={term} className="flex min-h-12 items-center justify-between gap-4 py-3 text-xs">
                      <dt className="text-[#7f8d9c]">{term}</dt>
                      <dd className="mono text-right text-[#c6d0d9]">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#b8f36b]/15 bg-[#b8f36b]/[0.055] p-4">
                  <BadgeCheck aria-hidden="true" size={17} className="shrink-0 text-[#b8f36b]" />
                  <p className="text-xs leading-5 text-[#a9c389]">A host sees the proposed limits before a node becomes rentable.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="earnings-calculator" aria-labelledby="earnings-heading" className="scroll-mt-24 border-y border-white/[0.07] bg-[#0a0e14]/75 py-20 sm:py-28">
        <div className="page-shell">
          <Reveal>
            <p className="section-kicker">Transparent assumptions</p>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.82fr] lg:items-end">
              <h2 id="earnings-heading" className="section-title">Gross is not what reaches your wallet.</h2>
              <p className="section-copy">
                Change the machine, power price, available hours, and expected booked utilization. KairoMesh shows the fee and loaded electricity instead of hiding them behind one optimistic number.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="mt-12">
            <ProviderCalculator />
          </Reveal>
        </div>
      </section>

      <section id="host-security" aria-labelledby="host-security-heading" className="py-24 sm:py-32">
        <div className="page-shell">
          <Reveal>
            <p className="section-kicker">The host boundary</p>
            <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.82fr] lg:items-end">
              <h2 id="host-security-heading" className="section-title">Your GPU is not an open shell.</h2>
              <p className="section-copy">
                Provider safety must be engineered before real enrollment. These are the control-plane requirements KairoMesh is designed around—not claims that the current demo is a production sandbox.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {hostControls.map((control, index) => (
              <Reveal key={control.title} delay={index * 0.05} className="surface-card flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-[#b8f36b]">
                    <control.icon aria-hidden="true" size={20} />
                  </span>
                  <span className="mono text-right text-[0.52rem] uppercase tracking-[0.1em] text-[#687583]">Host-owned</span>
                </div>
                <h3 className="mt-8 text-2xl font-[560] tracking-[-0.04em] text-white">{control.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-6 text-[#8f9dac]">{control.body}</p>
                <p className="mono mt-7 border-t border-white/[0.07] pt-5 text-[0.55rem] uppercase tracking-[0.08em] text-[#7f8d9c]">{control.detail}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-5 rounded-2xl border border-[#65a8ff]/18 bg-[#65a8ff]/[0.05] p-5 sm:flex sm:items-start sm:gap-4 sm:p-6">
            <ShieldCheck aria-hidden="true" size={20} className="mb-3 shrink-0 text-[#65a8ff] sm:mb-0" />
            <div className="text-sm leading-6 text-[#9db9d8]">
              <p className="font-medium text-[#c8dcf4]">Production gate, not marketing copy</p>
              <p className="mt-1">
                A real host launch requires a reviewed agent, image pinning, least privilege, resource quotas, egress controls, secret isolation, abuse handling, signed updates, and a documented uninstall path. Until those exist, KairoMesh should remain a transparent research demo.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="provider-flow-heading" className="border-y border-white/[0.07] bg-[#0a0e14] py-24 sm:py-28">
        <div className="page-shell">
          <Reveal className="text-center">
            <p className="section-kicker">Target provider flow</p>
            <h2 id="provider-flow-heading" className="section-title mx-auto mt-5">From spare window to closed receipt.</h2>
            <p className="section-copy mx-auto mt-6">Four legible stages, with the host&apos;s limits carried into every scheduling decision.</p>
          </Reveal>
          <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {onboardingSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.05} className="surface-card p-6">
                <div className="flex items-center justify-between">
                  <span className="mono text-xs text-[#b8f36b]">{step.number}</span>
                  <step.icon aria-hidden="true" size={17} className="text-[#687583]" />
                </div>
                <h3 className="mt-8 text-xl font-[560] tracking-[-0.035em] text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#8f9dac]">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="page-shell">
          <Reveal className="relative overflow-hidden rounded-[1.5rem] border border-[#b8f36b]/20 bg-[linear-gradient(135deg,#142017,#10151d_58%,#111a26)] p-7 shadow-[0_40px_120px_rgba(0,0,0,.3)] sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[#b8f36b]/10" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#b8f36b]/20 bg-[#b8f36b]/10 text-[#b8f36b]">
                  <Leaf aria-hidden="true" size={22} />
                </span>
                <h2 className="mt-8 max-w-3xl text-[clamp(2.4rem,6vw,5.2rem)] font-[560] leading-[0.96] tracking-[-0.06em] text-white">
                  Inspect the outcome before joining the supply.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[#a9b5c3]">
                  The live console uses simulated nodes and credits, but the scheduler, failure state machine, receipt-chain verification, and settlement invariants are executable.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/console" className="button-primary min-w-52 px-5">
                  Run the failure demo <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link href="/architecture" className="button-secondary min-w-52 px-5">
                  Read the trust model <Blocks aria-hidden="true" size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
