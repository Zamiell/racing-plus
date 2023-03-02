import { ModCallback } from "isaac-typescript-definitions";
import { fastClearPostNPCInit } from "../features/optional/major/fastClear/callbacks/postNPCInit";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_NPC_INIT, main);
}

function main(npc: EntityNPC) {
  fastClearPostNPCInit(npc);
}
