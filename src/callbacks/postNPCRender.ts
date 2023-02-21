import { EntityType, ModCallback } from "isaac-typescript-definitions";
import * as fastPolycephalus from "../features/optional/bosses/fastBlastocyst";
import * as fastDogma from "../features/optional/bosses/fastDogma";
import * as fastHeretic from "../features/optional/bosses/fastHeretic";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_NPC_RENDER,
    blastocystBig,
    EntityType.BLASTOCYST_BIG, // 74
  );

  mod.AddCallback(
    ModCallback.POST_NPC_RENDER,
    blastocystMedium,
    EntityType.BLASTOCYST_MEDIUM, // 75
  );

  mod.AddCallback(
    ModCallback.POST_NPC_RENDER,
    blastocystSmall,
    EntityType.BLASTOCYST_SMALL, // 76
  );

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
}

// EntityType.BLASTOCYST_BIG (74)
function blastocystBig(npc: EntityNPC) {
  fastPolycephalus.postNPCRenderBlastocystBig(npc);
}

// EntityType.BLASTOCYST_MEDIUM (75)
function blastocystMedium(npc: EntityNPC) {
  fastPolycephalus.postNPCRenderBlastocystMedium(npc);
}

// EntityType.BLASTOCYST_SMALL (76)
function blastocystSmall(npc: EntityNPC) {
  fastPolycephalus.postNPCRenderBlastocystSmall(npc);
}

// EntityType.HERETIC (905)
function heretic(npc: EntityNPC) {
  fastHeretic.postNPCRenderHeretic(npc);
}

// EntityType.DOGMA (950)
function dogma(npc: EntityNPC) {
  fastDogma.postNPCRenderDogma(npc);
}
