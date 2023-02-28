import {
  CollectibleType,
  ModCallback,
  TrinketType,
  UseFlag,
} from "isaac-typescript-definitions";
import { addFlag, Callback, getCollectibleName } from "isaacscript-common";
import { setStreakText } from "../../../../features/mandatory/streakText";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const EXPANSION_PACK_USE_FLAGS = addFlag(
  UseFlag.NO_ANIMATION, // 1 << 0
  UseFlag.OWNED, // 1 << 2
);

export class DisplayExpansionPack extends ConfigurableModFeature {
  configKey: keyof Config = "DisplayExpansionPack";

  // 3
  @Callback(ModCallback.POST_USE_ITEM)
  postUseItem(
    collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
    useFlags: BitFlags<UseFlag>,
  ): boolean | undefined {
    if (!player.HasTrinket(TrinketType.EXPANSION_PACK)) {
      return undefined;
    }

    if (useFlags !== EXPANSION_PACK_USE_FLAGS) {
      return undefined;
    }

    const collectibleName = getCollectibleName(collectibleType);
    setStreakText(collectibleName);

    return undefined;
  }
}
