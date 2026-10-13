import React from "react";
import { Scissors, Sparkles, Download, RefreshCw, Film } from "lucide-react";

interface HeaderProps {
  onNewVideo: () => void;
  onExport: () => void;
  hasActiveClip: boolean;
  videoLoaded: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewVideo,
  onExport,
  hasActiveClip,
  videoLoaded,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand logo & tagline */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40 ring-1 ring-white/20">
          <Scissors className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              RawClip <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300 font-black">AI</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              VIRAL CLIPPER
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Upload full video • Auto-find viral moments • Standard raw edit
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2.5">
        {videoLoaded && (
          <button
            onClick={onNewVideo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Change</span> Video
          </button>
        )}

        {hasActiveClip && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-md shadow-rose-900/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export MP4 Clip</span>
          </button>
        )}
      </div>
    </header>
  );
};
