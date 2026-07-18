import { describe, expect, it } from "vitest";
import { createReceiptChain, hashReceipt, verifyReceiptChain, type ReceiptEvent } from "./proof-chain";

const events: ReceiptEvent[] = [
  {
    sequence: 1,
    type: "JOB_ACCEPTED",
    jobId: "job-proof-1",
    timestamp: "2026-07-17T00:00:00.000Z",
    detail: { shards: 2, policy: "outcome-sla-v1" },
  },
  {
    sequence: 2,
    type: "CHECKPOINT_COMMITTED",
    jobId: "job-proof-1",
    nodeId: "node-1",
    checkpoint: 12,
    timestamp: "2026-07-17T00:10:00.000Z",
    detail: { artifact: "sha256:abc", encrypted: true },
  },
  {
    sequence: 3,
    type: "OUTPUT_VERIFIED",
    jobId: "job-proof-1",
    timestamp: "2026-07-17T00:20:00.000Z",
    detail: { passed: true, sampleRate: 0.12 },
  },
];

describe("proof chain", () => {
  it("creates and verifies a deterministic hash chain", () => {
    const chain = createReceiptChain(events);
    expect(chain).toHaveLength(3);
    expect(verifyReceiptChain(chain)).toBe(true);
    expect(createReceiptChain(events)).toEqual(chain);
  });

  it("uses stable object key ordering", () => {
    const reordered = { ...events[0], detail: { policy: "outcome-sla-v1", shards: 2 } };
    expect(hashReceipt("previous", events[0])).toBe(hashReceipt("previous", reordered));
  });

  it("detects mutated events", () => {
    const chain = createReceiptChain(events);
    const tampered = structuredClone(chain);
    tampered[1].event.detail.artifact = "sha256:evil";
    expect(verifyReceiptChain(tampered)).toBe(false);
  });

  it("detects broken links", () => {
    const chain = createReceiptChain(events);
    const tampered = structuredClone(chain);
    tampered[2].previousHash = "0".repeat(64);
    expect(verifyReceiptChain(tampered)).toBe(false);
  });

  it("rejects non-contiguous event sequences", () => {
    expect(() => createReceiptChain([{ ...events[0], sequence: 2 }])).toThrow(RangeError);
  });

  it("does not treat an empty list as a receipt", () => {
    expect(verifyReceiptChain([])).toBe(false);
  });
});
