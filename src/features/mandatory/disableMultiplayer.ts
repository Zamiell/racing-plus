// Multiplayer is illegal in Racing+ races and custom challenges, so if multiplayer is detected, the
// run is forcefully ended.

import { FadeoutTarget } from "isaac-typescript-definitions";
import {
  game,
  getPlayers,
  isChildPlayer,
  saveDataManager,
} from "isaacscript-common";

const v = {
  run: {
    firstPlayerControllerIndex: null as int | null,
  },
};

export function init(): void {
  saveDataManager("disableMultiplayer", v);
}

// ModCallback.POST_PLAYER_INIT (9)
export function postPlayerInit(player: EntityPlayer): void {
  if (v.run.firstPlayerControllerIndex === null) {
    v.run.firstPlayerControllerIndex = player.ControllerIndex;
  }
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const controllerIndexes = new Set<int>();
  for (const player of getPlayers()) {
    if (!controllerIndexes.has(player.ControllerIndex)) {
      controllerIndexes.add(player.ControllerIndex);
    }
  }

  if (controllerIndexes.size > 1) {
    endRun();
  }
}

// ModCallback.PRE_GAME_EXIT (17)
export function preGameExit(shouldSave: boolean): void {
  if (!shouldSave) {
    v.run.firstPlayerControllerIndex = null;
  }
}

// ModCallbackCustom.POST_PLAYER_INIT_LATE
export function postPlayerInitLate(player: EntityPlayer): void {
  if (isChildPlayer(player)) {
    return;
  }

  if (player.ControllerIndex !== v.run.firstPlayerControllerIndex) {
    endRun();
  }
}

/**
 * A new player has arrived that is not the first player, so they must be trying to initiate a
 * multiplayer game.
 *
 * Forcefully end the run to prevent cheating.
 */
function endRun() {
  // Play an animation to let the player know that multiplayer is illegal.
  const player = Isaac.GetPlayer();
  player.AnimateSad();

  game.Fadeout(0.05, FadeoutTarget.TITLE_SCREEN);
}
