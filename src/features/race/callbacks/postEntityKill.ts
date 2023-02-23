import { game } from "isaacscript-common";
import { RaceGoal } from "../../../enums/RaceGoal";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import { g } from "../../../globals";
import { config } from "../../../modConfigMenu";
import { spawnTrophy } from "../../mandatory/trophy";

export function hush(_entity: Entity): void {
  if (!config.ClientCommunication) {
    return;
  }

  checkSpawnHushRaceTrophy();
}

function checkSpawnHushRaceTrophy() {
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.HUSH
  ) {
    const room = game.GetRoom();
    const centerPos = room.GetCenterPos();
    spawnTrophy(centerPos);
  }
}
