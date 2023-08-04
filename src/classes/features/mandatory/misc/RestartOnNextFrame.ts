import type {
  Challenge,
  PlayerType} from "isaac-typescript-definitions";
import {
  ModCallback
} from "isaac-typescript-definitions";
import {
  Callback,
  FIRST_CHARACTER,
  LAST_VANILLA_CHARACTER,
  game,
  log,
  restart,
} from "isaacscript-common";
import { consoleCommand } from "../../../../utils";
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
    const challenge = Isaac.GetChallenge();
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
      challenge !== v.run.restartChallenge
    ) {
      this.restartChallenge(v.run.restartChallenge);
      return;
    }

    if (v.run.restartSeed !== null && startSeedString !== v.run.restartSeed) {
      this.restartSeed(v.run.restartSeed);
      return;
    }

    // Since no special conditions apply, just do a normal restart.
    restart();
  }

  /** Change the challenge of the run and restart the run. */
  restartChallenge(challenge: Challenge): void {
    consoleCommand(`challenge ${challenge}`);
  }

  /** Change the seed of the run and restart the run. */
  restartSeed(seed: string): void {
    consoleCommand(`seed ${seed}`);
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
