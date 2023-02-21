import { CollectibleType, PlayerType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { addCollectibleAndRemoveFromPools } from "../../../utilsGlobals";
import { ChallengeModFeature } from "../../ChallengeModFeature";

export class Season1 extends ChallengeModFeature {
  challenge = ChallengeCustom.SEASON_1;

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStarted(): void {
    this.giveStartingItems();
  }

  /** Give extra items to some characters. */
  giveStartingItems(): void {
    const player = Isaac.GetPlayer();
    const character = player.GetPlayerType();

    switch (character) {
      // 18, 36
      case PlayerType.BETHANY:
      case PlayerType.BETHANY_B: {
        addCollectibleAndRemoveFromPools(player, CollectibleType.DUALITY);
        break;
      }

      default: {
        break;
      }
    }
  }
}
