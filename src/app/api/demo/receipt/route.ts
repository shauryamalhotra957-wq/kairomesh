import { DEMO_MICROCREDITS_PER_UNIT } from "@/lib/demo-economics";
import { createDemoReceiptEvents } from "@/lib/demo-receipt";
import { nodeOffers } from "@/lib/network-data";
import { createReceiptChain } from "@/lib/proof-chain";
import { InvalidJsonError, PayloadTooLargeError, readJsonBody } from "@/lib/request-body";
import { demoReceiptRequestSchema } from "@/lib/schemas";
import { chooseFailoverNode, NoCapacityError, scheduleJob } from "@/lib/scheduler";

const MAX_BODY_BYTES = 12_000;

function json(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json({ error: "CONTENT_TYPE", message: "Content-Type must be application/json." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ error: "PAYLOAD_TOO_LARGE", message: "Request body exceeds 12 KB." }, 413);
  }

  let input: unknown;
  try {
    input = await readJsonBody(request, MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return json({ error: "PAYLOAD_TOO_LARGE", message: "Request body exceeds 12 KB." }, 413);
    }
    return json(
      { error: error instanceof InvalidJsonError ? "INVALID_JSON" : "BODY_READ_FAILED", message: "Request body is not valid JSON." },
      400,
    );
  }

  const parsed = demoReceiptRequestSchema.safeParse(input);
  if (!parsed.success) {
    return json(
      {
        error: "INVALID_REQUEST",
        message: "The receipt context failed validation.",
        fields: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      },
      422,
    );
  }

  try {
    const plan = scheduleJob(nodeOffers, parsed.data.request);
    const failedNodeId = parsed.data.failedNodeId;
    if (parsed.data.scenario === "failover" && plan.selected[0]?.node.id !== failedNodeId) {
      return json({ error: "INVALID_FAILED_NODE", message: "The failed node must be the primary attempt in the recomputed schedule." }, 422);
    }
    const recoveryNode = parsed.data.scenario === "failover" && failedNodeId
      ? chooseFailoverNode(nodeOffers, parsed.data.request, plan, failedNodeId).node
      : undefined;
    const context = {
      jobId: parsed.data.request.id,
      scenario: parsed.data.scenario,
      workload: parsed.data.request.workload,
      evidenceTier: parsed.data.request.minimumEvidenceTier,
      selectedNodeIds: plan.selected.map((item) => item.node.id),
      failedNodeId,
      recoveryNodeId: recoveryNode?.id,
      amountMicrocredits: Math.round(plan.predictedCost * DEMO_MICROCREDITS_PER_UNIT),
    };

    const chain = createReceiptChain(createDemoReceiptEvents(context));
    return json({
      data: {
        version: "kairomesh-receipt/v1",
        jobId: context.jobId,
        scenario: context.scenario,
        chain,
        rootHash: chain.at(-1)!.hash,
        claim: "Tamper-evident event chain; not a proof of arbitrary computation.",
      },
      simulated: true,
    }, 200);
  } catch (error) {
    if (error instanceof NoCapacityError) {
      return json({ error: error.code, message: error.message }, 409);
    }
    return json({ error: "RECEIPT_FAILED", message: "Unable to create the demo receipt." }, 500);
  }
}
