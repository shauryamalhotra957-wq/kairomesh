/** @vitest-environment node */

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { POST as createReceipt } from "./demo/receipt/route";
import { POST as createQuote } from "./quote/route";
import { DEMO_MICROCREDITS_PER_UNIT } from "@/lib/demo-economics";
import { defaultPriorities, nodeOffers, workloadPresets } from "@/lib/network-data";
import { verifyReceiptChain } from "@/lib/proof-chain";
import { chooseFailoverNode, scheduleJob } from "@/lib/scheduler";

const preset = workloadPresets[0];
const quoteRequest = {
  id: "job_route_test",
  name: preset.label,
  workload: preset.id,
  minVramGb: preset.minVramGb,
  gpuCount: preset.gpuCount,
  durationMinutes: preset.durationMinutes,
  maxPricePerGpuHour: preset.maxPricePerGpuHour,
  minimumEvidenceTier: "isolated" as const,
  checkpointIntervalMinutes: 8,
  priorities: { ...defaultPriorities },
};

function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("demo API contracts", () => {
  it("binds a clean receipt to the server-recomputed schedule and amount", async () => {
    const response = await createReceipt(jsonRequest("http://localhost/api/demo/receipt", { scenario: "clean", request: quoteRequest }));
    expect(response.status).toBe(200);
    const body = await response.json();
    const plan = scheduleJob(nodeOffers, quoteRequest);
    const chain = body.data.chain;
    expect(verifyReceiptChain(chain)).toBe(true);
    expect(chain.map((block: { event: { type: string } }) => block.event.type)).not.toContain("NODE_LOST");
    expect(chain.find((block: { event: { type: string } }) => block.event.type === "SETTLEMENT_AUTHORIZED").event.detail.amount)
      .toBe(Math.round(plan.predictedCost * DEMO_MICROCREDITS_PER_UNIT));
  });

  it("binds failover loss and recovery to the same scheduler used by the UI", async () => {
    const plan = scheduleJob(nodeOffers, quoteRequest);
    const failedNodeId = plan.selected[0].node.id;
    const expectedRecovery = chooseFailoverNode(nodeOffers, quoteRequest, plan, failedNodeId).node.id;
    const response = await createReceipt(jsonRequest("http://localhost/api/demo/receipt", {
      scenario: "failover",
      request: quoteRequest,
      failedNodeId,
    }));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.chain.find((block: { event: { type: string } }) => block.event.type === "NODE_LOST").event.nodeId).toBe(failedNodeId);
    expect(body.data.chain.find((block: { event: { type: string } }) => block.event.type === "SHARD_RECOVERED").event.nodeId).toBe(expectedRecovery);
  });

  it("rejects failover context that does not match the recomputed schedule", async () => {
    const response = await createReceipt(jsonRequest("http://localhost/api/demo/receipt", {
      scenario: "failover",
      request: quoteRequest,
      failedNodeId: "not-in-plan",
    }));
    expect(response.status).toBe(422);
  });

  it("rejects a selected non-primary node as the failed checkpoint owner", async () => {
    const plan = scheduleJob(nodeOffers, quoteRequest);
    expect(plan.selected.length).toBeGreaterThan(1);
    const response = await createReceipt(jsonRequest("http://localhost/api/demo/receipt", {
      scenario: "failover",
      request: quoteRequest,
      failedNodeId: plan.selected[1].node.id,
    }));
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({ error: "INVALID_FAILED_NODE" });
  });

  it("rejects an oversized quote stream even without Content-Length", async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(`{"padding":"${"x".repeat(12_100)}`));
        controller.enqueue(encoder.encode('"}'));
        controller.close();
      },
    });
    const request = new Request("http://localhost/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      duplex: "half",
    } as RequestInit & { duplex: "half" });
    expect(request.headers.get("content-length")).toBeNull();
    expect((await createQuote(request)).status).toBe(413);
  });
});
