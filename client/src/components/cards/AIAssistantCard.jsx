import React from 'react'
import { Sparkles, Gauge, ChevronRight } from 'lucide-react'

export default function AIAssistantCard({ insight, onAsk }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-navy-700/40 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-800 p-5 text-white shadow-pop">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-accent-400/10 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/20 text-accent-300 ring-1 ring-inset ring-accent-400/30">
            <Sparkles className="h-4.5 w-4.5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-semibold">AI Fleet Assistant</p>
            <p className="text-xs text-white/50">Predictive maintenance insight</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-accent-200">
          {insight.confidence}% confidence
        </span>
      </div>

      <div className="relative mt-4 rounded-xl bg-white/5 p-3.5 ring-1 ring-inset ring-white/10">
        <p className="text-sm leading-relaxed text-white/90">{insight.headline}</p>
      </div>

      <ul className="relative mt-3.5 flex flex-col gap-2">
        {insight.supportingPoints.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-white/60">
            <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-accent-400" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-4 border-t border-white/10 pt-3.5">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-white/40">
          <Gauge className="h-3 w-3" />
          Other predictions
        </p>
        <ul className="flex flex-col gap-2">
          {insight.secondaryPredictions.map((p) => (
            <li key={p.vehicle} className="flex items-center gap-2 text-xs text-white/70">
              <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-accent-200">
                {p.vehicle}
              </span>
              <span className="truncate">{p.message}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onAsk}
        className="relative mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/10 py-2 text-xs font-medium text-white transition-colors hover:bg-white/15"
      >
        Ask the fleet assistant
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
