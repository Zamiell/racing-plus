import * as json from "json";
import g from "./globals";
import "./lib/RevelCopyTable"; // eslint-disable-line import/extensions
import Config from "./types/Config";
import Globals from "./types/Globals";
import GlobalsRun from "./types/GlobalsRun";
import RaceData from "./types/RaceData";
import SpeedrunData from "./types/SpeedrunData";

let mod: Mod | null = null;

export function setMod(newMod: Mod): void {
  mod = newMod;
}

interface GlobalsToSave {
  config: Config;
  run: GlobalsRun;
  race: RaceData;
  speedrun: SpeedrunData;
}

export function save(): void {
  if (mod === null) {
    error('"saveDat.save()" was called without the mod being initialized.');
  }

  // We don't want to write everything in the globals table to disk,
  // as it contains things like cached API functions
  // Only explicitly save the sub-tables that cannot be regenerated
  const globalsToSave: GlobalsToSave = {
    config: g.config,
    run: g.run,
    race: g.race,
    speedrun: g.speedrun,
  };

  // Scrub some specific data that cannot be represented in JSON
  globalsToSave.run.fastClear.aliveEnemies = new LuaTable();

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

  let newGlobals: GlobalsToSave | null = null;
  function loadJSON(this: void) {
    if (mod === null) {
      return;
    }
    const modDataString = Isaac.LoadModData(mod);
    if (modDataString.trim() === "") {
      newGlobals = new Globals();
    } else {
      newGlobals = json.decode(modDataString) as GlobalsToSave;
    }
  }
  const [ok] = pcall(loadJSON);
  if (ok && newGlobals !== null) {
    loadSuccess(newGlobals);
  } else {
    error('Failed to load the "save#.dat" file.');
  }
}

function loadSuccess(newGlobals: GlobalsToSave) {
  // The loaded save data might have an older schema than the one we are currently using
  // We can use the RevelCopyTable function to create a new table that will have any missing fields
  // copied over from the default table
  const oldGlobals: GlobalsToSave = {
    config: g.config,
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
  g.run = validatedNewGlobals.run;
  g.race = validatedNewGlobals.race;
  g.speedrun = validatedNewGlobals.speedrun;
}
