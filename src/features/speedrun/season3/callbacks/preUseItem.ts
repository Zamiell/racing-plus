import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { getNumRoomsEntered } from "../../../utils/numRoomsEntered";

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
  const roomsEntered = getNumRoomsEntered();
  if (roomsEntered !== 1) {
    return undefined;
  }

  player.AnimateSad();
  return true;
}
