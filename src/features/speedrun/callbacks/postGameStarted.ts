import { CollectibleTypeCustom } from "../../../types/enums";
import { removeItemFromItemTracker } from "../../../util";
import * as tempMoreOptions from "../../mandatory/tempMoreOptions";
import * as characterProgress from "../characterProgress";
import * as season1 from "../season1";
import {
  goBackToFirstCharacter,
  inSpeedrun,
  setCorrectCharacter,
} from "../speedrun";
import v, { resetFirstCharacterVars, resetPersistentVars } from "../v";

export default function speedrunPostGameStarted(): void {
  if (!inSpeedrun()) {
    resetPersistentVars();
    return;
  }

  liveSplitReset();

  if (setCorrectCharacter()) {
    return;
  }

  if (goBackToFirstCharacter()) {
    return;
  }

  resetFirstCharacterVars();
  giveMoreOptionsBuff();
  characterProgress.postGameStarted();
  season1.postGameStarted();
}

function liveSplitReset() {
  const player = Isaac.GetPlayer();

  if (v.persistent.liveSplitReset) {
    v.persistent.liveSplitReset = false;
    player.AddCollectible(CollectibleTypeCustom.COLLECTIBLE_RESET);
    Isaac.DebugString(
      `Reset the LiveSplit AutoSplitter by giving "Reset", item ID ${CollectibleTypeCustom.COLLECTIBLE_RESET}.`,
    );
    removeItemFromItemTracker(CollectibleTypeCustom.COLLECTIBLE_RESET);
  }
}

function giveMoreOptionsBuff() {
  const player = Isaac.GetPlayer();

  // The first character of the speedrun always gets More Options to speed up the process of getting
  // a run going
  if (v.persistent.characterNum > 1) {
    tempMoreOptions.give(player);
  }
}
