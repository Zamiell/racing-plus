import g from "../../../globals";
import { gridToPos, incrementRNG } from "../../../misc";

export function postNewRoom(): void {
  if (!g.config.fastSatan) {
    return;
  }

  instantlySpawnSatan();
}

// There is an annoying delay before The Fallen and the leeches spawn
// To fix this, we manually spawn it as soon as the room is entered
function instantlySpawnSatan() {
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomStageID = roomDesc.Data.StageID;
  const roomVariant = roomDesc.Data.Variant;
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
  for (const position of [gridToPos(5, 3), gridToPos(7, 3)]) {
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
  const satans = Isaac.FindByType(
    EntityType.ENTITY_SATAN,
    -1,
    -1,
    false,
    false,
  );
  for (const satan of satans) {
    const npc = satan.ToNPC();
    if (npc !== null) {
      npc.I1 = 1;
    }
  }
}
