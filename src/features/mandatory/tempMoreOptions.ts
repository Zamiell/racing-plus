// In some situations, we force the first Treasure Room to have two items.

import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import {
  inRoomType,
  itemConfig,
  onFirstFloor,
  removeCollectibleFromItemTracker,
} from "isaacscript-common";
import { mod } from "../../mod";

const v = {
  run: {
    removeMoreOptions: false,
  },
};

export function init(): void {
  mod.saveDataManager("tempMoreOptions", v);
}

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const player = Isaac.GetPlayer();

  // Ensure that the "More Options" buff does not persist beyond the first floor. (It is removed as
  // soon as they enter the first Treasure Room, but they might have skipped the Basement 1 Treasure
  // Room for some reason.)
  if (v.run.removeMoreOptions && !onFirstFloor()) {
    v.run.removeMoreOptions = false;
    player.RemoveCollectible(CollectibleType.MORE_OPTIONS);
  }
}

// ModCallback.POST_NEW_ROOM (18)
export function postNewRoom(): void {
  const player = Isaac.GetPlayer();

  if (v.run.removeMoreOptions && inRoomType(RoomType.TREASURE)) {
    v.run.removeMoreOptions = false;
    player.RemoveCollectible(CollectibleType.MORE_OPTIONS);
  }
}

/** Validation is performed in the parent function. */
export function give(player: EntityPlayer): void {
  // If the character already started with More Options, then do nothing.
  if (player.HasCollectible(CollectibleType.MORE_OPTIONS)) {
    return;
  }

  player.AddCollectible(CollectibleType.MORE_OPTIONS);
  removeCollectibleFromItemTracker(CollectibleType.MORE_OPTIONS);

  // We don't want the costume to show.
  const itemConfigItem = itemConfig.GetCollectible(
    CollectibleType.MORE_OPTIONS,
  );
  if (itemConfigItem === undefined) {
    error(`Failed to get the item config for: ${CollectibleType.MORE_OPTIONS}`);
  }
  player.RemoveCostume(itemConfigItem);

  // Mark to remove more Options upon entering the first Treasure Room or upon reaching the next
  // floor.
  v.run.removeMoreOptions = true;
}
