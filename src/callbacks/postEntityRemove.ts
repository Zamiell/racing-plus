import { fastClearPostEntityRemove } from "../features/optional/major/fastClear/callbacks/postEntityRemove";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_ENTITY_REMOVE, main);
}

function main(entity: Entity) {
  fastClearPostEntityRemove(entity);
}
