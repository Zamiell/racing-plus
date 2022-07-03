// This feature is used because the game prevents you from executing a "restart" console command
// while in the PostGameStarted callback.

import { Challenge, PlayerType } from "isaac-typescript-definitions";
import {
  FIRST_CHARACTER,
  LAST_VANILLA_CHARACTER,
  log,
  restart,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { restartChallenge, restartSeed } from "../../utils";

const v = {
  run: {
    restartOnNextRenderFrame: false,
    restartCharacter: null as PlayerType | null,
    restartChallenge: null as Challenge | null,
    restartSeed: null as string | null,
  },
};

export function init(): void {
  saveDataManager("restartOnNextFrame", v);
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!v.run.restartOnNextRenderFrame) {
    return;
  }

  v.run.restartOnNextRenderFrame = false;
  checkSpecialRestart();
}

function checkSpecialRestart() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const startSeedString = g.seeds.GetStartSeedString();
  const challenge = Isaac.GetChallenge();

  if (v.run.restartCharacter !== null && character !== v.run.restartCharacter) {
    restart(v.run.restartCharacter);
    return;
  }

  if (v.run.restartChallenge !== null && challenge !== v.run.restartChallenge) {
    restartChallenge(v.run.restartChallenge);
    return;
  }

  if (v.run.restartSeed !== null && startSeedString !== v.run.restartSeed) {
    restartSeed(v.run.restartSeed);
    return;
  }

  // Since no special conditions apply, just do a normal restart.
  restart();
}

export function restartOnNextFrame(): void {
  v.run.restartOnNextRenderFrame = true;
}

export function isRestartingOnNextFrame(): boolean {
  return v.run.restartOnNextRenderFrame;
}

export function setRestartCharacter(character: PlayerType): void {
  // Prevent crashing the game when switching to a character that does not exist.
  if (character < FIRST_CHARACTER || character > LAST_VANILLA_CHARACTER) {
    if (
      // eslint-disable-next-line isaacscript/strict-enums
      character === LAST_VANILLA_CHARACTER + 1 &&
      BabiesModGlobals !== undefined
    ) {
      // Random Baby takes the first modded character slot.
    } else {
      log(`Preventing restarting to character: ${character}`);
      return;
    }
  }

  v.run.restartCharacter = character;
}

export function setRestartChallenge(challenge: Challenge): void {
  v.run.restartChallenge = challenge;
}

export function setRestartSeed(seed: string): void {
  v.run.restartSeed = seed;
}
