import g from "../globals";
import * as schoolbag from "../items/schoolbag";
import * as misc from "../misc";
import { CollectibleTypeCustom } from "../types/enums";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  // Local variables
  const character = g.p.GetPlayerType();

  Isaac.DebugString("In the R+7 (Season 2) challenge.");

  // Give extra items to some characters
  switch (character) {
    // 0
    case PlayerType.PLAYER_ISAAC: {
      misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_BATTERY);

      // Make Isaac start with a double charge instead of a single charge
      g.p.SetActiveCharge(12);
      g.sfx.Stop(SoundEffect.SOUND_BATTERYCHARGE);

      break;
    }

    // 15
    case PlayerType.PLAYER_APOLLYON: {
      // Apollyon starts with the Schoolbag by default
      misc.giveItemAndRemoveFromPools(
        CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
      );
      schoolbag.put(CollectibleType.COLLECTIBLE_VOID, -1);
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_VOID);

      break;
    }

    default: {
      break;
    }
  }
}
