import { config } from "../../../../../modConfigMenu";
import * as postWombPath from "../postWombPath";

export function momsHeart(entity: Entity): void {
  if (!config.fastTravel) {
    return;
  }

  postWombPath.postEntityKillMomsHeart(entity);
}

export function hush(entity: Entity): void {
  if (!config.fastTravel) {
    return;
  }

  postWombPath.postEntityKillHush(entity);
}
