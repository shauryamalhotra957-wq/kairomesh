import { describe, expect, it } from "vitest";
import { defaultPriorities } from "./network-data";
import { demoReceiptRequestSchema, quoteRequestSchema } from "./schemas";

const valid = {
  id: "job_123",
  name: "Launch film render",
  workload: "generative-video",
  minVramGb: 24,
  gpuCount: 3,
  durationMinutes: 96,
  maxPricePerGpuHour: 1.2,
  minimumEvidenceTier: "isolated",
  checkpointIntervalMinutes: 8,
  priorities: defaultPriorities,
};

describe("quote request schema", () => {
  it("accepts a bounded request", () => {
    expect(quoteRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects identifiers that could become unsafe log or path values", () => {
    expect(quoteRequestSchema.safeParse({ ...valid, id: "../../escape" }).success).toBe(false);
  });

  it("rejects zero weights", () => {
    const result = quoteRequestSchema.safeParse({
      ...valid,
      priorities: { cost: 0, reliability: 0, carbon: 0, latency: 0, trust: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a checkpoint interval longer than the job", () => {
    const result = quoteRequestSchema.safeParse({
      ...valid,
      durationMinutes: 5,
      checkpointIntervalMinutes: 10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown top-level and nested fields to match the published contract", () => {
    expect(quoteRequestSchema.safeParse({ ...valid, unexpected: true }).success).toBe(false);
    expect(quoteRequestSchema.safeParse({
      ...valid,
      priorities: { ...valid.priorities, unexpected: 0.1 },
    }).success).toBe(false);
  });
});

describe("demo receipt request schema", () => {
  it("accepts clean and failover contexts around the bounded quote request", () => {
    expect(demoReceiptRequestSchema.safeParse({ scenario: "clean", request: valid }).success).toBe(true);
    expect(demoReceiptRequestSchema.safeParse({ scenario: "failover", request: valid, failedNodeId: "node_123" }).success).toBe(true);
  });

  it("requires a failed node only for failover", () => {
    expect(demoReceiptRequestSchema.safeParse({ scenario: "failover", request: valid }).success).toBe(false);
    expect(demoReceiptRequestSchema.safeParse({ scenario: "clean", request: valid, failedNodeId: "node_123" }).success).toBe(false);
  });

  it("rejects unknown receipt context fields", () => {
    expect(demoReceiptRequestSchema.safeParse({ scenario: "clean", request: valid, unexpected: true }).success).toBe(false);
  });
});
