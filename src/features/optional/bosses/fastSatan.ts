import { getNPCs, inBossRoomOf, nextSeed } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

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
  const roomClear = g.r.IsClear();

  if (roomClear) {
    return;
  }

  // There is only one Satan room
  if (!inBossRoomOf(BossID.SATAN)) {
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
    seed = nextSeed(seed);
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

  seed = nextSeed(seed);
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
  const satans = getNPCs(EntityType.ENTITY_SATAN);
  for (const satan of satans) {
    satan.I1 = 1;
  }
}
