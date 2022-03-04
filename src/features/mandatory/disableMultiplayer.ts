// Multiplayer is illegal in Racing+ races and custom challenges, so if multiplayer is detected,
// the run is forcefully ended

import { getPlayers, isChildPlayer, saveDataManager } from "isaacscript-common";
import g from "../../globals";

const ENABLED = true;

const v = {
  run: {
    firstPlayerControllerIndex: null as int | null,
  },
};

export function init(): void {
  saveDataManager("disableMultiplayer", v);
}

// ModCallbacks.MC_POST_PLAYER_INIT (9)
export function postPlayerInit(player: EntityPlayer): void {
  if (!ENABLED) {
    return;
  }

  if (v.run.firstPlayerControllerIndex === null) {
    v.run.firstPlayerControllerIndex = player.ControllerIndex;
  }
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!ENABLED) {
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

// ModCallbacks.MC_PRE_GAME_EXIT (17)
export function preGameExit(shouldSave: boolean): void {
  if (!ENABLED) {
    return;
  }

  if (!shouldSave) {
    v.run.firstPlayerControllerIndex = null;
  }
}

// ModCallbacksCustom.MC_POST_PLAYER_INIT_LATE
export function postPlayerInitLate(player: EntityPlayer): void {
  if (!ENABLED) {
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
  // A new player has arrived that is not the first player,
  // so they must be trying to initiate a multiplayer game
  g.g.Fadeout(0.05, FadeoutTarget.TITLE_SCREEN);
}
