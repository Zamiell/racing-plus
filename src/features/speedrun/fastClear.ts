import { RoomType } from "isaac-typescript-definitions";
import {
  getEffectiveStage,
  isRoomInsideGrid,
  onRepentanceStage,
} from "isaacscript-common";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import g from "../../globals";
import { season3FastClear } from "./season3/fastClear";
import { season3HasMotherGoal } from "./season3/v";
import { inSpeedrun } from "./speedrun";

export function speedrunPostFastClear(): void {
  if (!inSpeedrun()) {
    return;
  }

  checkSpawnRepentanceDoor();
  season3FastClear();
}

/**
 * Paths to Repentance floors will not appear in custom challenges that have a goal of Blue Baby.
 * Thus, spawn the path manually if we are on a custom challenge. We only spawn them the
 * Downpour/Dross doors to avoid the bug where picking up Goat Head in a boss room and then
 * re-entering the room causes the Devil Room to become blocked.
 */
function checkSpawnRepentanceDoor() {
  if (speedrunShouldSpawnRepentanceDoor()) {
    g.r.TrySpawnSecretExit(true, true);
  }
}

export function speedrunShouldSpawnRepentanceDoor(): boolean {
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();
  const insideGrid = isRoomInsideGrid();
  const correctStageForRepentanceDoor = isCorrectStageForRepentanceDoor();

  return (
    correctStageForRepentanceDoor &&
    roomType === RoomType.BOSS &&
    insideGrid && // Handle the case of Emperor? card rooms.
    roomClear
  );
}

function isCorrectStageForRepentanceDoor(): boolean {
  const challenge = Isaac.GetChallenge();
  const effectiveStage = getEffectiveStage();
  const repentanceStage = onRepentanceStage();

  if (challenge === ChallengeCustom.SEASON_3) {
    if (!season3HasMotherGoal()) {
      return false;
    }

    return (
      // Basement 2 --> Downpour/Dross 2
      (effectiveStage === 2 && !repentanceStage) ||
      // Downpour/Dross 2 --> Mines/Ashpit 1
      (effectiveStage === 3 && repentanceStage) ||
      // Mines/Ashpit 2 --> Mausoleum/Gehenna 1
      (effectiveStage === 5 && repentanceStage)
    );
  }

  return effectiveStage === 1 || (effectiveStage === 2 && !repentanceStage);
}
