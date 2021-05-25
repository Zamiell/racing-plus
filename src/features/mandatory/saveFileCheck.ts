import g from "../../globals";
import { consoleCommand, log, playingOnSetSeed } from "../../misc";
import { SaveFileState } from "../../types/enums";

export const SAVE_FILE_SEED = "31XY AQGT"; // cspell:disable-line
export const EDEN_ACTIVE_ITEM = CollectibleType.COLLECTIBLE_DEATH_CERTIFICATE;
export const EDEN_PASSIVE_ITEM = CollectibleType.COLLECTIBLE_MR_DOLLY;

// We can verify that the player is playing on a fully unlocked save by file by going to a specific
// seed on Eden and checking to see if the items are accurate
// This is called from the PostGameStarted callback
// This function returns true if the PostGameStarted callback should halt
export function isNotFullyUnlocked(): boolean {
  const character = g.p.GetPlayerType();
  const activeItem = g.p.GetActiveItem();
  const startSeedString = g.seeds.GetStartSeedString();
  const challenge = Isaac.GetChallenge();

  if (g.saveFile.state === SaveFileState.FINISHED) {
    return false;
  }

  // Not checked
  if (
    g.saveFile.state === SaveFileState.NOT_CHECKED ||
    g.saveFile.state === SaveFileState.DEFERRED_UNTIL_NEW_RUN_BEGINS
  ) {
    // Store what the current run was like
    g.saveFile.oldRun.challenge = challenge;
    g.saveFile.oldRun.character = character;
    g.saveFile.oldRun.seededRun = playingOnSetSeed();
    g.saveFile.oldRun.seed = startSeedString;

    g.saveFile.state = SaveFileState.GOING_TO_EDEN;
    log("saveFileCheck - Performing a save file check with Eden.");
  }

  // Going to the set seed with Eden
  if (g.saveFile.state === SaveFileState.GOING_TO_EDEN) {
    let valid = true;
    if (challenge !== Challenge.CHALLENGE_NULL) {
      valid = false;
    }
    if (character !== PlayerType.PLAYER_EDEN) {
      valid = false;
    }
    if (startSeedString !== SAVE_FILE_SEED) {
      valid = false;
    }
    if (!valid) {
      g.run.restart = true;
      return true;
    }

    // We are on the specific Eden seed, so check to see if our items are correct
    // The items will be different depending on whether or we have other mods enabled
    const neededActiveItem = EDEN_ACTIVE_ITEM;
    const neededPassiveItem = EDEN_PASSIVE_ITEM;

    let text = `Error: On seed "${SAVE_FILE_SEED}", Eden needs `;
    if (activeItem !== neededActiveItem) {
      text += `an active item of ${neededActiveItem} (they have an active item of ${activeItem}).`;
      log(text);
    } else if (!g.p.HasCollectible(neededPassiveItem)) {
      text += `a passive item of ${neededPassiveItem}.`;
      log(text);
    } else {
      g.saveFile.fullyUnlocked = true;
      log("Valid save file detected.");
    }

    g.saveFile.state = SaveFileState.GOING_BACK;
    log("saveFileCheck - Going back to the old run.");
  }

  // Going back to the old challenge/character/seed
  if (g.saveFile.state === SaveFileState.GOING_BACK) {
    let valid = true;
    if (challenge !== g.saveFile.oldRun.challenge) {
      valid = false;
    }
    if (character !== g.saveFile.oldRun.character) {
      valid = false;
    }
    if (playingOnSetSeed() !== g.saveFile.oldRun.seededRun) {
      valid = false;
    }
    if (
      g.saveFile.oldRun.seededRun &&
      startSeedString !== g.saveFile.oldRun.seed
    ) {
      valid = false;
    }
    if (!valid) {
      g.run.restart = true;
      return true;
    }

    g.saveFile.state = SaveFileState.FINISHED;
    log("saveFileCheck - Completed.");
  }

  return false;
}

export function checkRestart(): boolean {
  const character = g.p.GetPlayerType();
  const startSeedString = g.seeds.GetStartSeedString();
  const challenge = Isaac.GetChallenge();

  switch (g.saveFile.state) {
    case SaveFileState.GOING_TO_EDEN: {
      if (challenge !== Challenge.CHALLENGE_NULL) {
        consoleCommand(`challenge ${Challenge.CHALLENGE_NULL}`);
      }

      if (character !== PlayerType.PLAYER_EDEN) {
        consoleCommand(`restart ${PlayerType.PLAYER_EDEN}`);
      }

      if (startSeedString !== SAVE_FILE_SEED) {
        consoleCommand(`seed ${SAVE_FILE_SEED}`);
      }

      return true;
    }

    case SaveFileState.GOING_BACK: {
      if (challenge !== g.saveFile.oldRun.challenge) {
        consoleCommand(`challenge ${g.saveFile.oldRun.challenge}`);
      }

      if (character !== g.saveFile.oldRun.character) {
        consoleCommand(`restart ${g.saveFile.oldRun.character}`);
      }

      if (playingOnSetSeed() !== g.saveFile.oldRun.seededRun) {
        // This will change the reset behavior to that of an unseeded run
        g.seeds.Reset();
        consoleCommand("restart");
      }

      if (
        g.saveFile.oldRun.seededRun &&
        startSeedString !== g.saveFile.oldRun.seed
      ) {
        consoleCommand(`seed ${g.saveFile.oldRun.seed}`);
      }

      return true;
    }

    default: {
      return false;
    }
  }
}
