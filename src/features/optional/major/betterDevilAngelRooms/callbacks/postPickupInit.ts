import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  getPlayerIndex,
  getPlayers,
  getRoomListIndex,
  onStage,
  repeat,
} from "isaacscript-common";
import { v } from "../v";

/**
 * Guppy's Eye will not work correctly with Red Chests that grant a devil deal item because Racing+
 * changes what the vanilla pools normally give. Since there is not a Guppy's Eye API, this bug is
 * not fixable. However, as a workaround, we can temporarily remove Guppy's Eye from the player to
 * prevent confusion.
 */
export function betterDevilAngelRoomsPostPickupInitRedChest(): void {
  if (!onStage(LevelStage.DARK_ROOM_CHEST)) {
    return;
  }

  const roomListIndex = getRoomListIndex();

  for (const player of getPlayers()) {
    const numGuppysEye = player.GetCollectibleNum(CollectibleType.GUPPYS_EYE);
    repeat(numGuppysEye, () => {
      player.RemoveCollectible(
        CollectibleType.GUPPYS_EYE,
        false,
        undefined,
        false,
      );

      const playerIndex = getPlayerIndex(player);
      v.run.regiveGuppysEyePlayers.push(playerIndex);
      v.run.regiveGuppysEyeRoomListIndex = roomListIndex;
    });
  }
}
