import type { Challenge, PlayerType } from "isaac-typescript-definitions";
import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  FIRST_CHARACTER,
  LAST_VANILLA_CHARACTER,
  game,
  log,
  onChallenge,
  restart,
  setChallenge,
  setRunSeed,
} from "isaacscript-common";
import { isBabiesModEnabled } from "../../../../utilsBabiesMod";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const v = {
  run: {
    restartOnNextRenderFrame: false,
    restartCharacter: null as PlayerType | null,
    restartChallenge: null as Challenge | null,
    restartSeed: null as string | null,
  },
};

/**
 * This feature is used because the game prevents you from executing a "restart" console command
 * while in the `POST_GAME_STARTED` callback.
 */
export class RestartOnNextFrame extends MandatoryModFeature {
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (!v.run.restartOnNextRenderFrame) {
      return;
    }

    v.run.restartOnNextRenderFrame = false;
    this.performRestart();
  }

  performRestart(): void {
    const seeds = game.GetSeeds();
    const startSeedString = seeds.GetStartSeedString();
    const player = Isaac.GetPlayer();
    const character = player.GetPlayerType();

    if (
      v.run.restartCharacter !== null &&
      character !== v.run.restartCharacter
    ) {
      restart(v.run.restartCharacter);
      return;
    }

    if (
      v.run.restartChallenge !== null &&
      !onChallenge(v.run.restartChallenge)
    ) {
      setChallenge(v.run.restartChallenge);
      return;
    }

    if (v.run.restartSeed !== null && startSeedString !== v.run.restartSeed) {
      setRunSeed(v.run.restartSeed);
      return;
    }

    // Since no special conditions apply, just do a normal restart.
    restart();
  }
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      character === LAST_VANILLA_CHARACTER + 1 &&
      isBabiesModEnabled()
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
