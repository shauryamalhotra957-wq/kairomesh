export type NodeStatus = "ready" | "busy" | "draining" | "offline";

export type RegionCode =
  | "ap-south"
  | "ap-southeast"
  | "eu-central"
  | "eu-west"
  | "us-east"
  | "us-west";

export type WorkloadKind =
  | "generative-video"
  | "image-batch"
  | "fine-tune"
  | "blender-render"
  | "simulation";

export type EvidenceTier = "observed" | "isolated" | "attested";

export interface NodeOffer {
  id: string;
  alias: string;
  gpu: string;
  vramGb: number;
  region: RegionCode;
  city: string;
  pricePerHour: number;
  reliability: number;
  latencyMs: number;
  carbonGramsPerKwh: number;
  trustScore: number;
  benchmarkScore: number;
  queueSeconds: number;
  status: NodeStatus;
  evidenceTier: EvidenceTier;
  secureBoot: boolean;
  supportedWorkloads: readonly WorkloadKind[];
  coordinates: { x: number; y: number };
}

export interface PriorityWeights {
  cost: number;
  reliability: number;
  carbon: number;
  latency: number;
  trust: number;
}

export interface JobRequest {
  id: string;
  name: string;
  workload: WorkloadKind;
  minVramGb: number;
  gpuCount: number;
  durationMinutes: number;
  maxPricePerGpuHour: number;
  minimumEvidenceTier: EvidenceTier;
  checkpointIntervalMinutes: number;
  priorities: PriorityWeights;
}

export interface ScoredNode {
  node: NodeOffer;
  score: number;
  factors: {
    cost: number;
    reliability: number;
    carbon: number;
    latency: number;
    trust: number;
    diversity: number;
  };
}

export interface SchedulePlan {
  jobId: string;
  selected: ScoredNode[];
  candidatesConsidered: number;
  predictedCost: number;
  marketRate: number;
  savingsPercent: number;
  estimatedStartSeconds: number;
  checkpointCount: number;
  policy: "outcome-sla-v1";
  explanation: string[];
}

export interface WorkloadPreset {
  id: WorkloadKind;
  label: string;
  summary: string;
  minVramGb: number;
  gpuCount: number;
  durationMinutes: number;
  maxPricePerGpuHour: number;
}
