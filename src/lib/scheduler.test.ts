import { describe, expect, it } from "vitest";
import type { JobRequest } from "./domain";
import { defaultPriorities, nodeOffers } from "./network-data";
import { chooseFailoverNode, getEligibleNodes, NoCapacityError, scheduleJob, scoreNodes } from "./scheduler";

const request: JobRequest = {
  id: "job-test-001",
  name: "Test render",
  workload: "generative-video",
  minVramGb: 24,
  gpuCount: 3,
  durationMinutes: 90,
  maxPricePerGpuHour: 1.2,
  minimumEvidenceTier: "isolated",
  checkpointIntervalMinutes: 10,
  priorities: { ...defaultPriorities },
};

describe("scheduler", () => {
  it("filters out unavailable, unaffordable, undersized, and below-policy nodes", () => {
    const eligible = getEligibleNodes(nodeOffers, request);
    expect(eligible.length).toBeGreaterThanOrEqual(3);
    expect(eligible.every((node) => node.status === "ready")).toBe(true);
    expect(eligible.every((node) => node.evidenceTier === "isolated" || node.evidenceTier === "attested")).toBe(true);
    expect(eligible.every((node) => node.vramGb >= request.minVramGb)).toBe(true);
    expect(eligible.every((node) => node.pricePerHour <= request.maxPricePerGpuHour)).toBe(true);
    expect(eligible.every((node) => node.supportedWorkloads.includes(request.workload))).toBe(true);
  });

  it("excludes a node whose catalog does not support the requested workload", () => {
    const incompatible = { ...nodeOffers[0], supportedWorkloads: ["image-batch"] as const };
    expect(getEligibleNodes([incompatible], request)).toEqual([]);
  });

  it("returns deterministically sorted scores", () => {
    const first = scoreNodes(nodeOffers, request);
    const second = scoreNodes(nodeOffers, request);
    expect(first).toEqual(second);
    expect(first[0].score).toBeGreaterThanOrEqual(first.at(-1)?.score ?? 0);
  });

  it("creates a budget-bounded, checkpointed plan", () => {
    const plan = scheduleJob(nodeOffers, request);
    expect(plan.selected).toHaveLength(3);
    expect(new Set(plan.selected.map((item) => item.node.id)).size).toBe(3);
    expect(plan.predictedCost).toBeLessThanOrEqual(plan.marketRate);
    expect(plan.checkpointCount).toBe(9);
    expect(plan.policy).toBe("outcome-sla-v1");
  });

  it("chooses a failover node outside the active set", () => {
    const plan = scheduleJob(nodeOffers, request);
    const failedId = plan.selected[0].node.id;
    const failover = chooseFailoverNode(nodeOffers, request, plan, failedId);
    expect(plan.selected.some((item) => item.node.id === failover.node.id)).toBe(false);
  });

  it("rejects failover for a node outside the plan", () => {
    const plan = scheduleJob(nodeOffers, request);
    expect(() => chooseFailoverNode(nodeOffers, request, plan, "unknown")).toThrow(RangeError);
  });

  it("reports capacity failure without returning a partial plan", () => {
    const impossible = { ...request, minVramGb: 160, gpuCount: 4 };
    expect(() => scheduleJob(nodeOffers, impossible)).toThrow(NoCapacityError);
  });

  it("rejects an all-zero priority policy", () => {
    const invalid = {
      ...request,
      priorities: { cost: 0, reliability: 0, carbon: 0, latency: 0, trust: 0 },
    };
    expect(() => scoreNodes(nodeOffers, invalid)).toThrow(TypeError);
  });
});
