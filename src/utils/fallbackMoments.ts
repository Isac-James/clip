import { ClipData } from "../types";

export function generateSmartFallbackClips(
  title: string,
  totalDuration: number,
  _style: string = "raw-podcast"
): ClipData[] {
  const maxDur = Math.max(30, Math.min(totalDuration, 3600));

  // Determine 3 strategic viral windows:
  // Clip 1: The Cold Open Hook (early spike ~ 8s - 34s)
  const c1Start = Math.min(6, Math.floor(maxDur * 0.05));
  const c1End = Math.min(maxDur - 2, c1Start + 26);

  // Clip 2: The Emotional Climax / Controversy (~ 38% mark)
  const c2Start = Math.min(
    Math.floor(maxDur * 0.38),
    Math.max(c1End + 5, 30)
  );
  const c2End = Math.min(maxDur - 1, c2Start + 28);

  // Clip 3: The Golden Insight / Mic Drop (~ 68% mark)
  const c3Start = Math.min(
    Math.floor(maxDur * 0.68),
    Math.max(c2End + 5, 55)
  );
  const c3End = Math.min(maxDur, c3Start + 32);

  return [
    {
      id: "clip-1",
      rank: 1,
      title: "The Unfiltered Cold Open",
      hookHeadline: "HE ADMITTED THIS ON CAMERA 😳",
      startTime: c1Start,
      endTime: c1End,
      duration: +(c1End - c1Start).toFixed(1),
      viralityScore: 98,
      viralityBreakdown: {
        hookScore: 99,
        retentionPotential: 97,
        emotionalSpike: 95,
        curiosityGap: 98,
      },
      whyViral:
        "Instant pattern interrupt in the first 2 seconds. The speaker immediately dives into a polarizing revelation with zero filler words.",
      bestPlatform: "TikTok & Shorts",
      audioPacing: "fast",
      zoomPunchMoments: [2.5, 8.0, 16.5],
      captions: [
        {
          text: "MOST PEOPLE HAVE NO IDEA",
          start: 0.0,
          end: 2.2,
          emphasis: true,
          color: "#facc15",
        },
        {
          text: "WHAT IS ACTUALLY HAPPENING",
          start: 2.2,
          end: 4.8,
          emphasis: false,
          color: "#ffffff",
        },
        {
          text: "BEHIND CLOSED DOORS",
          start: 4.8,
          end: 7.5,
          emphasis: true,
          color: "#22c55e",
        },
        {
          text: "THEY TOLD ME NOT TO SAY THIS",
          start: 7.5,
          end: 10.4,
          emphasis: true,
          color: "#f43f5e",
        },
        {
          text: "BUT I CANNOT STAY SILENT",
          start: 10.4,
          end: 13.6,
          emphasis: false,
          color: "#ffffff",
        },
        {
          text: "IF YOU WANT TO WIN IN 2026",
          start: 13.6,
          end: 17.0,
          emphasis: true,
          color: "#38bdf8",
        },
        {
          text: "YOU MUST MASTER THIS ONE THING",
          start: 17.0,
          end: 21.2,
          emphasis: true,
          color: "#facc15",
        },
        {
          text: "DO NOT SLEEP ON THIS",
          start: 21.2,
          end: 26.0,
          emphasis: false,
          color: "#ffffff",
        },
      ],
      socialCopy: {
        caption: `He actually said this on camera. Watch until the end before they take this down. 🤫 What's your take?`,
        hashtags: [
          "#viral",
          "#shorts",
          "#mindblown",
          "#rawtruth",
          "#fyp",
          "#podcastclips",
        ],
      },
    },
    {
      id: "clip-2",
      rank: 2,
      title: "The Controversial Truth",
      hookHeadline: "99% OF PEOPLE GET THIS WRONG ❌",
      startTime: c2Start,
      endTime: c2End,
      duration: +(c2End - c2Start).toFixed(1),
      viralityScore: 93,
      viralityBreakdown: {
        hookScore: 92,
        retentionPotential: 94,
        emotionalSpike: 96,
        curiosityGap: 90,
      },
      whyViral:
        "High controversy quotient. Challenges mainstream beliefs directly, sparking heavy comment debate and re-shares.",
      bestPlatform: "Instagram Reels",
      audioPacing: "dramatic",
      zoomPunchMoments: [3.2, 11.0, 19.8],
      captions: [
        {
          text: "STOP DOING WHAT EVERYONE ELSE DOES",
          start: 0.0,
          end: 2.8,
          emphasis: true,
          color: "#f43f5e",
        },
        {
          text: "THE COMMON ADVICE IS WRONG",
          start: 2.8,
          end: 5.6,
          emphasis: false,
          color: "#ffffff",
        },
        {
          text: "HERE IS THE HARD REALITY",
          start: 5.6,
          end: 8.5,
          emphasis: true,
          color: "#facc15",
        },
        {
          text: "WHEN YOU FOCUS ON THE LEVERAGE",
          start: 8.5,
          end: 12.0,
          emphasis: false,
          color: "#ffffff",
        },
        {
          text: "EVERYTHING ELSE MULTIPLIES",
          start: 12.0,
          end: 15.5,
          emphasis: true,
          color: "#22c55e",
        },
        {
          text: "THAT IS THE ENTIRE FORMULA",
          start: 15.5,
          end: 19.2,
          emphasis: true,
          color: "#38bdf8",
        },
        {
          text: "SAVE THIS FOR LATER",
          start: 19.2,
          end: 24.0,
          emphasis: false,
          color: "#ffffff",
        },
      ],
      socialCopy: {
        caption: `Stop following bad advice. Once you see this truth, you can never unsee it. Tag someone who needs to hear this! 🔥`,
        hashtags: [
          "#reels",
          "#growthmindset",
          "#brutallyhonest",
          "#motivation",
          "#tiktok",
        ],
      },
    },
    {
      id: "clip-3",
      rank: 3,
      title: "The Golden Lesson & Mic Drop",
      hookHeadline: "THIS ONE RULE CHANGED EVERYTHING 📈",
      startTime: c3Start,
      endTime: c3End,
      duration: +(c3End - c3Start).toFixed(1),
      viralityScore: 89,
      viralityBreakdown: {
        hookScore: 88,
        retentionPotential: 91,
        emotionalSpike: 89,
        curiosityGap: 87,
      },
      whyViral:
        "Actionable transformation takeaway with a high bookmark and save rate.",
      bestPlatform: "YouTube Shorts",
      audioPacing: "building",
      zoomPunchMoments: [4.0, 14.5],
      captions: [
        {
          text: "IF I HAD TO START FROM ZERO",
          start: 0.0,
          end: 2.7,
          emphasis: true,
          color: "#38bdf8",
        },
        {
          text: "THIS IS THE ONLY PLAYBOOK",
          start: 2.7,
          end: 5.8,
          emphasis: false,
          color: "#ffffff",
        },
        {
          text: "FIRST CUT OUT ALL DISTRACTIONS",
          start: 5.8,
          end: 9.2,
          emphasis: true,
          color: "#facc15",
        },
        {
          text: "THEN GO RELENTLESSLY ALL IN",
          start: 9.2,
          end: 13.0,
          emphasis: true,
          color: "#22c55e",
        },
        {
          text: "DO IT EVERY SINGLE DAY",
          start: 13.0,
          end: 17.5,
          emphasis: false,
          color: "#ffffff",
        },
        {
          text: "AND YOU WILL BE UNSTOPPABLE",
          start: 17.5,
          end: 22.0,
          emphasis: true,
          color: "#facc15",
        },
      ],
      socialCopy: {
        caption: `The golden rule that 99% ignore. Save this clip before tomorrow. 🚀`,
        hashtags: ["#shorts", "#success", "#discipline", "#dailywisdom"],
      },
    },
  ];
}
