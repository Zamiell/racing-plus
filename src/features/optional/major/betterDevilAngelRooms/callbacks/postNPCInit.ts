import { NPCState, RoomType } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";

export function pitfall(npc: EntityNPC): void {
  if (!config.BetterDevilAngelRooms) {
    return;
  }

  const room = game.GetRoom();
  const roomType = room.GetType();

  if (roomType !== RoomType.DEVIL) {
    return;
  }

  // Prevent pitfalls from displaying an "Appear" animation when in Devil Rooms, as it is
  // distracting. This must be in the `POST_NPC_INIT` callback because we want to cancel the
  // animation on both the first spawning and subsequent entries to the room. There is also a bug
  // where if you try to do this in the `POST_NEW_ROOM` callback, the Pitfall becomes invisible.
  npc.State = NPCState.IDLE;
}
