export interface CaptionWord {
  text: string;
  start: number; // in seconds relative to clip start
  end: number;   // in seconds relative to clip start
  emphasis?: boolean;
  color?: string;
}

export interface ViralityBreakdown {
  hookScore: number;
  retentionPotential: number;
  emotionalSpike: number;
  curiosityGap: number;
}

export interface SocialCopy {
  caption: string;
  hashtags: string[];
}

export interface ClipData {
  id: string;
  rank: number;
  title: string;
  hookHeadline: string;
  startTime: number; // in seconds of original video
  endTime: number;   // in seconds of original video
  duration: number;
  viralityScore: number;
  viralityBreakdown: ViralityBreakdown;
  whyViral: string;
  bestPlatform: string;
  audioPacing: string;
  zoomPunchMoments?: number[];
  captions: CaptionWord[];
  socialCopy: SocialCopy;
}

export type AspectRatio = "9:16" | "1:1" | "16:9" | "4:5";
export type CropMode = "center-fill" | "blurred-glass" | "letterbox" | "split-cam";
export type CaptionStyle = "hormozi-yellow" | "raw-clean" | "neon-cyber" | "karaoke-pop" | "submagic-box";
export type CaptionPosition = "middle" | "bottom" | "top";
export type CaptionSize = "small" | "medium" | "large";
export type HookStyle = "yellow-highlighter" | "red-badge" | "dark-glass" | "raw-text";

export interface EditingSettings {
  aspectRatio: AspectRatio;
  cropMode: CropMode;
  captionStyle: CaptionStyle;
  captionPosition: CaptionPosition;
  captionSize: CaptionSize;
  showHookHeadline: boolean;
  hookHeadlineText: string;
  hookHeadlineStyle: HookStyle;
  showProgressBar: boolean;
  progressBarColor: string;
  showSpeakerTag: boolean;
  speakerTag: string;
  zoomPunchEnabled: boolean;
  audioBoost: boolean;
}

export interface SampleVideo {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  url: string;
  suggestedClipsCount: number;
}
