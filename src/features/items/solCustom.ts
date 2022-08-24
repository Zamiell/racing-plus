import { CollectibleType } from "isaac-typescript-definitions";
import {
  addCollectibleCostume,
  anyPlayerHasCollectible,
  removeCollectibleFromItemTracker,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { config } from "../../modConfigMenu";

const OLD_COLLECTIBLE_TYPE = CollectibleType.SOL;
const NEW_COLLECTIBLE_TYPE = CollectibleTypeCustom.FLIP_CUSTOM;

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (!config.fastClear) {
    return;
  }

  // Automatically replace the vanilla flip with the custom one. (This handles Tainted Lazarus
  // correctly, since he is given Flip in the normal active item slot.)
  if (player.HasCollectible(OLD_COLLECTIBLE_TYPE)) {
    player.RemoveCollectible(OLD_COLLECTIBLE_TYPE);
    removeCollectibleFromItemTracker(OLD_COLLECTIBLE_TYPE);
    player.AddCollectible(NEW_COLLECTIBLE_TYPE, 0, false);
    addCollectibleCostume(player, OLD_COLLECTIBLE_TYPE);
  }
}

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  if (!anyPlayerHasCollectible(NEW_COLLECTIBLE_TYPE)) {
    return;
  }

  // TODO
}
