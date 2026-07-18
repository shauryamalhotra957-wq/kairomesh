import { describe, expect, it } from "vitest";
import { DEMO_PLATFORM_FEE_BPS, splitDemoCredits } from "./demo-economics";

describe("demo economics", () => {
  it("uses one eight-percent fee assumption without losing a microcredit", () => {
    const split = splitDemoCredits(2_500_000);
    expect(DEMO_PLATFORM_FEE_BPS).toBe(800);
    expect(split).toEqual({ providerMicrocredits: 2_300_000, platformMicrocredits: 200_000 });
    expect(split.providerMicrocredits + split.platformMicrocredits).toBe(2_500_000);
  });

  it("assigns rounding residue to the provider side", () => {
    expect(splitDemoCredits(1)).toEqual({ providerMicrocredits: 1, platformMicrocredits: 0 });
  });
});
