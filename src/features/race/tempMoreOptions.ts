import g from "../../globals";
import { removeItemFromItemTracker } from "../../misc";

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const stage = g.l.GetStage();
  const player = Isaac.GetPlayer(0);
  if (player === null) {
    return;
  }

  // Ensure that the "More Options" buff does not persist beyond Basement 1
  // (it is removed as soon as they enter the first Treasure Room,
  // but they might have skipped the Basement 1 Treasure Room for some reason)
  if (stage >= 2 && g.run.removeMoreOptions) {
    g.run.removeMoreOptions = false;
    player.RemoveCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS);
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (18)
export function postNewRoom(): void {
  const roomType = g.r.GetType();
  const player = Isaac.GetPlayer(0);
  if (player === null) {
    return;
  }

  if (g.run.removeMoreOptions && roomType === RoomType.ROOM_TREASURE) {
    g.run.removeMoreOptions = false;
    player.RemoveCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS);
  }
}

export function give(player: EntityPlayer): void {
  // If the character already started with More Options, then do nothing
  if (player.HasCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS)) {
    return;
  }

  player.AddCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS);
  removeItemFromItemTracker(CollectibleType.COLLECTIBLE_MORE_OPTIONS);

  // We don't want the costume to show
  player.RemoveCostume(
    g.itemConfig.GetCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS),
  );

  // More Options will be removed upon entering the first Treasure Room
  g.run.removeMoreOptions = true;
}
