export const DEFAULT_CONSOLE_FONT_TEXT = "Unknown";

export const CONSOLE_FONT_TO_TEXT = {
  0: "Default",
  1: "Small",
  2: "Tiny",
} as const satisfies Record<typeof Options.ConsoleFont, string>;
