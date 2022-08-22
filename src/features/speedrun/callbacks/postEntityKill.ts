import { season3PostEntityKillDogma } from "../season3/callbacks/postEntityKill";
import { inSpeedrun } from "../speedrun";

// EntityType.DOGMA (950)
export function speedrunPostEntityKillDogma(entity: Entity): void {
  if (!inSpeedrun()) {
    return;
  }

  season3PostEntityKillDogma(entity);
}
