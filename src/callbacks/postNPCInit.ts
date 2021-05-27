import * as fastClearPostNPCInit from "../features/optional/major/fastClear/callbacks/postNPCInit";
import * as fastClear2 from "../features/optional/major/fastClear2";

export function main(npc: EntityNPC): void {
  fastClearPostNPCInit.main(npc);
}

export function eye(npc: EntityNPC): void {
  fastClear2.postNPCInitEye(npc);
}
