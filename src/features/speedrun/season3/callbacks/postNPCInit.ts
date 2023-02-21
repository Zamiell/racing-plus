// In Season 3, the first phase of the Hush fight is skipped. (We don't want the players to have to
// fight Blue Baby twice over the course of the 7 character speedrun.)

import { EntityType, LevelStage } from "isaac-typescript-definitions";
import { spawnNPCWithSeed } from "isaacscript-common";
import { g } from "../../../../globals";
import { onSeason } from "../../speedrun";

const VANILLA_HUSH_SPAWN_POSITION = Vector(580, 260);

// EntityType.ISAAC (102)
export function season3PostNPCInitIsaac(npc: EntityNPC): void {
  if (!onSeason(3)) {
    return;
  }

  const stage = g.l.GetStage();
  if (stage !== LevelStage.BLUE_WOMB) {
    return;
  }

  npc.Remove();
  spawnNPCWithSeed(
    EntityType.HUSH,
    0,
    0,
    VANILLA_HUSH_SPAWN_POSITION,
    npc.InitSeed,
  );
}
