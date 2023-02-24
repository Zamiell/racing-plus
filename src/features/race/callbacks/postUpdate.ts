import { GameStateFlag, RoomType } from "isaac-typescript-definitions";
import { findFreePosition, game, inRoomType } from "isaacscript-common";
import { RaceGoal } from "../../../enums/RaceGoal";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import { g } from "../../../globals";
import { config } from "../../../modConfigMenu";
import { doesTrophyExist, spawnTrophy } from "../../mandatory/trophy";

export function racePostUpdate(): void {
  if (!config.ClientCommunication) {
    return;
  }

  spawnBossRushTrophy();
}

function spawnBossRushTrophy() {
  const room = game.GetRoom();
  const bossRushDone = game.GetStateFlag(GameStateFlag.BOSS_RUSH_DONE);

  if (
    !doesTrophyExist() &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.BOSS_RUSH &&
    !g.raceVars.finished &&
    inRoomType(RoomType.BOSS_RUSH) &&
    bossRushDone
  ) {
    const centerPos = room.GetCenterPos();
    const position = findFreePosition(centerPos); // Some Boss Rush layouts have pits.
    spawnTrophy(position);
  }
}
