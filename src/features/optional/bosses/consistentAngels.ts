// In vanilla, bombing two angel statues will sometimes result in two of the same angel type
// spawning
// Prevent this from happening by keeping track of the angel types

import { saveDataManager } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const FRAME_DELAY_TO_SPAWN_AFTER_MEAT_CLEAVER = 2;

const v = {
  room: {
    lastSpawnedAngelType: null as EntityType | null,
    usedMeatCleaverFrame: null as int | null,
  },
};

export function init(): void {
  saveDataManager("consistentAngels", v);
}

// ModCallbacks.MC_USE_ITEM (3)
// CollectibleType.COLLECTIBLE_MEAT_CLEAVER (631)
export function useItemMeatCleaver(): void {
  v.room.usedMeatCleaverFrame = g.g.GetFrameCount();
}

// ModCallbacks.MC_POST_NPC_INIT (27)
// EntityType.ENTITY_URIEL (271)
export function postNPCInitUriel(npc: EntityNPC): void {
  if (!config.consistentAngels) {
    return;
  }

  checkDuplicateAngel(npc);
}

// ModCallbacks.MC_POST_NPC_INIT (27)
// EntityType.ENTITY_GABRIEL (272)
export function postNPCInitGabriel(npc: EntityNPC): void {
  if (!config.consistentAngels) {
    return;
  }

  checkDuplicateAngel(npc);
}

function checkDuplicateAngel(npc: EntityNPC) {
  const gameFrameCount = g.g.GetFrameCount();

  // This feature should not apply to angels that were duplicated with a Meat Cleaver
  if (
    v.room.usedMeatCleaverFrame !== null &&
    v.room.usedMeatCleaverFrame + FRAME_DELAY_TO_SPAWN_AFTER_MEAT_CLEAVER ===
      gameFrameCount
  ) {
    return;
  }

  // This feature does not apply to Fallen Angels
  if (npc.Variant !== AngelVariant.NORMAL) {
    return;
  }

  if (v.room.lastSpawnedAngelType === null) {
    v.room.lastSpawnedAngelType = npc.Type;
    return;
  }

  if (v.room.lastSpawnedAngelType === npc.Type) {
    npc.Remove();
    v.room.lastSpawnedAngelType = null;

    const otherAngelType =
      npc.Type === EntityType.ENTITY_URIEL
        ? EntityType.ENTITY_GABRIEL
        : EntityType.ENTITY_URIEL;
    g.g.Spawn(
      otherAngelType,
      npc.Variant,
      npc.Position,
      npc.Velocity,
      npc.SpawnerEntity,
      npc.SubType,
      npc.InitSeed,
    );
  }
}
