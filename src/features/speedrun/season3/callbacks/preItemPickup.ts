import { TrapdoorVariant } from "isaac-typescript-definitions";
import {
  onRepentanceStage,
  PickingUpItem,
  spawnTrapdoorWithVariant,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { inClearedMomBossRoom } from "../../../../utilsGlobals";
import { season3HasDogmaGoal, season3HasGoalThroughWomb1, v } from "../v";

/** One tile away from the bottom door in a 1x1 room. */
export const INVERTED_TRAPDOOR_GRID_INDEX = 97;

export function season3PreItemPickup(
  _player: EntityPlayer,
  _pickingUpItem: PickingUpItem,
): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  // We don't check for the Polaroid / Negative because the players could re-roll the photos.
  spawnTrapdoorOnTakeMomCollectible();
}

/**
 * We need to spawn an extra trapdoor in two situations:
 * - If on Depths 2, spawn an extra trapdoor to Mausoleum 2 (Dogma).
 * - If on Mausoleum 2, spawn an extra trapdoor to Womb 1.
 */
function spawnTrapdoorOnTakeMomCollectible() {
  if (v.run.season3DogmaTrapdoorSpawned) {
    return;
  }

  if (!inClearedMomBossRoom()) {
    return;
  }

  // Depths 2 --> Mausoleum 2 (Dogma)
  if (!onRepentanceStage() && !season3HasDogmaGoal()) {
    return;
  }

  // Mausoleum 2 --> Womb 1
  if (onRepentanceStage() && !season3HasGoalThroughWomb1()) {
    return;
  }

  spawnTrapdoorWithVariant(
    TrapdoorVariant.NORMAL,
    INVERTED_TRAPDOOR_GRID_INDEX,
  );

  v.run.season3DogmaTrapdoorSpawned = true;
}
