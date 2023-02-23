import {
  CacheFlag,
  ModCallback,
  PlayerType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  isEden,
  mapGetPlayer,
  mapSetPlayer,
  ModCallbackCustom,
  PlayerIndex,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { MandatoryModFeature } from "../../MandatoryModFeature";

const v = {
  run: {
    edenBaseLuckMap: new Map<PlayerIndex, float>(),
  },
};

/**
 * This is the logic for the custom items "13 Luck" and "15 Luck".
 *
 * We deliberately do not account for a player having multiple copies of these items because it
 * should be impossible and it makes the code more complicated.
 */
export class NLuck extends MandatoryModFeature {
  v = v;

  // 8, 1 << 10
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.LUCK)
  evaluateCacheLuck(player: EntityPlayer): void {
    const has13Luck = player.HasCollectible(
      CollectibleTypeCustom.THIRTEEN_LUCK,
    );
    const has15Luck = player.HasCollectible(CollectibleTypeCustom.FIFTEEN_LUCK);

    if (!has13Luck && !has15Luck) {
      return;
    }

    const targetLuck = has15Luck ? 15 : 13;
    const luckModifier = this.getCharacterLuckModifier(player);
    const totalLuck = targetLuck - luckModifier;
    player.Luck += totalLuck;
  }

  /**
   * Some characters start with non-zero luck. Thus, we might need to vary the amount of extra luck
   * given to them.
   */
  getCharacterLuckModifier(player: EntityPlayer): float {
    const character = player.GetPlayerType();
    switch (character) {
      // 8
      case PlayerType.LAZARUS: {
        return -1;
      }

      // 9, 30
      case PlayerType.EDEN:
      case PlayerType.EDEN_B: {
        const baseLuck = mapGetPlayer(v.run.edenBaseLuckMap, player);
        return baseLuck === undefined ? 0 : baseLuck;
      }

      // 14
      case PlayerType.KEEPER: {
        return -2;
      }

      // 20
      case PlayerType.ESAU: {
        return -1;
      }

      // 33
      case PlayerType.KEEPER_B: {
        return -2;
      }

      // 38
      case PlayerType.LAZARUS_2_B: {
        return -2;
      }

      default: {
        return 0;
      }
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST)
  postPlayerInitFirst(player: EntityPlayer): void {
    if (isEden(player)) {
      mapSetPlayer(v.run.edenBaseLuckMap, player, player.Luck);
    }
  }
}
