import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Sparkles,
  Film,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  FileVideo,
  AlertCircle
} from "lucide-react";
import { SampleVideo } from "../types";
import { SAMPLE_VIDEOS } from "../constants/samples";

interface VideoUploaderProps {
  onVideoSelected: (file: File | null, url: string, title: string, duration: number) => void;
  onAutoClip: (title: string, duration: number, transcript?: string) => void;
  isAnalyzing: boolean;
  analysisStep: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoSelected,
  onAutoClip,
  isAnalyzing,
  analysisStep,
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleVideo | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [userTranscript, setUserTranscript] = useState<string>("");
  const [showAdvancedTranscript, setShowAdvancedTranscript] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file (.mp4, .webm, .mov).");
      return;
    }

    setUploadedFile(file);
    setSelectedSample(null);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setVideoTitle(cleanName);

    // Read duration
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      const dur = tempVideo.duration || 120;
      setVideoDuration(dur);
      onVideoSelected(file, url, cleanName, dur);
    };
  };

  const handleSelectSample = (sample: SampleVideo) => {
    setSelectedSample(sample);
    setUploadedFile(null);
    setVideoPreviewUrl(sample.url);
    setVideoTitle(sample.title);
    setVideoDuration(sample.duration);
    onVideoSelected(null, sample.url, sample.title, sample.duration);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleStartAutoClip = () => {
    if (!videoPreviewUrl) return;
    onAutoClip(videoTitle || "Uploaded Video", videoDuration || 120, userTranscript);
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Value Proposition */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>AI Viral Moment Detector & Raw Editor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
          Upload Full Video. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-orange-400">
            We Find Viral Moments & Do All The Work.
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Drop in a full podcast, debate, interview, or stream. The AI detects high-retention spikes,
          clips them, reframes to 9:16 vertical, burns in raw Hormozi-style subtitles, and generates top hooks.
        </p>
      </div>

      {/* Main Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !videoPreviewUrl && fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
          isDragOver
            ? "border-rose-500 bg-rose-950/20 scale-[1.01]"
            : videoPreviewUrl
            ? "border-slate-700 bg-slate-900/60"
            : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/40 cursor-pointer"
        } p-6 sm:p-8`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {!videoPreviewUrl ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8 text-rose-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-bold text-white">
                Drag and drop your full video here
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                Supports MP4, WebM, MOV, or M4V (up to full podcasts & hour-long videos)
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-600 transition shadow"
            >
              Browse Local Files
            </button>
          </div>
        ) : (
          /* Video Selected Info Card */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <FileVideo className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base truncate max-w-md">
                    {videoTitle || "Selected Video"}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {formatDuration(videoDuration)} duration
                    </span>
                    {uploadedFile && (
                      <span>{(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                    )}
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Video Ready
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
              >
                Choose another file
              </button>
            </div>

            {/* Video preview player */}
            <div className="aspect-video max-h-56 w-full rounded-xl overflow-hidden bg-black border border-slate-800">
              <video
                src={videoPreviewUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>

            {/* Optional transcript hint expander */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedTranscript(!showAdvancedTranscript)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition"
              >
                <span>{showAdvancedTranscript ? "Hide" : "+ Add"} transcript or topic context (optional)</span>
              </button>
              {showAdvancedTranscript && (
                <div className="mt-2">
                  <textarea
                    value={userTranscript}
                    onChange={(e) => setUserTranscript(e.target.value)}
                    placeholder="Paste full transcript, key topics, or speaker dialogue here to help the AI pinpoint exact viral quotes..."
                    rows={3}
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 p-3 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}
            </div>

            {/* BIG ACTION BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={handleStartAutoClip}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-base tracking-wide shadow-xl shadow-rose-950/50 flex items-center justify-center gap-3 transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{analysisStep || "AI is finding viral moments..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 fill-white stroke-none" />
                    <span>FIND VIRAL MOMENTS & AUTO-CLIP NOW</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Stepper Feedback (when working) */}
      {isAnalyzing && (
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-5 space-y-3 animate-pulse-subtle">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Automated Viral Clipping Engine in Progress
            </span>
            <span className="text-slate-400">Please wait 3-5 seconds</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full w-3/4 animate-pulse rounded-full" />
          </div>
          <p className="text-xs text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {analysisStep}
          </p>
        </div>
      )}

      {/* Instant Samples Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            Or 1-Click Test With Sample Footage
          </h2>
          <span className="text-[11px] text-slate-500">Ready to clip instantly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_VIDEOS.map((sample) => {
            const isSelected = selectedSample?.id === sample.id;
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`group rounded-xl border p-3 cursor-pointer transition text-left flex gap-3 items-center ${
                  isSelected
                    ? "border-rose-500 bg-rose-950/20 ring-1 ring-rose-500"
                    : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80"
                }`}
              >
                <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                  <img
                    src={sample.thumbnail}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.2 rounded text-[9px] font-bold text-slate-200">
                    {formatDuration(sample.duration)}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate group-hover:text-rose-300 transition">
                    {sample.title}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {sample.description}
                  </p>
                  <span className="inline-block mt-1 text-[10px] text-amber-400 font-semibold">
                    ✨ 3 Viral Moments
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
