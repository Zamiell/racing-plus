import { GridRoom, TeleporterState } from "isaac-typescript-definitions";
import { asNumber, teleport } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import v from "../v";

// ModCallbackCustom.POST_GRID_ENTITY_STATE_CHANGED
// GridEntityType.TELEPORTER (23)
export function season3PostGridEntityStateChangedTeleporter(
  _gridEntity: GridEntity,
  _oldState: int,
  newState: int,
): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  if (!v.room.teleporterSpawned) {
    return;
  }

  if (newState === asNumber(TeleporterState.DISABLED)) {
    teleport(GridRoom.MEGA_SATAN);
  }
}
