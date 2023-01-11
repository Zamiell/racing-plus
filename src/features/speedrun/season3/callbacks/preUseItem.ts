import { LevelStage } from "isaac-typescript-definitions";
import { getEffectiveStage, inStartingRoom } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";

export function season3PreUseItemGlowingHourGlass(
  player: EntityPlayer,
): boolean | undefined {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.SEASON_3) {
    return undefined;
  }

  return preventHomeWarp(player);
}

/** It is possible to warp to Home by using the Glowing Hour Glass on the first room of the run. */
function preventHomeWarp(player: EntityPlayer): boolean | undefined {
  const effectiveStage = getEffectiveStage();

  if (effectiveStage === LevelStage.BASEMENT_1 && inStartingRoom()) {
    player.AnimateSad();
    return true;
  }

  return undefined;
}
