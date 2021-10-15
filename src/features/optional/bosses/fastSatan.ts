import { getRoomStageID, getRoomVariant } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { incrementRNG } from "../../../util";

const SATAN_ROOM_VARIANT = 3600;

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
  const roomStageID = getRoomStageID();
  const roomVariant = getRoomVariant();
  const roomClear = g.r.IsClear();

  if (roomClear) {
    return;
  }

  // There is only one Satan room
  if (
    roomStageID !== StageID.SPECIAL_ROOMS ||
    roomVariant !== SATAN_ROOM_VARIANT
  ) {
    return;
  }

  spawnEnemies();
  primeStatue();
}

function spawnEnemies() {
  // Spawn 2x Kamikaze Leech (55.1) & 1x Fallen (81.0)
  const roomSeed = g.r.GetSpawnSeed();

  let seed = roomSeed;
  for (const gridIndex of [66, 68]) {
    const position = g.r.GetGridPosition(gridIndex);
    seed = incrementRNG(seed);
    g.g.Spawn(
      EntityType.ENTITY_LEECH,
      1,
      position,
      Vector.Zero,
      undefined,
      0,
      seed,
    );
  }

  seed = incrementRNG(seed);
  const centerPos = g.r.GetCenterPos();
  g.g.Spawn(
    EntityType.ENTITY_FALLEN,
    0,
    centerPos,
    Vector.Zero,
    undefined,
    0,
    seed,
  );
}

function primeStatue() {
  // Prime the statue to wake up quicker
  const satans = Isaac.FindByType(EntityType.ENTITY_SATAN);
  for (const satan of satans) {
    const npc = satan.ToNPC();
    if (npc !== undefined) {
      npc.I1 = 1;
    }
  }
}
