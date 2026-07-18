export const DEMO_PLATFORM_FEE_BPS = 800;
export const DEMO_PLATFORM_FEE_RATE = DEMO_PLATFORM_FEE_BPS / 10_000;
export const DEMO_MICROCREDITS_PER_UNIT = 1_000_000;

export function splitDemoCredits(totalMicrocredits: number) {
  const platformMicrocredits = Math.round(totalMicrocredits * DEMO_PLATFORM_FEE_RATE);
  return {
    providerMicrocredits: totalMicrocredits - platformMicrocredits,
    platformMicrocredits,
  };
}
