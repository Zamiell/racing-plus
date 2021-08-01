import g from "../../../../globals";
import { incrementRNG } from "../../../../util";
import { getRoomSelection, spawnLuaRoom } from "./rooms";

export default function angel(): void {
  g.run.seededRooms.RNG.angelSelection = incrementRNG(
    g.run.seededRooms.RNG.angelSelection,
  );
  const luaRoom = getRoomSelection(false, g.run.seededRooms.RNG.angelSelection);
  spawnLuaRoom(luaRoom, false);
}
