import { CardType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getDoors,
  gridCoordinatesToWorldPosition,
  spawnCard,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/**
 * We need to spawn the card in a spot that won't be blocked. The center of the room can be blocked
 * in one specific Ultra Secret Room. Use the left side of the room instead (which is free in all
 * Ultra Secret Rooms).
 */
const CARD_POSITION = gridCoordinatesToWorldPosition(2, 3);

/**
 * Rarely, Ultra Secret Rooms can have no doors. Work around this by spawning a Fool card for the
 * player.
 */
export class PreventUltraSecretRoomSoftlock extends ConfigurableModFeature {
  configKey: keyof Config = "PreventUltraSecretRoomSoftlock";

  @CallbackCustom(
    ModCallbackCustom.POST_NEW_ROOM_REORDERED,
    RoomType.ULTRA_SECRET,
  )
  postNewRoomReorderedUltraSecret(): void {
    const doors = getDoors();
    if (doors.length > 0) {
      return;
    }

    spawnCard(CardType.FOOL, CARD_POSITION);
  }
}
