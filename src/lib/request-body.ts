import "server-only";

export class PayloadTooLargeError extends Error {
  constructor() {
    super("Request body exceeds the configured byte limit.");
    this.name = "PayloadTooLargeError";
  }
}

export class InvalidJsonError extends Error {
  constructor() {
    super("Request body is not valid UTF-8 JSON.");
    this.name = "InvalidJsonError";
  }
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  if (!request.body) throw new InvalidJsonError();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new PayloadTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return JSON.parse(text) as unknown;
  } catch (error) {
    if (error instanceof PayloadTooLargeError) throw error;
    throw new InvalidJsonError();
  }
}
