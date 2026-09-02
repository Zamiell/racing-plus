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
    CurrentSetting: () => Options.AnnouncerVoiceMode,
    Display: () => `Announcer Voice Mode: ${getAnnouncerVoiceModeText()}`,
    Info: [
      "Whether the announcer voice should play when using items, pills, cards, and runes.",
    ],
    Maximum: 2,
    Minimum: 0,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isNumber(newValue) && isEnumValue(newValue, AnnouncerVoiceMode)) {
        Options.AnnouncerVoiceMode = newValue;
      } else {
        logError("Failed to parse the new value for: Announcer Voice Mode");
      }
    },
    Type: ModConfigMenuOptionType.NUMBER,
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    CurrentSetting: () => Options.ConsoleFont,
    Display: () => `Debug Console Font: ${getConsoleFontText()}`,
    Info: ["Customize the font of the in-game debug console."],
    Maximum: 2,
    Minimum: 0,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isNumber(newValue) && isEnumValue(newValue, ConsoleFont)) {
        Options.ConsoleFont = newValue;
      } else {
        logError("Failed to parse the new value for: Debug Console Font");
      }
    },
    Type: ModConfigMenuOptionType.NUMBER,
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    CurrentSetting: () => Options.DebugConsoleEnabled,
    Display: () => `Debug Console: ${onOff(Options.DebugConsoleEnabled)}`,
    Info: ["Enable or disable the in-game debug console."],
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.DebugConsoleEnabled = newValue;
      } else {
        logError("Failed to parse the new value for: Debug Console");
      }
    },
    Type: ModConfigMenuOptionType.BOOLEAN,
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    CurrentSetting: () => Options.FadedConsoleDisplay,
    Display: () =>
      `Faded Console Display: ${onOff(Options.FadedConsoleDisplay)}`,
    Info: [
      "Shows Lua errors and other console output in-game without having to manually bring up the console.",
    ],
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.FadedConsoleDisplay = newValue;
      } else {
        logError("Failed to parse the new value for: Faded Console Display");
      }
    },
    Type: ModConfigMenuOptionType.BOOLEAN,
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    CurrentSetting: () => Options.MaxRenderScale,
    Display: () => `Max Render Scale: ${Options.MaxRenderScale}`,
    Info: [
      "How big the window can be before the game changes the rendering to fill the screen.",
    ],
    Maximum: 99,
    Minimum: 1,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isNumber(newValue) && newValue >= 1 && newValue <= 99) {
        Options.MaxRenderScale = newValue;
      } else {
        logError("Failed to parse the new value for: Max Render Scale");
      }
    },
    Type: ModConfigMenuOptionType.NUMBER,
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    CurrentSetting: () => Options.MaxScale,
    Display: () => `Max Scale: ${Options.MaxScale}`,
    Info: ["n/a"],
    Maximum: 99,
    Minimum: 1,
    OnChange: (newValue: number | boolean | undefined) => {
      if (isNumber(newValue) && newValue >= 1 && newValue <= 99) {
        Options.MaxScale = newValue;
      } else {
        logError("Failed to parse the new value for: Max Scale");
      }
    },
    Type: ModConfigMenuOptionType.NUMBER,
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    CurrentSetting: () => Options.MouseControl,
    Display: () => `Mouse Control: ${onOff(Options.MouseControl)}`,
    Info: [
      "Whether the mouse can be used to shoot tears and control items like Epic Fetus or Marked.",
    ],
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.MouseControl = newValue;
      } else {
        logError("Failed to parse the new value for: Mouse Control");
      }
    },
    Type: ModConfigMenuOptionType.BOOLEAN,
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    CurrentSetting: () => Options.PauseOnFocusLost,
    Display: () => `Pause on Focus Lost: ${onOff(Options.PauseOnFocusLost)}`,
    Info: [
      "Whether the game will automatically pause if you switch to a different program.",
    ],
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.PauseOnFocusLost = newValue;
      } else {
        logError("Failed to parse the new value for: Pause on Focus Lost");
      }
    },
    Type: ModConfigMenuOptionType.BOOLEAN,
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    CurrentSetting: () => Options.RumbleEnabled,
    Display: () => `Rumble: ${onOff(Options.RumbleEnabled)}`,
    Info: ["Whether the rumble feature is enabled for controller players."],
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.RumbleEnabled = newValue;
      } else {
        logError("Failed to parse the new value for: Rumble");
      }
    },
    Type: ModConfigMenuOptionType.BOOLEAN,
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    CurrentSetting: () => Options.SaveCommandHistory,
    Display: () => `Save Command History: ${onOff(Options.SaveCommandHistory)}`,
    Info: [
      "Whether the game will save the history of executed debug console commands.",
    ],
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.SaveCommandHistory = newValue;
      } else {
        logError("Failed to parse the new value for: Save Command History");
      }
    },
    Type: ModConfigMenuOptionType.BOOLEAN,
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    CurrentSetting: () => Options.UseBorderlessFullscreen,
    Display: () =>
      `Borderless Fullscreen: ${onOff(Options.UseBorderlessFullscreen)}`,
    Info: ["This only takes effect if the game is in full screen mode."],
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.UseBorderlessFullscreen = newValue;
      } else {
        logError("Failed to parse the new value for: Borderless Fullscreen");
      }
    },
    Type: ModConfigMenuOptionType.BOOLEAN,
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    CurrentSetting: () => Options.VSync,
    Display: () => `VSync: ${onOff(Options.VSync)}`,
    Info: ["n/a"],
    OnChange: (newValue: number | boolean | undefined) => {
      if (isBoolean(newValue)) {
        Options.VSync = newValue;
      } else {
        logError("Failed to parse the new value for: VSync");
      }
    },
    Type: ModConfigMenuOptionType.BOOLEAN,
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
