import {
  GridRoom,
  LevelStage,
  TeleporterState,
} from "isaac-typescript-definitions";
import { asNumber, inStartingRoom, teleport } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";

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

  checkMegaSatanTeleporterActivated(newState);
}

function checkMegaSatanTeleporterActivated(newState: int) {
  const stage = g.l.GetStage();

  if (stage !== LevelStage.DARK_ROOM_CHEST || !inStartingRoom()) {
    return;
  }

  if (newState === asNumber(TeleporterState.DISABLED)) {
    teleport(GridRoom.MEGA_SATAN);
  }
}
