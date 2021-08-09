import g from "../../../globals";
import * as trophy from "../../mandatory/trophy";

export function hush(_entity: Entity): void {
  checkSpawnHushRaceTrophy();
}

function checkSpawnHushRaceTrophy() {
  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Hush"
  ) {
    const centerPos = g.r.GetCenterPos();
    const pos = g.r.FindFreePickupSpawnPosition(centerPos);
    trophy.spawn(pos);
  }
}
