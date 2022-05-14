import { ModCallback } from "isaac-typescript-definitions";
import { fastClearPostEntityRemove } from "../features/optional/major/fastClear/callbacks/postEntityRemove";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_ENTITY_REMOVE, main);
}

function main(entity: Entity) {
  fastClearPostEntityRemove(entity);
}
