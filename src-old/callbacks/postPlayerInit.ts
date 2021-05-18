// This callback occurs before the "PostGameStarted" callback

import * as season8 from "../challenges/season8";
import g from "../globals";

export function main(player: EntityPlayer): void {
  // We don't care if this is a co-op baby
  if (player.Variant !== 0) {
    return;
  }

  // Cache the player object so that we don't have to repeatedly call Isaac.GetPlayer(0)
  g.p = player;

  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const character = g.p.GetPlayerType();

  Isaac.DebugString(`MC_POST_PLAYER_INIT - Character ${character}`);

  // Do nothing if we are continuing an existing run
  if (gameFrameCount !== 0) {
    return;
  }

  stopD6RechargeSound();
  season8.postPlayerInit();
}

function stopD6RechargeSound() {
  // Local variables
  const character = g.p.GetPlayerType();

  // With Eve, Eden, and Keeper, the beginning of the recharge sound will play, which is annoying
  if (
    character === PlayerType.PLAYER_EVE || // 5
    character === PlayerType.PLAYER_EDEN || // 9
    character === PlayerType.PLAYER_KEEPER // 14
  ) {
    // Adding the D6 is necessary because these characters have not been given their active item yet
    // The recharge sounds happens somewhere between this callback and the PostGameStarted callback
    // (if the active item is already charged,
    // there won't be a 2nd recharge sound when a new item is added)
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_D6, 6, false); // 105
    g.sfx.Stop(SoundEffect.SOUND_BATTERYCHARGE); // 170
  }
}
