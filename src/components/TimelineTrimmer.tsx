import React, { useMemo } from "react";
import { Scissors, Clock, Zap, ArrowLeft, ArrowRight } from "lucide-react";
import { ClipData } from "../types";

interface TimelineTrimmerProps {
  clip: ClipData;
  totalDuration: number;
  currentTime: number;
  onUpdateRange: (startTime: number, endTime: number) => void;
  onSeek: (time: number) => void;
}

export const TimelineTrimmer: React.FC<TimelineTrimmerProps> = ({
  clip,
  totalDuration,
  currentTime,
  onUpdateRange,
  onSeek,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = (secs % 60).toFixed(1);
    return `${mins}:${parseFloat(rem) < 10 ? "0" : ""}${rem}`;
  };

  const clipDuration = Math.max(1, clip.endTime - clip.startTime);

  // Generate simulated audio speech waveform peaks for the timeline
  const waveformBars = useMemo(() => {
    const barsCount = 60;
    const bars = [];
    for (let i = 0; i < barsCount; i++) {
      // Deterministic speech energy pattern
      const factor = Math.sin(i * 0.4) * Math.cos(i * 0.25);
      const height = Math.max(20, Math.min(95, Math.floor(45 + factor * 40 + ((i % 5) * 8))));
      bars.push(height);
    }
    return bars;
  }, []);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = parseFloat(e.target.value);
    if (newStart < clip.endTime - 2) {
      onUpdateRange(newStart, clip.endTime);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = parseFloat(e.target.value);
    if (newEnd > clip.startTime + 2) {
      onUpdateRange(clip.startTime, newEnd);
    }
  };

  const nudgeStart = (delta: number) => {
    const newStart = Math.max(0, Math.min(clip.endTime - 2, clip.startTime + delta));
    onUpdateRange(newStart, clip.endTime);
    onSeek(newStart);
  };

  const nudgeEnd = (delta: number) => {
    const newEnd = Math.min(totalDuration, Math.max(clip.startTime + 2, clip.endTime + delta));
    onUpdateRange(clip.startTime, newEnd);
  };

  // Percentages relative to total video duration
  const startPercent = Math.max(0, Math.min(100, (clip.startTime / totalDuration) * 100));
  const endPercent = Math.max(0, Math.min(100, (clip.endTime / totalDuration) * 100));
  const playheadPercent = Math.max(0, Math.min(100, (currentTime / totalDuration) * 100));

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-rose-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
            Smart Clip Trimmer & Audio Waveform
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">
            Selected: <strong className="text-white">{clipDuration.toFixed(1)}s</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            Optimal Viral Length
          </span>
        </div>
      </div>

      {/* Visual Timeline Track */}
      <div className="relative h-20 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 select-none">
        {/* Waveform Bars Background */}
        <div className="absolute inset-0 flex items-center justify-between px-2 gap-0.5 opacity-30">
          {waveformBars.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-slate-400 rounded-full transition-all"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {/* Selected Window Highlight */}
        <div
          className="absolute top-0 bottom-0 bg-rose-500/15 border-l-2 border-r-2 border-rose-500 transition-all"
          style={{
            left: `${startPercent}%`,
            width: `${Math.max(2, endPercent - startPercent)}%`,
          }}
        >
          {/* 3-Second Hook Zone Marker */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-amber-400/20 border-r border-dashed border-amber-400 flex items-start justify-start p-1"
            style={{
              width: `${Math.min(100, (3 / clipDuration) * 100)}%`,
            }}
          >
            <span className="text-[9px] font-black uppercase text-amber-300 flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-current" /> Hook (3s)
            </span>
          </div>
        </div>

        {/* Playhead Marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_white] z-20 pointer-events-none transition-all duration-75"
          style={{ left: `${playheadPercent}%` }}
        >
          <div className="w-3 h-3 rounded-full bg-white -ml-[5px] -mt-1 shadow" />
        </div>

        {/* Sliders for precision dragging */}
        <div className="absolute inset-x-0 bottom-1 flex items-center px-1 z-30 pointer-events-none">
          <input
            type="range"
            min="0"
            max={totalDuration}
            step="0.1"
            value={clip.startTime}
            onChange={handleStartChange}
            className="w-full absolute inset-0 opacity-0 cursor-ew-resize pointer-events-auto"
          />
          <input
            type="range"
            min="0"
            max={totalDuration}
            step="0.1"
            value={clip.endTime}
            onChange={handleEndChange}
            className="w-full absolute inset-0 opacity-0 cursor-ew-resize pointer-events-auto"
          />
        </div>
      </div>

      {/* Nudge Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Start:</span>
          <button
            onClick={() => nudgeStart(-0.5)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            -0.5s
          </button>
          <span className="font-mono text-white font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {formatTime(clip.startTime)}
          </span>
          <button
            onClick={() => nudgeStart(0.5)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            +0.5s
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">End:</span>
          <button
            onClick={() => nudgeEnd(-0.5)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            -0.5s
          </button>
          <span className="font-mono text-white font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {formatTime(clip.endTime)}
          </span>
          <button
            onClick={() => nudgeEnd(0.5)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            +0.5s
          </button>
        </div>
      </div>
    </div>
  );
};
