// Multiplayer is illegal in Racing+ races and custom challenges, so if multiplayer is detected, the
// run is forcefully ended.

import { FadeoutTarget } from "isaac-typescript-definitions";
import { getPlayers, isChildPlayer, saveDataManager } from "isaacscript-common";
import g from "../../globals";

const MULTIPLAYER_ENABLED = true;

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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!MULTIPLAYER_ENABLED) {
    return;
  }

  if (v.run.firstPlayerControllerIndex === null) {
    v.run.firstPlayerControllerIndex = player.ControllerIndex;
  }
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!MULTIPLAYER_ENABLED) {
    return;
  }

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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!MULTIPLAYER_ENABLED) {
    return;
  }

  if (!shouldSave) {
    v.run.firstPlayerControllerIndex = null;
  }
}

// ModCallbackCustom.POST_PLAYER_INIT_LATE
export function postPlayerInitLate(player: EntityPlayer): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!MULTIPLAYER_ENABLED) {
    return;
  }

  if (isChildPlayer(player)) {
    return;
  }

  if (player.ControllerIndex !== v.run.firstPlayerControllerIndex) {
    endRun();
  }
}

function endRun() {
  // A new player has arrived that is not the first player, so they must be trying to initiate a
  // multiplayer game.
  g.g.Fadeout(0.05, FadeoutTarget.TITLE_SCREEN);
}
