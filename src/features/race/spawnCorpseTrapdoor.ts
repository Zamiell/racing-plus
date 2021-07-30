import { NORMAL_TRAPDOOR_POSITION } from "../../constants";
import g from "../../globals";

// If the goal of the race is Mother, we need to explicitly spawn a trapdoor after Mom's Heart is
// defeated (because it was manually removed earlier to avoid the player taking the wrong path)
export function postNewRoom(): void {
  const mausoleumHeartKilled = g.g.GetStateFlag(
    GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED,
  );

  if (
    !g.run.spawnedCorpseTrapdoor &&
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Mother" &&
    mausoleumHeartKilled
  ) {
    g.run.spawnedCorpseTrapdoor = true;
    Isaac.GridSpawn(
      GridEntityType.GRID_TRAPDOOR,
      0,
      NORMAL_TRAPDOOR_POSITION,
      true,
    );
  }
}
