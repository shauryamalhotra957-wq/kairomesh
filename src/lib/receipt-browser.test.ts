import { describe, expect, it } from "vitest";
import { createReceiptChain, type ReceiptEvent } from "./proof-chain";
import { verifyReceiptInBrowser } from "./receipt-browser";

const events: ReceiptEvent[] = [
  { sequence: 1, type: "JOB_ACCEPTED", jobId: "job-browser", timestamp: "2026-07-17T00:00:00.000Z", detail: { shards: 2 } },
  { sequence: 2, type: "OUTPUT_VERIFIED", jobId: "job-browser", timestamp: "2026-07-17T00:01:00.000Z", detail: { passed: true } },
];

describe("browser receipt verification", () => {
  it("recomputes a server-generated chain with WebCrypto", async () => {
    const chain = createReceiptChain(events);
    const result = await verifyReceiptInBrowser(chain, chain.at(-1)!.hash);
    expect(result.valid).toBe(true);
    expect(result.checkedBlocks).toBe(2);
  });

  it("detects a changed event", async () => {
    const chain = structuredClone(createReceiptChain(events));
    chain[1].event.detail.passed = false;
    const result = await verifyReceiptInBrowser(chain, chain.at(-1)!.hash);
    expect(result.valid).toBe(false);
  });

  it("rejects an empty chain and a root that does not match the displayed receipt", async () => {
    const chain = createReceiptChain(events);
    expect((await verifyReceiptInBrowser([], "0".repeat(64))).valid).toBe(false);
    expect((await verifyReceiptInBrowser(chain, "0".repeat(64))).valid).toBe(false);
  });
});
