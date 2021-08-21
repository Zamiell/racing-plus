import { saveDataManager, saveDataManagerSave } from "isaacscript-common";
import {
  ALL_CONFIG_DESCRIPTIONS,
  ALL_HOTKEY_DESCRIPTIONS,
  BOSS_CHANGES_1,
  BOSS_CHANGES_2,
  BUG_FIXES,
  CHARACTER_CHANGES,
  ConfigDescriptionArray,
  CUSTOM_HOTKEYS,
  CUTSCENE_CHANGES,
  ENEMY_CHANGES,
  GAMEPLAY_CHANGES,
  GRAPHIC_CHANGES,
  MAJOR_CHANGES,
  OTHER_FEATURES,
  QUALITY_OF_LIFE_CHANGES_1,
  QUALITY_OF_LIFE_CHANGES_2,
  REMOVALS,
  SOUND_CHANGES,
} from "./configDescription";
import Config from "./types/Config";
import Hotkeys from "./types/Hotkeys";

const CATEGORY_NAME = "Racing+";
const PRESETS_NAME = "Presets";

const v = {
  persistent: {
    config: new Config(),
    hotkeys: new Hotkeys(),
  },
};
export const config = v.persistent.config;
export const hotkeys = v.persistent.hotkeys;

export function init(): void {
  if (ModConfigMenu === null || InputHelper === null) {
    return;
  }

  // Since config and hotkeys are TypeScriptToLua classes, they have metatables on them,
  // which the save data manager does not support
  // We don't need to use any class functions on these objects,
  // so we can manually remove the metatable before feeding it to the save data manager
  setmetatable(config, null);
  setmetatable(hotkeys, null);

  saveDataManager("modConfigMenu", v);

  deleteOldConfig();
  validateConfigDescriptions();

  registerPresets();
  registerSubMenuConfig("Major", MAJOR_CHANGES);
  registerSubMenuHotkeys("Hotkeys", CUSTOM_HOTKEYS);
  registerSubMenuConfig("Chars", CHARACTER_CHANGES);
  registerSubMenuConfig("Boss (1)", BOSS_CHANGES_1);
  registerSubMenuConfig("Boss (2)", BOSS_CHANGES_2);
  registerSubMenuConfig("Enemies", ENEMY_CHANGES);
  registerSubMenuConfig("QoL (1)", QUALITY_OF_LIFE_CHANGES_1);
  registerSubMenuConfig("QoL (2)", QUALITY_OF_LIFE_CHANGES_2);
  registerSubMenuConfig("Gameplay", GAMEPLAY_CHANGES);
  registerSubMenuConfig("Removals", REMOVALS);
  registerSubMenuConfig("Cutscene", CUTSCENE_CHANGES);
  registerSubMenuConfig("Bug Fixes", BUG_FIXES);
  registerSubMenuConfig("Graphics", GRAPHIC_CHANGES);
  registerSubMenuConfig("Sound", SOUND_CHANGES);
  registerSubMenuConfig("Other", OTHER_FEATURES);
}

function deleteOldConfig() {
  // If we reload the mod, then it will create duplicates of every entry
  // Thus, we must first purge all settings relating to Racing+
  // ModConfigMenu.MenuData = [];
  const categoryID = ModConfigMenu.GetCategoryIDByName(CATEGORY_NAME);
  if (categoryID !== null) {
    ModConfigMenu.MenuData.set(categoryID, {
      Name: CATEGORY_NAME,
      Subcategories: [],
    });
  }
}

// The descriptions are typed as having keys of "keyof Config | keyof Hotkeys"
// Thus, it is impossible for them to contain any incorrect data
// However, the inverse is not true (i.e. a config value can be missing a description)
// So, we check this at runtime
function validateConfigDescriptions() {
  for (const key of Object.keys(config)) {
    if (!ALL_CONFIG_DESCRIPTIONS.some((array) => key === array[0])) {
      error(`Failed to find key "${key}" in the config descriptions.`);
    }
  }

  for (const key of Object.keys(hotkeys)) {
    if (!ALL_HOTKEY_DESCRIPTIONS.some((array) => key === array[0])) {
      error(`Failed to find key "${key}" in the hotkey descriptions.`);
    }
  }
}

function registerPresets() {
  ModConfigMenu.AddText(CATEGORY_NAME, PRESETS_NAME, () => "Mod by Zamiel");
  ModConfigMenu.AddText(CATEGORY_NAME, PRESETS_NAME, () => "isaacracing.net");
  ModConfigMenu.AddSpace(CATEGORY_NAME, PRESETS_NAME);

  ModConfigMenu.AddSetting(CATEGORY_NAME, PRESETS_NAME, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => isAllConfigSetTo(true),
    Display: () => `Enable every setting: ${onOff(isAllConfigSetTo(true))}`,
    OnChange: (newValue: boolean | number) => {
      const booleanNewValue = newValue as boolean;
      setAllSettings(booleanNewValue);
    },
    Info: ["Turn every configurable setting on."],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, PRESETS_NAME, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => isAllConfigSetTo(false),
    Display: () => `Disable every setting: ${onOff(isAllConfigSetTo(false))}`,
    OnChange: (newValue: boolean | number) => {
      const booleanNewValue = newValue as boolean;
      setAllSettings(!booleanNewValue);
    },
    Info: ["Turn every configurable setting off."],
  });
}

function isAllConfigSetTo(value: boolean) {
  for (const key of Object.keys(config)) {
    const assertedKey = key as keyof Config;
    const currentValue = config[assertedKey];
    if (currentValue !== value) {
      return false;
    }
  }

  return true;
}

function setAllSettings(newValue: boolean) {
  for (const key of Object.keys(config)) {
    const assertedKey = key as keyof Config;
    config[assertedKey] = newValue;
  }

  saveDataManagerSave();
}

function registerSubMenuConfig(
  subMenuName: string,
  descriptions: ConfigDescriptionArray,
) {
  for (const [configName, array] of descriptions) {
    const [optionType, code, shortDescription, longDescription] = array;

    ModConfigMenu.AddSetting(CATEGORY_NAME, subMenuName, {
      Type: optionType,
      CurrentSetting: () => config[configName as keyof Config],
      Display: () =>
        getDisplayTextBoolean(
          configName as keyof Config,
          code,
          shortDescription,
        ),
      OnChange: (newValue: number | boolean) => {
        config[configName as keyof Config] = newValue as boolean;
        saveDataManagerSave();
      },
      Info: [longDescription],
    });
  }
}

function registerSubMenuHotkeys(
  subMenuName: string,
  descriptions: ConfigDescriptionArray,
) {
  for (const [configName, array] of descriptions) {
    const [optionType, , shortDescription, longDescription] = array;

    ModConfigMenu.AddSetting(CATEGORY_NAME, subMenuName, {
      Type: optionType,
      CurrentSetting: () => hotkeys[configName as keyof Hotkeys],
      Display: () =>
        getDisplayTextKeyboardController(
          configName as keyof Hotkeys,
          optionType,
          shortDescription,
        ),
      OnChange: (newValue: number | boolean) => {
        if (newValue === null) {
          // The value passed by Mod Config Menu will be null if the user canceled a popup dialog
          newValue = getDefaultValue(optionType);
        }
        hotkeys[configName as keyof Hotkeys] = newValue as number;
      },
      Popup: () => getPopupDescription(configName as keyof Hotkeys, optionType),
      PopupGfx: getPopupGfx(optionType),
      PopupWidth: getPopupWidth(optionType),
      Info: [longDescription],
    });
  }
}

function getDefaultValue(optionType: ModConfigMenuOptionType) {
  switch (optionType) {
    case ModConfigMenuOptionType.BOOLEAN: {
      return true;
    }

    case ModConfigMenuOptionType.KEYBIND_KEYBOARD:
    case ModConfigMenuOptionType.KEYBIND_CONTROLLER: {
      return -1;
    }

    default: {
      error(`Option types of ${optionType} are unsupported.`);
      return false;
    }
  }
}

function getDisplayTextBoolean(
  configName: keyof Config,
  code: string,
  shortDescription: string,
) {
  switch (code) {
    case "": {
      return `${shortDescription}: n/a`;
    }

    default: {
      const currentValue = config[configName];
      return `${code} - ${shortDescription}: ${onOff(currentValue)}`;
    }
  }
}

function getDisplayTextKeyboardController(
  configName: keyof Hotkeys,
  optionType: ModConfigMenuOptionType,
  shortDescription: string,
) {
  switch (optionType) {
    case ModConfigMenuOptionType.KEYBIND_KEYBOARD: {
      const currentValue = hotkeys[configName];

      let text: string;
      if (currentValue === -1) {
        text = "None";
      } else {
        const stringValue = InputHelper.KeyboardToString.get(currentValue);
        text = stringValue === null ? "Unknown Key" : stringValue;
      }

      return `${shortDescription}: ${text} (keyboard)`;
    }

    case ModConfigMenuOptionType.KEYBIND_CONTROLLER: {
      const currentValue = hotkeys[configName];

      let text: string;
      if (currentValue === -1) {
        text = "None";
      } else {
        const stringValue = InputHelper.ControllerToString.get(currentValue);
        text = stringValue === null ? "Unknown Button" : stringValue;
      }

      return `${shortDescription}: ${text} (controller)`;
    }

    default: {
      error(`Option types of ${optionType} are unsupported.`);
      return "Unknown";
    }
  }
}

function onOff(setting: boolean) {
  return setting ? "ON" : "OFF";
}

function getPopupDescription(
  configName: keyof Hotkeys,
  optionType: ModConfigMenuOptionType,
) {
  const currentValue = hotkeys[configName];

  const deviceString = popupGetDeviceString(optionType);
  const keepSettingString = popupGetKeepSettingString(optionType, currentValue);
  const backKeyText = popupGetBackKeyText();
  return `Press a button on your ${deviceString} to change this setting.$newline$newline${keepSettingString}Press "${backKeyText}" to go back and clear this setting.`;
}

function popupGetDeviceString(optionType: ModConfigMenuOptionType) {
  switch (optionType) {
    case ModConfigMenuOptionType.KEYBIND_KEYBOARD: {
      return "keyboard";
    }

    case ModConfigMenuOptionType.KEYBIND_CONTROLLER: {
      return "controller";
    }

    default: {
      error(`Option types of ${optionType} are unsupported.`);
      return "unknown";
    }
  }
}

function popupGetKeepSettingString(
  optionType: ModConfigMenuOptionType,
  currentValue: int,
) {
  if (currentValue === -1) {
    return "";
  }

  const currentKeyName = getKeyName(optionType, currentValue);
  return `This setting is currently set to "${currentKeyName}".$newlinePress this button to keep it unchanged.$newline$newline`;
}

function getKeyName(optionType: ModConfigMenuOptionType, key: int) {
  switch (optionType) {
    case ModConfigMenuOptionType.KEYBIND_KEYBOARD: {
      return InputHelper.KeyboardToString.get(key);
    }

    case ModConfigMenuOptionType.KEYBIND_CONTROLLER: {
      return InputHelper.ControllerToString.get(key);
    }

    default: {
      error(`Option types of ${optionType} are unsupported.`);
      return "unknown";
    }
  }
}

function popupGetBackKeyText() {
  const lastBackPressed = ModConfigMenu.Config.LastBackPressed;

  const keyboardString = InputHelper.KeyboardToString.get(lastBackPressed);
  if (keyboardString !== null) {
    return keyboardString;
  }

  const controllerString = InputHelper.ControllerToString.get(lastBackPressed);
  if (controllerString !== null) {
    return controllerString;
  }

  return "back";
}

function getPopupGfx(optionType: ModConfigMenuOptionType) {
  return optionType === ModConfigMenuOptionType.KEYBIND_KEYBOARD ||
    optionType === ModConfigMenuOptionType.KEYBIND_CONTROLLER
    ? ModConfigMenu.PopupGfx.WIDE_SMALL
    : null;
}

function getPopupWidth(optionType: ModConfigMenuOptionType) {
  return optionType === ModConfigMenuOptionType.KEYBIND_KEYBOARD ||
    optionType === ModConfigMenuOptionType.KEYBIND_CONTROLLER
    ? 280
    : null;
}
