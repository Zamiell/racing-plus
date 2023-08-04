import { EntityType, PitfallVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  removeAllMatchingEntities,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/**
 * Prevent the bug where if Suction Pitfalls do not complete their "Disappear" animation by the time
 * the player leaves the room, they will re-appear the next time the player enters the room (even
 * though the room is already cleared and they should be gone).
 */
export class RemoveInvalidPitfalls extends ConfigurableModFeature {
  configKey: keyof Config = "RemoveInvalidPitfalls";

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    const roomClear = room.IsClear();
    if (!roomClear) {
      return;
    }

    removeAllMatchingEntities(
      EntityType.PITFALL,
      PitfallVariant.SUCTION_PITFALL,
    );
  }
}
