import g from "./globals";
import * as saveDat from "./saveDat";
import Config from "./types/Config";

export function set<K extends keyof Config, V extends Config[K]>(
  key: K,
  value: V,
): void {
  g.config[key] = value;

  // Every time they change an option in the menu, save it to disk
  saveDat.save();
}
