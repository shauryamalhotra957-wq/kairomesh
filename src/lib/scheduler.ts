import type {
  JobRequest,
  NodeOffer,
  PriorityWeights,
  SchedulePlan,
  ScoredNode,
} from "./domain";

export class NoCapacityError extends Error {
  readonly code = "NO_CAPACITY";
  readonly eligibleCount: number;

  constructor(eligibleCount: number, requestedCount: number) {
    super(`Only ${eligibleCount} eligible nodes are available for ${requestedCount} requested GPUs.`);
    this.name = "NoCapacityError";
    this.eligibleCount = eligibleCount;
  }
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const evidenceRank = { observed: 1, isolated: 2, attested: 3 } as const;

function normalizeWeights(weights: PriorityWeights): PriorityWeights {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    throw new TypeError("At least one scheduler priority must be greater than zero.");
  }

  return {
    cost: weights.cost / total,
    reliability: weights.reliability / total,
    carbon: weights.carbon / total,
    latency: weights.latency / total,
    trust: weights.trust / total,
  };
}

function inverseRange(value: number, min: number, max: number): number {
  if (max === min) return 1;
  return clamp01(1 - (value - min) / (max - min));
}

export function getEligibleNodes(offers: NodeOffer[], request: JobRequest): NodeOffer[] {
  return offers.filter(
    (offer) =>
      offer.status === "ready" &&
      offer.supportedWorkloads.includes(request.workload) &&
      offer.vramGb >= request.minVramGb &&
      offer.pricePerHour <= request.maxPricePerGpuHour &&
      evidenceRank[offer.evidenceTier] >= evidenceRank[request.minimumEvidenceTier],
  );
}

export function scoreNodes(offers: NodeOffer[], request: JobRequest): ScoredNode[] {
  const eligible = getEligibleNodes(offers, request);
  if (eligible.length === 0) return [];

  const weights = normalizeWeights(request.priorities);
  const prices = eligible.map((node) => node.pricePerHour);
  const carbons = eligible.map((node) => node.carbonGramsPerKwh);
  const latencies = eligible.map((node) => node.latencyMs);
  const ranges = {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    minCarbon: Math.min(...carbons),
    maxCarbon: Math.max(...carbons),
    minLatency: Math.min(...latencies),
    maxLatency: Math.max(...latencies),
  };

  return eligible
    .map((node) => {
      const factors = {
        cost: inverseRange(node.pricePerHour, ranges.minPrice, ranges.maxPrice),
        reliability: clamp01((node.reliability - 90) / 10),
        carbon: inverseRange(node.carbonGramsPerKwh, ranges.minCarbon, ranges.maxCarbon),
        latency: inverseRange(node.latencyMs, ranges.minLatency, ranges.maxLatency),
        trust: clamp01((node.trustScore - 75) / 25),
        diversity: 0,
      };
      const score =
        factors.cost * weights.cost +
        factors.reliability * weights.reliability +
        factors.carbon * weights.carbon +
        factors.latency * weights.latency +
        factors.trust * weights.trust;

      return { node, score: Number((score * 100).toFixed(2)), factors };
    })
    .sort((a, b) => b.score - a.score || a.node.pricePerHour - b.node.pricePerHour);
}

function selectDiverseNodes(scored: ScoredNode[], count: number): ScoredNode[] {
  const remaining = [...scored];
  const selected: ScoredNode[] = [];

  while (selected.length < count && remaining.length > 0) {
    const regions = new Set(selected.map((item) => item.node.region));
    const gpus = new Set(selected.map((item) => item.node.gpu));
    let bestIndex = 0;
    let bestAdjustedScore = Number.NEGATIVE_INFINITY;

    remaining.forEach((candidate, index) => {
      const diversity =
        (regions.has(candidate.node.region) ? 0 : selected.length === 0 ? 0 : 2.5) +
        (gpus.has(candidate.node.gpu) ? 0 : selected.length === 0 ? 0 : 1);
      const adjustedScore = candidate.score + diversity;
      if (adjustedScore > bestAdjustedScore) {
        bestAdjustedScore = adjustedScore;
        bestIndex = index;
      }
    });

    const [winner] = remaining.splice(bestIndex, 1);
    const diversity = Math.max(0, bestAdjustedScore - winner.score);
    selected.push({
      ...winner,
      score: Number(bestAdjustedScore.toFixed(2)),
      factors: { ...winner.factors, diversity: Number(diversity.toFixed(2)) },
    });
  }

  return selected;
}

export function scheduleJob(offers: NodeOffer[], request: JobRequest): SchedulePlan {
  const scored = scoreNodes(offers, request);
  if (scored.length < request.gpuCount) {
    throw new NoCapacityError(scored.length, request.gpuCount);
  }

  const selected = selectDiverseNodes(scored, request.gpuCount);
  const hourlyRate = selected.reduce((sum, item) => sum + item.node.pricePerHour, 0);
  const predictedCost = hourlyRate * (request.durationMinutes / 60);
  const marketRate = request.maxPricePerGpuHour * request.gpuCount * (request.durationMinutes / 60);
  const savingsPercent = marketRate === 0 ? 0 : ((marketRate - predictedCost) / marketRate) * 100;
  const regions = new Set(selected.map((item) => item.node.region));

  return {
    jobId: request.id,
    selected,
    candidatesConsidered: scored.length,
    predictedCost: Number(predictedCost.toFixed(2)),
    marketRate: Number(marketRate.toFixed(2)),
    savingsPercent: Number(Math.max(0, savingsPercent).toFixed(1)),
    estimatedStartSeconds: Math.max(...selected.map((item) => item.node.queueSeconds)),
    checkpointCount: Math.max(1, Math.ceil(request.durationMinutes / request.checkpointIntervalMinutes)),
    policy: "outcome-sla-v1",
    explanation: [
      `${selected.length} policy-compatible GPUs selected from ${scored.length} eligible offers.`,
      `${regions.size} failure domain${regions.size === 1 ? "" : "s"} reduce correlated host risk.`,
      `External checkpoint intervals of ${request.checkpointIntervalMinutes} minutes cap modeled lost work.`,
      "Settlement unlocks only after output policy and receipt-chain verification.",
    ],
  };
}

export function chooseFailoverNode(
  offers: NodeOffer[],
  request: JobRequest,
  plan: SchedulePlan,
  failedNodeId: string,
): ScoredNode {
  if (!plan.selected.some((item) => item.node.id === failedNodeId)) {
    throw new RangeError(`Node ${failedNodeId} is not part of the active schedule.`);
  }

  const excluded = new Set(plan.selected.map((item) => item.node.id));
  const candidate = scoreNodes(
    offers.filter((offer) => !excluded.has(offer.id)),
    { ...request, gpuCount: 1 },
  )[0];

  if (!candidate) {
    throw new NoCapacityError(0, 1);
  }

  return candidate;
}
