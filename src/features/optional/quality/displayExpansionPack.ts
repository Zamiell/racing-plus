import {
  CollectibleType,
  TrinketType,
  UseFlag,
} from "isaac-typescript-definitions";
import { addFlag, getCollectibleName } from "isaacscript-common";
import { setStreakText } from "../../mandatory/streakText";

const EXPANSION_PACK_USE_FLAGS = addFlag(
  UseFlag.NO_ANIMATION, // 1 << 0
  UseFlag.OWNED, // 1 << 2
);

// ModCallback.POST_USE_ITEM (3)
export function postUseItem(
  collectibleType: CollectibleType,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
): void {
  if (!player.HasTrinket(TrinketType.EXPANSION_PACK)) {
    return;
  }

  if (useFlags !== EXPANSION_PACK_USE_FLAGS) {
    return;
  }

  const collectibleName = getCollectibleName(collectibleType);
  setStreakText(collectibleName);
}
