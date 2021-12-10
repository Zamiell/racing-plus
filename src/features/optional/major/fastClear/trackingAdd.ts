import {
  isAliveExceptionNPC,
  isDyingEggyWithNoSpidersLeft,
  log,
} from "isaacscript-common";
import g from "../../../../globals";
import { FAST_CLEAR_DEBUG } from "./constants";
import * as trackingRemove from "./trackingRemove";
import v from "./v";

// ModCallbacks.MC_NPC_UPDATE (0)
export function postNPCUpdate(npc: EntityNPC): void {
  // Friendly enemies (from Delirious or Friendly Ball) will be added to the aliveEnemies table
  // because there are no flags set yet in the PostNPCInit callback
  // Thus, we have to wait until they are initialized before we remove them from the table
  if (npc.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
    trackingRemove.checkRemove(npc, false);
    return;
  }

  // Eggies will never trigger the PostEntityKill callback,
  // so we must manually check to see if they are dead on every frame
  if (isDyingEggyWithNoSpidersLeft(npc)) {
    trackingRemove.checkRemove(npc, false);
    return;
  }

  // In order to keep track of new NPCs,
  // we can't completely rely on the PostNPCInit callback because it is not fired for certain NPCs
  // (like when a Gusher emerges from killing a Gaper)
  checkAdd(npc, "MC_NPC_UPDATE");
}

// ModCallbacks.MC_POST_NPC_INIT (27)
export function postNPCInit(npc: EntityNPC): void {
  checkAdd(npc, "MC_POST_NPC_INIT");
}

// ModCallbacks.MC_POST_PROJECTILE_INIT (43)
export function postProjectileInit(projectile: EntityProjectile): void {
  checkAdd(projectile, "MC_POST_PROJECTILE_INIT");
}

function checkAdd(entity: Entity, parentCallback: string) {
  // Don't do anything if we are already tracking this entity
  const ptrHash = GetPtrHash(entity);
  if (v.room.aliveEnemies.has(ptrHash)) {
    return;
  }

  // The only projectiles that we want to track are Meat Projectiles from a Cohort
  const projectile = entity.ToProjectile();
  if (
    projectile !== undefined &&
    projectile.Variant !== ProjectileVariant.PROJECTILE_MEAT
  ) {
    return;
  }

  // We don't care if this is a non-battle NPC
  // (for some reason, some NPCs incorrectly have their "CanShutDoors" property equal to false)
  const npc = entity.ToNPC();
  if (
    npc !== undefined &&
    !npc.CanShutDoors &&
    npc.Type !== EntityType.ENTITY_DEEP_GAPER
  ) {
    return;
  }

  // We don't care if the NPC is already dead
  // (this is needed because we can enter this function from the PostNPCUpdate callback)
  if (entity.IsDead()) {
    return;
  }

  // We don't care if this is a specific child NPC attached to some other NPC (like Death's scythes)
  if (npc !== undefined && isAliveExceptionNPC(npc)) {
    return;
  }

  add(entity, ptrHash, parentCallback);
}

function add(entity: Entity, ptrHash: PtrHash, parentCallback: string) {
  const gameFrameCount = g.g.GetFrameCount();

  v.room.aliveEnemies.add(ptrHash);

  if (FAST_CLEAR_DEBUG) {
    log(
      `Added NPC to track to frame ${gameFrameCount}: ${entity.Type}.${entity.Variant}.${entity.SubType} - ${ptrHash} (${parentCallback})`,
    );
    log(
      `Total NPCs tracked on frame ${gameFrameCount}: ${v.room.aliveEnemies.size}`,
    );
  }
}
