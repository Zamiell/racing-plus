import g from "../../../../../globals";
import * as tracking from "../tracking";

export function main(npc: EntityNPC): void {
  if (!g.fastClear) {
    return;
  }

  // Friendly enemies (from Delirious or Friendly Ball) will be added to the aliveEnemies table
  // because there are no flags set yet in the PostNPCInit callback
  // Thus, we have to wait until they are initialized and not remove them from the table
  if (npc.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
    // Remove it from the list if it is on it
    tracking.checkRemove(npc, false);
    return;
  }

  // In order to keep track of new NPCs,
  // we can't rely on the PostNPCInit callback because it is not fired for certain NPCs
  // (like when a Gusher emerges from killing a Gaper)
  tracking.checkAdd(npc);
}

// EntityType.ENTITY_RAGLING (246)
export function ragling(npc: EntityNPC): void {
  if (!g.fastClear) {
    return;
  }

  // Rag Man Raglings (246.1) do not actually die; they turn into patches on the ground
  // So, we need to manually keep track of when this happens
  if (
    npc.Variant === 1 &&
    npc.State === NpcState.STATE_UNIQUE_DEATH
    // (they go to STATE_UNIQUE_DEATH when they are patches on the ground)
  ) {
    tracking.checkRemove(npc, false);
  }
}

// EntityType.ENTITY_STONEY (302)
export function stoney(npc: EntityNPC): void {
  if (!g.fastClear) {
    return;
  }

  // Stoneys have a chance to morph from EntityType.ENTITY_FATTY (208),
  // so they will get added to the aliveEnemies table before the room is loaded
  // To correct for this, we constantly check to see if Stoneys are on the aliveEnemies table
  const ptrHash = GetPtrHash(npc);
  if (g.run.fastClear.aliveEnemies.get(ptrHash) !== null) {
    g.run.fastClear.aliveEnemies.set(ptrHash, null);
    g.run.fastClear.aliveEnemiesCount -= 1;
  }
}
