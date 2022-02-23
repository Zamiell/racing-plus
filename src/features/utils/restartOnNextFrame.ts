import { MAX_VANILLA_CHARACTER, saveDataManager } from "isaacscript-common";
import g from "../../globals";
import { PlayerTypeCustom } from "../../types/PlayerTypeCustom";
import {
  restart,
  restartAsCharacter,
  restartChallenge,
  restartSeed,
} from "../../utils";

// This feature is used because the game prevents you from executing a "restart" console command
// while in the PostGameStarted callback

const v = {
  run: {
    restartOnNextFrame: false,
    restartCharacter: null as PlayerType | PlayerTypeCustom | null,
    restartChallenge: null as Challenge | null,
    restartSeed: null as string | null,
  },
};

export function init(): void {
  saveDataManager("restartOnNextFrame", v);
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!v.run.restartOnNextFrame) {
    return;
  }

  v.run.restartOnNextFrame = false;
  checkSpecialRestart();
}

function checkSpecialRestart() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const startSeedString = g.seeds.GetStartSeedString();
  const challenge = Isaac.GetChallenge();

  if (v.run.restartCharacter !== null && character !== v.run.restartCharacter) {
    restartAsCharacter(v.run.restartCharacter);
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

  // Since no special conditions apply, just do a normal restart
  restart();
}

export function restartOnNextFrame(): void {
  v.run.restartOnNextFrame = true;
}

export function isRestartingOnNextFrame(): boolean {
  return v.run.restartOnNextFrame;
}

export function setRestartCharacter(
  character: PlayerType | PlayerTypeCustom,
): void {
  if (
    character < 0 ||
    (character > MAX_VANILLA_CHARACTER &&
      character !== PlayerTypeCustom.PLAYER_RANDOM_BABY)
  ) {
    // Prevent crashing the game when switching to a custom character that does not exist
    return;
  }

  v.run.restartCharacter = character;
}

export function setRestartChallenge(challenge: Challenge): void {
  v.run.restartChallenge = challenge;
}

export function setRestartSeed(seed: string): void {
  v.run.restartSeed = seed;
}
