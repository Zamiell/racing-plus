import { nextSeed } from "isaacscript-common";
import { getRoomDebug, getRoomSelection, spawnLuaRoom } from "./rooms";
import v from "./v";

export default function angel(): void {
  v.run.seeds.angelSelection = nextSeed(v.run.seeds.angelSelection);
  let luaRoom = getRoomSelection(false, v.run.seeds.angelSelection);

  if (v.run.debugRoomNum !== null) {
    luaRoom = getRoomDebug(false, v.run.debugRoomNum);
    v.run.debugRoomNum = null;
  }

  spawnLuaRoom(luaRoom, false);
}
