import { season3PostNPCRenderDogma } from "../season3/callbacks/postNPCRender";
import { inSpeedrun } from "../speedrun";

// EntityType.DOGMA (950)
export function speedrunPostNPCRenderDogma(npc: EntityNPC): void {
  if (!inSpeedrun()) {
    return;
  }

  season3PostNPCRenderDogma(npc);
}
