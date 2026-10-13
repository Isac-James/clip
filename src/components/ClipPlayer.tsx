import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Repeat,
  Zap,
  Sparkles,
} from "lucide-react";
import { ClipData, EditingSettings, CaptionWord } from "../types";

interface ClipPlayerProps {
  videoUrl: string;
  clip: ClipData;
  settings: EditingSettings;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const ClipPlayer: React.FC<ClipPlayerProps> = ({
  videoUrl,
  clip,
  settings,
  currentTime,
  onTimeUpdate,
  isPlaying,
  setIsPlaying,
  videoRef,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  // Calculate time relative to clip start
  const clipDuration = Math.max(1, clip.endTime - clip.startTime);
  const relativeTime = Math.max(0, Math.min(clipDuration, currentTime - clip.startTime));
  const progressPercent = Math.min(100, Math.max(0, (relativeTime / clipDuration) * 100));

  // Determine current active caption card
  const activeCaption = useMemo(() => {
    if (!clip.captions || clip.captions.length === 0) return null;
    return clip.captions.find(
      (c) => relativeTime >= c.start && relativeTime <= c.end
    );
  }, [clip.captions, relativeTime]);

  // Handle play / pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // If we are at the end, rewind to start of clip
      if (videoRef.current.currentTime >= clip.endTime - 0.2) {
        videoRef.current.currentTime = clip.startTime;
      }
      videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  // Rewind to start of clip
  const rewindToStart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = clip.startTime;
    onTimeUpdate(clip.startTime);
  };

  // Jump to 3-second hook
  const jumpToHook = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(clip.endTime - 1, clip.startTime + 2.5);
    onTimeUpdate(videoRef.current.currentTime);
  };

  // Keep background blurred video in sync if in blurred-glass mode
  useEffect(() => {
    if (settings.cropMode === "blurred-glass" && backgroundVideoRef.current && videoRef.current) {
      backgroundVideoRef.current.currentTime = videoRef.current.currentTime;
      if (isPlaying) {
        backgroundVideoRef.current.play().catch(() => {});
      } else {
        backgroundVideoRef.current.pause();
      }
    }
  }, [isPlaying, currentTime, settings.cropMode]);

  // Handle video time updates and loop clamp
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;

    if (time >= clip.endTime) {
      if (isLooping) {
        videoRef.current.currentTime = clip.startTime;
        onTimeUpdate(clip.startTime);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        onTimeUpdate(clip.endTime);
      }
      return;
    }

    if (time < clip.startTime) {
      videoRef.current.currentTime = clip.startTime;
      onTimeUpdate(clip.startTime);
      return;
    }

    onTimeUpdate(time);
  };

  // Handle manual scrub
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRelative = parseFloat(e.target.value);
    const newAbsTime = clip.startTime + newRelative;
    if (videoRef.current) {
      videoRef.current.currentTime = newAbsTime;
      onTimeUpdate(newAbsTime);
    }
  };

  // Check if zoom punch is triggered at current timestamp
  const isZoomPunched = useMemo(() => {
    if (!settings.zoomPunchEnabled || !clip.zoomPunchMoments) return false;
    return clip.zoomPunchMoments.some(
      (punch) => Math.abs(relativeTime - punch) < 0.6
    );
  }, [settings.zoomPunchEnabled, clip.zoomPunchMoments, relativeTime]);

  // Aspect ratio wrapper classes
  const aspectClass = useMemo(() => {
    switch (settings.aspectRatio) {
      case "9:16":
        return "aspect-[9/16] max-w-[340px] sm:max-w-[380px]";
      case "1:1":
        return "aspect-square max-w-[420px]";
      case "16:9":
        return "aspect-[16/9] max-w-[580px]";
      case "4:5":
        return "aspect-[4/5] max-w-[380px]";
      default:
        return "aspect-[9/16] max-w-[360px]";
    }
  }, [settings.aspectRatio]);

  // Hook Headline styling
  const renderHookHeadline = () => {
    if (!settings.showHookHeadline) return null;
    const text = settings.hookHeadlineText || clip.hookHeadline;

    switch (settings.hookHeadlineStyle) {
      case "yellow-highlighter":
        return (
          <div className="mx-auto text-center px-3 py-1.5 rounded-lg bg-amber-400 text-black font-black uppercase text-xs sm:text-sm font-viral tracking-wider shadow-2xl shadow-black/80 ring-2 ring-black">
            {text}
          </div>
        );
      case "red-badge":
        return (
          <div className="mx-auto text-center px-3 py-1.5 rounded-lg bg-rose-600 text-white font-black uppercase text-xs sm:text-sm font-viral tracking-wider shadow-2xl shadow-black/80 ring-2 ring-black">
            🚨 {text}
          </div>
        );
      case "dark-glass":
        return (
          <div className="mx-auto text-center px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white font-black uppercase text-xs sm:text-sm tracking-wide border border-white/20 shadow-2xl">
            {text}
          </div>
        );
      case "raw-text":
      default:
        return (
          <div className="mx-auto text-center px-2 py-1 text-white font-black uppercase text-sm sm:text-base font-viral tracking-wider text-stroke-md">
            {text}
          </div>
        );
    }
  };

  // Caption font styling
  const renderSubtitles = () => {
    if (!activeCaption) return null;

    let positionClass = "bottom-1/4";
    if (settings.captionPosition === "middle") positionClass = "top-1/2 -translate-y-1/2";
    if (settings.captionPosition === "top") positionClass = "top-20";
    if (settings.captionPosition === "bottom") positionClass = "bottom-16";

    let sizeClass = "text-xl sm:text-2xl";
    if (settings.captionSize === "small") sizeClass = "text-base sm:text-lg";
    if (settings.captionSize === "large") sizeClass = "text-2xl sm:text-3xl";

    const isEmphasis = activeCaption.emphasis;

    switch (settings.captionStyle) {
      case "hormozi-yellow":
        return (
          <div
            className={`absolute left-0 right-0 ${positionClass} px-4 flex justify-center pointer-events-none transition-all duration-100 z-20`}
          >
            <div
              className={`font-viral uppercase ${sizeClass} tracking-wide text-stroke-md transform ${
                isEmphasis ? "scale-110 text-amber-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]" : "text-white"
              } transition-transform`}
            >
              {activeCaption.text}
            </div>
          </div>
        );

      case "neon-cyber":
        return (
          <div
            className={`absolute left-0 right-0 ${positionClass} px-4 flex justify-center pointer-events-none transition-all duration-100 z-20`}
          >
            <div
              className={`font-viral uppercase ${sizeClass} tracking-wide text-stroke-sm transform ${
                isEmphasis
                  ? "scale-110 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]"
                  : "text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.7)]"
              }`}
            >
              {activeCaption.text}
            </div>
          </div>
        );

      case "karaoke-pop":
        return (
          <div
            className={`absolute left-0 right-0 ${positionClass} px-4 flex justify-center pointer-events-none transition-all duration-100 z-20`}
          >
            <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-2xl">
              <span
                className={`font-black uppercase ${sizeClass} font-viral ${
                  isEmphasis ? "text-rose-400 text-stroke-sm" : "text-amber-300 text-stroke-sm"
                }`}
              >
                {activeCaption.text}
              </span>
            </div>
          </div>
        );

      case "submagic-box":
        return (
          <div
            className={`absolute left-0 right-0 ${positionClass} px-4 flex justify-center pointer-events-none transition-all duration-100 z-20`}
          >
            <div className="bg-amber-400 text-slate-950 font-black font-viral uppercase px-3 py-1 rounded-md shadow-2xl text-lg sm:text-xl tracking-wider ring-2 ring-black">
              {activeCaption.text} 🔥
            </div>
          </div>
        );

      case "raw-clean":
      default:
        return (
          <div
            className={`absolute left-0 right-0 ${positionClass} px-4 flex justify-center pointer-events-none transition-all duration-100 z-20`}
          >
            <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span className={`font-bold text-white ${sizeClass} tracking-tight`}>
                {activeCaption.text}
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center w-full space-y-4"
    >
      {/* Live Video Box */}
      <div
        onClick={togglePlay}
        className={`relative ${aspectClass} w-full rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-slate-800 cursor-pointer select-none group transition-transform duration-300 ${
          isZoomPunched ? "scale-[1.04]" : "scale-100"
        }`}
      >
        {/* Layer 1: Blurred Ambient Background (when cropMode is blurred-glass) */}
        {settings.cropMode === "blurred-glass" && (
          <div className="absolute inset-0 overflow-hidden z-0">
            <video
              ref={backgroundVideoRef}
              src={videoUrl}
              muted
              playsInline
              className="w-full h-full object-cover blur-xl scale-125 opacity-70 filter"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* Layer 2: Main Active Video */}
        <div
          className={`relative w-full h-full flex items-center justify-center z-10 ${
            settings.cropMode === "center-fill"
              ? "overflow-hidden"
              : settings.cropMode === "letterbox"
              ? "bg-black"
              : ""
          }`}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            className={`w-full h-full transition-transform duration-200 ${
              settings.cropMode === "center-fill"
                ? "object-cover scale-105"
                : settings.cropMode === "blurred-glass"
                ? "object-contain p-1"
                : "object-contain"
            }`}
          />
        </div>

        {/* Layer 3: Burned-in Top Hook Headline */}
        {settings.showHookHeadline && (
          <div className="absolute top-4 left-0 right-0 px-4 z-20 pointer-events-none">
            {renderHookHeadline()}
          </div>
        )}

        {/* Layer 4: Speaker Tag Badge */}
        {settings.showSpeakerTag && settings.speakerTag && (
          <div className="absolute top-16 left-3 z-20 pointer-events-none">
            <div className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-slate-700/80">
              🎙️ {settings.speakerTag}
            </div>
          </div>
        )}

        {/* Layer 5: Live Subtitles Card */}
        {renderSubtitles()}

        {/* Layer 6: Retention Progress Bar */}
        {settings.showProgressBar && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50 z-20 pointer-events-none">
            <div
              className="h-full transition-all duration-75"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: settings.progressBarColor || "#ef4444",
              }}
            />
          </div>
        )}

        {/* Layer 7: Hover Play/Pause Overlay Icon */}
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl text-white transform group-hover:scale-105 transition-transform">
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white translate-x-0.5" />
            )}
          </div>
        </div>
      </div>

      {/* Scrub Bar & Timecodes */}
      <div className="w-full max-w-md px-2 space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max={clipDuration}
            step="0.05"
            value={relativeTime}
            onChange={handleScrub}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{relativeTime.toFixed(1)}s</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Duration:</span>
            <span className="text-slate-200 font-bold">{clipDuration.toFixed(1)}s</span>
          </div>
          <span>{clipDuration.toFixed(1)}s</span>
        </div>

        {/* Media Controls Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={rewindToStart}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Rewind to Clip Start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={jumpToHook}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-xs flex items-center gap-1 border border-amber-500/30 transition"
              title="Jump to the 3-second hook"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-300" />
              <span>Hook (3s)</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 rounded-lg transition ${
                isLooping
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
              title={isLooping ? "Looping Enabled" : "Looping Disabled"}
            >
              <Repeat className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
