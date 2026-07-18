"use client";

import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Ban,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clipboard,
  CloudLightning,
  Cpu,
  Fingerprint,
  Gauge,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  Play,
  ReceiptText,
  RotateCcw,
  ServerCrash,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TriangleAlert,
  Waypoints,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DEMO_MICROCREDITS_PER_UNIT, splitDemoCredits } from "@/lib/demo-economics";
import type { EvidenceTier, JobRequest, NodeOffer, PriorityWeights, SchedulePlan, WorkloadPreset } from "@/lib/domain";
import { defaultPriorities } from "@/lib/network-data";
import { verifyReceiptInBrowser, type BrowserReceiptBlock } from "@/lib/receipt-browser";
import { chooseFailoverNode } from "@/lib/scheduler";
import { cn, formatCurrency } from "@/lib/utils";

type RunState = "idle" | "queued" | "running" | "recovering" | "verifying" | "settled" | "mismatch";
type EventTone = "neutral" | "active" | "good" | "warn" | "bad";

interface DemoEvent {
  id: number;
  at: string;
  code: string;
  message: string;
  tone: EventTone;
}

interface ReceiptData {
  version: string;
  jobId: string;
  scenario: "clean" | "failover";
  chain: BrowserReceiptBlock[];
  rootHash: string;
  claim: string;
}

interface ReceiptRequestPayload {
  scenario: "clean" | "failover";
  request: JobRequest;
  failedNodeId?: string;
}

const profiles: Record<string, { label: string; description: string; icon: typeof Gauge; weights: PriorityWeights }> = {
  balanced: {
    label: "Balanced",
    description: "Cost, trust, and reliability",
    icon: Gauge,
    weights: { ...defaultPriorities },
  },
  cheapest: {
    label: "Lowest cost",
    description: "Price-dominant routing",
    icon: CircleDollarSign,
    weights: { cost: 0.62, reliability: 0.13, carbon: 0.05, latency: 0.05, trust: 0.15 },
  },
  trusted: {
    label: "Most trusted",
    description: "Evidence and availability first",
    icon: ShieldCheck,
    weights: { cost: 0.08, reliability: 0.34, carbon: 0.05, latency: 0.03, trust: 0.5 },
  },
  green: {
    label: "Low carbon",
    description: "Carbon-aware placement",
    icon: Leaf,
    weights: { cost: 0.15, reliability: 0.18, carbon: 0.5, latency: 0.02, trust: 0.15 },
  },
};

const evidenceLabels: Record<EvidenceTier, string> = {
  observed: "Observed",
  isolated: "Isolated",
  attested: "Attested",
};

const initialEvents: DemoEvent[] = [
  { id: 0, at: "T−00.0", code: "DEMO_READY", message: "Presenter-safe network seeded locally.", tone: "neutral" },
];

const stateMeta: Record<RunState, { label: string; tone: string }> = {
  idle: { label: "Ready", tone: "text-[#a9b5c3] border-white/10 bg-white/[0.03]" },
  queued: { label: "Matching", tone: "text-[#8dc0ff] border-[#65a8ff]/25 bg-[#65a8ff]/10" },
  running: { label: "Running", tone: "text-[#b8f36b] border-[#b8f36b]/25 bg-[#b8f36b]/10" },
  recovering: { label: "Recovering", tone: "text-[#f5c76a] border-[#f5b942]/25 bg-[#f5b942]/10" },
  verifying: { label: "Verifying", tone: "text-[#8dc0ff] border-[#65a8ff]/25 bg-[#65a8ff]/10" },
  settled: { label: "Settled", tone: "text-[#b8f36b] border-[#b8f36b]/25 bg-[#b8f36b]/10" },
  mismatch: { label: "Rejected", tone: "text-[#ff8d8d] border-[#ff6b6b]/25 bg-[#ff6b6b]/10" },
};

function buildRequest(preset: WorkloadPreset, tier: EvidenceTier, profileKey: string): JobRequest {
  return {
    id: "job_console_demo",
    name: preset.label,
    workload: preset.id,
    minVramGb: preset.minVramGb,
    gpuCount: preset.gpuCount,
    durationMinutes: preset.durationMinutes,
    maxPricePerGpuHour: preset.maxPricePerGpuHour,
    minimumEvidenceTier: tier,
    checkpointIntervalMinutes: 8,
    priorities: { ...profiles[profileKey].weights },
  };
}

function formatStateTime(id: number) {
  return `T+${(id * 0.8).toFixed(1).padStart(4, "0")}`;
}

function NetworkMap({
  offers,
  plan,
  state,
  failedNodeId,
  standbyNodeId,
}: {
  offers: NodeOffer[];
  plan: SchedulePlan;
  state: RunState;
  failedNodeId: string | null;
  standbyNodeId: string | null;
}) {
  const selectedIds = new Set(plan.selected.map((item) => item.node.id));
  const isLive = state !== "idle" && state !== "settled" && state !== "mismatch";
  const isComplete = state === "settled";

  return (
    <div className="mesh-grid relative h-[22rem] overflow-hidden rounded-xl border border-white/[0.07] bg-[#090d13] sm:h-[25rem]">
      <div className="absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-4">
        <div>
          <p className="mono text-[0.56rem] uppercase tracking-[0.11em] text-[#687583]">Failure-domain graph</p>
          <p className="mt-1 text-xs font-medium text-[#d8e0e7]">{plan.selected.length} active · {plan.candidatesConsidered} eligible</p>
        </div>
        <div className="rounded-full border border-white/[0.08] bg-[#080b10]/85 px-2.5 py-1.5 backdrop-blur">
          <span className="mono inline-flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.08em] text-[#8f9dac]"><span className={cn("h-1.5 w-1.5 rounded-full", isLive ? "bg-[#b8f36b]" : isComplete ? "bg-[#65a8ff]" : "bg-[#687583]")} /> {isLive ? "telemetry live" : isComplete ? "receipt sealed" : "routes armed"}</span>
        </div>
      </div>
      <svg role="img" aria-labelledby="network-title network-description" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <title id="network-title">KairoMesh GPU failure domain map</title>
        <desc id="network-description">A synthetic network map showing the selected GPU hosts, a failed host, and a replacement host during recovery.</desc>
        <path d="M5 42c7-16 19-17 27-7 5 6 2 11-3 16-7 7-5 17-13 20C9 74 8 62 5 55Z" fill="#65a8ff" fillOpacity=".025" stroke="#65a8ff" strokeOpacity=".08" strokeWidth=".35" />
        <path d="M40 28c8-11 19-12 28-4 3 3 5 9 2 13-5 7-2 11 4 16 7 6 5 20-4 26-9 6-13-4-15-12-2-7-10-8-16-14-8-8-5-17 1-25Z" fill="#b8f36b" fillOpacity=".02" stroke="#b8f36b" strokeOpacity=".07" strokeWidth=".35" />
        <path d="M74 49c5-10 19-12 23-1 3 8-4 12-10 15-6 3-9 13-15 10-6-3-2-13 2-24Z" fill="#65a8ff" fillOpacity=".025" stroke="#65a8ff" strokeOpacity=".08" strokeWidth=".35" />
        {plan.selected.map(({ node }) => (
          <line key={`route-${node.id}`} x1="50" y1="56" x2={node.coordinates.x} y2={node.coordinates.y} stroke={node.id === failedNodeId ? "#ff6b6b" : "#b8f36b"} strokeOpacity={node.id === failedNodeId ? 0.2 : isLive || isComplete ? 0.52 : 0.18} strokeWidth=".45" className={isLive && node.id !== failedNodeId ? "route-line" : ""} vectorEffect="non-scaling-stroke" />
        ))}
        {standbyNodeId && (() => {
          const standby = offers.find((offer) => offer.id === standbyNodeId);
          return standby ? <line x1="50" y1="56" x2={standby.coordinates.x} y2={standby.coordinates.y} stroke="#65a8ff" strokeOpacity=".65" strokeWidth=".55" className={isLive ? "route-line" : ""} vectorEffect="non-scaling-stroke" /> : null;
        })()}
        <circle cx="50" cy="56" r="7.5" fill="#10151d" stroke={state === "mismatch" ? "#ff6b6b" : isComplete ? "#b8f36b" : "#65a8ff"} strokeOpacity=".7" strokeWidth=".55" />
        {isLive && <circle cx="50" cy="56" r="10" fill="none" stroke="#65a8ff" strokeOpacity=".25" strokeWidth=".4" className="proof-pulse" />}
        <rect x="47.6" y="53.6" width="4.8" height="4.8" rx="1" fill={state === "mismatch" ? "#ff6b6b" : isComplete ? "#b8f36b" : "#65a8ff"} />
        {offers.map((node) => {
          const selected = selectedIds.has(node.id);
          const failed = failedNodeId === node.id;
          const standby = standbyNodeId === node.id;
          const fill = failed ? "#ff6b6b" : standby ? "#65a8ff" : selected ? "#b8f36b" : node.status === "ready" ? "#6d7b88" : "#3e4853";
          return (
            <g key={node.id} transform={`translate(${node.coordinates.x} ${node.coordinates.y})`}>
              {(selected || standby) && !failed && isLive && <circle r="3.3" fill="none" stroke={fill} strokeOpacity=".28" strokeWidth=".35" className="proof-pulse" />}
              <circle r={selected || standby ? 1.65 : 1.05} fill="#10151d" stroke={fill} strokeWidth={selected || standby ? ".7" : ".45"} />
              <circle r=".45" fill={fill} />
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-x-3 bottom-3 z-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {plan.selected.map(({ node }, index) => {
          const failed = node.id === failedNodeId;
          return (
            <div key={node.id} className={cn("rounded-lg border bg-[#090d13]/90 p-2.5 backdrop-blur", failed ? "border-[#ff6b6b]/25" : "border-white/[0.07]")}>
              <div className="flex items-center justify-between gap-2">
                <span className={cn("h-1.5 w-1.5 rounded-full", failed ? "bg-[#ff6b6b]" : isLive ? "bg-[#b8f36b]" : "bg-[#687583]")} />
                <span className="mono text-[0.48rem] uppercase tracking-[0.06em] text-[#5f6d7b]">shard {String(index + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-2 truncate text-[0.62rem] font-medium text-[#c6d0d9]">{node.alias}</p>
              <p className="mono mt-1 truncate text-[0.48rem] uppercase text-[#687583]">{failed ? "heartbeat lost" : node.gpu}</p>
            </div>
          );
        })}
        {standbyNodeId && (() => {
          const standby = offers.find((offer) => offer.id === standbyNodeId);
          return standby ? (
            <div className="rounded-lg border border-[#65a8ff]/20 bg-[#65a8ff]/[0.06] p-2.5 backdrop-blur">
              <div className="flex items-center justify-between"><span className="h-1.5 w-1.5 rounded-full bg-[#65a8ff]" /><span className="mono text-[0.48rem] uppercase text-[#8dc0ff]">failover</span></div>
              <p className="mt-2 truncate text-[0.62rem] font-medium text-[#c6d0d9]">{standby.alias}</p>
              <p className="mono mt-1 truncate text-[0.48rem] uppercase text-[#687583]">fence 02 · restored</p>
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}

export function MissionControl({
  offers,
  presets,
  initialPlan,
}: {
  offers: NodeOffer[];
  presets: WorkloadPreset[];
  initialPlan: SchedulePlan;
}) {
  const reduceMotion = useReducedMotion();
  const [presetIndex, setPresetIndex] = useState(0);
  const [evidenceTier, setEvidenceTier] = useState<EvidenceTier>("isolated");
  const [profileKey, setProfileKey] = useState("balanced");
  const [plan, setPlan] = useState<SchedulePlan>(initialPlan);
  const [quoteStatus, setQuoteStatus] = useState<"ready" | "loading" | "error">("ready");
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");
  const [progress, setProgress] = useState(0);
  const [events, setEvents] = useState<DemoEvent[]>(initialEvents);
  const [failedNodeId, setFailedNodeId] = useState<string | null>(null);
  const [standbyNodeId, setStandbyNodeId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [receiptStatus, setReceiptStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [verification, setVerification] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [copied, setCopied] = useState(false);
  const [branchLocked, setBranchLocked] = useState(false);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const eventCounter = useRef(0);
  const quoteRequestSequence = useRef(0);
  const quoteController = useRef<AbortController | null>(null);
  const runGeneration = useRef(0);
  const lastReceiptRequest = useRef<{ payload: ReceiptRequestPayload; generation: number } | null>(null);

  const running = ["queued", "running", "recovering", "verifying"].includes(runState);
  const chaosReady = runState === "running" && progress >= 57 && !branchLocked;
  const currentPreset = presets[presetIndex];
  const estimatedSpend = plan.predictedCost * (progress / 100);
  const heldMicrocredits = Math.round(plan.predictedCost * DEMO_MICROCREDITS_PER_UNIT);
  const { providerMicrocredits, platformMicrocredits } = splitDemoCredits(heldMicrocredits);
  const utilization = runState === "idle" ? 0 : runState === "mismatch" ? 0 : Math.min(96, Math.round(44 + progress * 0.54));
  const settlementRows: Array<[string, string, string]> = runState === "mismatch"
    ? [
        ["Buyer return", `+${heldMicrocredits.toLocaleString()}`, "Illustrated"],
        ["Buyer held", "0", "Released"],
        ["Provider pending", "0", "Withheld"],
        ["Model state", "—", "Rejected"],
      ]
    : runState === "settled"
      ? [
          ["Buyer spend", `−${heldMicrocredits.toLocaleString()}`, "Illustrated"],
          ["Provider pending", `+${providerMicrocredits.toLocaleString()}`, "Credited"],
          ["Platform fee", `+${platformMicrocredits.toLocaleString()}`, "Recorded"],
          ["Net entries", "0", "Balanced"],
        ]
      : [
          ["Buyer reserve", heldMicrocredits.toLocaleString(), "Held"],
          ["Provider pending", "0", "Waiting"],
          ["Platform fee", "0", "Waiting"],
          ["Model state", "—", "Open"],
        ];

  useEffect(() => () => {
    quoteRequestSequence.current += 1;
    quoteController.current?.abort("unmount");
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
    runGeneration.current += 1;
  }, []);

  const clearTimers = () => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
  };

  const schedule = (delay: number, callback: () => void) => {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
  };

  const addEvent = (code: string, message: string, tone: EventTone = "neutral") => {
    eventCounter.current += 1;
    const event: DemoEvent = {
      id: eventCounter.current,
      at: formatStateTime(eventCounter.current),
      code,
      message,
      tone,
    };
    setEvents((current) => [...current, event]);
  };

  const requestQuote = async (nextPreset: WorkloadPreset, nextTier: EvidenceTier, nextProfile: string) => {
    const sequence = quoteRequestSequence.current + 1;
    quoteRequestSequence.current = sequence;
    quoteController.current?.abort("superseded");
    const controller = new AbortController();
    quoteController.current = controller;
    const timeout = setTimeout(() => controller.abort("timeout"), 8_000);
    setQuoteStatus("loading");
    setQuoteError(null);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRequest(nextPreset, nextTier, nextProfile)),
        signal: controller.signal,
      });
      const body = (await response.json()) as { data?: SchedulePlan; message?: string };
      if (!response.ok || !body.data) throw new Error(body.message ?? "No eligible capacity for this policy.");
      if (sequence !== quoteRequestSequence.current) return;
      setPlan(body.data);
      setQuoteStatus("ready");
    } catch (error) {
      if (sequence !== quoteRequestSequence.current) return;
      setQuoteStatus("error");
      setQuoteError(controller.signal.reason === "timeout"
        ? "The quote timed out. Change a policy control to retry."
        : error instanceof Error ? error.message : "Unable to produce a quote.");
    } finally {
      clearTimeout(timeout);
      if (quoteController.current === controller) quoteController.current = null;
    }
  };

  const handlePreset = (value: number) => {
    const nextPreset = presets[value];
    setPresetIndex(value);
    void requestQuote(nextPreset, evidenceTier, profileKey);
  };

  const handleTier = (value: EvidenceTier) => {
    setEvidenceTier(value);
    void requestQuote(currentPreset, value, profileKey);
  };

  const handleProfile = (value: string) => {
    setProfileKey(value);
    void requestQuote(currentPreset, evidenceTier, value);
  };

  const loadReceipt = async (payload: ReceiptRequestPayload, generation: number): Promise<ReceiptData | null> => {
    lastReceiptRequest.current = { payload, generation };
    setReceiptStatus("loading");
    try {
      const response = await fetch("/api/demo/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Receipt endpoint rejected the scenario.");
      const body = (await response.json()) as { data: ReceiptData };
      const check = await verifyReceiptInBrowser(body.data.chain, body.data.rootHash);
      if (!check.valid) throw new Error("Receipt endpoint returned an invalid chain.");
      if (generation === runGeneration.current) {
        setReceipt(body.data);
        setReceiptStatus("ready");
        return body.data;
      }
      return null;
    } catch {
      if (generation === runGeneration.current) {
        setReceipt(null);
        setReceiptStatus("error");
      }
      return null;
    }
  };

  const sealAndSettle = async (payload: ReceiptRequestPayload, generation: number) => {
    setProgress(97);
    addEvent("RECEIPT_SEALING", "Server recomputed the bounded scenario record; browser integrity check started.", "active");
    const sealedReceipt = await loadReceipt(payload, generation);
    if (generation !== runGeneration.current) return;
    if (!sealedReceipt) {
      addEvent("SETTLEMENT_BLOCKED", "Receipt creation or integrity verification failed; illustrated credits remain held.", "bad");
      return;
    }
    setProgress(100);
    setRunState("settled");
    addEvent("RECEIPT_VERIFIED", `${sealedReceipt.chain.length} receipt blocks passed the browser integrity check.`, "good");
    addEvent("SETTLEMENT_RELEASED", "Illustrated demo-credit split closed once after receipt verification.", "good");
  };

  const retryReceipt = () => {
    const previous = lastReceiptRequest.current;
    if (!previous || previous.generation !== runGeneration.current) return;
    void sealAndSettle(previous.payload, previous.generation);
  };

  const finishGoldenPath = (
    baseDelay = 0,
    scenario: "clean" | "failover" = "clean",
    failedNode?: string,
    generation = runGeneration.current,
  ) => {
    schedule(baseDelay + 950, () => {
      setRunState("verifying");
      setProgress(89);
      addEvent("OUTPUT_POLICY", `Declared ${currentPreset.id} output checks passed.`, "active");
    });
    schedule(baseDelay + 2050, () => {
      void sealAndSettle({
        scenario,
        request: buildRequest(currentPreset, evidenceTier, profileKey),
        ...(failedNode ? { failedNodeId: failedNode } : {}),
      }, generation);
    });
  };

  const launch = () => {
    clearTimers();
    runGeneration.current += 1;
    setBranchLocked(false);
    eventCounter.current = 0;
    setEvents([]);
    setReceipt(null);
    setReceiptStatus("idle");
    lastReceiptRequest.current = null;
    setVerification("idle");
    setFailedNodeId(null);
    setStandbyNodeId(null);
    setRunState("queued");
    setProgress(5);
    addEvent("FUNDS_HELD", `${heldMicrocredits.toLocaleString()} demo μcredits reserved.`, "active");
    schedule(700, () => {
      setRunState("running");
      setProgress(14);
      addEvent("TEMPLATE_ACCEPTED", `Digest-pinned ${currentPreset.id}-catalog-v1 policy accepted.`, "good");
    });
    schedule(1800, () => {
      setProgress(27);
      addEvent("EVIDENCE_ACCEPTED", `${plan.selected.length} synthetic evidence records satisfy ${evidenceLabels[evidenceTier]}.`, "good");
    });
    schedule(3200, () => {
      setProgress(41);
      addEvent("SHARDS_STARTED", `${plan.selected.length} synthetic shards leased with fence 01.`, "active");
    });
    schedule(5000, () => {
      setProgress(57);
      addEvent("CHECKPOINT_18", "Synthetic checkpoint digest mirrored outside the active host.", "good");
    });
    schedule(7200, () => {
      setProgress(74);
      addEvent("PRESENTER_HOLD", "Checkpoint 27 sealed. Choose the clean or adversarial path.", "active");
    });
  };

  const continueClean = () => {
    if (!chaosReady) return;
    setBranchLocked(true);
    clearTimers();
    addEvent("CLEAN_PATH", "No fault injected; output verification may proceed.", "active");
    finishGoldenPath(0, "clean", undefined, runGeneration.current);
  };

  const injectDisconnect = () => {
    if (!chaosReady) return;
    setBranchLocked(true);
    clearTimers();
    const failed = plan.selected[0]?.node.id;
    if (!failed) return;
    setFailedNodeId(failed);
    setRunState("recovering");
    setProgress((value) => Math.max(46, value));
    addEvent("HEARTBEAT_LOST", `${plan.selected[0].node.alias} missed three lease renewals.`, "bad");
    try {
      const failover = chooseFailoverNode(offers, buildRequest(currentPreset, evidenceTier, profileKey), plan, failed);
      schedule(780, () => {
        setStandbyNodeId(failover.node.id);
        addEvent("FENCE_INCREMENTED", "Attempt fence advanced 01 → 02; stale output disabled.", "warn");
      });
      schedule(1550, () => {
        setRunState("running");
        setProgress((value) => Math.max(69, value + 9));
        addEvent("CHECKPOINT_RESTORED", `${failover.node.alias} resumed from checkpoint 18.`, "good");
      });
      finishGoldenPath(2050, "failover", failed, runGeneration.current);
    } catch {
      setRunState("mismatch");
      addEvent("NO_FAILOVER", "Recovery capacity unavailable; held credits returned.", "bad");
    }
  };

  const injectMismatch = () => {
    if (!chaosReady) return;
    setBranchLocked(true);
    clearTimers();
    const node = plan.selected.at(-1)?.node;
    if (node) setFailedNodeId(node.id);
    setRunState("mismatch");
    setProgress(92);
    addEvent("OUTPUT_MISMATCH", "Independent sample hash disagreed with the claimed artifact.", "bad");
    schedule(620, () => addEvent("NODE_QUARANTINED", `${node?.alias ?? "Node"} removed from new assignments.`, "warn"));
    schedule(1120, () => addEvent("FUNDS_RETURNED", "Held demo credits returned; provider payout = 0.", "good"));
  };

  const reset = () => {
    clearTimers();
    runGeneration.current += 1;
    setBranchLocked(false);
    eventCounter.current = 0;
    setRunState("idle");
    setProgress(0);
    setEvents(initialEvents);
    setFailedNodeId(null);
    setStandbyNodeId(null);
    setReceipt(null);
    setReceiptStatus("idle");
    lastReceiptRequest.current = null;
    setVerification("idle");
    setCopied(false);
  };

  const verifyReceipt = async () => {
    if (!receipt) return;
    setVerification("checking");
    const result = await verifyReceiptInBrowser(receipt.chain, receipt.rootHash);
    setVerification(result.valid ? "valid" : "invalid");
  };

  const copyRootHash = async () => {
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(receipt.rootHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mission-control">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow"><span className="status-dot" /> Mission control</span>
            <span className="mono rounded-full border border-[#65a8ff]/20 bg-[#65a8ff]/[0.08] px-2.5 py-1 text-[0.54rem] uppercase tracking-[0.1em] text-[#8dc0ff]">Synthetic network</span>
          </div>
          <h1 className="mt-4 text-3xl font-[560] tracking-[-0.05em] text-white sm:text-4xl">Break the run. Watch it recover.</h1>
        </div>
        <div className="flex items-center gap-2">
          <span role="status" aria-live="polite" aria-label={`Run status: ${stateMeta[runState].label}`} className={cn("mono inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-[0.58rem] uppercase tracking-[0.09em]", stateMeta[runState].tone)}>
            {running && <span className="h-1.5 w-1.5 rounded-full bg-current" />}{stateMeta[runState].label}
          </span>
          <button type="button" onClick={reset} className="button-secondary min-h-10 px-3 py-2 text-[0.68rem]"><RotateCcw aria-hidden="true" size={14} /> Reset</button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[18.5rem_minmax(0,1fr)_21rem]">
        <aside className="surface-card h-fit overflow-hidden" aria-label="Job configuration">
          <div className="border-b border-white/[0.07] p-4">
            <div className="flex items-center gap-2"><Sparkles aria-hidden="true" size={15} className="text-[#b8f36b]" /><h2 className="text-xs font-medium text-white">Deploy policy</h2></div>
            <p className="mt-2 text-[0.68rem] leading-5 text-[#687583]">Only fixed catalog scenarios run in this demo.</p>
          </div>
          <div className="space-y-5 p-4">
            <label className="block">
              <span className="mono text-[0.56rem] uppercase tracking-[0.1em] text-[#7f8d9c]">Workload</span>
              <span className="relative mt-2 block">
                <select value={presetIndex} onChange={(event) => handlePreset(Number(event.target.value))} disabled={running} className="min-h-12 w-full appearance-none rounded-xl border border-white/[0.09] bg-[#0a0e14] px-3 pr-9 text-xs text-white transition-colors hover:border-white/[0.16] disabled:opacity-55">
                  {presets.map((preset, index) => <option key={preset.id} value={index}>{preset.label}</option>)}
                </select>
                <ChevronDown aria-hidden="true" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#687583]" />
              </span>
              <span className="mt-2 block text-[0.63rem] leading-4 text-[#687583]">{currentPreset.summary}</span>
            </label>

            <label className="block">
              <span className="mono text-[0.56rem] uppercase tracking-[0.1em] text-[#7f8d9c]">Minimum evidence</span>
              <span className="relative mt-2 block">
                <select value={evidenceTier} onChange={(event) => handleTier(event.target.value as EvidenceTier)} disabled={running} className="min-h-12 w-full appearance-none rounded-xl border border-white/[0.09] bg-[#0a0e14] px-3 pr-9 text-xs text-white hover:border-white/[0.16] disabled:opacity-55">
                  <option value="observed">Observed · measured node</option>
                  <option value="isolated">Isolated · bounded runtime</option>
                  <option value="attested">Attested scenario · fixture only</option>
                </select>
                <ChevronDown aria-hidden="true" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#687583]" />
              </span>
            </label>

            <fieldset>
              <legend className="mono text-[0.56rem] uppercase tracking-[0.1em] text-[#7f8d9c]">Placement objective</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries(profiles).map(([key, profile]) => (
                  <button key={key} type="button" disabled={running} onClick={() => handleProfile(key)} aria-pressed={profileKey === key} className={cn("min-h-[3.25rem] rounded-xl border p-2 text-left transition-colors", profileKey === key ? "border-[#b8f36b]/30 bg-[#b8f36b]/[0.08]" : "border-white/[0.07] bg-[#0a0e14] hover:border-white/[0.15]", running && "opacity-55")}>
                    <profile.icon aria-hidden="true" size={13} className={profileKey === key ? "text-[#b8f36b]" : "text-[#687583]"} />
                    <span className="mt-1.5 block text-[0.6rem] text-[#c6d0d9]">{profile.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="rounded-xl border border-white/[0.07] bg-[#090d12] p-3.5">
              <div className="flex items-center justify-between">
                <span className="mono text-[0.54rem] uppercase tracking-[0.08em] text-[#687583]">Live quote</span>
                {quoteStatus === "loading" ? <LoaderCircle aria-label="Loading quote" size={13} className="animate-spin text-[#65a8ff]" /> : quoteStatus === "ready" ? <BadgeCheck aria-label="Quote ready" size={14} className="text-[#b8f36b]" /> : <TriangleAlert aria-label="Quote unavailable" size={14} className="text-[#ff6b6b]" />}
              </div>
              {quoteStatus === "error" ? (
                <div role="alert" className="mt-3 rounded-lg border border-[#ff6b6b]/20 bg-[#ff6b6b]/[0.06] p-3 text-[0.62rem] leading-5 text-[#ff9d9d]">{quoteError}</div>
              ) : (
                <>
                  <div className="mt-4 flex items-end justify-between">
                    <div><p className="mono text-xl font-medium text-white">{formatCurrency(plan.predictedCost)}</p><p className="mt-1 text-[0.58rem] text-[#687583]">forecast total</p></div>
                    <div className="text-right"><p className="mono text-sm text-[#b8f36b]">−{plan.savingsPercent}%</p><p className="mt-1 text-[0.58rem] text-[#687583]">vs ceiling</p></div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3 text-center">
                    <div><p className="mono text-[0.7rem] text-[#c6d0d9]">{currentPreset.gpuCount}</p><p className="mt-1 text-[0.5rem] uppercase text-[#5f6d7b]">GPUs</p></div>
                    <div><p className="mono text-[0.7rem] text-[#c6d0d9]">{plan.estimatedStartSeconds}s</p><p className="mt-1 text-[0.5rem] uppercase text-[#5f6d7b]">start</p></div>
                    <div><p className="mono text-[0.7rem] text-[#c6d0d9]">{plan.checkpointCount}</p><p className="mt-1 text-[0.5rem] uppercase text-[#5f6d7b]">checkpoints</p></div>
                  </div>
                </>
              )}
            </div>

            <button type="button" onClick={launch} disabled={running || quoteStatus !== "ready"} className="button-primary w-full disabled:border-[#42502f] disabled:bg-[#42502f] disabled:text-[#899477] disabled:shadow-none">
              {running ? <><LoaderCircle aria-hidden="true" size={15} className="animate-spin" /> Run active</> : <><Play aria-hidden="true" size={15} fill="currentColor" /> Launch demo run</>}
            </button>
          </div>
        </aside>

        <section className="min-w-0 space-y-4" aria-label="Active run">
          <div className="surface-card p-3 sm:p-4">
            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Progress", value: `${progress}%`, icon: Activity, tone: "text-[#65a8ff]" },
                { label: "GPU util.", value: `${utilization}%`, icon: Cpu, tone: "text-[#b8f36b]" },
                { label: "Spend", value: formatCurrency(estimatedSpend), icon: CircleDollarSign, tone: "text-[#f5b942]" },
                { label: "Fence", value: standbyNodeId ? "02" : "01", icon: Fingerprint, tone: "text-[#c6d0d9]" },
              ].map((metric) => (
                <div key={metric.label} className="rounded-xl border border-white/[0.07] bg-[#090d12] p-3">
                  <div className="flex items-center justify-between"><span className="text-[0.57rem] text-[#687583]">{metric.label}</span><metric.icon aria-hidden="true" size={13} className={metric.tone} /></div>
                  <p className="mono mt-3 text-base font-medium text-white">{metric.value}</p>
                </div>
              ))}
            </div>
            <NetworkMap offers={offers} plan={plan} state={runState} failedNodeId={failedNodeId} standbyNodeId={standbyNodeId} />
          </div>

          <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <div className="surface-card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div><p className="mono text-[0.56rem] uppercase tracking-[0.1em] text-[#687583]">Chaos controls</p><h2 className="mt-2 text-sm font-medium text-white">Attack the active run</h2></div>
                <CloudLightning aria-hidden="true" size={18} className="text-[#f5b942]" />
              </div>
              <p className="mt-3 text-[0.68rem] leading-5 text-[#7f8d9c]">These presenter actions exercise two different guarantees: continuity after loss, and withheld payout after bad output.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <button type="button" onClick={continueClean} disabled={!chaosReady} className="button-secondary min-h-12 rounded-xl px-3 text-[0.64rem] disabled:opacity-35"><CheckCircle2 aria-hidden="true" size={15} className="text-[#b8f36b]" /> Continue clean</button>
                <button type="button" onClick={injectDisconnect} disabled={!chaosReady} className="button-secondary min-h-12 rounded-xl px-3 text-[0.64rem] disabled:opacity-35"><ServerCrash aria-hidden="true" size={15} className="text-[#f5b942]" /> Disconnect host</button>
                <button type="button" onClick={injectMismatch} disabled={!chaosReady} className="button-secondary min-h-12 rounded-xl px-3 text-[0.64rem] disabled:opacity-35"><ShieldAlert aria-hidden="true" size={15} className="text-[#ff6b6b]" /> Corrupt output</button>
              </div>
            </div>
            <div className="surface-card p-4 sm:p-5">
              <div className="flex items-center justify-between"><p className="mono text-[0.56rem] uppercase tracking-[0.1em] text-[#687583]">Recovery budget</p><TimerReset aria-hidden="true" size={16} className="text-[#65a8ff]" /></div>
              <div className="mt-5 flex items-end justify-between"><p className="mono text-2xl font-medium text-white">≤ 08:00</p><span className="text-[0.6rem] text-[#687583]">checkpoint age</span></div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#65a8ff] to-[#b8f36b]" /></div>
              <div className="mt-3 flex justify-between text-[0.56rem] text-[#687583]"><span>last sealed</span><span className="mono text-[#b8f36b]">healthy</span></div>
            </div>
          </div>

          <div className={cn("surface-card overflow-hidden transition-colors", runState === "mismatch" ? "border-[#ff6b6b]/25" : runState === "settled" ? "border-[#b8f36b]/20" : "")}>
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <div className="flex items-center gap-2"><CircleDollarSign aria-hidden="true" size={14} className="text-[#b8f36b]" /><h2 className="text-xs font-medium text-white">Settlement model</h2></div>
              <span className="mono text-[0.53rem] uppercase tracking-[0.08em] text-[#687583]">illustrated split · tested ledger library</span>
            </div>
            <div className="grid gap-px bg-white/[0.06] sm:grid-cols-4">
              {settlementRows.map(([label, value, note]) => (
                <div key={label} className="bg-[#0d1219] p-4">
                  <p className="text-[0.58rem] text-[#687583]">{label}</p>
                  <p className="mono mt-3 text-sm text-white">{value} {value !== "—" && <span className="text-[0.48rem] text-[#687583]">μcr</span>}</p>
                  <p className={cn("mono mt-2 text-[0.5rem] uppercase", runState === "mismatch" ? "text-[#ff8d8d]" : "text-[#b8f36b]")}>{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4" aria-label="Run evidence">
          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
              <div className="flex items-center gap-2"><Waypoints aria-hidden="true" size={14} className="text-[#65a8ff]" /><h2 className="text-xs font-medium text-white">Evidence events</h2></div>
              <span className="mono text-[0.52rem] uppercase tracking-[0.08em] text-[#687583]">presenter log</span>
            </div>
            <div role="log" aria-live="polite" aria-relevant="additions" className="max-h-[28rem] min-h-[18rem] space-y-0 overflow-y-auto p-3">
              <AnimatePresence initial={false}>
                {events.map((event) => (
                  <motion.div key={event.id} initial={reduceMotion ? false : { opacity: 0, x: 7 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="relative grid grid-cols-[2.8rem_1fr] gap-2 border-b border-white/[0.055] py-3 last:border-0">
                    <span className="mono text-[0.48rem] text-[#52606d]">{event.at}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn("h-1.5 w-1.5 rounded-full", event.tone === "good" ? "bg-[#b8f36b]" : event.tone === "active" ? "bg-[#65a8ff]" : event.tone === "warn" ? "bg-[#f5b942]" : event.tone === "bad" ? "bg-[#ff6b6b]" : "bg-[#687583]")} />
                        <span className={cn("mono text-[0.51rem] uppercase tracking-[0.06em]", event.tone === "bad" ? "text-[#ff8d8d]" : event.tone === "warn" ? "text-[#f5c76a]" : "text-[#a9b5c3]")}>{event.code}</span>
                      </div>
                      <p className="mt-1.5 text-[0.61rem] leading-[1.15rem] text-[#7f8d9c]">{event.message}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {events.length === 0 && <p className="p-4 text-center text-[0.65rem] text-[#5f6d7b]">Waiting for the first state transition.</p>}
            </div>
          </div>

          <div className={cn("surface-card overflow-hidden", receipt && "border-[#b8f36b]/20")}>
            <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
              <div className="flex items-center gap-2"><ReceiptText aria-hidden="true" size={14} className={receipt ? "text-[#b8f36b]" : "text-[#687583]"} /><h2 className="text-xs font-medium text-white">Receipt explorer</h2></div>
              {receipt ? <span className="mono text-[0.5rem] uppercase text-[#b8f36b]">{receipt.chain.length} blocks</span> : receiptStatus === "loading" ? <span className="mono text-[0.5rem] uppercase text-[#8dc0ff]">sealing</span> : receiptStatus === "error" ? <span className="mono text-[0.5rem] uppercase text-[#ff8d8d]">failed</span> : <span className="mono text-[0.5rem] uppercase text-[#5f6d7b]">pending</span>}
            </div>
            {receipt ? (
              <div className="p-4">
                <div className="rounded-xl border border-white/[0.07] bg-[#090d12] p-3">
                  <p className="mono text-[0.51rem] uppercase tracking-[0.08em] text-[#687583]">Root hash</p>
                  <p className="mono mt-2 break-all text-[0.58rem] leading-5 text-[#a9b5c3]">{receipt.rootHash}</p>
                </div>
                <p className="mt-3 text-[0.58rem] leading-4 text-[#687583]">{receipt.claim}</p>
                <button type="button" onClick={verifyReceipt} disabled={verification === "checking"} className={cn("mt-4 w-full min-h-12 rounded-xl border px-3 text-[0.65rem] font-medium transition-colors", verification === "valid" ? "border-[#b8f36b]/30 bg-[#b8f36b]/10 text-[#caff8c]" : verification === "invalid" ? "border-[#ff6b6b]/30 bg-[#ff6b6b]/10 text-[#ff9d9d]" : "border-white/[0.09] bg-white/[0.03] text-[#c6d0d9] hover:border-[#65a8ff]/30")}>
                  <span className="inline-flex items-center gap-2">{verification === "checking" ? <LoaderCircle aria-hidden="true" size={14} className="animate-spin" /> : verification === "valid" ? <CheckCircle2 aria-hidden="true" size={14} /> : verification === "invalid" ? <Ban aria-hidden="true" size={14} /> : <Fingerprint aria-hidden="true" size={14} />} {verification === "valid" ? "Verified in this browser" : verification === "invalid" ? "Mutation detected" : verification === "checking" ? "Recomputing SHA-256…" : "Verify chain in browser"}</span>
                </button>
                <button type="button" onClick={copyRootHash} className="button-quiet mt-2 w-full rounded-xl text-[0.62rem]"><Clipboard aria-hidden="true" size={13} /> {copied ? "Root hash copied" : "Copy root hash"}</button>
              </div>
            ) : runState === "mismatch" ? (
              <div className="p-5 text-center"><ShieldAlert aria-hidden="true" size={24} className="mx-auto text-[#ff6b6b]" /><p className="mt-3 text-xs font-medium text-white">Receipt withheld</p><p className="mt-2 text-[0.62rem] leading-5 text-[#687583]">The output policy failed. No success receipt or host payout was issued.</p></div>
            ) : receiptStatus === "error" ? (
              <div role="alert" className="p-5 text-center"><TriangleAlert aria-hidden="true" size={23} className="mx-auto text-[#ff8d8d]" /><p className="mt-3 text-xs font-medium text-white">Receipt sealing failed</p><p className="mt-2 text-[0.62rem] leading-5 text-[#687583]">The run did not settle. Recreate and verify the bounded scenario receipt to release the illustrated credits.</p><button type="button" onClick={retryReceipt} className="button-secondary mt-4 min-h-11 px-4 text-[0.65rem]">Retry receipt</button></div>
            ) : receiptStatus === "loading" ? (
              <div className="p-5 text-center" aria-live="polite"><LoaderCircle aria-hidden="true" size={23} className="mx-auto animate-spin text-[#65a8ff]" /><p className="mt-3 text-xs font-medium text-[#a9b5c3]">Sealing scenario receipt</p><p className="mt-2 text-[0.61rem] leading-5 text-[#5f6d7b]">Recomputing the schedule context and linking its synthetic events.</p></div>
            ) : (
              <div className="p-5 text-center"><LockKeyhole aria-hidden="true" size={23} className="mx-auto text-[#52606d]" /><p className="mt-3 text-xs font-medium text-[#a9b5c3]">Closes after verification</p><p className="mt-2 text-[0.61rem] leading-5 text-[#5f6d7b]">A bounded, server-recomputed scenario record is linked into the final demo chain before illustrated settlement.</p></div>
            )}
          </div>

          <div className="rounded-xl border border-[#f5b942]/15 bg-[#f5b942]/[0.045] p-4">
            <div className="flex gap-3"><AlertTriangle aria-hidden="true" size={15} className="mt-0.5 shrink-0 text-[#f5b942]" /><p className="text-[0.6rem] leading-5 text-[#a99a73]">Demo inventory, telemetry, credits, and failures are synthetic. The scheduler, validation, failover choice, state controls, and browser hash verification are implemented.</p></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
