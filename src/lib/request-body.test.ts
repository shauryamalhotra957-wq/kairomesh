/** @vitest-environment node */

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { InvalidJsonError, PayloadTooLargeError, readJsonBody } from "./request-body";

function streamRequest(chunks: Uint8Array[]) {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(chunk));
      controller.close();
    },
  });
  return new Request("http://localhost/test", {
    method: "POST",
    body,
    duplex: "half",
  } as RequestInit & { duplex: "half" });
}

describe("bounded JSON request reader", () => {
  it("parses UTF-8 JSON split across stream chunks", async () => {
    const encoder = new TextEncoder();
    const result = await readJsonBody(streamRequest([encoder.encode('{"ok":'), encoder.encode("true}")]), 64);
    expect(result).toEqual({ ok: true });
  });

  it("stops a missing-length stream as soon as it crosses the byte limit", async () => {
    const encoder = new TextEncoder();
    const request = streamRequest([encoder.encode("12345678"), encoder.encode("901")]);
    expect(request.headers.get("content-length")).toBeNull();
    await expect(readJsonBody(request, 10)).rejects.toBeInstanceOf(PayloadTooLargeError);
  });

  it("rejects malformed JSON and invalid UTF-8", async () => {
    const encoder = new TextEncoder();
    await expect(readJsonBody(streamRequest([encoder.encode("{")]), 10)).rejects.toBeInstanceOf(InvalidJsonError);
    await expect(readJsonBody(streamRequest([new Uint8Array([0xc3, 0x28])]), 10)).rejects.toBeInstanceOf(InvalidJsonError);
  });
});
