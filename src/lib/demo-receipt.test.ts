import { describe, expect, it } from "vitest";
import { createDemoReceiptEvents, isDemoReceiptScenario } from "./demo-receipt";

describe("demo receipt scenarios", () => {
  const base = {
    jobId: "job-clean",
    workload: "generative-video" as const,
    evidenceTier: "isolated" as const,
    selectedNodeIds: ["node-a", "node-b", "node-c"],
    amountMicrocredits: 2_500_000,
  };

  it("keeps a clean run free of recovery claims", () => {
    const events = createDemoReceiptEvents({ ...base, scenario: "clean" });
    expect(events.map((event) => event.type)).toEqual([
      "JOB_ACCEPTED",
      "ARTIFACT_BOUND",
      "NODE_EVIDENCE_ACCEPTED",
      "SHARD_STARTED",
      "CHECKPOINT_COMMITTED",
      "OUTPUT_VERIFIED",
      "SETTLEMENT_AUTHORIZED",
    ]);
    expect(events.map((event) => event.sequence)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(events.find((event) => event.type === "OUTPUT_VERIFIED")?.detail.artifact).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it("binds failover output to the recovered node and a newer fence", () => {
    const events = createDemoReceiptEvents({
      ...base,
      jobId: "job-failover",
      scenario: "failover",
      failedNodeId: "node-a",
      recoveryNodeId: "node-d",
    });
    expect(events.map((event) => event.type)).toContain("NODE_LOST");
    expect(events.map((event) => event.type)).toContain("SHARD_RECOVERED");
    expect(events.find((event) => event.type === "SHARD_RECOVERED")?.detail.fence).toBe(2);
    expect(events.find((event) => event.type === "NODE_LOST")?.nodeId).toBe("node-a");
    expect(events.find((event) => event.type === "OUTPUT_VERIFIED")?.nodeId).toBe("node-d");
    expect(events.find((event) => event.type === "SETTLEMENT_AUTHORIZED")?.detail.amount).toBe(2_500_000);
  });

  it("accepts only named receipt scenarios", () => {
    expect(isDemoReceiptScenario("clean")).toBe(true);
    expect(isDemoReceiptScenario("failover")).toBe(true);
    expect(isDemoReceiptScenario("unknown")).toBe(false);
    expect(isDemoReceiptScenario(null)).toBe(false);
  });
});
