import { EntityType, ModCallback } from "isaac-typescript-definitions";
import * as dummyDPS from "../features/mandatory/dummyDPS";
import * as fastDogma from "../features/optional/bosses/fastDogma";
import * as fastHeretic from "../features/optional/bosses/fastHeretic";
import { speedrunPostNPCRenderDogma } from "../features/speedrun/callbacks/postNPCRender";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_NPC_RENDER,
    heretic,
    EntityType.HERETIC, // 905
  );

  mod.AddCallback(
    ModCallback.POST_NPC_RENDER,
    dogma,
    EntityType.DOGMA, // 950
  );

  mod.AddCallback(
    ModCallback.POST_NPC_RENDER,
    dummy,
    EntityType.DUMMY, // 964
  );
}

// EntityType.HERETIC (905)
function heretic(npc: EntityNPC) {
  fastHeretic.postNPCRenderHeretic(npc);
}

// EntityType.DOGMA (950)
function dogma(npc: EntityNPC) {
  speedrunPostNPCRenderDogma(npc);
  fastDogma.postNPCRenderDogma(npc);
}

// EntityType.DUMMY (964)
function dummy(npc: EntityNPC) {
  dummyDPS.postNPCRenderDummy(npc);
}
