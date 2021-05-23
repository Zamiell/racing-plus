import * as config from "./config";
import {
  ALL_DESCRIPTIONS,
  BUG_FIXES,
  ConfigDescriptionArray,
  CUSTOM_HOTKEYS,
  GAMEPLAY_AND_QUALITY_OF_LIFE_CHANGES,
  MAJOR_CHANGES,
} from "./configDescription";
import g from "./globals";
import Config from "./types/Config";

const CATEGORY_NAME = "Racing+";

export function register(): void {
  if (ModConfigMenu === null) {
    return;
  }

  deleteOldConfig();
  validateConfigDescriptions();

  registerSubMenu("Major", MAJOR_CHANGES);
  registerSubMenu("Hotkeys", CUSTOM_HOTKEYS);
  registerSubMenu("Gameplay", GAMEPLAY_AND_QUALITY_OF_LIFE_CHANGES);
  registerSubMenu("Bug Fixes", BUG_FIXES);
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

function validateConfigDescriptions() {
  // The descriptions are typed as having keys of "keyof Config"
  // Thus, it is impossible for them to contain any non-config data
  // However, the inverse is not true (i.e. a config value can be missing a description)
  // So, we check this at runtime
  for (const key of Object.keys(g.config)) {
    if (!ALL_DESCRIPTIONS.some((array) => key === array[0])) {
      error(`Failed to find config key "${key}" in the config descriptions.`);
    }
  }
}

function registerSubMenu(
  subMenuName: string,
  descriptions: ConfigDescriptionArray,
) {
  for (const [configName, array] of descriptions) {
    const [optionType, code, shortDescription, longDescription] = array;

    ModConfigMenu.AddSetting(CATEGORY_NAME, subMenuName, {
      Type: optionType,
      CurrentSetting: () => g.config[configName],
      Display: () =>
        getDisplayText(configName, optionType, code, shortDescription),
      OnChange: (newValue: number | boolean) => {
        if (newValue === null) {
          // The value passed by Mod Config Menu will be null if the user canceled a popup dialog
          newValue = getDefaultValue(optionType);
        }
        config.set(configName, newValue);
      },
      Popup: getPopup(configName, optionType),
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

function getDisplayText(
  configName: keyof Config,
  optionType: ModConfigMenuOptionType,
  code: string,
  shortDescription: string,
) {
  switch (optionType) {
    case ModConfigMenuOptionType.BOOLEAN: {
      const currentValue = g.config[configName] as boolean;
      return `${code} - ${shortDescription}: ${onOff(currentValue)}`;
    }

    case ModConfigMenuOptionType.KEYBIND_KEYBOARD: {
      const currentValue = g.config[configName] as number;

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
      const currentValue = g.config[configName] as number;

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

function getPopup(
  configName: keyof Config,
  optionType: ModConfigMenuOptionType,
) {
  return optionType === ModConfigMenuOptionType.KEYBIND_KEYBOARD ||
    optionType === ModConfigMenuOptionType.KEYBIND_CONTROLLER
    ? () => popup(configName, optionType)
    : null;
}

function popup(configName: keyof Config, optionType: ModConfigMenuOptionType) {
  const currentValue = g.config[configName] as int;

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
