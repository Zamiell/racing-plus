import type { ActiveSlot } from "isaac-typescript-definitions";
import {
  CollectibleType,
  Direction,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import { Callback, hasFlag } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { setFastTravelFadingToBlack } from "../major/fastTravel/setNewState";

export class FastForgetMeNow extends ConfigurableModFeature {
  configKey: keyof Config = "FastForgetMeNow";

  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.FORGET_ME_NOW)
  preUseItemForgetMeNow(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
    useFlags: BitFlags<UseFlag>,
    activeSlot: ActiveSlot,
    _customVarData: int,
  ): boolean | undefined {
    // This feature depends on fast-travel.
    if (!config.FastTravel) {
      return;
    }

    if (!hasFlag(useFlags, UseFlag.OWNED)) {
      return;
    }

    player.RemoveCollectible(
      CollectibleType.FORGET_ME_NOW,
      undefined,
      activeSlot,
    );

    // Call the fast-travel function directly to emulate the player having touched a trapdoor.
    setFastTravelFadingToBlack(player, player.Position, Direction.NO_DIRECTION);

    // Cancel the original effect.
    return true;
  }
}
