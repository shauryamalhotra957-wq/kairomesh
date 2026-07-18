import { createHash } from "node:crypto";
import type { EvidenceTier, WorkloadKind } from "./domain";
import { DEMO_PLATFORM_FEE_BPS } from "./demo-economics";
import type { ReceiptEvent } from "./proof-chain";

export type DemoReceiptScenario = "clean" | "failover";

export interface DemoReceiptContext {
  jobId: string;
  scenario: DemoReceiptScenario;
  workload: WorkloadKind;
  evidenceTier: EvidenceTier;
  selectedNodeIds: string[];
  failedNodeId?: string;
  recoveryNodeId?: string;
  amountMicrocredits: number;
}

export function isDemoReceiptScenario(value: string | null): value is DemoReceiptScenario {
  return value === "clean" || value === "failover";
}

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createDemoReceiptEvents(context: DemoReceiptContext): ReceiptEvent[] {
  const { jobId, scenario } = context;
  const start = Date.parse("2026-07-17T03:30:00.000Z");
  const at = (seconds: number) => new Date(start + seconds * 1_000).toISOString();
  const template = `${context.workload}-catalog-v1`;
  const primaryNodeId = context.selectedNodeIds[0];
  const selectedNodeSetDigest = digest([...context.selectedNodeIds].sort().join(":"));
  const events: Array<Omit<ReceiptEvent, "sequence">> = [
    { type: "JOB_ACCEPTED", jobId, timestamp: at(0), detail: { policy: "outcome-sla-v1", shards: context.selectedNodeIds.length, workload: context.workload } },
    { type: "ARTIFACT_BOUND", jobId, timestamp: at(2), detail: { imageDigest: `sha256:${digest(`synthetic:${template}`)}`, template, source: "synthetic_fixture" } },
    { type: "NODE_EVIDENCE_ACCEPTED", jobId, timestamp: at(5), detail: { evidenceTier: context.evidenceTier, nodes: context.selectedNodeIds.length, selectedNodeSetDigest } },
    { type: "SHARD_STARTED", jobId, timestamp: at(8), detail: { fence: 1, shards: context.selectedNodeIds.length, selectedNodeSetDigest } },
    { type: "CHECKPOINT_COMMITTED", jobId, nodeId: primaryNodeId, checkpoint: 18, timestamp: at(48), detail: { checkpointClass: "synthetic_digest", artifact: `sha256:${digest(`${jobId}:checkpoint:18`)}` } },
  ];

  if (scenario === "failover") {
    events.push(
      { type: "NODE_LOST", jobId, nodeId: context.failedNodeId, timestamp: at(54), detail: { reason: "heartbeat_timeout", fence: 1 } },
      { type: "SHARD_RECOVERED", jobId, nodeId: context.recoveryNodeId, checkpoint: 18, timestamp: at(62), detail: { fence: 2, staleFenceRejected: true } },
    );
  }

  events.push(
    { type: "OUTPUT_VERIFIED", jobId, nodeId: scenario === "failover" ? context.recoveryNodeId : primaryNodeId, timestamp: at(112), detail: { workload: context.workload, validator: "catalog-output-policy-v1", passed: true, artifact: `sha256:${digest(`${jobId}:output:${scenario}`)}` } },
    { type: "SETTLEMENT_AUTHORIZED", jobId, timestamp: at(114), detail: { currency: "demo_microcredits", amount: context.amountMicrocredits, platformFeeBps: DEMO_PLATFORM_FEE_BPS, balancedIllustration: true } },
  );

  return events.map((event, index) => ({ ...event, sequence: index + 1 }));
}
