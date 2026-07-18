import { z } from "zod";

const workloadSchema = z.enum([
  "generative-video",
  "image-batch",
  "fine-tune",
  "blender-render",
  "simulation",
]);

export const prioritySchema = z.object({
  cost: z.number().min(0).max(1),
  reliability: z.number().min(0).max(1),
  carbon: z.number().min(0).max(1),
  latency: z.number().min(0).max(1),
  trust: z.number().min(0).max(1),
}).strict();

export const quoteRequestSchema = z
  .object({
    id: z.string().trim().min(3).max(64).regex(/^[a-zA-Z0-9_-]+$/),
    name: z.string().trim().min(3).max(100),
    workload: workloadSchema,
    minVramGb: z.number().int().min(8).max(160),
    gpuCount: z.number().int().min(1).max(4),
    durationMinutes: z.number().int().min(1).max(720),
    maxPricePerGpuHour: z.number().positive().max(25),
    minimumEvidenceTier: z.enum(["observed", "isolated", "attested"]),
    checkpointIntervalMinutes: z.number().int().min(2).max(60),
    priorities: prioritySchema,
  })
  .strict()
  .superRefine((value, context) => {
    const total = Object.values(value.priorities).reduce((sum, item) => sum + item, 0);
    if (total <= 0) {
      context.addIssue({
        code: "custom",
        path: ["priorities"],
        message: "At least one scheduling priority must be greater than zero.",
      });
    }
    if (value.checkpointIntervalMinutes > value.durationMinutes) {
      context.addIssue({
        code: "custom",
        path: ["checkpointIntervalMinutes"],
        message: "Checkpoint interval cannot exceed the expected job duration.",
      });
    }
  });

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export const demoReceiptRequestSchema = z
  .object({
    scenario: z.enum(["clean", "failover"]),
    request: quoteRequestSchema,
    failedNodeId: z.string().min(3).max(64).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.scenario === "failover" && !value.failedNodeId) {
      context.addIssue({ code: "custom", path: ["failedNodeId"], message: "Failover requires the failed node ID." });
    } else if (value.scenario === "clean" && value.failedNodeId) {
      context.addIssue({ code: "custom", path: ["scenario"], message: "Clean receipts cannot include failover node IDs." });
    }
  });
