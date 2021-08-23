import g from "../../../globals";
import { findFreePosition } from "../../../utilGlobals";
import * as trophy from "../../mandatory/trophy";
import RaceGoal from "../types/RaceGoal";
import RacerStatus from "../types/RacerStatus";
import RaceStatus from "../types/RaceStatus";

export function hush(_entity: Entity): void {
  checkSpawnHushRaceTrophy();
}

function checkSpawnHushRaceTrophy() {
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.HUSH
  ) {
    const centerPos = g.r.GetCenterPos();
    const position = findFreePosition(centerPos);
    trophy.spawn(position);
  }
}
