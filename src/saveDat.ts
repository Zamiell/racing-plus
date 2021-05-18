import * as json from "json";
import g from "./globals";
import "./lib/RevelCopyTable"; // eslint-disable-line import/extensions
import Globals from "./types/Globals";

let mod: Mod | null = null;

export function setMod(newMod: Mod): void {
  mod = newMod;
}

export function save(): void {
  if (mod === null) {
    return;
  }

  const encodedData = json.encode(g);
  mod.SaveData(encodedData);
}

export function load(): void {
  if (mod === null) {
    return;
  }

  if (!Isaac.HasModData(mod)) {
    // There is no "save#.dat" file for this save slot
    return;
  }

  let newGlobals: Globals | null = null;
  function loadJSON(this: void) {
    if (mod === null) {
      return;
    }
    const modDataString = Isaac.LoadModData(mod);
    if (modDataString.trim() === "") {
      newGlobals = new Globals();
    } else {
      newGlobals = json.decode(modDataString) as Globals;
    }
  }
  const [ok] = pcall(loadJSON);
  if (ok && newGlobals !== null) {
    loadSuccess(newGlobals);
  } else {
    error('Failed to load the "save#.dat" file.');
  }
}

function loadSuccess(newGlobals: Globals) {
  // The loaded save data might have an older schema than the one we are currently using
  // We can use the RevelCopyTable function to create a new table that will have any missing fields
  // copied over from the default table
  const validatedNewGlobals = RevelCopyTable(
    newGlobals as unknown as LuaTable,
    g as unknown as LuaTable,
  ) as unknown as Globals;

  // We have loaded a new copy of the Globals class from the disk
  // However, we cannot directly overwrite the globals class with the new one,
  // since that would override the reference that the entire program's modules are sharing
  // Instead, update all of the main objects on top of the globals variable
  g.config = validatedNewGlobals.config;
  g.run = validatedNewGlobals.run;
}
