import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import * as postWombPath from "../postWombPath";
import v from "../v";

// EntityType.ENTITY_MOM (45)
export function mom(_entity: Entity): void {
  const gameFrameCount = g.g.GetFrameCount();
  v.room.momKilledFrame = gameFrameCount;
}

// EntityType.ENTITY_MOMS_HEART (78)
export function momsHeart(entity: Entity): void {
  if (!config.fastTravel) {
    return;
  }

  postWombPath.postEntityKillMomsHeart(entity);
}

// EntityType.ENTITY_HUSH (407)
export function hush(entity: Entity): void {
  if (!config.fastTravel) {
    return;
  }

  postWombPath.postEntityKillHush(entity);
}
