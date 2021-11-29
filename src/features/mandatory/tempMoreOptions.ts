// In some situations, we force the first Treasure Room to have two items

import {
  getEffectiveStage,
  removeCollectibleFromItemTracker,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";

const v = {
  run: {
    removeMoreOptions: false,
  },
};

export function init(): void {
  saveDataManager("tempMoreOptions", v);
}

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const effectiveStage = getEffectiveStage();
  const player = Isaac.GetPlayer();

  // Ensure that the "More Options" buff does not persist beyond Basement 1
  // (it is removed as soon as they enter the first Treasure Room,
  // but they might have skipped the Basement 1 Treasure Room for some reason)
  if (v.run.removeMoreOptions && effectiveStage >= 2) {
    v.run.removeMoreOptions = false;
    player.RemoveCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS);
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (18)
export function postNewRoom(): void {
  const roomType = g.r.GetType();
  const player = Isaac.GetPlayer();

  if (v.run.removeMoreOptions && roomType === RoomType.ROOM_TREASURE) {
    v.run.removeMoreOptions = false;
    player.RemoveCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS);
  }
}

export function give(player: EntityPlayer): void {
  // If the character already started with More Options, then do nothing
  if (player.HasCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS)) {
    return;
  }

  player.AddCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS);
  removeCollectibleFromItemTracker(CollectibleType.COLLECTIBLE_MORE_OPTIONS);

  // We don't want the costume to show
  const itemConfigItem = g.itemConfig.GetCollectible(
    CollectibleType.COLLECTIBLE_MORE_OPTIONS,
  );
  if (itemConfigItem === undefined) {
    error(
      `Failed to get the item config for: ${CollectibleType.COLLECTIBLE_MORE_OPTIONS}`,
    );
  }
  player.RemoveCostume(itemConfigItem);

  // Mark to remove more Options upon entering the first Treasure Room or upon reaching the next
  // floor
  v.run.removeMoreOptions = true;
}
