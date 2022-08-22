import { GridEntityType } from "isaac-typescript-definitions";
import { spawnGridEntity } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { getNumRoomsEntered } from "../../../utils/numRoomsEntered";
import { isOnFirstCharacter } from "../../speedrun";
import { Season3Goal } from "../constants";
import { resetSeason3StartingRoomSprites } from "../startingRoomSprites";
import v from "../v";

const TOP_CENTER_GRID_INDEX = 22;

export function season3PostNewRoom(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  const numRoomsEntered = getNumRoomsEntered();
  if (numRoomsEntered !== 1) {
    resetSeason3StartingRoomSprites();
  }

  checkSpawnMegaSatanTeleporter();
}

function checkSpawnMegaSatanTeleporter() {
  if (
    v.persistent.remainingGoals.includes(Season3Goal.MEGA_SATAN) &&
    !isOnFirstCharacter()
  ) {
    spawnGridEntity(GridEntityType.TELEPORTER, TOP_CENTER_GRID_INDEX);
  }
}
