import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Download,
  Film,
  FileText,
  CheckCircle2,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Smartphone,
} from "lucide-react";
import { ClipData, EditingSettings } from "../types";
import { getDefaultFallbackCaptions } from "../utils/fallbackMoments";

interface ExportModalProps {
  clip: ClipData;
  settings: EditingSettings;
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  clip,
  settings,
  videoUrl,
  isOpen,
  onClose,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string>("");
  const [copiedCaption, setCopiedCaption] = useState(false);

  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  if (!isOpen) return null;

  const clipDuration = Math.max(1, clip.endTime - clip.startTime);

  // Generate SRT subtitles string
  const generateSrt = () => {
    let srt = "";
    const effectiveCaptions = (clip.captions && clip.captions.length > 0)
      ? clip.captions
      : getDefaultFallbackCaptions(clipDuration);

    effectiveCaptions.forEach((card, index) => {
      const startMs = Math.floor(card.start * 1000);
      const endMs = Math.floor(card.end * 1000);

      const formatSrtTime = (ms: number) => {
        const hrs = Math.floor(ms / 3600000);
        const mins = Math.floor((ms % 3600000) / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        const millis = ms % 1000;
        return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(
          secs
        ).padStart(2, "0")},${String(millis).padStart(3, "0")}`;
      };

      srt += `${index + 1}\n`;
      srt += `${formatSrtTime(startMs)} --> ${formatSrtTime(endMs)}\n`;
      srt += `${card.text}\n\n`;
    });
    return srt;
  };

  const handleDownloadSrt = () => {
    const srtData = generateSrt();
    const blob = new Blob([srtData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${clip.title.replace(/\s+/g, "_")}_subtitles.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render & Record the video with canvas overlay
  const handleStartRender = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setDownloadUrl(null);
    recordedChunksRef.current = [];

    const video = hiddenVideoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      setIsExporting(false);
      return;
    }

    // Set canvas dimensions based on aspect ratio
    let width = 1080;
    let height = 1920;
    if (settings.aspectRatio === "1:1") {
      width = 1080;
      height = 1080;
    } else if (settings.aspectRatio === "16:9") {
      width = 1920;
      height = 1080;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set video position to clip start
    video.currentTime = clip.startTime;
    await new Promise((r) => {
      video.onseeked = r;
    });

    // Start playback
    await video.play();

    // Prepare stream & MediaRecorder
    const stream = canvas.captureStream(30);

    // If audio is present, connect audio track
    try {
      // @ts-ignore
      const audioStream = video.captureStream?.() || video.mozCaptureStream?.();
      if (audioStream) {
        const audioTracks = audioStream.getAudioTracks();
        if (audioTracks.length > 0) {
          stream.addTrack(audioTracks[0]);
        }
      }
    } catch (e) {
      console.warn("Audio capture fallback:", e);
    }

    let mimeType = "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm";
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8000000,
    });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadFileName(
        `${clip.title.replace(/\s+/g, "_")}_${settings.aspectRatio.replace(":", "x")}_raw_clip.webm`
      );
      setIsExporting(false);
      setExportProgress(100);
    };

    recorder.start(100);

    // Animation render loop
    const renderFrame = () => {
      if (!isExporting && recorder.state !== "recording") return;

      const currentVideoTime = video.currentTime;
      const relTime = Math.max(0, currentVideoTime - clip.startTime);
      const progress = Math.min(100, (relTime / clipDuration) * 100);
      setExportProgress(Math.floor(progress));

      if (currentVideoTime >= clip.endTime || video.ended) {
        video.pause();
        if (recorder.state === "recording") {
          recorder.stop();
        }
        return;
      }

      // Draw background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Draw video frame (covering canvas for 9:16 center crop)
      if (settings.cropMode === "center-fill" && settings.aspectRatio === "9:16") {
        const videoRatio = video.videoWidth / (video.videoHeight || 1);
        const canvasRatio = width / height;
        let sWidth = video.videoWidth;
        let sHeight = video.videoHeight;
        let sx = 0;
        let sy = 0;

        if (videoRatio > canvasRatio) {
          sWidth = video.videoHeight * canvasRatio;
          sx = (video.videoWidth - sWidth) / 2;
        } else {
          sHeight = video.videoWidth / canvasRatio;
          sy = (video.videoHeight - sHeight) / 2;
        }

        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, width, height);
      } else {
        // Center fit with letterbox
        const hRatio = width / video.videoWidth;
        const vRatio = height / video.videoHeight;
        const ratio = Math.min(hRatio, vRatio);
        const centerShiftX = (width - video.videoWidth * ratio) / 2;
        const centerShiftY = (height - video.videoHeight * ratio) / 2;
        ctx.drawImage(
          video,
          0,
          0,
          video.videoWidth,
          video.videoHeight,
          centerShiftX,
          centerShiftY,
          video.videoWidth * ratio,
          video.videoHeight * ratio
        );
      }

      // Draw Top Hook Headline Banner
      if (settings.showHookHeadline) {
        const headline = settings.hookHeadlineText || clip.hookHeadline;
        ctx.save();
        ctx.font = "900 48px 'Anton', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textWidth = ctx.measureText(headline).width;
        const bannerPadding = 40;
        const bannerHeight = 80;
        const bannerY = 160;

        if (settings.hookHeadlineStyle === "yellow-highlighter") {
          ctx.fillStyle = "#facc15";
          ctx.fillRect(
            (width - textWidth) / 2 - bannerPadding / 2,
            bannerY - bannerHeight / 2,
            textWidth + bannerPadding,
            bannerHeight
          );
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 4;
          ctx.strokeRect(
            (width - textWidth) / 2 - bannerPadding / 2,
            bannerY - bannerHeight / 2,
            textWidth + bannerPadding,
            bannerHeight
          );
          ctx.fillStyle = "#000000";
          ctx.fillText(headline, width / 2, bannerY);
        } else {
          ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
          ctx.fillRect(
            (width - textWidth) / 2 - bannerPadding / 2,
            bannerY - bannerHeight / 2,
            textWidth + bannerPadding,
            bannerHeight
          );
          ctx.fillStyle = "#ffffff";
          ctx.fillText(headline, width / 2, bannerY);
        }
        ctx.restore();
      }

      // Draw active subtitle card
      const effectiveCaptions = (clip.captions && clip.captions.length > 0)
        ? clip.captions
        : getDefaultFallbackCaptions(clipDuration);

      const activeWord = effectiveCaptions.find(
        (c) => relTime >= c.start && relTime <= c.end
      );

      if (activeWord) {
        ctx.save();
        const subY = height * 0.72;
        ctx.font = "900 64px 'Anton', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Black stroke outline
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 14;
        ctx.lineJoin = "round";
        ctx.strokeText(activeWord.text, width / 2, subY);

        // Fill color
        ctx.fillStyle = activeWord.emphasis ? "#facc15" : "#ffffff";
        ctx.fillText(activeWord.text, width / 2, subY);
        ctx.restore();
      }

      // Draw bottom retention progress bar
      if (settings.showProgressBar) {
        const barHeight = 16;
        const barY = height - barHeight;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, barY, width, barHeight);

        ctx.fillStyle = settings.progressBarColor || "#ef4444";
        ctx.fillRect(0, barY, (width * progress) / 100, barHeight);
      }

      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  };

  const handleCopyCaption = () => {
    const fullText = `${clip.socialCopy.caption}\n\n${clip.socialCopy.hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Hidden video and canvas for rendering */}
        <video
          ref={hiddenVideoRef}
          src={videoUrl}
          playsInline
          muted
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="font-extrabold text-white text-base">
                Export Standard Raw Clip
              </h3>
              <p className="text-xs text-slate-400">
                {settings.aspectRatio} format • {clipDuration.toFixed(1)}s duration
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

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Clip summary card */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Active Selection
            </span>
            <p className="text-sm font-extrabold text-white truncate">
              {clip.hookHeadline}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span>Aspect: <strong className="text-white">{settings.aspectRatio}</strong></span>
              <span>•</span>
              <span>Captions: <strong className="text-amber-300">{settings.captionStyle}</strong></span>
              <span>•</span>
              <span>Burned Hook: <strong className="text-emerald-400">{settings.showHookHeadline ? "Yes" : "No"}</strong></span>
            </div>
          </div>

          {/* Render progress / actions */}
          {isExporting ? (
            <div className="p-5 rounded-xl bg-slate-950 border border-rose-500/30 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-rose-400 animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">
                  Rendering {settings.aspectRatio} Vertical Raw Video... {exportProgress}%
                </p>
                <p className="text-[11px] text-slate-400">
                  Burning in Hormozi captions, hook headline & retention progress bar.
                </p>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-100 rounded-full"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          ) : downloadUrl ? (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Clip Render Complete!</p>
                <p className="text-xs text-slate-300">
                  Ready to publish on TikTok, Instagram Reels, and YouTube Shorts.
                </p>
              </div>
              <a
                href={downloadUrl}
                download={downloadFileName}
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition"
              >
                <Download className="w-4 h-4" /> Download Edited Video ({downloadFileName})
              </a>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleStartRender}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm tracking-wide shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition"
            >
              <Film className="w-4 h-4 fill-white" />
              <span>RENDER & DOWNLOAD RAW VERTICAL VIDEO</span>
            </button>
          )}

          {/* Secondary downloads & copy */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDownloadSrt}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Download .SRT Subtitles</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCaption}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy Social Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
