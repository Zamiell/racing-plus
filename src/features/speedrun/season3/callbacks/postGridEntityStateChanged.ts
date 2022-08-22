import { GridRoom, TeleporterState } from "isaac-typescript-definitions";
import { asNumber, teleport } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
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

  checkDepths2TeleporterActivated(newState);
  checkMegaSatanTeleporterActivated(newState);
}

function checkDepths2TeleporterActivated(newState: int) {
  Isaac.DebugString(`GETTING HERE 1 - ${newState}`);
  if (!v.room.depths2TeleporterSpawned) {
    return;
  }
  Isaac.DebugString(`GETTING HERE 2 - ${newState}`);

  if (newState === asNumber(TeleporterState.DISABLED)) {
    Isaac.DebugString(`GETTING HERE 3 - ${newState}`);
    const startingRoomGridIndex = g.l.GetStartingRoomIndex();
    teleport(startingRoomGridIndex);
  }
}

function checkMegaSatanTeleporterActivated(newState: int) {
  if (!v.room.megaSatanTeleporterSpawned) {
    return;
  }

  if (newState === asNumber(TeleporterState.DISABLED)) {
    teleport(GridRoom.MEGA_SATAN);
  }
}
