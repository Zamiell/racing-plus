export const DEFAULT_ANNOUNCER_VOICE_MODE_TEXT = "Unknown";

export const ANNOUNCER_VOICE_MODE_TO_TEXT = {
  0: "Random",
  1: "Always Off",
  2: "Always On",
} as const satisfies Record<typeof Options.AnnouncerVoiceMode, string>;
