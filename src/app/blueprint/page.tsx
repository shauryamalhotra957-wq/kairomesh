import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Compass,
  Cpu,
  Gauge,
  Lightbulb,
  ListChecks,
  LockKeyhole,
  Quote,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wrench,
  Workflow,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Startup blueprint",
  description:
    "KairoMesh's evidence-gated roadmap from customer discovery to a resilient, production-grade GPU outcome cloud.",
};

const phases = [
  {
    id: "phase-1",
    number: "01",
    name: "Ideation",
    duration: "3–4 days",
    icon: Lightbulb,
    accentClass: "text-[#65a8ff]",
    iconClass: "border-[#65a8ff]/25 bg-[#65a8ff]/10 text-[#8dc0ff]",
    mission:
      "Reduce a broad, crowded P2P GPU marketplace concept to one painful customer job, one clear promise, and one safely deliverable scope.",
    actions: [
      {
        title: "Choose the first buyer.",
        detail:
          "Target 2–20-person AI video and image teams already spending at least $500 per month on burst GPU capacity.",
      },
      {
        title: "Name the job to be done.",
        detail: "Finish a render or generation batch by a deadline without managing flaky machines.",
      },
      {
        title: "Freeze one workload.",
        detail:
          "Support a signed, restartable workflow that can be divided by frame, scene, seed, or asset.",
      },
      {
        title: "Write the anti-goals.",
        detail:
          "Exclude gaming, confidential data, arbitrary shell access, inbound ports, tokens, frontier training, and global open onboarding.",
      },
      {
        title: "Map substitutes.",
        detail:
          "Compare local hardware, Vast, RunPod, Salad, io.net, Akash, and TensorDock by successful-output cost and operator time.",
      },
      {
        title: "Model the whole job.",
        detail:
          "Include host power, model transfer, retries, storage, payment fees, refunds, fraud loss, support, and platform margin.",
      },
      {
        title: "Define the trust boundary.",
        detail:
          "Label community workers Public/Non-sensitive and document what hosts, buyers, and the control plane can attack.",
      },
      {
        title: "Publish the one-page promise.",
        detail:
          "Show the deadline outcome, supported workload, indicative price, exclusions, and separate buyer and host applications.",
      },
    ],
    tools: ["ChatGPT", "Notion / Linear", "Google Sheets", "Figma", "Tally", "Cal.com", "Akash Signal"],
    kpis: [
      "One ICP and one supported workflow approved",
      "25 qualified buyer prospects and 25 plausible hosts",
      "A falsifiable deadline, price, and refund promise",
      "At least 20% modeled contribution margin",
      "Host payout clears electricity and wear",
      "No unresolved critical threat in scope",
      "Five discovery calls booked",
    ],
    insight:
      "A marketplace's visible supply is a vanity metric until paid demand clears it. Recruit the painful workload first; supply follows credible utilization.",
  },
  {
    id: "phase-2",
    number: "02",
    name: "Validation",
    duration: "10–14 days",
    icon: SearchCheck,
    accentClass: "text-[#b8f36b]",
    iconClass: "border-[#b8f36b]/25 bg-[#b8f36b]/10 text-[#b8f36b]",
    mission:
      "Prove that buyers will submit real workloads and pay—and that qualified hosts will provide usable capacity—before building a generalized cloud.",
    actions: [
      {
        title: "Interview 20 buyers.",
        detail:
          "Collect real bills, failure logs, queue patterns, security limits, workarounds, and the last deadline this problem damaged.",
      },
      {
        title: "Interview 20 hosts.",
        detail:
          "Record hardware, schedules, power cost, cooling, connectivity, ISP limits, minimum payout, and runtime tolerance.",
      },
      {
        title: "Put a price on the page.",
        detail:
          "Ask for a paid pilot, refundable deposit, or procurement conversation instead of collecting a generic waitlist.",
      },
      {
        title: "Run a concierge market.",
        detail:
          "Manually verify 3–5 GPUs, dispatch a fixed workflow, checkpoint externally, collect artifacts, and calculate payout.",
      },
      {
        title: "Keep a measured fallback.",
        detail:
          "Use existing cloud capacity only to rescue a committed pilot, and log its cost so it cannot silently erase margin.",
      },
      {
        title: "Benchmark the substitutes.",
        detail:
          "Run the same job locally, on Vast, and on RunPod; measure queue, transfer, compute, retries, operator minutes, and final cost.",
      },
      {
        title: "Ask for the second job.",
        detail:
          "Repeat paid work within two weeks is stronger evidence than enthusiasm, signups, or a polished demo.",
      },
      {
        title: "Make a hard decision.",
        detail:
          "Write a go, revise, or stop memo. Change the customer or workload only when paid evidence supports it.",
      },
    ],
    tools: ["Tally", "Cal.com", "HubSpot", "Stripe invoices", "Cloudflare R2", "PostHog", "OpenTelemetry", "Loom"],
    kpis: [
      "20 buyer and 20 host interviews completed",
      "Five paid or deposit-backed pilot commitments",
      "Ten qualified hosts willing to install the agent",
      "Three customers submit a second job",
      "At least 95% final completion after manual retry",
      "30% lower TCO or 50% less operator time",
      "Zero security, abuse, data-loss, or payment incidents",
    ],
    insight:
      "“I would use it” is courtesy. A real job, permission to process it, and payment are evidence. Optimize for uncomfortable truth, not a large waitlist.",
  },
  {
    id: "phase-3",
    number: "03",
    name: "MVP",
    duration: "4–6 weeks",
    icon: Wrench,
    accentClass: "text-[#f5b942]",
    iconClass: "border-[#f5b942]/25 bg-[#f5b942]/10 text-[#f5b942]",
    mission:
      "Automate one complete, safe marketplace loop: quote, submit, place, execute, checkpoint, verify, deliver, charge, and pay the host.",
    actions: [
      {
        title: "Build the buyer control surface.",
        detail:
          "Provide authentication, quote, submit, cancel, status, sanitized logs, outputs, spend limits, invoices, and deletion controls.",
      },
      {
        title: "Ship a Linux-only host agent.",
        detail:
          "Include enrollment, device identity, benchmarks, heartbeat, schedule, thermal ceiling, bandwidth cap, earnings estimate, and kill switch.",
      },
      {
        title: "Match by measured eligibility.",
        detail:
          "Use GPU and VRAM, throughput, model cache, region, reliability, thermals, network, deadline, and retry budget.",
      },
      {
        title: "Make work restartable.",
        detail:
          "Split jobs into idempotent shards, store checkpoints away from the host, and requeue after health or heartbeat failure.",
      },
      {
        title: "Restrict the runtime.",
        detail:
          "Run only signed platform images with rootless isolation, read-only roots, dropped capabilities, quotas, and no privileged mode.",
      },
      {
        title: "Constrain network and secrets.",
        detail:
          "Allow no public inbound access, default-deny egress, and issue short-lived scoped credentials only to eligible nodes.",
      },
      {
        title: "Verify useful output.",
        detail:
          "Check artifact count, dimensions, frames, decodability, workflow and model identity, provenance, and upload completion.",
      },
      {
        title: "Make money movement auditable.",
        detail:
          "Use idempotent metering, accepted-output charging, refunds, host payout, fees, reconciliation, and an immutable ledger.",
      },
      {
        title: "Operate trust and safety.",
        detail:
          "Add an AUP, screening, workload allowlist, abuse intake, suspension, kill switch, appeal path, and evidence policy.",
      },
      {
        title: "Test failure as normal.",
        detail:
          "Automate unit, integration, contract, end-to-end, security, load, chaos, restore, and payment-reconciliation tests.",
      },
    ],
    tools: [
      "Next.js / TypeScript",
      "FastAPI or Go",
      "PostgreSQL",
      "Temporal / Redis",
      "R2 / S3",
      "WireGuard",
      "Stripe Connect",
      "OpenTelemetry",
      "Trivy / Syft / Cosign",
      "GitHub Actions",
    ],
    kpis: [
      "25 real GPUs complete eligibility checks",
      "1,000 successful test, chaos, and pilot jobs",
      "At least 95% final completion after automatic retry",
      "P95 queue-to-start below 120 seconds when supply exists",
      "Quote-to-final price within ±10%",
      "Host onboarding median below 15 minutes",
      "Zero duplicate charges or payouts in reconciliation tests",
      "Zero open critical vulnerabilities",
      "All remaining seed or simulated data labeled",
    ],
    insight:
      "Residential nodes do not need hyperscaler uptime. KairoMesh's orchestration must make their failure boring while the customer buys final completion.",
  },
  {
    id: "phase-4",
    number: "04",
    name: "Launch",
    duration: "Weeks 7–12",
    icon: Rocket,
    accentClass: "text-[#ff8d8d]",
    iconClass: "border-[#ff6b6b]/25 bg-[#ff6b6b]/10 text-[#ff8d8d]",
    mission:
      "Win a dense, invite-only workload niche with transparent evidence before opening either side of the marketplace broadly.",
    actions: [
      {
        title: "Limit market density.",
        detail: "Operate in no more than three regions, one consumer-GPU family, and one workflow class.",
      },
      {
        title: "Publish honest status.",
        detail:
          "Mark Preview or Beta, distinguish live from simulated data, state the Public/Non-sensitive tier, and show measured SLOs.",
      },
      {
        title: "Expose the economics.",
        detail:
          "Explain quote composition, accepted-output billing, retry reserve, refunds, host payout, fees, and storage or transfer.",
      },
      {
        title: "Onboard design partners personally.",
        detail: "Watch every step and fix the highest-friction failure within one release cycle.",
      },
      {
        title: "Turn pilots into evidence.",
        detail:
          "Publish two case studies with baseline, queue, retries, final cost, deadline outcome, operator-time savings, and limits.",
      },
      {
        title: "Recruit concentrated supply.",
        detail:
          "Target university labs, rendering studios, creator communities, idle workstations, and small GPU farms.",
      },
      {
        title: "Teach the recovery model.",
        detail:
          "Run weekly workflow demos, publish an API quickstart, and show a host-loss recovery without pretending it is an SLA.",
      },
      {
        title: "Operate incidents visibly.",
        detail:
          "Define severity, staffed hours, status updates, refunds, postmortems, abuse escalation, and appeals.",
      },
      {
        title: "Review market health weekly.",
        detail:
          "Separate no-supply, host, workflow, artifact, control-plane, cancellation, fraud, and payment failures.",
      },
    ],
    tools: ["PostHog", "HubSpot", "Loops / Resend", "Discord", "GitHub Discussions", "Statuspage", "Loom", "Hacker News"],
    kpis: [
      "Ten paying teams",
      "$2,000+ monthly gross marketplace volume",
      "At least 30% weekly paying-customer repeat",
      "At least 98% final completion for supported jobs",
      "Customer satisfaction at least 4.5 / 5",
      "Refunds below 3% of GMV",
      "At least 35% utilization in declared host windows",
      "Zero unlabeled simulated metrics",
    ],
    insight:
      "Launch workload-by-workload and region-by-region. An apparently global network with empty liquidity is worse than a small market that consistently fills jobs.",
  },
  {
    id: "phase-5",
    number: "05",
    name: "Scale",
    duration: "3–12 months",
    icon: TrendingUp,
    accentClass: "text-[#c6d0d9]",
    iconClass: "border-white/[0.14] bg-white/[0.05] text-[#dce5ed]",
    mission:
      "Convert retention, workflow integrations, host-performance history, and reliability telemetry into a durable compute network.",
    actions: [
      {
        title: "Expand from retention.",
        detail:
          "Add transcription, embeddings, evaluation, and LoRA training one at a time, each with its own verification contract.",
      },
      {
        title: "Add multi-region resilience.",
        detail:
          "Replicate critical storage, make checkpoints portable, and fall back to vetted clouds when a paid deadline is at risk.",
      },
      {
        title: "Introduce market products.",
        detail:
          "Offer reserved capacity, low-priority queues, deadline tiers, spend policies, and committed host windows.",
      },
      {
        title: "Create a separate Trusted tier.",
        detail:
          "Use audited data-center hosts and supported confidential CPU/GPU combinations with remote attestation.",
      },
      {
        title: "Build compliance evidence.",
        detail:
          "Pursue SOC 2 readiness, penetration tests, DPAs, vendor reviews, incident exercises, and access and retention audits.",
      },
      {
        title: "Industrialize host acquisition.",
        detail:
          "Create campus and studio programs, a preconfigured Linux image, qualification kits, and power and thermal guidance.",
      },
      {
        title: "Deepen integrations.",
        detail: "Ship workflow-native SDKs and make KairoMesh a portable execution target, not a proprietary editor.",
      },
      {
        title: "Schedule with measured data.",
        detail:
          "Forecast demand, warm model caches, price retry risk, detect degradation, and optimize successful-output cost.",
      },
      {
        title: "Add enterprise controls.",
        detail:
          "Support teams, roles, spend policies, audit export, regional pinning, support SLAs, reserved pools, and procurement.",
      },
      {
        title: "Treat gaming as a separate line.",
        detail:
          "Proceed only after dedicated Windows supply, publisher review, anti-cheat compatibility, persistence, abuse controls, and latency proof.",
      },
    ],
    tools: [
      "Temporal",
      "Kubernetes / Nomad",
      "Terraform",
      "ClickHouse",
      "OpenTelemetry",
      "Vanta / Drata",
      "NVIDIA Attestation SDK",
      "Enterprise KYC",
    ],
    kpis: [
      "At least 40% eight-week paying cohort retention",
      "500 active verified GPUs",
      "At least 35% useful utilization",
      "$100,000 monthly GMV within 12 months",
      "At least 20% contribution margin",
      "At least 98% final completion",
      "99.9% control-plane uptime",
      "Fraud and chargeback loss below 0.5% of GMV",
      "No cross-tier data-classification incident",
    ],
    insight:
      "The GPUs are not the moat. The moat is workflow integration, reliable demand, host history, warm model placement, completion telemetry, and recovery operations.",
  },
] as const;

const sprint = [
  {
    days: "Days 1–3",
    title: "Freeze the thesis",
    actions: ["Select the exact buyer, workflow, regions, and exclusions", "Finish the threat model and economics", "Publish buyer and host applications"],
    checkpoint: "One-page brief, risk register, and 50-prospect pipeline",
  },
  {
    days: "Days 4–7",
    title: "Collect painful evidence",
    actions: ["Complete ten buyer and ten host interviews", "Obtain three real workload samples", "Secure 3–5 test GPUs and ask for deposits"],
    checkpoint: "One paid commitment and repeated evidence of the same problem",
  },
  {
    days: "Days 8–10",
    title: "Build the concierge runner",
    actions: ["Create one signed workload image", "Build benchmark, heartbeat, checkpoint, and manifest", "Compare local, Vast, and RunPod"],
    checkpoint: "Measured queue, output cost, retry, and operator-effort baseline",
  },
  {
    days: "Days 11–14",
    title: "Complete paid work",
    actions: ["Run the first paid jobs", "Measure accepted output, host earnings, and margin", "Ask immediately for the next batch"],
    checkpoint: "Three successful paid jobs and one repeat customer",
  },
  {
    days: "Days 15–21",
    title: "Automate the vertical slice",
    actions: ["Connect quote through payout state", "Add thermal guard, kill switch, and scoped secrets", "Label every demo-only field"],
    checkpoint: "One real remote GPU job completed without manual state edits",
  },
  {
    days: "Days 22–25",
    title: "Try to break it",
    actions: ["Inject host loss and corrupt checkpoints", "Test duplicate work, expired credentials, and payment timeout", "Restore data and reconcile the ledger"],
    checkpoint: "Chaos report, restore proof, and incident, refund, and abuse runbooks",
  },
  {
    days: "Days 26–28",
    title: "Run the partner beta",
    actions: ["Onboard five paying partners and ten hosts", "Run at least 100 representative jobs", "Fix the three largest reliability or UX losses"],
    checkpoint: "At least 95% final completion and no critical safety incident",
  },
  {
    days: "Days 29–30",
    title: "Publish evidence",
    actions: ["Release architecture, limits, pricing, and case study", "Distinguish live metrics from sample UI", "Open the invite-only beta"],
    checkpoint: "A go/no-go review on repeat use, reliability, margin, and risk",
  },
] as const;

const selfChecks = [
  {
    title: "Logical sequence",
    detail: "Narrow the wedge, validate payment, automate safely, launch densely, then scale from retention.",
  },
  {
    title: "Complete phase anatomy",
    detail: "Every phase carries a mission, actions, tools, duration, measurable gate, and founder insight.",
  },
  {
    title: "Ambitious, not imaginary",
    detail: "The first 90 days target ten paying teams and 25 verified nodes—not a fictional global network.",
  },
  {
    title: "Metrics without fluff",
    detail: "Repeat use, completion, output cost, host economics, margin, refunds, and incidents decide progress.",
  },
  {
    title: "Security through scope",
    detail: "Arbitrary code, sensitive data, inbound ports, tokens, frontier training, and gaming stay outside MVP.",
  },
  {
    title: "Truthful interface",
    detail: "Seeded nodes, animated jobs, sample earnings, and mock outcomes remain explicitly labeled simulated.",
  },
  {
    title: "Root-cause reliability",
    detail: "Portable checkpoints, idempotency, reconciliation, restore drills, and trust tiers resolve core risks.",
  },
  {
    title: "Evidence-gated expansion",
    detail: "No broad launch without paid validation and no Trusted-tier claim without attestation evidence.",
  },
] as const;

const targetMetrics = [
  { value: "10", label: "paying design partners", icon: Users },
  { value: "25", label: "verified GPU nodes", icon: Cpu },
  { value: "95%+", label: "final completion target", icon: Gauge },
  { value: "$2k+", label: "monthly GMV target", icon: CircleDollarSign },
] as const;

export default function BlueprintPage() {
  return (
    <main id="main-content" className="pb-24 pt-28 sm:pb-32 sm:pt-36">
      <section className="page-shell">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(22,29,39,.96),rgba(8,11,16,.98))] px-5 py-8 shadow-[0_40px_120px_rgba(0,0,0,.26)] sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-[#65a8ff]/10" />
          <div className="pointer-events-none absolute -right-4 -top-10 h-64 w-64 rounded-full border border-[#b8f36b]/10" />
          <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <span className="eyebrow">
                <Compass aria-hidden="true" size={14} className="text-[#b8f36b]" />
                90-day operating blueprint
              </span>
              <h1 className="text-gradient mt-7 max-w-[12ch] text-[clamp(3rem,7.5vw,6.8rem)] font-[560] leading-[0.9] tracking-[-0.07em]">
                Five gates from proof to scale.
              </h1>
              <p className="mt-6 max-w-2xl text-[1rem] leading-7 text-[#a9b5c3] sm:text-[1.08rem]">
                A complete, evidence-gated path from one painful batch workload to a resilient GPU outcome cloud. Each phase ends in a measurable reason to continue—or stop.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/console" className="button-primary px-5">
                  Open mission control <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <a href="#phase-1" className="button-secondary px-5">
                  Start with phase one <ArrowDown aria-hidden="true" size={16} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3" aria-label="First 90-day target metrics">
              {targetMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 sm:p-5">
                  <metric.icon aria-hidden="true" size={17} className="text-[#b8f36b]" />
                  <p className="mono mt-5 text-2xl font-medium text-white sm:text-3xl">{metric.value}</p>
                  <p className="mt-1 text-xs leading-5 text-[#7f8d9c]">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="relative mt-8 flex gap-3 rounded-xl border border-[#f5b942]/20 bg-[#f5b942]/[0.055] p-4 text-xs leading-5 text-[#c9b98c] sm:items-center">
            <LockKeyhole aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-[#f5b942] sm:mt-0" />
            <p>
              <strong className="font-medium text-[#f1d897]">Targets, not live claims.</strong> The current console is an interactive failure-and-receipt demonstration. Metrics on this page are operating gates until real agents, jobs, metering, and payouts prove them.
            </p>
          </aside>
        </div>

        <nav aria-label="Blueprint phases" className="surface-card mt-5 p-2">
          <ol className="grid gap-1 sm:grid-cols-5">
            {phases.map((phase) => (
              <li key={phase.id}>
                <a
                  href={`#${phase.id}`}
                  className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#a9b5c3] transition-colors duration-200 hover:bg-white/[0.04] hover:text-white"
                >
                  <span className={`mono text-[0.62rem] ${phase.accentClass}`}>{phase.number}</span>
                  <span className="font-medium">{phase.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <section aria-labelledby="phase-roadmap-title" className="page-shell mt-24 sm:mt-32">
        <div className="max-w-3xl">
          <p className="section-kicker">The five gates</p>
          <h2 id="phase-roadmap-title" className="section-title mt-5">
            Build only what the evidence unlocks.
          </h2>
          <p className="section-copy mt-6">
            Each phase has one job, a bounded toolset, and an exit gate. The roadmap prevents infrastructure ambition from outrunning customer truth.
          </p>
        </div>

        <div className="mt-14 space-y-6">
          {phases.map((phase) => (
            <article
              key={phase.id}
              id={phase.id}
              aria-labelledby={`${phase.id}-title`}
              className="surface-card scroll-mt-28 overflow-hidden"
            >
              <header className="grid gap-6 border-b border-white/[0.07] p-5 sm:p-7 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:p-9">
                <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${phase.iconClass}`}>
                  <phase.icon aria-hidden="true" size={22} />
                </span>
                <div>
                  <p className={`mono text-[0.62rem] uppercase tracking-[0.14em] ${phase.accentClass}`}>
                    Phase {phase.number}
                  </p>
                  <h3 id={`${phase.id}-title`} className="mt-2 text-3xl font-[560] tracking-[-0.045em] text-white sm:text-4xl">
                    {phase.name}
                  </h3>
                </div>
                <span className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-white/[0.09] bg-black/20 px-4 text-xs font-medium text-[#c6d0d9]">
                  <Clock3 aria-hidden="true" size={14} className={phase.accentClass} />
                  {phase.duration}
                </span>
              </header>

              <div className="border-b border-white/[0.07] bg-white/[0.015] p-5 sm:p-7 lg:p-9">
                <p className="mono text-[0.58rem] uppercase tracking-[0.13em] text-[#8f9dac]">Mission</p>
                <p className="mt-3 max-w-5xl text-lg font-[470] leading-8 tracking-[-0.02em] text-[#dce5ed] sm:text-xl">
                  {phase.mission}
                </p>
              </div>

              <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,.8fr)]">
                <section aria-label={`${phase.name} actions`} className="p-5 sm:p-7 lg:border-r lg:border-white/[0.07] lg:p-9">
                  <div className="flex items-center gap-3">
                    <ListChecks aria-hidden="true" size={18} className={phase.accentClass} />
                    <h4 id={`${phase.id}-actions`} className="text-base font-medium text-white">
                      Actions
                    </h4>
                  </div>
                  <ol className="mt-6 space-y-3">
                    {phase.actions.map((action, index) => (
                      <li key={action.title} className="grid grid-cols-[2rem_1fr] gap-3 rounded-xl border border-white/[0.065] bg-black/15 p-4">
                        <span className={`mono pt-0.5 text-[0.62rem] ${phase.accentClass}`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="text-sm leading-6 text-[#8f9dac]">
                          <strong className="font-medium text-[#dce5ed]">{action.title}</strong> {action.detail}
                        </p>
                      </li>
                    ))}
                  </ol>
                </section>

                <div className="grid content-start border-t border-white/[0.07] lg:border-t-0">
                  <section aria-label={`${phase.name} tools and platforms`} className="border-b border-white/[0.07] p-5 sm:p-7 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Workflow aria-hidden="true" size={17} className={phase.accentClass} />
                      <h4 id={`${phase.id}-tools`} className="text-sm font-medium text-white">
                        Tools and platforms
                      </h4>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {phase.tools.map((tool) => (
                        <li key={tool} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[0.68rem] text-[#a9b5c3]">
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section aria-label={`${phase.name} KPI gate`} className="border-b border-white/[0.07] p-5 sm:p-7 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Target aria-hidden="true" size={17} className={phase.accentClass} />
                      <h4 id={`${phase.id}-kpis`} className="text-sm font-medium text-white">
                        KPI gate
                      </h4>
                    </div>
                    <ul className="mt-5 space-y-3">
                      {phase.kpis.map((kpi) => (
                        <li key={kpi} className="flex gap-3 text-xs leading-5 text-[#a9b5c3]">
                          <CheckCircle2 aria-hidden="true" size={14} className={`mt-0.5 shrink-0 ${phase.accentClass}`} />
                          <span>{kpi}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <aside className="p-5 sm:p-7 lg:p-8" aria-label={`${phase.name} founder insight`}>
                    <Quote aria-hidden="true" size={19} className={phase.accentClass} />
                    <h4 className="mt-5 text-sm font-medium text-white">Founder insight</h4>
                    <p className="mt-3 text-sm leading-6 text-[#a9b5c3]">{phase.insight}</p>
                  </aside>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="sprint" aria-labelledby="sprint-title" className="mt-24 border-y border-white/[0.07] bg-[#0a0e14]/85 py-24 sm:mt-32 sm:py-28">
        <div className="page-shell">
          <div className="grid gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <p className="section-kicker">30-day action sprint</p>
              <h2 id="sprint-title" className="section-title mt-5">
                Thirty days to paid evidence.
              </h2>
            </div>
            <p className="section-copy lg:pb-1">
              The first month compresses discovery, a concierge runner, one real remote execution, destructive testing, and an invite-only decision gate.
            </p>
          </div>

          <ol className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {sprint.map((step, index) => (
              <li key={step.days} className="surface-card flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#65a8ff]/20 bg-[#65a8ff]/10 text-[#8dc0ff]">
                    <CalendarDays aria-hidden="true" size={18} />
                  </span>
                  <span className="mono text-[0.58rem] uppercase tracking-[0.12em] text-[#8f9dac]">
                    Sprint {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mono mt-6 text-[0.62rem] uppercase tracking-[0.12em] text-[#b8f36b]">{step.days}</p>
                <h3 className="mt-2 text-xl font-[560] tracking-[-0.035em] text-white">{step.title}</h3>
                <ul className="mt-5 space-y-3 text-xs leading-5 text-[#8f9dac]">
                  {step.actions.map((action) => (
                    <li key={action} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-[0.43rem] h-1 w-1 shrink-0 rounded-full bg-[#65a8ff]" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-white/[0.07] pt-5">
                  <p className="mono text-[0.55rem] uppercase tracking-[0.11em] text-[#8f9dac]">Gate / deliverable</p>
                  <p className="mt-2 text-xs leading-5 text-[#c6d0d9]">{step.checkpoint}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="self-check-title" className="page-shell py-24 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#b8f36b]/20 bg-[#b8f36b]/10 text-[#b8f36b]">
              <ShieldCheck aria-hidden="true" size={22} />
            </span>
            <p className="section-kicker mt-7">Self-check</p>
            <h2 id="self-check-title" className="mt-4 max-w-lg text-[clamp(2.2rem,5vw,4.4rem)] font-[560] leading-[0.98] tracking-[-0.055em] text-white">
              Ambition with a brake pedal.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#8f9dac]">
              These constraints stop KairoMesh from confusing visual polish, registered GPUs, or roadmap claims with a working marketplace.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {selfChecks.map((check) => (
              <li key={check.title} className="surface-card p-5 sm:p-6">
                <CheckCircle2 aria-hidden="true" size={18} className="text-[#b8f36b]" />
                <h3 className="mt-5 text-base font-medium text-white">{check.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#8f9dac]">{check.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-shell">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-[#b8f36b]/20 bg-[linear-gradient(135deg,#142017,#10151d_58%,#111a26)] p-7 shadow-[0_40px_120px_rgba(0,0,0,.3)] sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-[#b8f36b]/10" />
          <div className="relative grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#b8f36b]/20 bg-[#b8f36b]/10 text-[#b8f36b]">
                <Sparkles aria-hidden="true" size={22} />
              </span>
              <h2 className="mt-7 max-w-3xl text-[clamp(2.25rem,5vw,4.8rem)] font-[560] leading-[0.96] tracking-[-0.06em] text-white">
                A plan is useful when the product can survive it.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#a9b5c3] sm:text-base">
                Return to mission control to inspect the current simulated scheduling, checkpoint failover, receipt, and balanced settlement flow.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/console" className="button-primary min-w-52 px-5">
                Open mission control <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link href="/" className="button-secondary min-w-52 px-5">
                Back to overview <Compass aria-hidden="true" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
