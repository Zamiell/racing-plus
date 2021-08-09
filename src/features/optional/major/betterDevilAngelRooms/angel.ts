import { incrementRNG } from "../../../../util";
import { getRoomSelection, spawnLuaRoom } from "./rooms";
import v from "./v";

export default function angel(): void {
  v.run.seeds.angelSelection = incrementRNG(v.run.seeds.angelSelection);
  const luaRoom = getRoomSelection(false, v.run.seeds.angelSelection);
  spawnLuaRoom(luaRoom, false);
}
