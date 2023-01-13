import {
  EntityFlag,
  EntityType,
  ProjectileVariant,
} from "isaac-typescript-definitions";
import {
  isAliveExceptionNPC,
  isDyingDump,
  isDyingEggyWithNoSpidersLeft,
} from "isaacscript-common";
import * as trackingRemove from "./trackingRemove";
import { logFastClear, v } from "./v";

// ModCallback.POST_NPC_UPDATE (0)
export function postNPCUpdate(npc: EntityNPC): void {
  // Friendly enemies (from Delirious or Friendly Ball) will be added to the `aliveEnemies` set
  // because there are no flags set yet in the `POST_NPC_INIT` callback. Thus, we have to wait until
  // they are initialized before we remove them from the table.
  if (npc.HasEntityFlags(EntityFlag.FRIENDLY)) {
    trackingRemove.checkRemove(npc, false, "MC_NPC_UPDATE_FLAG_FRIENDLY");
    return;
  }

  // Eggies will never trigger the `POST_ENTITY_KILL` callback, so we must manually check to see if
  // they are dead on every frame.
  if (isDyingEggyWithNoSpidersLeft(npc)) {
    trackingRemove.checkRemove(npc, false, "MC_NPC_UPDATE_DYING_EGGY");
    return;
  }

  // Dumps will never trigger the `POST_ENTITY_KILL` callback, so we must manually check to see if
  // they are dead on every frame.
  if (isDyingDump(npc)) {
    trackingRemove.checkRemove(npc, false, "MC_NPC_UPDATE_DYING_DUMP");
    return;
  }

  // In order to keep track of new NPCs, we cannot completely rely on the `POST_NPC_INIT` callback,
  // because it is not fired for certain NPCs (like when a Gusher emerges from killing a Gaper).
  checkAdd(npc, "MC_NPC_UPDATE");
}

// ModCallback.POST_NPC_INIT (27)
export function postNPCInit(npc: EntityNPC): void {
  checkAdd(npc, "MC_POST_NPC_INIT");
}

// ModCallback.POST_PROJECTILE_INIT (43)
export function postProjectileInitMeat(projectile: EntityProjectile): void {
  checkAdd(projectile, "MC_POST_PROJECTILE_INIT");
}

function checkAdd(entity: Entity, parentCallback: string) {
  // Don't do anything if we are already tracking this entity.
  const ptrHash = GetPtrHash(entity);
  if (v.room.aliveEnemies.has(ptrHash)) {
    return;
  }

  // The only projectiles that we want to track are Meat Projectiles from a Cohort.
  const projectile = entity.ToProjectile();
  if (
    projectile !== undefined &&
    projectile.Variant !== ProjectileVariant.MEAT
  ) {
    return;
  }

  // We don't care if this is a non-battle NPC.
  const npc = entity.ToNPC();
  if (
    npc !== undefined &&
    !npc.CanShutDoors &&
    // For some reason, some NPCs incorrectly have their "CanShutDoors" property equal to false.
    npc.Type !== EntityType.DEEP_GAPER
  ) {
    return;
  }

  // We don't care if the NPC is already dead. (This is needed because we can enter this function
  // from the `POST_NPC_UPDATE` callback.)
  if (entity.IsDead()) {
    return;
  }

  // We don't care if this is a specific child NPC attached to some other NPC (like Death's
  // scythes).
  if (npc !== undefined && isAliveExceptionNPC(npc)) {
    return;
  }

  add(entity, ptrHash, parentCallback);
}

function add(entity: Entity, ptrHash: PtrHash, parentCallback: string) {
  v.room.aliveEnemies.add(ptrHash);
  if (entity.IsBoss()) {
    v.room.aliveBosses.add(ptrHash);
  }

  logFastClear(true, entity, ptrHash, parentCallback);
}
