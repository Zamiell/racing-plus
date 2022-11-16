import { TrapdoorVariant } from "isaac-typescript-definitions";
import { PickingUpItem, spawnTrapdoorWithVariant } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { inClearedMomBossRoom } from "../../../../utilsGlobals";
import v, {
  season3DogmaTrapdoorSpawned,
  season3HasDogmaGoal,
  season3HasOnlyMotherLeft,
} from "../v";

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

  spawnTrapdoorOnTakeMomCollectible();
}

/** The trapdoor to Womb 2 in Mausoleum Mom boss room or to the Dogma goal should only spawn after the players have taken a collectible. */
function spawnTrapdoorOnTakeMomCollectible() {
  if (!inClearedMomBossRoom()) {
    return;
  }

  if (!season3HasDogmaGoal()) {
    return;
  }

  if (season3HasOnlyMotherLeft()) {
    return;
  }

  if (season3DogmaTrapdoorSpawned()) {
    return;
  }

  spawnTrapdoorWithVariant(
    TrapdoorVariant.NORMAL,
    INVERTED_TRAPDOOR_GRID_INDEX,
  );

  v.run.season3DogmaTrapdoorSpawned = true;
}
