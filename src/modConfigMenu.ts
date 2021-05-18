import * as config from "./config";
import featuresMap from "./featuresMap";
import g from "./globals";

const CATEGORY_NAME = "Racing+";

export function register(): void {
  if (ModConfigMenu === null) {
    return;
  }

  debugModConfigMenu();
  validateFeatures();
  registerFeatures();
}

function debugModConfigMenu() {
  // Uncomment this when debugging to clear all menu entires upon reloading
  ModConfigMenu.MenuData = [];
}

function validateFeatures() {
  for (const key of Object.keys(g.config)) {
    if (!featuresMap.has(key as keyof Config)) {
      error(`Failed to find config key "${key}" in the features map.`);
    }
  }
}

function registerFeatures() {
  for (const [key, value] of featuresMap.entries()) {
    const [code, shortDescription, longDescription] = value;

    ModConfigMenu.AddSetting(CATEGORY_NAME, "Features", {
      Type: ModConfigMenuOptionType.BOOLEAN,
      CurrentSetting: () => g.config[key],
      Display: () => `${code} - ${shortDescription}: ${onOff(g.config[key])}`,
      OnChange: (newBoolean: boolean) => {
        config.set(key, newBoolean);
      },
      Info: [longDescription],
    });
  }
}

function onOff(setting: boolean) {
  return setting ? "ON" : "OFF";
}
