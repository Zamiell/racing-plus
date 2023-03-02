import {
  CollectibleType,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import { CallbackCustom, game, ModCallbackCustom } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import { CUSTOM_CHALLENGES_SET } from "../../../speedrun/constants";
import {
  addCollectibleAndRemoveFromPools,
  addTrinketAndRemoveFromPools,
} from "../../../utils";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { spawnDroppedChildsHeart } from "../optional/characters/SamsonDropHeart";

/**
 * For some reason, characters do not start with items that are granted by achievements while in
 * challenges.
 */
export class AchievementItems extends ChallengeModFeature {
  challenge = CUSTOM_CHALLENGES_SET;

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    this.giveAchievementItems();
  }

  giveAchievementItems(): void {
    const itemPool = game.GetItemPool();
    const player = Isaac.GetPlayer();
    const character = player.GetPlayerType();

    switch (character) {
      // 0
      case PlayerType.ISAAC: {
        addCollectibleAndRemoveFromPools(player, CollectibleType.D6);
        break;
      }

      // 2
      case PlayerType.CAIN: {
        addTrinketAndRemoveFromPools(player, TrinketType.PAPER_CLIP);
        break;
      }

      // 5
      case PlayerType.EVE: {
        addCollectibleAndRemoveFromPools(player, CollectibleType.RAZOR_BLADE);
        break;
      }

      // 6
      case PlayerType.SAMSON: {
        if (config.SamsonDropHeart) {
          spawnDroppedChildsHeart(player);
        } else {
          addTrinketAndRemoveFromPools(player, TrinketType.CHILDS_HEART);
        }
        break;
      }

      // 10
      case PlayerType.LOST: {
        // Holy Mantle is not removed from pools while in a custom challenge.
        itemPool.RemoveCollectible(CollectibleType.HOLY_MANTLE);
        break;
      }

      // 14
      case PlayerType.KEEPER: {
        addCollectibleAndRemoveFromPools(player, CollectibleType.WOODEN_NICKEL);
        addTrinketAndRemoveFromPools(player, TrinketType.STORE_KEY);
        break;
      }

      default: {
        break;
      }
    }
  }
}
