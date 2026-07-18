"use client";

import {
  ArrowRight,
  CircleDollarSign,
  Cpu,
  Gauge,
  Info,
  Leaf,
  TimerReset,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useId, useState } from "react";
import { DEMO_PLATFORM_FEE_RATE } from "@/lib/demo-economics";

const DAYS_PER_MONTH = 30;

const gpuProfiles = [
  {
    id: "rtx-3090",
    name: "RTX 3090",
    vram: "24 GB",
    simulatedRate: 0.34,
    loadedSystemWatts: 520,
  },
  {
    id: "rtx-4090",
    name: "RTX 4090",
    vram: "24 GB",
    simulatedRate: 0.43,
    loadedSystemWatts: 610,
  },
  {
    id: "rtx-5090",
    name: "RTX 5090",
    vram: "32 GB",
    simulatedRate: 0.71,
    loadedSystemWatts: 730,
  },
  {
    id: "rtx-a6000",
    name: "RTX A6000",
    vram: "48 GB",
    simulatedRate: 0.82,
    loadedSystemWatts: 460,
  },
  {
    id: "l40s",
    name: "L40S",
    vram: "48 GB",
    simulatedRate: 1.06,
    loadedSystemWatts: 520,
  },
] as const;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const preciseCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatSignedCurrency(value: number) {
  const sign = value < 0 ? "−" : "+";
  return `${sign}${currency.format(Math.abs(value))}`;
}

export function ProviderCalculator() {
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const [gpuId, setGpuId] = useState<(typeof gpuProfiles)[number]["id"]>("rtx-4090");
  const [hoursPerDay, setHoursPerDay] = useState(18);
  const [utilization, setUtilization] = useState(64);
  const [electricityRate, setElectricityRate] = useState("0.12");

  const selectedGpu = gpuProfiles.find((gpu) => gpu.id === gpuId) ?? gpuProfiles[1];
  const parsedElectricityRate = Number(electricityRate);
  const electricityRateIsValid =
    electricityRate.trim() !== "" &&
    Number.isFinite(parsedElectricityRate) &&
    parsedElectricityRate >= 0 &&
    parsedElectricityRate <= 2;

  const availableHours = hoursPerDay * DAYS_PER_MONTH;
  const billableHours = availableHours * (utilization / 100);
  const grossRevenue = selectedGpu.simulatedRate * billableHours;
  const platformFee = grossRevenue * DEMO_PLATFORM_FEE_RATE;
  const electricityCost = electricityRateIsValid
    ? (selectedGpu.loadedSystemWatts / 1000) * billableHours * parsedElectricityRate
    : null;
  const netRevenue = electricityCost === null ? null : grossRevenue - platformFee - electricityCost;
  const netMargin = netRevenue === null || grossRevenue === 0 ? 0 : (netRevenue / grossRevenue) * 100;
  const safeMargin = Math.max(0, Math.min(100, netMargin));
  const netPerExtraUtilizationPoint =
    electricityCost === null
      ? null
      : (hoursPerDay * DAYS_PER_MONTH * selectedGpu.simulatedRate * (1 - DEMO_PLATFORM_FEE_RATE)) / 100 -
        ((selectedGpu.loadedSystemWatts / 1000) * hoursPerDay * DAYS_PER_MONTH * parsedElectricityRate) / 100;

  const gpuSelectId = `${baseId}-gpu`;
  const hoursId = `${baseId}-hours`;
  const utilizationId = `${baseId}-utilization`;
  const electricityId = `${baseId}-electricity`;
  const electricityHelpId = `${baseId}-electricity-help`;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
      <section aria-labelledby={`${baseId}-inputs-title`} className="surface-card p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="section-kicker">Host economics</p>
            <h3 id={`${baseId}-inputs-title`} className="mt-3 text-2xl font-[560] tracking-[-0.04em] text-white sm:text-3xl">
              Model your available window.
            </h3>
          </div>
          <span className="mono inline-flex w-fit items-center gap-2 rounded-full border border-[#f5b942]/20 bg-[#f5b942]/[0.07] px-3 py-2 text-[0.58rem] uppercase tracking-[0.1em] text-[#f1d897]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f5b942]" /> Simulated rates
          </span>
        </div>

        <div className="mt-7 space-y-7">
          <div>
            <label htmlFor={gpuSelectId} className="text-sm font-medium text-[#dfe7ee]">
              GPU model
            </label>
            <div className="relative mt-2">
              <select
                id={gpuSelectId}
                value={gpuId}
                onChange={(event) => setGpuId(event.target.value as (typeof gpuProfiles)[number]["id"])}
                className="min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-white/[0.12] bg-[#0a0e14] px-4 pr-11 text-base text-white transition-colors duration-200 hover:border-white/25 focus:border-[#b8f36b]/60"
              >
                {gpuProfiles.map((gpu) => (
                  <option key={gpu.id} value={gpu.id}>
                    {gpu.name} · {gpu.vram}
                  </option>
                ))}
              </select>
              <Cpu aria-hidden="true" size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#687583]" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
                <p className="mono text-[0.54rem] uppercase tracking-[0.09em] text-[#687583]">Host rate</p>
                <p className="mono mt-2 text-sm text-[#b8f36b]">{preciseCurrency.format(selectedGpu.simulatedRate)}/h</p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
                <p className="mono text-[0.54rem] uppercase tracking-[0.09em] text-[#687583]">Loaded system</p>
                <p className="mono mt-2 text-sm text-[#c6d0d9]">~{selectedGpu.loadedSystemWatts} W</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor={hoursId} className="text-sm font-medium text-[#dfe7ee]">
                Available each day
              </label>
              <output htmlFor={hoursId} className="mono rounded-lg border border-white/[0.08] bg-black/20 px-2.5 py-1.5 text-xs text-[#b8f36b]">
                {hoursPerDay} h
              </output>
            </div>
            <input
              id={hoursId}
              type="range"
              min="1"
              max="24"
              step="1"
              value={hoursPerDay}
              onChange={(event) => setHoursPerDay(Number(event.target.value))}
              className="mt-4 h-11 w-full cursor-pointer accent-[#b8f36b]"
            />
            <div aria-hidden="true" className="mono -mt-1 flex justify-between text-[0.54rem] uppercase tracking-[0.08em] text-[#5f6d7b]">
              <span>1 hour</span>
              <span>24 hours</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor={utilizationId} className="text-sm font-medium text-[#dfe7ee]">
                Expected booked utilization
              </label>
              <output htmlFor={utilizationId} className="mono rounded-lg border border-white/[0.08] bg-black/20 px-2.5 py-1.5 text-xs text-[#65a8ff]">
                {utilization}%
              </output>
            </div>
            <input
              id={utilizationId}
              type="range"
              min="5"
              max="95"
              step="1"
              value={utilization}
              onChange={(event) => setUtilization(Number(event.target.value))}
              className="mt-4 h-11 w-full cursor-pointer accent-[#65a8ff]"
            />
            <p className="mt-1 text-xs leading-5 text-[#7f8d9c]">
              Utilization is the share of your available window that receives a paid job, not an uptime guarantee.
            </p>
          </div>

          <div>
            <label htmlFor={electricityId} className="text-sm font-medium text-[#dfe7ee]">
              Electricity rate
            </label>
            <div className="relative mt-2 max-w-xs">
              <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7f8d9c]">$</span>
              <input
                id={electricityId}
                type="number"
                inputMode="decimal"
                min="0"
                max="2"
                step="0.01"
                value={electricityRate}
                onChange={(event) => setElectricityRate(event.target.value)}
                aria-invalid={!electricityRateIsValid}
                aria-describedby={electricityHelpId}
                className="min-h-12 w-full rounded-xl border border-white/[0.12] bg-[#0a0e14] pl-8 pr-20 text-base text-white transition-colors duration-200 hover:border-white/25 focus:border-[#b8f36b]/60 aria-[invalid=true]:border-[#ff6b6b]/70"
              />
              <span className="mono pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.6rem] uppercase tracking-[0.08em] text-[#687583]">/ kWh</span>
            </div>
            <p id={electricityHelpId} className={`mt-2 text-xs leading-5 ${electricityRateIsValid ? "text-[#7f8d9c]" : "text-[#ff9a9a]"}`}>
              {electricityRateIsValid
                ? "Use your marginal electricity price in USD. The estimate counts loaded compute time only."
                : "Enter a rate from $0.00 to $2.00 per kWh to complete the estimate."}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3 rounded-xl border border-[#65a8ff]/15 bg-[#65a8ff]/[0.055] p-4 text-xs leading-5 text-[#9db9d8]">
          <Info aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-[#65a8ff]" />
          <p>
            The model uses 30 days, an 8% simulated platform fee, and estimated loaded-system draw. It excludes taxes, idle power, cooling, internet, hardware wear, and other host costs.
          </p>
        </div>
      </section>

      <section aria-labelledby={`${baseId}-result-title`} className="surface-card overflow-hidden lg:sticky lg:top-28">
        <div className="border-b border-white/[0.07] bg-[radial-gradient(circle_at_85%_0%,rgba(184,243,107,.1),transparent_45%)] p-5 sm:p-7 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Monthly estimate</p>
              <h3 id={`${baseId}-result-title`} className="sr-only">Estimated monthly provider earnings</h3>
            </div>
            <CircleDollarSign aria-hidden="true" size={22} className="text-[#b8f36b]" />
          </div>

          <output aria-live="polite" className="mt-6 block">
            <span className="block text-sm text-[#8f9dac]">Projected net earnings</span>
            <span className={`mono mt-2 block text-[clamp(2.65rem,8vw,5.1rem)] font-medium leading-none tracking-[-0.07em] ${netRevenue !== null && netRevenue < 0 ? "text-[#ff8d8d]" : "text-white"}`}>
              {netRevenue === null ? "—" : currency.format(netRevenue)}
            </span>
            <span className="mono mt-3 block text-[0.6rem] uppercase tracking-[0.1em] text-[#687583]">
              USD / 30-day month · estimate only
            </span>
          </output>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
              <TimerReset aria-hidden="true" size={15} className="text-[#65a8ff]" />
              <p className="mono mt-4 text-lg text-white">{billableHours.toFixed(0)} h</p>
              <p className="mt-1 text-[0.65rem] text-[#7f8d9c]">estimated booked time</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
              <Gauge aria-hidden="true" size={15} className="text-[#b8f36b]" />
              <p className="mono mt-4 text-lg text-white">{netRevenue === null ? "—" : `${netMargin.toFixed(0)}%`}</p>
              <p className="mt-1 text-[0.65rem] text-[#7f8d9c]">net share of gross</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7 lg:p-8">
          <div className="space-y-4" aria-label="Estimated monthly earnings breakdown">
            <div className="flex items-center justify-between gap-4 text-sm">
              <div>
                <p className="text-[#c6d0d9]">Gross booked revenue</p>
                <p className="mt-1 text-xs text-[#687583]">{billableHours.toFixed(0)} h × {preciseCurrency.format(selectedGpu.simulatedRate)}</p>
              </div>
              <span className="mono text-[#b8f36b]">{formatSignedCurrency(grossRevenue)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4 text-sm">
              <div>
                <p className="text-[#c6d0d9]">Simulated platform fee</p>
                <p className="mt-1 text-xs text-[#687583]">8% of gross revenue</p>
              </div>
              <span className="mono text-[#f5b942]">−{currency.format(platformFee)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4 text-sm">
              <div>
                <p className="text-[#c6d0d9]">Loaded electricity</p>
                <p className="mt-1 text-xs text-[#687583]">~{selectedGpu.loadedSystemWatts} W during booked time</p>
              </div>
              <span className="mono text-[#65a8ff]">{electricityCost === null ? "—" : `−${currency.format(electricityCost)}`}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/[0.12] pt-5">
              <div>
                <p className="font-medium text-white">Estimated net</p>
                <p className="mt-1 text-xs text-[#687583]">Before taxes and unmodeled costs</p>
              </div>
              <span className={`mono text-xl ${netRevenue !== null && netRevenue < 0 ? "text-[#ff8d8d]" : "text-white"}`}>
                {netRevenue === null ? "—" : currency.format(netRevenue)}
              </span>
            </div>
          </div>

          <div className="mt-7 rounded-xl border border-white/[0.07] bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-[#8f9dac]">Estimated net margin</span>
              <span className="mono text-[#c6d0d9]">{netRevenue === null ? "incomplete" : `${netMargin.toFixed(1)}%`}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.span
                aria-hidden="true"
                className="block h-full w-full origin-left rounded-full bg-gradient-to-r from-[#65a8ff] to-[#b8f36b]"
                animate={{ scaleX: safeMargin / 100 }}
                initial={false}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-[#7f8d9c]">
              {netPerExtraUtilizationPoint === null
                ? "Complete the electricity input to see utilization sensitivity."
                : `At this availability, each additional booked-utilization point changes estimated net by ${preciseCurrency.format(netPerExtraUtilizationPoint)} per month.`}
            </p>
          </div>

          <div className="mt-7 flex gap-3 rounded-xl border border-[#b8f36b]/15 bg-[#b8f36b]/[0.055] p-4 text-xs leading-5 text-[#a9c389]">
            <Leaf aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-[#b8f36b]" />
            <p>Use measured wall power and your real tariff before making a hardware or hosting decision. This calculator is a scenario model, not a payout quote.</p>
          </div>

          <Link href="/console" className="button-primary mt-7 w-full px-5">
            Open the live console <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
