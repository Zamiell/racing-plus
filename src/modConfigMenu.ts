import type { Controller } from "isaac-typescript-definitions";
import { Keyboard } from "isaac-typescript-definitions";
import { asString, controllerToString } from "isaacscript-common";
import { Config } from "./classes/Config";
import { Hotkeys } from "./classes/Hotkeys";
import type { ConfigDescriptions } from "./configDescription";
import {
  ALL_CONFIG_DESCRIPTIONS,
  ALL_HOTKEY_DESCRIPTIONS,
  BOSS_CHANGES_1,
  BOSS_CHANGES_2,
  BOSS_CHANGES_3,
  BUG_FIXES_1,
  BUG_FIXES_2,
  CHARACTER_CHANGES,
  CUSTOM_HOTKEYS,
  CUTSCENE_CHANGES,
  ENEMY_CHANGES_1,
  ENEMY_CHANGES_2,
  GAMEPLAY_CHANGES,
  GRAPHIC_CHANGES_1,
  GRAPHIC_CHANGES_2,
  GRAPHIC_CHANGES_3,
  MAJOR_CHANGES,
  OTHER_FEATURES,
  QUALITY_OF_LIFE_CHANGES_1,
  QUALITY_OF_LIFE_CHANGES_2,
  QUALITY_OF_LIFE_CHANGES_3,
  REMOVALS,
  SOUND_CHANGES,
} from "./configDescription";
import { mod } from "./mod";

const CATEGORY_NAME = "Racing+";
const PRESETS_NAME = "Presets";

const v = {
  persistent: {
    config: new Config(),
    hotkeys: new Hotkeys(),
  },
};

export const { config, hotkeys } = v.persistent;

export function modConfigMenuInit(): void {
  mod.saveDataManager("modConfigMenu", v);

  if (ModConfigMenu === undefined) {
    return;
  }

  deleteOldConfig(CATEGORY_NAME);
  validateConfigDescriptions();

  registerPresets();
  registerSubMenuConfig("Major", MAJOR_CHANGES);
  registerSubMenuHotkeys("Hotkeys", CUSTOM_HOTKEYS);
  registerSubMenuConfig("Chars", CHARACTER_CHANGES);
  registerSubMenuConfig("Boss (1)", BOSS_CHANGES_1);
  registerSubMenuConfig("Boss (2)", BOSS_CHANGES_2);
  registerSubMenuConfig("Boss (3)", BOSS_CHANGES_3);
  registerSubMenuConfig("NPCs (1)", ENEMY_CHANGES_1);
  registerSubMenuConfig("NPCs (2)", ENEMY_CHANGES_2);
  registerSubMenuConfig("QoL (1)", QUALITY_OF_LIFE_CHANGES_1);
  registerSubMenuConfig("QoL (2)", QUALITY_OF_LIFE_CHANGES_2);
  registerSubMenuConfig("QoL (3)", QUALITY_OF_LIFE_CHANGES_3);
  registerSubMenuConfig("Gameplay", GAMEPLAY_CHANGES);
  registerSubMenuConfig("Removals", REMOVALS);
  registerSubMenuConfig("Cutscenes", CUTSCENE_CHANGES);
  registerSubMenuConfig("Fixes (1)", BUG_FIXES_1);
  registerSubMenuConfig("Fixes (2)", BUG_FIXES_2);
  registerSubMenuConfig("GFX (1)", GRAPHIC_CHANGES_1);
  registerSubMenuConfig("GFX (2)", GRAPHIC_CHANGES_2);
  registerSubMenuConfig("GFX (3)", GRAPHIC_CHANGES_3);
  registerSubMenuConfig("Sounds", SOUND_CHANGES);
  registerSubMenuConfig("Other", OTHER_FEATURES);
}

export function deleteOldConfig(categoryName: string): void {
  if (ModConfigMenu === undefined) {
    return;
  }

  // If we reload the mod, then it will create duplicates of every entry. Thus, we must first purge
  // all settings relating to the mod.
  const categoryID = ModConfigMenu.GetCategoryIDByName(categoryName);
  if (categoryID !== undefined) {
    ModConfigMenu.MenuData.set(categoryID, {
      Name: categoryName,
      Subcategories: [],
    });
  }
}

/**
 * The descriptions are typed as having keys of `keyof Config | keyof Hotkeys | ""`. Thus, it is
 * impossible for them to contain any incorrect data. However, the inverse is not true (i.e. a
 * config value can be missing a description). So, we check this at runtime.
 */
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

  // Check for duplicate codes.
  const codes = new Set<string>();
  for (const element of ALL_CONFIG_DESCRIPTIONS) {
    const [name, configValues] = element;
    const [_optionType, code, title, description] = configValues;

    if (code !== "" && codes.has(code)) {
      error(`There is a duplicate config description code of: ${code}`);
    }
    codes.add(code);

    if (asString(title) === "") {
      error(`The title for config description "${name}" is blank.`);
    }

    if (asString(description) === "") {
      error(`The description for config description "${name}" is blank.`);
    }
  }
}

function registerPresets() {
  if (ModConfigMenu === undefined) {
    return;
  }

  ModConfigMenu.AddText(CATEGORY_NAME, PRESETS_NAME, () => "Mod by Zamiel");
  ModConfigMenu.AddText(CATEGORY_NAME, PRESETS_NAME, () => "isaacracing.net");
  ModConfigMenu.AddSpace(CATEGORY_NAME, PRESETS_NAME);

  ModConfigMenu.AddSetting(CATEGORY_NAME, PRESETS_NAME, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => isAllConfigSetTo(true),
    Display: () => `Enable every setting: ${onOff(isAllConfigSetTo(true))}`,
    OnChange: (newValue: boolean | number | undefined) => {
      if (newValue === undefined) {
        return;
      }

      const booleanNewValue = newValue as boolean;
      setAllModConfigMenuSettings(booleanNewValue);
    },
    Info: ["Turn every configurable setting on."],
  });

  ModConfigMenu.AddSetting(CATEGORY_NAME, PRESETS_NAME, {
    Type: ModConfigMenuOptionType.BOOLEAN,
    CurrentSetting: () => isAllConfigSetTo(false),
    Display: () => `Disable every setting: ${onOff(isAllConfigSetTo(false))}`,
    OnChange: (newValue: boolean | number | undefined) => {
      if (newValue === undefined) {
        return;
      }

      const booleanNewValue = newValue as boolean;
      setAllModConfigMenuSettings(!booleanNewValue);
    },
    Info: ["Turn every configurable setting off."],
  });
}

function isAllConfigSetTo(value: boolean): boolean {
  for (const key of Object.keys(config)) {
    const assertedKey = key as keyof Config;
    const currentValue = config[assertedKey];
    if (currentValue !== value) {
      return false;
    }
  }

  return true;
}

export function setAllModConfigMenuSettings(newValue: boolean): void {
  for (const key of Object.keys(config)) {
    const assertedKey = key as keyof Config;
    config[assertedKey] = newValue;
  }

  mod.saveDataManagerSave();
}

function registerSubMenuConfig(
  subMenuName: string,
  configDescriptions: ConfigDescriptions,
) {
  if (ModConfigMenu === undefined) {
    return;
  }

  for (const [configName, array] of configDescriptions) {
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
      OnChange: (newValue: number | boolean | undefined) => {
        if (newValue === undefined) {
          return;
        }

        config[configName as keyof Config] = newValue as boolean;
        mod.saveDataManagerSave();
      },
      Info: [longDescription],
    });
  }
}

function registerSubMenuHotkeys(
  subMenuName: string,
  configDescriptions: ConfigDescriptions,
) {
  if (ModConfigMenu === undefined) {
    return;
  }

  for (const [configName, array] of configDescriptions) {
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
      OnChange: (newValue: number | boolean | undefined) => {
        if (newValue === undefined) {
          newValue = getDefaultValue(optionType);
        }

        const hotkey = configName as keyof Hotkeys;
        hotkeys[hotkey] = newValue as Keyboard;
      },
      Popup: () => getPopupDescription(configName as keyof Hotkeys, optionType),
      PopupGfx: getPopupGfx(optionType),
      PopupWidth: getPopupWidth(optionType),
      Info: [longDescription],
    });
  }
}

function getDefaultValue(optionType: ModConfigMenuOptionType): true | -1 {
  switch (optionType) {
    case ModConfigMenuOptionType.BOOLEAN: {
      return true;
    }

    case ModConfigMenuOptionType.KEY_BIND_KEYBOARD:
    case ModConfigMenuOptionType.KEY_BIND_CONTROLLER: {
      return -1;
    }

    default: {
      return error(`Option types of ${optionType} are unsupported.`);
    }
  }
}

function getDisplayTextBoolean(
  configName: keyof Config,
  code: string,
  shortDescription: string,
): string {
  if (code === "") {
    return `${shortDescription}: n/a`;
  }

  const currentValue = config[configName];
  return `${code} - ${shortDescription}: ${onOff(currentValue)}`;
}

function getDisplayTextKeyboardController(
  configName: keyof Hotkeys,
  optionType: ModConfigMenuOptionType,
  shortDescription: string,
): string {
  switch (optionType) {
    case ModConfigMenuOptionType.KEY_BIND_KEYBOARD: {
      const currentValue = hotkeys[configName];
      const text = currentValue === -1 ? "None" : Keyboard[currentValue];

      return `${shortDescription}: ${text} (keyboard)`;
    }

    default: {
      return error(`Option types of ${optionType} are unsupported.`);
    }
  }
}

export function onOff(setting: boolean): string {
  return setting ? "ON" : "OFF";
}

function getPopupDescription(
  configName: keyof Hotkeys,
  optionType: ModConfigMenuOptionType,
): string {
  const currentValue = hotkeys[configName];

  const deviceString = popupGetDeviceString(optionType);
  const keepSettingString = popupGetKeepSettingString(optionType, currentValue);
  const backKeyText = popupGetBackKeyText();
  return `Press a button on your ${deviceString} to change this setting.$newline$newline${keepSettingString}Press "${backKeyText}" to go back and clear this setting.`;
}

function popupGetDeviceString(
  optionType: ModConfigMenuOptionType,
): "keyboard" | "controller" {
  switch (optionType) {
    case ModConfigMenuOptionType.KEY_BIND_KEYBOARD: {
      return "keyboard";
    }

    case ModConfigMenuOptionType.KEY_BIND_CONTROLLER: {
      return "controller";
    }

    default: {
      return error(`Option types of ${optionType} are unsupported.`);
    }
  }
}

function popupGetKeepSettingString(
  optionType: ModConfigMenuOptionType,
  currentValue: int,
): string {
  if (currentValue === -1) {
    return "";
  }

  const currentKeyName = getKeyName(optionType, currentValue);
  return `This setting is currently set to "${currentKeyName}".$newlinePress this button to keep it unchanged.$newline$newline`;
}

function getKeyName(optionType: ModConfigMenuOptionType, key: int): string {
  switch (optionType) {
    case ModConfigMenuOptionType.KEY_BIND_KEYBOARD: {
      return Keyboard[key] ?? "Unknown";
    }

    case ModConfigMenuOptionType.KEY_BIND_CONTROLLER: {
      return controllerToString(key as Controller) ?? "Unknown";
    }

    default: {
      return error(`Option types of ${optionType} are unsupported.`);
    }
  }
}

function popupGetBackKeyText(): string {
  if (ModConfigMenu === undefined) {
    return "back";
  }

  const lastBackPressed = ModConfigMenu.Config.LastBackPressed;

  const keyboardString = Keyboard[lastBackPressed];
  if (keyboardString !== undefined) {
    return keyboardString;
  }

  const controllerString = controllerToString(lastBackPressed as Controller);
  if (controllerString !== undefined) {
    return controllerString;
  }

  return "back";
}

function getPopupGfx(optionType: ModConfigMenuOptionType) {
  if (ModConfigMenu === undefined) {
    return undefined;
  }

  return optionType === ModConfigMenuOptionType.KEY_BIND_KEYBOARD ||
    optionType === ModConfigMenuOptionType.KEY_BIND_CONTROLLER
    ? ModConfigMenu.PopupGfx.WIDE_SMALL
    : undefined;
}

function getPopupWidth(optionType: ModConfigMenuOptionType) {
  return optionType === ModConfigMenuOptionType.KEY_BIND_KEYBOARD ||
    optionType === ModConfigMenuOptionType.KEY_BIND_CONTROLLER
    ? 280
    : undefined;
}
