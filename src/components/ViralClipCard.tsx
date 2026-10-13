import React from "react";
import { Flame, Clock, Play, TrendingUp, Sparkles, Check, Share2, Info } from "lucide-react";
import { ClipData } from "../types";

interface ViralClipCardProps {
  clip: ClipData;
  isActive: boolean;
  onSelect: (clip: ClipData) => void;
  onOpenAudit: (clip: ClipData) => void;
}

export const ViralClipCard: React.FC<ViralClipCardProps> = ({
  clip,
  isActive,
  onSelect,
  onOpenAudit,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "from-rose-500 to-amber-500 text-rose-300 border-rose-500/40";
    if (score >= 90) return "from-amber-500 to-yellow-500 text-amber-300 border-amber-500/40";
    return "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/40";
  };

  return (
    <div
      onClick={() => onSelect(clip)}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-4 ${
        isActive
          ? "border-rose-500 bg-slate-900/90 shadow-xl shadow-rose-950/30 ring-1 ring-rose-500"
          : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60"
      }`}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500" />
      )}

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1 bg-slate-800 border ${
              clip.rank === 1
                ? "border-amber-500/50 text-amber-300"
                : "border-slate-700 text-slate-300"
            }`}
          >
            {clip.rank === 1 ? "🏆 #1 Viral Pick" : `#${clip.rank} Viral Cut`}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {clip.bestPlatform}
          </span>
        </div>

        {/* Virality Score Pill */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border bg-gradient-to-r ${getScoreColor(
            clip.viralityScore
          )} bg-opacity-10`}
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{clip.viralityScore}/100</span>
        </div>
      </div>

      {/* Hook Headline Banner */}
      <div className="mb-2">
        <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-200 transition line-clamp-2">
          {clip.hookHeadline}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
          {clip.title}
        </p>
      </div>

      {/* Why it's Viral Insight */}
      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-3 text-[11px] text-slate-300 line-clamp-2">
        <span className="font-bold text-amber-300 mr-1">Viral Trigger:</span>
        {clip.whyViral}
      </div>

      {/* Footer Info & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
          </span>
          <span className="text-slate-600">•</span>
          <span className="font-semibold text-slate-300">{clip.duration}s</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAudit(clip);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Virality Score Breakdown"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          <span
            className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition ${
              isActive
                ? "bg-rose-500 text-white"
                : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            {isActive ? "Editing" : "Select"}
          </span>
        </div>
      </div>
    </div>
  );
};
