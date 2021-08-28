import { getAliveBosses } from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import * as postWombPath from "../postWombPath";
import v from "../v";

const PERFECTION_VELOCITY_MULTIPLIER = 7; // Experimentally determined from vanilla

export function main(entity: Entity): void {
  if (!config.fastTravel) {
    return;
  }

  if (v.run.perfection.spawned) {
    return;
  }

  const roomType = g.r.GetType();
  const startSeed = g.seeds.GetStartSeed();

  if (roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }

  if (!npc.IsBoss()) {
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
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TRINKET,
    npc.Position,
    velocity,
    null,
    TrinketType.TRINKET_PERFECTION,
    startSeed,
  );

  v.run.perfection.spawned = true;
}

// EntityType.ENTITY_MOM (45)
export function mom(_entity: Entity): void {
  if (!config.fastTravel) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  v.room.momKilledFrame = gameFrameCount;
}

// EntityType.ENTITY_MOMS_HEART (78)
export function momsHeart(entity: Entity): void {
  if (!config.fastTravel) {
    return;
  }

  postWombPath.postEntityKillMomsHeart(entity);
}

// EntityType.ENTITY_HUSH (407)
export function hush(entity: Entity): void {
  if (!config.fastTravel) {
    return;
  }

  postWombPath.postEntityKillHush(entity);
}
