import {
  EntityType,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import { getAliveBosses, spawnTrinket } from "isaacscript-common";
import g from "../../../../globals";
import v from "./v";

const PERFECTION_VELOCITY_MULTIPLIER = 7; // Experimentally determined from vanilla

const SPLITTING_BOSSES: ReadonlySet<EntityType> = new Set([
  EntityType.FISTULA_BIG, // 71
  EntityType.FISTULA_MEDIUM, // 72
]);

// ModCallback.POST_ENTITY_KILL (68)
export function postEntityKill(entity: Entity): void {
  if (v.run.perfection.spawned) {
    return;
  }

  const roomType = g.r.GetType();
  const startSeed = g.seeds.GetStartSeed();

  if (roomType !== RoomType.BOSS) {
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

  // Perfection is spawned after clearing 3 floors in a row without taking any damage.
  // The "floorsWithoutDamage" variable is incremented after going in a trapdoor.
  // So if it is at 2, and we have not taken damage on this floor,
  // and we have killed the boss for this floor, then we have cleared 3 floors.
  if (v.run.perfection.floorsWithoutDamage < 2 || v.level.tookDamage) {
    return;
  }

  const aliveBosses = getAliveBosses();
  if (aliveBosses.length > 0) {
    return;
  }

  const velocity = RandomVector().mul(PERFECTION_VELOCITY_MULTIPLIER);
  spawnTrinket(
    TrinketType.PERFECTION,
    npc.Position,
    velocity,
    undefined,
    startSeed,
  );

  v.run.perfection.spawned = true;
}
