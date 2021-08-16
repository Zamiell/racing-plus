import { gridToPos } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { incrementRNG } from "../../../util";

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.fastSatan) {
    return;
  }

  instantlySpawnSatan();
}

// There is an annoying delay before The Fallen and the leeches spawn
// To fix this, we manually spawn it as soon as the room is entered
function instantlySpawnSatan() {
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomData = roomDesc.Data;
  const roomStageID = roomData.StageID;
  const roomVariant = roomData.Variant;
  const roomClear = g.r.IsClear();

  if (roomClear) {
    return;
  }

  // There is only one Satan room
  if (roomStageID !== 0 || roomVariant !== 3600) {
    return;
  }

  spawnEnemies();
  primeStatue();
}

function spawnEnemies() {
  // Spawn 2x Kamikaze Leech (55.1) & 1x Fallen (81.0)
  const roomSeed = g.r.GetSpawnSeed();

  let seed = roomSeed;
  const positions = [gridToPos(5, 3), gridToPos(7, 3)];
  for (const position of positions) {
    seed = incrementRNG(seed);
    g.g.Spawn(EntityType.ENTITY_LEECH, 1, position, Vector.Zero, null, 0, seed);
  }

  seed = incrementRNG(seed);
  g.g.Spawn(
    EntityType.ENTITY_FALLEN,
    0,
    gridToPos(6, 3),
    Vector.Zero,
    null,
    0,
    seed,
  );
}

function primeStatue() {
  // Prime the statue to wake up quicker
  const satans = Isaac.FindByType(EntityType.ENTITY_SATAN);
  for (const satan of satans) {
    const npc = satan.ToNPC();
    if (npc !== null) {
      npc.I1 = 1;
    }
  }
}
