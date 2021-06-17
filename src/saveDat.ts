import g from "./globals";
import * as jsonHelper from "./jsonHelper";
import log from "./log";
import * as tableUtils from "./tableUtils";
import GlobalsRunRoom from "./types/GlobalsRunRoom";
import GlobalsToSave from "./types/GlobalsToSave";

let mod: Mod | null = null;

export function setMod(newMod: Mod): void {
  mod = newMod;
}

export function save(): void {
  const isClear = g.r.IsClear();

  if (mod === null) {
    error('"saveDat.save()" was called without the mod being initialized.');
  }

  // Wipe the variables for the current room, since we do not need to store that
  // (it will be re-created as soon as they re-enter the game)
  // Wiping this now should be safe, since the only time that a user can save the state in the
  // middle of a room is by changing a setting using Mod Config Menu, and Mod Config Menu can only
  // be opened when the room is already clear
  g.run.room = new GlobalsRunRoom(isClear);

  // Scrub some specific data that cannot be represented in JSON
  g.run.fastClear.aliveEnemies = new LuaTable();

  // We don't want to write everything in the globals table to disk,
  // as it contains things like cached API functions
  // Only explicitly save the sub-tables that cannot be regenerated
  const globalsToSave: GlobalsToSave = {
    config: g.config,
    hotkeys: g.hotkeys,
    run: g.run,
    race: g.race,
    speedrun: g.speedrun,
  };

  const jsonString = jsonHelper.encode(globalsToSave);
  mod.SaveData(jsonString);
}

export function load(): void {
  if (mod === null) {
    error('"saveDat.load()" was called without the mod being initialized.');
  }

  if (!Isaac.HasModData(mod)) {
    // There is no "save#.dat" file for this save slot
    return;
  }

  const jsonString = readSaveDatFile(mod);
  if (jsonString === null) {
    return;
  }
  const newGlobals = jsonHelper.decode(jsonString);

  const oldGlobals: GlobalsToSave = {
    config: g.config,
    hotkeys: g.hotkeys,
    run: g.run,
    race: g.race,
    speedrun: g.speedrun,
  };
  tableUtils.merge(oldGlobals as LuaTable, newGlobals);
}

function readSaveDatFile(modObject: Mod) {
  const isaacFrameCount = Isaac.GetFrameCount();
  const defaultModData = "{}";

  const [ok, jsonStringOrErrMsg] = pcall(tryLoadModData, modObject);
  if (!ok) {
    log(
      `Racing+ failed to read from the "save#.dat" file on Isaac frame ${isaacFrameCount}: ${jsonStringOrErrMsg}`,
    );
    return defaultModData;
  }

  const jsonStringTrimmed = jsonStringOrErrMsg.trim();
  if (jsonStringTrimmed === "") {
    return defaultModData;
  }

  return jsonStringTrimmed;
}

function tryLoadModData(this: void, modObject: Mod) {
  return Isaac.LoadModData(modObject);
}
