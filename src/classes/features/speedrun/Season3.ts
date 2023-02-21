import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, inStartingRoom, onFirstFloor } from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { v } from "./season3/v";

export class Season3 extends ChallengeModFeature {
  challenge = ChallengeCustom.SEASON_3;
  v = v;

  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.GLOWING_HOUR_GLASS) // 23, 422
  preUseItemGlowingHourGlass(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return this.preventHomeWarp(player);
  }

  /**
   * It is possible to warp to Home by using the Glowing Hour Glass on the first room of the run.
   */
  preventHomeWarp(player: EntityPlayer): boolean | undefined {
    if (onFirstFloor() && inStartingRoom()) {
      player.AnimateSad();
      return true;
    }

    return undefined;
  }
}
