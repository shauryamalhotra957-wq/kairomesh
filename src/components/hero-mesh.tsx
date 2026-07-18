"use client";

import { Check, CircleStop, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const scenes = [
  { label: "Quote locked", detail: "3 × RTX · $2.74 max", progress: 8 },
  { label: "Hosts challenged", detail: "3 passports accepted", progress: 24 },
  { label: "Rendering shards", detail: "checkpoint 18 sealed", progress: 48 },
  { label: "Host lost", detail: "monsoon-01 · heartbeat", progress: 51 },
  { label: "Checkpoint restored", detail: "aurora-05 · fence 02", progress: 68 },
  { label: "Output verified", detail: "480 / 480 frames", progress: 100 },
] as const;

export function HeroMesh() {
  const reduceMotion = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing || scene >= scenes.length - 1) return;
    timer.current = setTimeout(() => {
      const next = Math.min(scene + 1, scenes.length - 1);
      setScene(next);
      if (next === scenes.length - 1) setPlaying(false);
    }, reduceMotion ? 200 : 1050);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, reduceMotion, scene]);

  const start = () => {
    setScene(0);
    setPlaying(true);
  };

  const active = scenes[scene];
  const failed = scene === 3;
  const recovered = scene >= 4;
  const complete = scene === scenes.length - 1;

  return (
    <div className="surface-card relative isolate overflow-hidden p-3 shadow-[0_40px_120px_rgba(0,0,0,0.38)] sm:p-4">
      <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-[#65a8ff]/[0.08] blur-3xl" />
      <div className="flex items-center justify-between border-b border-white/[0.07] px-1 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#b8f36b] shadow-[0_0_14px_rgba(184,243,107,.45)]" />
          <span className="mono text-[0.63rem] uppercase tracking-[0.1em] text-[#a9b5c3]">Live outcome route</span>
        </div>
        <span className="mono rounded-full border border-[#65a8ff]/25 bg-[#65a8ff]/10 px-2 py-1 text-[0.55rem] uppercase tracking-[0.1em] text-[#8dc0ff]">Demo network</span>
      </div>

      <div className="mesh-grid relative mt-3 h-[18rem] overflow-hidden rounded-[0.8rem] border border-white/[0.07] bg-[#090d13] sm:h-[21rem]">
        <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between">
          <div>
            <p className="mono text-[0.56rem] uppercase tracking-[0.11em] text-[#687583]">Run / KM-0427</p>
            <p className="mt-1 text-sm font-medium text-white">Open satellite flood map</p>
          </div>
          <div className="text-right">
            <p className="mono text-[0.56rem] uppercase tracking-[0.11em] text-[#687583]">Budget used</p>
            <p className="mono mt-1 text-sm text-[#b8f36b]">$1.84 / $2.74</p>
          </div>
        </div>

        <svg aria-label="Animated map of a GPU job failing over between hosts" role="img" viewBox="0 0 600 330" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="route" x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="#65a8ff" stopOpacity="0.18" />
              <stop offset="0.5" stopColor="#b8f36b" stopOpacity="0.95" />
              <stop offset="1" stopColor="#65a8ff" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <path d="M80 205 C160 120 235 245 305 163 S445 100 526 184" fill="none" stroke="#7f8d9c" strokeOpacity=".12" strokeWidth="1" />
          <path d="M80 205 C160 120 235 245 305 163" fill="none" stroke="url(#route)" strokeWidth="2" className={playing && scene < 3 ? "route-line" : ""} />
          {(recovered || complete) && <path d="M305 163 C380 225 445 100 526 184" fill="none" stroke="url(#route)" strokeWidth="2" className="route-line" />}

          <g transform="translate(80 205)">
            <circle r="26" fill="#10151d" stroke="#65a8ff" strokeOpacity=".55" />
            <circle r="4" fill="#65a8ff" />
            <text y="48" fill="#7f8d9c" textAnchor="middle" fontSize="10" fontFamily="monospace">INPUT</text>
          </g>
          <g transform="translate(305 163)">
            <circle r="31" fill="#10151d" stroke={failed ? "#ff6b6b" : "#b8f36b"} strokeOpacity=".72" />
            {!failed && scene > 0 && <circle r="37" fill="none" stroke="#b8f36b" strokeOpacity=".3" className="proof-pulse" />}
            {failed ? <path d="m-7-7 14 14m0-14L-7 7" stroke="#ff6b6b" strokeWidth="2" /> : <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#b8f36b" />}
            <text y="52" fill={failed ? "#ff8d8d" : "#a9b5c3"} textAnchor="middle" fontSize="10" fontFamily="monospace">{failed ? "HOST LOST" : "MONSOON-01"}</text>
          </g>
          <g transform="translate(526 184)" opacity={recovered || complete ? 1 : 0.28}>
            <circle r="31" fill="#10151d" stroke={complete ? "#b8f36b" : "#65a8ff"} strokeOpacity=".72" />
            {complete ? <path d="m-8 0 5 5 11-12" fill="none" stroke="#b8f36b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /> : <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#65a8ff" />}
            <text y="52" fill="#a9b5c3" textAnchor="middle" fontSize="10" fontFamily="monospace">{complete ? "RECEIPT" : "AURORA-05"}</text>
          </g>
          {scene >= 2 && scene < 5 && <circle cx={scene < 4 ? 230 : 417} cy={scene < 4 ? 184 : 179} r="4" fill="#f4f7f9" />}
        </svg>

        <div className="absolute inset-x-3 bottom-3 z-10 rounded-xl border border-white/[0.08] bg-[#0a0e14]/90 p-3 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active.label} initial={reduceMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -4 }} transition={{ duration: 0.22 }}>
                <p className="text-xs font-medium text-white">{active.label}</p>
                <p className="mono mt-1 text-[0.58rem] uppercase tracking-[0.08em] text-[#7f8d9c]">{active.detail}</p>
              </motion.div>
            </AnimatePresence>
            <span className="mono text-xs text-[#b8f36b]">{active.progress}%</span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-[#65a8ff] to-[#b8f36b]" animate={{ width: `${active.progress}%` }} transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }} />
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3 px-1">
        <div className="flex min-w-0 items-center gap-2 text-[0.66rem] text-[#7f8d9c]">
          {complete ? <ShieldCheck aria-hidden="true" size={14} className="text-[#b8f36b]" /> : failed ? <CircleStop aria-hidden="true" size={14} className="text-[#ff6b6b]" /> : <Check aria-hidden="true" size={14} className="text-[#65a8ff]" />}
          <span className="truncate">{complete ? "Receipt chain verified" : "Checkpoint mirror armed"}</span>
        </div>
        <button type="button" onClick={playing ? () => setPlaying(false) : complete ? start : () => setPlaying(true)} className="button-secondary min-h-10 px-3 py-2 text-[0.68rem]" aria-label={playing ? "Pause network story" : complete ? "Replay network story" : "Play network story"}>
          {complete ? <RotateCcw aria-hidden="true" size={14} /> : playing ? <CircleStop aria-hidden="true" size={14} /> : <Play aria-hidden="true" size={14} fill="currentColor" />}
          {complete ? "Replay" : playing ? "Pause" : "Run failure test"}
        </button>
      </div>
    </div>
  );
}
