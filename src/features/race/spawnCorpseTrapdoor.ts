import { NORMAL_TRAPDOOR_POSITION } from "../../constants";
import g from "../../globals";
import v from "./v";

// If the goal of the race is Mother, we need to explicitly spawn a trapdoor after Mom's Heart is
// defeated (because it was manually removed earlier to avoid the player taking the wrong path)
export function postNewRoom(): void {
  const roomType = g.r.GetType();
  const mausoleumHeartKilled = g.g.GetStateFlag(
    GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED,
  );

  if (
    !v.run.spawnedCorpseTrapdoor &&
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Mother" &&
    mausoleumHeartKilled &&
    roomType === RoomType.ROOM_BOSS
  ) {
    v.run.spawnedCorpseTrapdoor = true;
    Isaac.GridSpawn(
      GridEntityType.GRID_TRAPDOOR,
      0,
      NORMAL_TRAPDOOR_POSITION,
      true,
    );
  }
}
