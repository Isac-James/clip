import React, { useState } from "react";
import { X, Flame, Sparkles, TrendingUp, Copy, Check, Share2, ShieldCheck } from "lucide-react";
import { ClipData } from "../types";

interface ViralityAuditModalProps {
  clip: ClipData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViralityAuditModal: React.FC<ViralityAuditModalProps> = ({
  clip,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !clip) return null;

  const handleCopy = () => {
    const text = `${clip.socialCopy.caption}\n\n${clip.socialCopy.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { viralityBreakdown } = clip;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Virality Potential Audit
              </h3>
              <p className="text-xs text-slate-400">
                AI evaluation for "{clip.hookHeadline}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Virality Score Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">
                Estimated Virality Score
              </span>
              <h4 className="text-2xl font-black text-white mt-0.5">
                {clip.viralityScore}/100 <span className="text-xs text-amber-400 font-bold ml-1">TOP 2% TIKTOK TIER</span>
              </h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-black text-lg border border-rose-500/30">
              🔥
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Retention & Algorithm Pillars
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Hook Strength (0-3s)</span>
                  <span className="font-bold text-amber-400">{viralityBreakdown.hookScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${viralityBreakdown.hookScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Retention Potential</span>
                  <span className="font-bold text-emerald-400">{viralityBreakdown.retentionPotential}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${viralityBreakdown.retentionPotential}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Emotional Spike</span>
                  <span className="font-bold text-rose-400">{viralityBreakdown.emotionalSpike}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-400 h-full rounded-full"
                    style={{ width: `${viralityBreakdown.emotionalSpike}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Curiosity Gap</span>
                  <span className="font-bold text-cyan-400">{viralityBreakdown.curiosityGap}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full"
                    style={{ width: `${viralityBreakdown.curiosityGap}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Viral Trigger Breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Why The Algorithm Will Push This
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {clip.whyViral}
            </p>
          </div>

          {/* Ready-to-Post Copy & Hashtags */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Ready-to-Post Caption & Hashtags
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-200 bg-slate-900 p-2.5 rounded-lg font-mono">
              {clip.socialCopy.caption}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {clip.socialCopy.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-rose-300 font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
