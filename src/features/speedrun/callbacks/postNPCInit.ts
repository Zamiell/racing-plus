import { season3PostNPCInitIsaac } from "../season3/callbacks/postNPCInit";
import { inSpeedrun } from "../speedrun";

// EntityType.ISAAC (102)
export function speedrunPostNPCInitIsaac(npc: EntityNPC): void {
  if (!inSpeedrun()) {
    return;
  }

  season3PostNPCInitIsaac(npc);
}
