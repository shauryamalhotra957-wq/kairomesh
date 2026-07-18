import { nodeOffers } from "@/lib/network-data";
import { consumeRateLimit } from "@/lib/rate-limit";
import { InvalidJsonError, PayloadTooLargeError, readJsonBody } from "@/lib/request-body";
import { quoteRequestSchema } from "@/lib/schemas";
import { NoCapacityError, scheduleJob } from "@/lib/scheduler";

const MAX_BODY_BYTES = 12_000;

function getRateLimitKey(request: Request) {
  if (process.env.KAIROMESH_TRUST_PROXY !== "true") return "anonymous";
  const candidate = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  return /^[a-fA-F0-9:.]{3,64}$/.test(candidate) ? candidate : "anonymous";
}

function json(body: unknown, status: number, extraHeaders: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json({ error: "CONTENT_TYPE", message: "Content-Type must be application/json.", requestId }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ error: "PAYLOAD_TOO_LARGE", message: "Request body exceeds 12 KB.", requestId }, 413);
  }

  const now = Date.now();
  const rate = consumeRateLimit(getRateLimitKey(request), now);
  const resetSeconds = Math.max(1, Math.ceil((rate.resetAt - now) / 1_000));
  const rateHeaders = {
    "RateLimit-Limit": "30",
    "RateLimit-Remaining": String(rate.remaining),
    "RateLimit-Reset": String(resetSeconds),
    "X-Request-Id": requestId,
  };
  if (!rate.allowed) {
    return json(
      { error: "RATE_LIMITED", message: "Quote limit reached. Try again shortly.", requestId },
      429,
      { ...rateHeaders, "Retry-After": String(resetSeconds) },
    );
  }

  let input: unknown;
  try {
    input = await readJsonBody(request, MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return json({ error: "PAYLOAD_TOO_LARGE", message: "Request body exceeds 12 KB.", requestId }, 413, rateHeaders);
    }
    if (!(error instanceof InvalidJsonError)) {
      return json({ error: "BODY_READ_FAILED", message: "Unable to read the request body.", requestId }, 400, rateHeaders);
    }
    return json({ error: "INVALID_JSON", message: "Request body is not valid JSON.", requestId }, 400, rateHeaders);
  }

  const parsed = quoteRequestSchema.safeParse(input);
  if (!parsed.success) {
    return json(
      {
        error: "INVALID_REQUEST",
        message: "The quote request failed validation.",
        fields: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
        requestId,
      },
      422,
      rateHeaders,
    );
  }

  try {
    const plan = scheduleJob(nodeOffers, parsed.data);
    return json({ data: plan, requestId, simulated: true }, 200, rateHeaders);
  } catch (error) {
    if (error instanceof NoCapacityError) {
      return json(
        { error: error.code, message: error.message, eligibleCount: error.eligibleCount, requestId },
        409,
        rateHeaders,
      );
    }
    return json({ error: "INTERNAL_ERROR", message: "Unable to produce a quote.", requestId }, 500, rateHeaders);
  }
}
