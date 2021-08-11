/*
// Called from the "PostGameStarted.Main()" function
export function main(): void {
  const character = g.p.GetPlayerType();
  const challenge = Isaac.GetChallenge();

  // Reset some per-run variables
  g.speedrun.fadeFrame = 0;
  g.speedrun.resetFrame = 0;

  // Reset some variables if they are changing characters / items
  if (challenge === ChallengeCustom.CHANGE_CHAR_ORDER) {
    g.speedrun.characterNum = 1;
    g.season6.vetoList = [];
  }

  if (g.speedrun.liveSplitReset) {
    g.speedrun.liveSplitReset = false;
    g.p.AddCollectible(CollectibleTypeCustom.COLLECTIBLE_OFF_LIMITS, 0, false);
    Isaac.DebugString(
      `Reset the LiveSplit AutoSplitter by giving "Off Limits", item ID ${CollectibleTypeCustom.COLLECTIBLE_OFF_LIMITS}.`,
    );
    misc.removeItemFromItemTracker(
      CollectibleTypeCustom.COLLECTIBLE_OFF_LIMITS,
    );
  }

  // Move to the first character if we finished
  // (this has to be above the challenge name check so that the fireworks won't carry over to
  // another run)
  if (g.speedrun.finished) {
    g.speedrun.characterNum = 1;
    g.speedrun.finished = false;
    g.speedrun.finishedTime = 0;
    g.speedrun.finishedFrames = 0;
    g.speedrun.fastReset = false;
    g.run.restart = true;
    Isaac.DebugString(
      "Restarting to go back to the first character (since we finished the speedrun).",
    );
    return;
  }

  if (!inSpeedrun()) {
    return;
  }

  if (RacingPlusData === null) {
    return;
  }

  // Don't do anything if the player has not submitted a character order
  // (we will display an error later on in the PostRender callback)
  if (!speedrun.checkValidCharOrder()) {
    return;
  }

  // Check to see if we are on the correct character
  const correctCharacter = speedrun.getCurrentCharacter();
  if (character !== correctCharacter) {
    g.speedrun.fastReset = true;
    g.run.restart = true;
    Isaac.DebugString(
      `Restarting because we are on character ${character} and we need to be on character ${correctCharacter}.`,
    );
    return;
  }

  // Check if they want to go back to the first character
  if (g.speedrun.fastReset) {
    g.speedrun.fastReset = false;
  } else if (!g.speedrun.fastReset && g.speedrun.characterNum !== 1) {
    // They held R, and they are not on the first character,
    // so they want to restart from the first character
    g.speedrun.characterNum = 1;
    g.season5.selectedStartingItems = [];
    g.season6.selectedStartingBuilds = [];
    g.season9.selectedStartingBuildIndexes = [];
    g.run.restart = true;
    Isaac.DebugString(
      "Restarting because we want to start from the first character again.",
    );

    // Tell the LiveSplit AutoSplitter to reset
    g.speedrun.liveSplitReset = true;
    return;
  }

  // Reset variables for the first character
  if (g.speedrun.characterNum === 1) {
    g.speedrun.startedTime = 0;
    g.speedrun.startedFrame = 0;
    g.speedrun.startedCharTime = 0;
    g.speedrun.characterRunTimes = [];

    switch (challenge) {
      case ChallengeCustom.R7_SEASON_5: {
        season5.postGameStartedFirstCharacter();
        break;
      }

      case ChallengeCustom.R7_SEASON_6: {
        season6.postGameStartedFirstCharacter();
        break;
      }

      case ChallengeCustom.R7_SEASON_7: {
        season7.postGameStartedFirstCharacter();
        break;
      }

      case ChallengeCustom.R7_SEASON_8: {
        season8.postGameStartedFirstCharacter();
        break;
      }

      case ChallengeCustom.R7_SEASON_9: {
        season9.postGameStartedFirstCharacter();
        break;
      }

      default: {
        break;
      }
    }
  }

  // The first character of the speedrun always gets More Options to speed up the process of getting
  // a run going
  // (but Season 4 and Season 6 never get it, since there is no resetting involved)
  if (
    g.speedrun.characterNum === 1 &&
    challenge !== ChallengeCustom.R7_SEASON_4 &&
    challenge !== ChallengeCustom.R7_SEASON_6
  ) {
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS, 0, false);
    misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_MORE_OPTIONS);

    // We don't want the costume to show
    g.p.RemoveCostume(
      g.itemConfig.GetCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS),
    );

    // More Options will be removed upon entering the first Treasure Room
    g.run.removeMoreOptions = true;
  }

  // Do actions based on the specific challenge
  switch (challenge) {
    case ChallengeCustom.R15_VANILLA: {
      // Do nothing for the vanilla challenge
      break;
    }

    case ChallengeCustom.R9_SEASON_1: {
      season1.postGameStarted9();
      break;
    }

    case ChallengeCustom.R14_SEASON_1: {
      season1.postGameStarted14();
      break;
    }

    case ChallengeCustom.R7_SEASON_2: {
      season2.postGameStarted();
      break;
    }

    case ChallengeCustom.R7_SEASON_3: {
      season3.postGameStarted();
      break;
    }

    case ChallengeCustom.R7_SEASON_4: {
      season4.postGameStarted();
      break;
    }

    case ChallengeCustom.R7_SEASON_5: {
      season5.postGameStarted();
      break;
    }

    case ChallengeCustom.R7_SEASON_6: {
      season6.postGameStarted();
      break;
    }

    case ChallengeCustom.R7_SEASON_7: {
      season7.postGameStarted();
      break;
    }

    case ChallengeCustom.R7_SEASON_8: {
      season8.postGameStarted();
      break;
    }

    case ChallengeCustom.R7_SEASON_9: {
      season9.postGameStarted();
      break;
    }

    default: {
      error("Unknown challenge.");
      break;
    }
  }
}
*/
