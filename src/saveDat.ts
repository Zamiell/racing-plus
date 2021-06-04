import * as json from "json";
import g from "./globals";
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

  const encodedData = json.encode(globalsToSave);
  mod.SaveData(encodedData);
}

export function load(): void {
  if (mod === null) {
    error('"saveDat.load()" was called without the mod being initialized.');
  }

  if (!Isaac.HasModData(mod)) {
    // There is no "save#.dat" file for this save slot
    return;
  }

  const modDataString = readSaveDat();
  const newGlobals = convertStringToTable(modDataString);

  const oldGlobals: GlobalsToSave = {
    config: g.config,
    hotkeys: g.hotkeys,
    run: g.run,
    race: g.race,
    speedrun: g.speedrun,
  };
  tableUtils.merge(oldGlobals as LuaTable, newGlobals);
}

function readSaveDat() {
  const defaultModData = "{}";
  let modDataString = defaultModData;
  function loadModData(this: void) {
    if (mod === null) {
      error('"loadModData()" was called without the mod being initialized.');
    }
    modDataString = Isaac.LoadModData(mod);
  }
  const [ok] = pcall(loadModData);
  if (!ok) {
    modDataString = defaultModData;
  }
  modDataString = modDataString.trim();
  if (modDataString === "") {
    modDataString = defaultModData;
  }

  return modDataString;
}

function convertStringToTable(modDataString: string) {
  const defaultTable = new LuaTable();
  let table: LuaTable | null = null;
  function decodeJSON(this: void) {
    table = json.decode(modDataString) as LuaTable;
  }
  const [ok] = pcall(decodeJSON);
  if (!ok || table === null) {
    table = defaultTable;
  }

  return table;
}

/*
function loadSuccess(newGlobals: GlobalsToSave) {
  // The loaded save data might have an older schema than the one we are currently using
  // We can use the RevelCopyTable function to create a new table that will have any missing fields
  // copied over from the default table
  const oldGlobals: GlobalsToSave = {
    config: g.config,
    hotkeys: g.hotkeys,
    run: g.run,
    race: g.race,
    speedrun: g.speedrun,
  };
  const validatedNewGlobals = RevelCopyTable(
    newGlobals as unknown as LuaTable,
    oldGlobals as unknown as LuaTable,
  ) as unknown as GlobalsToSave;

  // Restore the specific parts of the globals that were saved
  g.config = validatedNewGlobals.config;
  g.hotkeys = validatedNewGlobals.hotkeys;
  g.run = validatedNewGlobals.run;
  g.race = validatedNewGlobals.race;
  g.speedrun = validatedNewGlobals.speedrun;
}
*/
