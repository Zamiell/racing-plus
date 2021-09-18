import { getAliveBosses } from "isaacscript-common";
import g from "../../../../globals";
import v from "./v";

const PERFECTION_VELOCITY_MULTIPLIER = 7; // Experimentally determined from vanilla

// On stage 8, we do not want the Perfection Trinket to be close to the trapdoor or the beam of light
// We put it 2 squares to the right of where the beam of light is
const STAGE_8_SPAWN_GRID_LOCATION = 70;

// On stage 10, we do not want the Perfection Trinket to be close to the passage to the next floor
// in the center of the room
// We put it 2 squares to the right of the center of the room
const STAGE_10_SPAWN_GRID_LOCATION = 69;

const SPLITTING_BOSSES = new Set<EntityType>([
  EntityType.ENTITY_FISTULA_BIG, // 71
  EntityType.ENTITY_FISTULA_MEDIUM, // 72
]);

export function postEntityKill(entity: Entity): void {
  if (v.run.perfection.spawned) {
    return;
  }

  const roomType = g.r.GetType();
  const startSeed = g.seeds.GetStartSeed();

  if (roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  const npc = entity.ToNPC();
  if (npc === undefined) {
    return;
  }

  if (!npc.IsBoss()) {
    return;
  }

  if (SPLITTING_BOSSES.has(npc.Type)) {
    return;
  }

  // Perfection is spawned after clearing 3 floors in a row without taking any damage
  // The "floorsWithoutDamage" variable is incremented after going in a trapdoor
  // So if it is at 2, and we have not taken damage on this floor,
  // and we have killed the boss for this floor, then we have cleared 3 floors
  if (v.run.perfection.floorsWithoutDamage < 2 || v.level.tookDamage) {
    return;
  }

  const aliveBosses = getAliveBosses();
  if (aliveBosses.length > 0) {
    return;
  }

  const velocity = RandomVector().mul(PERFECTION_VELOCITY_MULTIPLIER);
  const position = getPerfectionPosition(npc);
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TRINKET,
    position,
    velocity,
    undefined,
    TrinketType.TRINKET_PERFECTION,
    startSeed,
  );

  v.run.perfection.spawned = true;
}

export function getPerfectionPosition(npc: EntityNPC | null): Vector {
  const stage = g.l.GetStage();
  const centerPos = g.r.GetCenterPos();

  if (stage === 8) {
    return g.r.GetGridPosition(STAGE_8_SPAWN_GRID_LOCATION);
  }

  if (stage === 10) {
    return g.r.GetGridPosition(STAGE_10_SPAWN_GRID_LOCATION);
  }

  return npc === null ? centerPos : npc.Position;
}
