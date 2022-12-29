import { GameStateFlag, RoomType } from "isaac-typescript-definitions";
import { findFreePosition, game } from "isaacscript-common";
import { RaceGoal } from "../../../enums/RaceGoal";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import { g } from "../../../globals";
import { config } from "../../../modConfigMenu";
import { doesTrophyExist, spawnTrophy } from "../../mandatory/trophy";

export function racePostUpdate(): void {
  if (!config.clientCommunication) {
    return;
  }

  spawnBossRushTrophy();
}

function spawnBossRushTrophy() {
  const roomType = g.r.GetType();
  const bossRushDone = game.GetStateFlag(GameStateFlag.BOSS_RUSH_DONE);

  if (
    !doesTrophyExist() &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.BOSS_RUSH &&
    !g.raceVars.finished &&
    roomType === RoomType.BOSS_RUSH &&
    bossRushDone
  ) {
    const centerPos = g.r.GetCenterPos();
    const position = findFreePosition(centerPos); // Some Boss Rush layouts have pits.
    spawnTrophy(position);
  }
}
