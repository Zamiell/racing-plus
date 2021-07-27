import g from "../../../globals";
import * as trophy from "../../mandatory/trophy";
import * as theBeastPreventEnd from "../theBeastPreventEnd";

export function hush(_entity: Entity): void {
  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Hush"
  ) {
    spawnTrophy();
  }
}

export function theBeast(_entity: Entity): void {
  theBeastPreventEnd.postEntityKillTheBeast(_entity);
}

function spawnTrophy() {
  const centerPos = g.r.GetCenterPos();
  const pos = g.r.FindFreePickupSpawnPosition(centerPos);
  trophy.spawn(pos);
}
