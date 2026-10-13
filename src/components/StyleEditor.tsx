import React, { useState } from "react";
import {
  Smartphone,
  Square,
  Monitor,
  Type,
  Layout,
  Flame,
  Sparkles,
  Sliders,
  Palette,
  Eye,
  Edit3,
} from "lucide-react";
import {
  EditingSettings,
  AspectRatio,
  CropMode,
  CaptionStyle,
  CaptionPosition,
  CaptionSize,
  HookStyle,
} from "../types";

interface StyleEditorProps {
  settings: EditingSettings;
  onChange: (settings: EditingSettings) => void;
  onOpenCaptionEditor: () => void;
}

export const StyleEditor: React.FC<StyleEditorProps> = ({
  settings,
  onChange,
  onOpenCaptionEditor,
}) => {
  const [activeTab, setActiveTab] = useState<"layout" | "captions" | "hook" | "retention">("layout");

  const updateSetting = <K extends keyof EditingSettings>(key: K, value: EditingSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
      {/* Editor Header Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
        <button
          onClick={() => setActiveTab("layout")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition border-b-2 shrink-0 ${
            activeTab === "layout"
              ? "border-rose-500 text-rose-400 bg-slate-900/80"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Framing & Aspect</span>
        </button>

        <button
          onClick={() => setActiveTab("captions")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition border-b-2 shrink-0 ${
            activeTab === "captions"
              ? "border-rose-500 text-rose-400 bg-slate-900/80"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Raw Captions</span>
        </button>

        <button
          onClick={() => setActiveTab("hook")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition border-b-2 shrink-0 ${
            activeTab === "hook"
              ? "border-rose-500 text-rose-400 bg-slate-900/80"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Hook Headline</span>
        </button>

        <button
          onClick={() => setActiveTab("retention")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition border-b-2 shrink-0 ${
            activeTab === "retention"
              ? "border-rose-500 text-rose-400 bg-slate-900/80"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Retention Polish</span>
        </button>
      </div>

      {/* Tab 1: Layout & Aspect Ratio */}
      {activeTab === "layout" && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Aspect Ratio Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Aspect Ratio Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateSetting("aspectRatio", "9:16")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition ${
                  settings.aspectRatio === "9:16"
                    ? "border-rose-500 bg-rose-950/30 text-rose-300 ring-1 ring-rose-500"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1 text-rose-400" />
                <span>9:16 Vertical</span>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5">TikTok / Shorts</span>
              </button>

              <button
                type="button"
                onClick={() => updateSetting("aspectRatio", "1:1")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition ${
                  settings.aspectRatio === "1:1"
                    ? "border-rose-500 bg-rose-950/30 text-rose-300 ring-1 ring-rose-500"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Square className="w-5 h-5 mb-1 text-amber-400" />
                <span>1:1 Square</span>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5">Insta Feed</span>
              </button>

              <button
                type="button"
                onClick={() => updateSetting("aspectRatio", "16:9")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition ${
                  settings.aspectRatio === "16:9"
                    ? "border-rose-500 bg-rose-950/30 text-rose-300 ring-1 ring-rose-500"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Monitor className="w-5 h-5 mb-1 text-blue-400" />
                <span>16:9 Landscape</span>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5">Classic YouTube</span>
              </button>
            </div>
          </div>

          {/* Framing / Crop Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Vertical Framing & Background
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateSetting("cropMode", "center-fill")}
                className={`p-3 rounded-xl border text-left transition ${
                  settings.cropMode === "center-fill"
                    ? "border-rose-500 bg-rose-950/30 text-white"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                }`}
              >
                <p className="text-xs font-bold text-white">Raw Center Crop</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Fills entire 9:16 screen focusing on speaker.
                </p>
              </button>

              <button
                type="button"
                onClick={() => updateSetting("cropMode", "blurred-glass")}
                className={`p-3 rounded-xl border text-left transition ${
                  settings.cropMode === "blurred-glass"
                    ? "border-rose-500 bg-rose-950/30 text-white"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                }`}
              >
                <p className="text-xs font-bold text-white">Blurred Ambient Glass</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Top & bottom ambient blur with sharp centered video.
                </p>
              </button>

              <button
                type="button"
                onClick={() => updateSetting("cropMode", "letterbox")}
                className={`p-3 rounded-xl border text-left transition ${
                  settings.cropMode === "letterbox"
                    ? "border-rose-500 bg-rose-950/30 text-white"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                }`}
              >
                <p className="text-xs font-bold text-white">Letterbox Bars</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Black cinema padding above and below video.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Raw Captions & Subtitles */}
      {activeTab === "captions" && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Subtitle Style Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Raw Viral Caption Style
              </label>
              <button
                onClick={onOpenCaptionEditor}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Words & Timings
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateSetting("captionStyle", "hormozi-yellow")}
                className={`p-2.5 rounded-xl border text-left transition ${
                  settings.captionStyle === "hormozi-yellow"
                    ? "border-rose-500 bg-rose-950/30"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <span className="font-viral text-amber-300 text-sm font-black text-stroke-sm block">
                  HORMOZI YELLOW
                </span>
                <span className="text-[10px] text-slate-400">Bold Anton + yellow punch</span>
              </button>

              <button
                type="button"
                onClick={() => updateSetting("captionStyle", "neon-cyber")}
                className={`p-2.5 rounded-xl border text-left transition ${
                  settings.captionStyle === "neon-cyber"
                    ? "border-rose-500 bg-rose-950/30"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <span className="font-viral text-cyan-400 text-sm font-black text-stroke-sm block">
                  NEON CYBER
                </span>
                <span className="text-[10px] text-slate-400">Cyan & emerald glow</span>
              </button>

              <button
                type="button"
                onClick={() => updateSetting("captionStyle", "karaoke-pop")}
                className={`p-2.5 rounded-xl border text-left transition ${
                  settings.captionStyle === "karaoke-pop"
                    ? "border-rose-500 bg-rose-950/30"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <span className="font-viral text-rose-400 text-sm font-black text-stroke-sm block">
                  KARAOKE POP
                </span>
                <span className="text-[10px] text-slate-400">Bouncing active card</span>
              </button>

              <button
                type="button"
                onClick={() => updateSetting("captionStyle", "submagic-box")}
                className={`p-2.5 rounded-xl border text-left transition ${
                  settings.captionStyle === "submagic-box"
                    ? "border-rose-500 bg-rose-950/30"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <span className="bg-amber-400 text-slate-950 px-1 rounded text-xs font-black font-viral">
                  SUBMAGIC BOX 🔥
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Highlighter pill tag</span>
              </button>

              <button
                type="button"
                onClick={() => updateSetting("captionStyle", "raw-clean")}
                className={`p-2.5 rounded-xl border text-left transition ${
                  settings.captionStyle === "raw-clean"
                    ? "border-rose-500 bg-rose-950/30"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <span className="text-white text-xs font-bold block">
                  Raw Clean White
                </span>
                <span className="text-[10px] text-slate-400">Minimal dark backing</span>
              </button>
            </div>
          </div>

          {/* Caption Position & Size */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Vertical Position
              </label>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(["bottom", "middle", "top"] as CaptionPosition[]).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => updateSetting("captionPosition", pos)}
                    className={`flex-1 py-1 text-xs font-semibold rounded capitalize transition ${
                      settings.captionPosition === pos
                        ? "bg-slate-800 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Font Size
              </label>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(["small", "medium", "large"] as CaptionSize[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => updateSetting("captionSize", sz)}
                    className={`flex-1 py-1 text-xs font-semibold rounded capitalize transition ${
                      settings.captionSize === sz
                        ? "bg-slate-800 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Hook Headline */}
      {activeTab === "hook" && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Top Hook Headline Banner
              </h4>
              <p className="text-[11px] text-slate-400">
                Increases initial 3-second hook retention by 42% on TikTok and Reels.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showHookHeadline}
                onChange={(e) => updateSetting("showHookHeadline", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {settings.showHookHeadline && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Headline Text
                </label>
                <input
                  type="text"
                  value={settings.hookHeadlineText}
                  onChange={(e) => updateSetting("hookHeadlineText", e.target.value)}
                  placeholder="e.g. HE ADMITTED THIS ON CAMERA 😳"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 text-xs text-white px-3 py-2.5 font-bold uppercase tracking-wide focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Headline Banner Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => updateSetting("hookHeadlineStyle", "yellow-highlighter")}
                    className={`p-2 rounded-lg border text-center transition ${
                      settings.hookHeadlineStyle === "yellow-highlighter"
                        ? "border-amber-400 bg-amber-400/20 text-amber-300"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-black uppercase">Yellow Highlighter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting("hookHeadlineStyle", "red-badge")}
                    className={`p-2 rounded-lg border text-center transition ${
                      settings.hookHeadlineStyle === "red-badge"
                        ? "border-rose-500 bg-rose-500/20 text-rose-300"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-black uppercase">🚨 Red Alert</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting("hookHeadlineStyle", "dark-glass")}
                    className={`p-2 rounded-lg border text-center transition ${
                      settings.hookHeadlineStyle === "dark-glass"
                        ? "border-slate-400 bg-slate-800 text-white"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-black uppercase">Dark Glass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting("hookHeadlineStyle", "raw-text")}
                    className={`p-2 rounded-lg border text-center transition ${
                      settings.hookHeadlineStyle === "raw-text"
                        ? "border-slate-400 bg-slate-800 text-white"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-black uppercase">Raw Minimal</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Retention Polish */}
      {activeTab === "retention" && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Progress Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Bottom Retention Bar</span>
              <span className="text-[11px] text-slate-400">Shows viewer clip duration to boost completion rates.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showProgressBar}
                onChange={(e) => updateSetting("showProgressBar", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* Zoom Punches */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Smart Zoom Punches (1.1x)</span>
              <span className="text-[11px] text-slate-400">Micro-zooms at emphasis words to prevent audience swiping away.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.zoomPunchEnabled}
                onChange={(e) => updateSetting("zoomPunchEnabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* Speaker Tag */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Speaker Tag Badge</span>
                <span className="text-[11px] text-slate-400">Add presenter or guest name in the corner.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showSpeakerTag}
                  onChange={(e) => updateSetting("showSpeakerTag", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>
            {settings.showSpeakerTag && (
              <input
                type="text"
                value={settings.speakerTag}
                onChange={(e) => updateSetting("speakerTag", e.target.value)}
                placeholder="e.g. Host / Guest Name"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-xs text-white px-3 py-2 focus:outline-none focus:border-rose-500"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
