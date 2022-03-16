export const DEFAULT_CONSOLE_FONT_TEXT = "Unknown";

export const CONSOLE_FONT_TO_TEXT: {
  readonly [key in typeof Options.ConsoleFont]: string;
} = {
  0: "Default",
  1: "Small",
  2: "Tiny",
};
