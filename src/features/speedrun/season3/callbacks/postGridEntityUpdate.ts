import { GridRoom } from "isaac-typescript-definitions";
import {
  getPlayerCloserThan,
  teleport,
  TELEPORTER_ACTIVATION_DISTANCE,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import v from "../v";

// ModCallbackCustom.POST_GRID_ENTITY_UPDATE
// GridEntityType.TELEPORTER (23)
export function season3PostGridEntityUpdateTeleporter(
  gridEntity: GridEntity,
): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  if (!v.room.teleporterSpawned) {
    return;
  }

  const playerTouching = getPlayerCloserThan(
    gridEntity.Position,
    TELEPORTER_ACTIVATION_DISTANCE,
  );
  if (playerTouching !== undefined) {
    teleport(GridRoom.MEGA_SATAN);
  }
}
