import { deleteOldConfig, onOff } from "./modConfigMenu";
import {
  ANNOUNCER_VOICE_MODE_TO_TEXT,
  DEFAULT_ANNOUNCER_VOICE_MODE_TEXT,
} from "./objects/announcerVoiceModeToText";
import {
  CONSOLE_FONT_TO_TEXT,
  DEFAULT_CONSOLE_FONT_TEXT,
} from "./objects/consoleFontToText";

const CATEGORY_NAME = "Vanilla Options";

export function init(): void {
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
      if (
        newValue === undefined ||
        typeof newValue === "boolean" ||
        (newValue !== 0 && newValue !== 1 && newValue !== 2)
      ) {
        return;
      }

      Options.AnnouncerVoiceMode = newValue;
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
      if (
        newValue === undefined ||
        typeof newValue === "boolean" ||
        (newValue !== 0 && newValue !== 1 && newValue !== 2)
      ) {
        return;
      }

      Options.ConsoleFont = newValue;
    },
    Info: ["Customize the font of the in-game debug console."],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.DebugConsoleEnabled,
    Display: () => `Debug Console: ${onOff(Options.DebugConsoleEnabled)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (newValue === undefined || typeof newValue === "number") {
        return;
      }

      Options.DebugConsoleEnabled = newValue;
    },
    Info: ["Enable or disable the in-game debug console."],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.FadedConsoleDisplay,
    Display: () =>
      `Faded Console Display: ${onOff(Options.FadedConsoleDisplay)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (newValue === undefined || typeof newValue === "number") {
        return;
      }

      Options.FadedConsoleDisplay = newValue;
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
      if (
        newValue === undefined ||
        typeof newValue === "boolean" ||
        newValue < 1 ||
        newValue > 99
      ) {
        return;
      }

      Options.MaxRenderScale = newValue;
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
      if (
        newValue === undefined ||
        typeof newValue === "boolean" ||
        newValue < 1 ||
        newValue > 99
      ) {
        return;
      }

      Options.MaxScale = newValue;
    },
    Info: ["n/a"],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.MouseControl,
    Display: () => `Mouse Control: ${onOff(Options.MouseControl)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (newValue === undefined || typeof newValue === "number") {
        return;
      }

      Options.MouseControl = newValue;
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
      if (newValue === undefined || typeof newValue === "number") {
        return;
      }

      Options.PauseOnFocusLost = newValue;
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
      if (newValue === undefined || typeof newValue === "number") {
        return;
      }

      Options.RumbleEnabled = newValue;
    },
    Info: [
      "Whether or not the rumble feature is enabled for controller players.",
    ],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.SaveCommandHistory,
    Display: () => `Save Command History: ${onOff(Options.SaveCommandHistory)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (newValue === undefined || typeof newValue === "number") {
        return;
      }

      Options.SaveCommandHistory = newValue;
    },
    Info: [
      "Whether or not the game will save the history of executed debug console commands.",
    ],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.UseBorderlessFullscreen,
    Display: () =>
      `Borderless Fullscreen: ${onOff(Options.UseBorderlessFullscreen)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (newValue === undefined || typeof newValue === "number") {
        return;
      }

      Options.UseBorderlessFullscreen = newValue;
    },
    Info: ["This only takes effect if the game is in full screen mode."],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, undefined, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => Options.VSync,
    Display: () => `VSync: ${onOff(Options.VSync)}`,
    OnChange: (newValue: number | boolean | undefined) => {
      if (newValue === undefined || typeof newValue === "number") {
        return;
      }

      Options.VSync = newValue;
    },
    Info: ["n/a"],
  });
}

function getAnnouncerVoiceModeText() {
  const announcerVoiceModeText =
    ANNOUNCER_VOICE_MODE_TO_TEXT[Options.AnnouncerVoiceMode];
  return announcerVoiceModeText === undefined
    ? DEFAULT_ANNOUNCER_VOICE_MODE_TEXT
    : announcerVoiceModeText;
}

function getConsoleFontText() {
  const consoleFontText = CONSOLE_FONT_TO_TEXT[Options.ConsoleFont];
  return consoleFontText === undefined
    ? DEFAULT_CONSOLE_FONT_TEXT
    : consoleFontText;
}
