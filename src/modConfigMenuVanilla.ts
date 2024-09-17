import {
  AnnouncerVoiceMode,
  ConsoleFont,
  ModConfigMenuOptionType,
} from "isaac-typescript-definitions";
import { isBoolean, isEnumValue, isNumber, logError } from "isaacscript-common";
import { deleteOldConfig, onOff } from "./modConfigMenu";

const CATEGORY_NAME = "Vanilla Options";

const CONSOLE_FONT_TO_TEXT = {
  0: "Default",
  1: "Small",
  2: "Tiny",
} as const satisfies Record<typeof Options.ConsoleFont, string>;

const ANNOUNCER_VOICE_MODE_TO_TEXT = {
  0: "Random",
  1: "Always Off",
  2: "Always On",
} as const satisfies Record<typeof Options.AnnouncerVoiceMode, string>;

export function modConfigMenuVanillaInit(): void {
  if (ModConfigMenu === undefined) {
    return;
  }

  deleteOldConfig(CATEGORY_NAME);

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.NUMBER,
    CurrentSetting: () => Options.AnnouncerVoiceMode,
    Minimum: 0,
    Maximum: 2,
    Display: () => `Announcer Voice Mode: ${getAnnouncerVoiceModeText()}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isNumber(newValue) && isEnumValue(newValue, AnnouncerVoiceMode)) {
        Options.AnnouncerVoiceMode = newValue;
      } else {
        logError("Failed to parse the new value for: Announcer Voice Mode");
      }
    },
    Info: [
      "Whether the announcer voice should play when using items, pills, cards, and runes.",
    ],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.NUMBER,
    CurrentSetting: () => Options.ConsoleFont,
    Minimum: 0,
    Maximum: 2,
    Display: () => `Debug Console Font: ${getConsoleFontText()}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isNumber(newValue) && isEnumValue(newValue, ConsoleFont)) {
        Options.ConsoleFont = newValue;
      } else {
        logError("Failed to parse the new value for: Debug Console Font");
      }
    },
    Info: ["Customize the font of the in-game debug console."],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.DebugConsoleEnabled,
    Display: () => `Debug Console: ${onOff(Options.DebugConsoleEnabled)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.DebugConsoleEnabled = newValue;
      } else {
        logError("Failed to parse the new value for: Debug Console");
      }
    },
    Info: ["Enable or disable the in-game debug console."],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.FadedConsoleDisplay,
    Display: () =>
      `Faded Console Display: ${onOff(Options.FadedConsoleDisplay)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.FadedConsoleDisplay = newValue;
      } else {
        logError("Failed to parse the new value for: Faded Console Display");
      }
    },
    Info: [
      "Shows Lua errors and other console output in-game without having to manually bring up the console.",
    ],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.NUMBER,
    CurrentSetting: () => Options.MaxRenderScale,
    Minimum: 1,
    Maximum: 99,
    Display: () => `Max Render Scale: ${Options.MaxRenderScale}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isNumber(newValue) && newValue >= 1 && newValue <= 99) {
        Options.MaxRenderScale = newValue;
      } else {
        logError("Failed to parse the new value for: Max Render Scale");
      }
    },
    Info: [
      "How big the window can be before the game changes the rendering to fill the screen.",
    ],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.NUMBER,
    CurrentSetting: () => Options.MaxScale,
    Minimum: 1,
    Maximum: 99,
    Display: () => `Max Scale: ${Options.MaxScale}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isNumber(newValue) && newValue >= 1 && newValue <= 99) {
        Options.MaxScale = newValue;
      } else {
        logError("Failed to parse the new value for: Max Scale");
      }
    },
    Info: ["n/a"],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.MouseControl,
    Display: () => `Mouse Control: ${onOff(Options.MouseControl)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.MouseControl = newValue;
      } else {
        logError("Failed to parse the new value for: Mouse Control");
      }
    },
    Info: [
      "Whether the mouse can be used to shoot tears and control items like Epic Fetus or Marked.",
    ],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.PauseOnFocusLost,
    Display: () => `Pause on Focus Lost: ${onOff(Options.PauseOnFocusLost)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.PauseOnFocusLost = newValue;
      } else {
        logError("Failed to parse the new value for: Pause on Focus Lost");
      }
    },
    Info: [
      "Whether the game will automatically pause if you switch to a different program.",
    ],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.RumbleEnabled,
    Display: () => `Rumble: ${onOff(Options.RumbleEnabled)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.RumbleEnabled = newValue;
      } else {
        logError("Failed to parse the new value for: Rumble");
      }
    },
    Info: ["Whether the rumble feature is enabled for controller players."],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.SaveCommandHistory,
    Display: () => `Save Command History: ${onOff(Options.SaveCommandHistory)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.SaveCommandHistory = newValue;
      } else {
        logError("Failed to parse the new value for: Save Command History");
      }
    },
    Info: [
      "Whether the game will save the history of executed debug console commands.",
    ],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.UseBorderlessFullscreen,
    Display: () =>
      `Borderless Fullscreen: ${onOff(Options.UseBorderlessFullscreen)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.UseBorderlessFullscreen = newValue;
      } else {
        logError("Failed to parse the new value for: Borderless Fullscreen");
      }
    },
    Info: ["This only takes effect if the game is in full screen mode."],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.VSync,
    Display: () => `VSync: ${onOff(Options.VSync)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.VSync = newValue;
      } else {
        logError("Failed to parse the new value for: VSync");
      }
    },
    Info: ["n/a"],
  });
}

function getAnnouncerVoiceModeText(): string {
  // Compare against undefined to be future-safe against new voice mode values.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return ANNOUNCER_VOICE_MODE_TO_TEXT[Options.AnnouncerVoiceMode] ?? "Unknown";
}

function getConsoleFontText(): string {
  // Compare against undefined to be future-safe against new font text values.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return CONSOLE_FONT_TO_TEXT[Options.ConsoleFont] ?? "Unknown";
}
