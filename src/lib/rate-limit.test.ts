/** @vitest-environment node */

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { consumeRateLimit } from "./rate-limit";

describe("process-local demo rate limiter", () => {
  it("allows thirty requests per window and rejects the next", () => {
    const now = 1_000_000;
    for (let index = 0; index < 30; index += 1) {
      expect(consumeRateLimit("limit-key", now).allowed).toBe(true);
    }
    const rejected = consumeRateLimit("limit-key", now);
    expect(rejected).toMatchObject({ allowed: false, remaining: 0, resetAt: now + 60_000 });
  });

  it("starts a fresh bucket after expiry", () => {
    const first = consumeRateLimit("reset-key", 2_000_000);
    const reset = consumeRateLimit("reset-key", first.resetAt);
    expect(reset).toMatchObject({ allowed: true, remaining: 29 });
    expect(reset.resetAt).toBe(first.resetAt + 60_000);
  });

  it("evicts oldest live buckets instead of growing without bound", () => {
    const now = 3_000_000;
    for (let index = 0; index < 1_005; index += 1) consumeRateLimit(`flood-${index}`, now);
    expect(consumeRateLimit("flood-0", now).remaining).toBe(29);
  });
});
