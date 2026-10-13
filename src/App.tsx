import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Flame,
  Film,
  Scissors,
  CheckCircle2,
  Share2,
  Download,
  Layers,
  Sliders,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Header } from "./components/Header";
import { VideoUploader } from "./components/VideoUploader";
import { ViralClipCard } from "./components/ViralClipCard";
import { ClipPlayer } from "./components/ClipPlayer";
import { TimelineTrimmer } from "./components/TimelineTrimmer";
import { StyleEditor } from "./components/StyleEditor";
import { CaptionEditor } from "./components/CaptionEditor";
import { ViralityAuditModal } from "./components/ViralityAuditModal";
import { ExportModal } from "./components/ExportModal";
import { ClipData, EditingSettings, CaptionWord } from "./types";
import { generateSmartFallbackClips } from "./utils/fallbackMoments";

export default function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<number>(0);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [clips, setClips] = useState<ClipData[]>([]);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCaptionEditorOpen, setIsCaptionEditorOpen] = useState<boolean>(false);
  const [auditClip, setAuditClip] = useState<ClipData | null>(null);

  // Editing Settings (Defaulted to classic viral standard raw style)
  const [settings, setSettings] = useState<EditingSettings>({
    aspectRatio: "9:16",
    cropMode: "center-fill",
    captionStyle: "hormozi-yellow",
    captionPosition: "bottom",
    captionSize: "medium",
    showHookHeadline: true,
    hookHeadlineText: "",
    hookHeadlineStyle: "yellow-highlighter",
    showProgressBar: true,
    progressBarColor: "#ef4444",
    showSpeakerTag: false,
    speakerTag: "",
    zoomPunchEnabled: true,
    audioBoost: true,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Active clip object
  const activeClip = clips.find((c) => c.id === activeClipId) || clips[0] || null;

  // Sync hook headline text when active clip changes
  useEffect(() => {
    if (activeClip) {
      setSettings((prev) => ({
        ...prev,
        hookHeadlineText: activeClip.hookHeadline,
      }));
      setCurrentTime(activeClip.startTime);
      if (videoRef.current) {
        videoRef.current.currentTime = activeClip.startTime;
      }
    }
  }, [activeClipId]);

  // Video selection callback from uploader
  const handleVideoSelected = (
    file: File | null,
    url: string,
    title: string,
    duration: number
  ) => {
    setVideoFile(file);
    setVideoUrl(url);
    setVideoTitle(title);
    setVideoDuration(duration);
    setClips([]);
    setActiveClipId(null);
  };

  // Automated Viral Moment Detection & Clipping
  const handleAutoClip = async (
    title: string,
    duration: number,
    transcript?: string
  ) => {
    setIsAnalyzing(true);
    setAnalysisStep("Scanning speech cadence & audio amplitude spikes...");

    try {
      setTimeout(() => {
        setAnalysisStep("AI calculating 3-second hook retention & virality curves...");
      }, 1000);

      setTimeout(() => {
        setAnalysisStep("Applying standard raw 9:16 vertical crop & Hormozi captions...");
      }, 2200);

      const response = await fetch("/api/find-viral-moments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: title,
          videoDuration: duration,
          transcript,
          targetClipCount: 3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data?.clips && resData.data.clips.length > 0) {
        const foundClips: ClipData[] = resData.data.clips;
        setClips(foundClips);
        setActiveClipId(foundClips[0].id);
      } else {
        const fallbackClips = generateSmartFallbackClips(title, duration, "raw-podcast");
        setClips(fallbackClips);
        setActiveClipId(fallbackClips[0].id);
      }
    } catch (err) {
      console.warn("Auto clip network/server warning, using high-retention fallback:", err);
      const fallbackClips = generateSmartFallbackClips(title, duration, "raw-podcast");
      setClips(fallbackClips);
      if (fallbackClips.length > 0) {
        setActiveClipId(fallbackClips[0].id);
      }
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  };

  // Trimmer updates start / end of current clip
  const handleUpdateRange = (newStart: number, newEnd: number) => {
    if (!activeClipId) return;
    setClips((prev) =>
      prev.map((c) =>
        c.id === activeClipId
          ? {
              ...c,
              startTime: newStart,
              endTime: newEnd,
              duration: +(newEnd - newStart).toFixed(1),
            }
          : c
      )
    );
  };

  // Save edited caption words
  const handleSaveCaptions = (newCaptions: CaptionWord[]) => {
    if (!activeClipId) return;
    setClips((prev) =>
      prev.map((c) =>
        c.id === activeClipId ? { ...c, captions: newCaptions } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* App Header */}
      <Header
        onNewVideo={() => {
          setVideoUrl("");
          setClips([]);
          setActiveClipId(null);
        }}
        onExport={() => setIsExportOpen(true)}
        hasActiveClip={Boolean(activeClip)}
        videoLoaded={Boolean(videoUrl)}
      />

      <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
        {/* State 1: Upload or Initial Full Video selection */}
        {!videoUrl || clips.length === 0 ? (
          <div className="py-6 sm:py-10">
            <VideoUploader
              onVideoSelected={handleVideoSelected}
              onAutoClip={handleAutoClip}
              isAnalyzing={isAnalyzing}
              analysisStep={analysisStep}
            />
          </div>
        ) : (
          /* State 2: Full Interactive Viral Clipping Studio */
          <div className="space-y-6">
            {/* Top Bar Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Flame className="w-5 h-5 fill-rose-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm sm:text-base">
                      {videoTitle || "Uploaded Video"}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {clips.length} Viral Moments Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any moment below to preview, fine-tune the raw look, or export in 9:16 vertical format.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-rose-950/40 flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Active Clip</span>
                </button>
              </div>
            </div>

            {/* Main Studio 3-Column / Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Viral Moments Queue (4 cols) */}
              <div className="lg:col-span-4 space-y-3.5 order-2 lg:order-1">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Viral Moment Cuts ({clips.length})
                  </h3>
                  <span className="text-[11px] text-slate-500">Ranked by virality</span>
                </div>

                <div className="space-y-3">
                  {clips.map((clip) => (
                    <ViralClipCard
                      key={clip.id}
                      clip={clip}
                      isActive={activeClip?.id === clip.id}
                      onSelect={(c) => setActiveClipId(c.id)}
                      onOpenAudit={(c) => setAuditClip(c)}
                    />
                  ))}
                </div>

                {/* Audit helper banner */}
                {activeClip && (
                  <div
                    onClick={() => setAuditClip(activeClip)}
                    className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-slate-300">
                        View Virality Audit for "{activeClip.title}"
                      </span>
                    </div>
                    <span className="font-bold text-amber-400">
                      {activeClip.viralityScore}% ➔
                    </span>
                  </div>
                )}
              </div>

              {/* Center Column: Live Preview Player & Timeline Trimmer (5 cols) */}
              <div className="lg:col-span-5 space-y-4 order-1 lg:order-2 flex flex-col items-center">
                {activeClip ? (
                  <>
                    <ClipPlayer
                      videoUrl={videoUrl}
                      clip={activeClip}
                      settings={settings}
                      currentTime={currentTime}
                      onTimeUpdate={(t) => setCurrentTime(t)}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      videoRef={videoRef}
                    />

                    {/* Timeline Trimmer */}
                    <div className="w-full">
                      <TimelineTrimmer
                        clip={activeClip}
                        totalDuration={videoDuration}
                        currentTime={currentTime}
                        onUpdateRange={handleUpdateRange}
                        onSeek={(t) => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = t;
                            setCurrentTime(t);
                          }
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    No clip selected.
                  </div>
                )}
              </div>

              {/* Right Column: Style & Raw Polish Editor (3 cols) */}
              <div className="lg:col-span-3 space-y-4 order-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-rose-400" />
                    Standard & Raw Polish
                  </h3>
                  <span className="text-[11px] text-rose-400 font-bold">Auto-Applied</span>
                </div>

                <StyleEditor
                  settings={settings}
                  onChange={setSettings}
                  onOpenCaptionEditor={() => setIsCaptionEditorOpen(true)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Subtitles & Words Modal */}
      {activeClip && (
        <CaptionEditor
          clip={activeClip}
          isOpen={isCaptionEditorOpen}
          onClose={() => setIsCaptionEditorOpen(false)}
          onSaveCaptions={handleSaveCaptions}
        />
      )}

      {/* Virality Audit Modal */}
      <ViralityAuditModal
        clip={auditClip}
        isOpen={Boolean(auditClip)}
        onClose={() => setAuditClip(null)}
      />

      {/* Export & Render Modal */}
      {activeClip && (
        <ExportModal
          clip={activeClip}
          settings={settings}
          videoUrl={videoUrl}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
