import type { Metadata } from "next";
import { MissionControl } from "@/components/mission-control";
import { defaultPriorities, nodeOffers, workloadPresets } from "@/lib/network-data";
import { scheduleJob } from "@/lib/scheduler";

export const metadata: Metadata = {
  title: "Mission control",
  description: "Run the KairoMesh checkpoint failover, output mismatch, receipt, and settlement demonstration.",
};

export default function ConsolePage() {
  const preset = workloadPresets[0];
  const initialPlan = scheduleJob(nodeOffers, {
    id: "job_console_demo",
    name: preset.label,
    workload: preset.id,
    minVramGb: preset.minVramGb,
    gpuCount: preset.gpuCount,
    durationMinutes: preset.durationMinutes,
    maxPricePerGpuHour: preset.maxPricePerGpuHour,
    minimumEvidenceTier: "isolated",
    checkpointIntervalMinutes: 8,
    priorities: { ...defaultPriorities },
  });

  return (
    <main id="main-content" className="pb-24 pt-28 sm:pt-32">
      <div className="page-shell">
        <MissionControl offers={nodeOffers} presets={workloadPresets} initialPlan={initialPlan} />
      </div>
    </main>
  );
}
