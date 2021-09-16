// In vanilla, bombing two angel statues will sometimes result in two of the same angel type
// spawning
// Prevent this from happening by keeping track of the angel types

import { saveDataManager } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const v = {
  room: {
    lastSpawnedAngelType: null as EntityType | null,
  },
};

export function init(): void {
  saveDataManager("consistentAngels", v);
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
