import { findFreePosition } from "isaacscript-common";
import { RaceGoal } from "../../../enums/RaceGoal";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import * as trophy from "../../mandatory/trophy";

export function racePostUpdate(): void {
  if (!config.clientCommunication) {
    return;
  }

  spawnBossRushTrophy();
}

function spawnBossRushTrophy() {
  const roomType = g.r.GetType();
  const bossRushDone = g.g.GetStateFlag(GameStateFlag.STATE_BOSSRUSH_DONE);

  if (
    !trophy.trophyHasSpawned() &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.BOSS_RUSH &&
    !g.raceVars.finished &&
    roomType === RoomType.ROOM_BOSSRUSH &&
    bossRushDone
  ) {
    const centerPos = g.r.GetCenterPos();
    const position = findFreePosition(centerPos); // Some Boss Rush layouts have pits
    trophy.spawn(position);
  }
}
