import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isBethany,
  ModCallbackCustom,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { addCollectibleAndRemoveFromPools } from "../../../utils";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { hasErrors } from "../mandatory/misc/checkErrors/v";

export class Season1 extends ChallengeModFeature {
  challenge = ChallengeCustom.SEASON_1;

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (hasErrors()) {
      return;
    }

    this.giveStartingItems();
  }

  /** Give extra items to some characters. */
  giveStartingItems(): void {
    const player = Isaac.GetPlayer();

    if (isBethany(player)) {
      addCollectibleAndRemoveFromPools(player, CollectibleType.DUALITY);
    }
  }
}
