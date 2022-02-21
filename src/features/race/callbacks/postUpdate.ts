import { findFreePosition, getRoomSafeGridIndex } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import * as trophy from "../../mandatory/trophy";
import { RaceGoal } from "../types/RaceGoal";
import { RacerStatus } from "../types/RacerStatus";
import { RaceStatus } from "../types/RaceStatus";

export function racePostUpdate(): void {
  if (!config.clientCommunication) {
    return;
  }

  spawnBossRushTrophy();
}

function spawnBossRushTrophy() {
  const roomSafeGridIndex = getRoomSafeGridIndex();
  const bossRushDone = g.g.GetStateFlag(GameStateFlag.STATE_BOSSRUSH_DONE);

  if (
    !trophy.trophyHasSpawned() &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.BOSS_RUSH &&
    !g.raceVars.finished &&
    roomSafeGridIndex === GridRooms.ROOM_BOSSRUSH_IDX &&
    bossRushDone
  ) {
    const centerPos = g.r.GetCenterPos();
    const position = findFreePosition(centerPos); // Some Boss Rush layouts have pits
    trophy.spawn(position);
  }
}
