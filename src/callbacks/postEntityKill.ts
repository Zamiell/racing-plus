import { EntityType, ModCallback } from "isaac-typescript-definitions";
import * as racePostEntityKill from "../features/race/callbacks/postEntityKill";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_ENTITY_KILL,
    hush,
    EntityType.HUSH, // 407
  );
}

// EntityType.HUSH (407)
function hush(entity: Entity) {
  racePostEntityKill.hush(entity);
}
