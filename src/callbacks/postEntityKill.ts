import { EntityType, ModCallback } from "isaac-typescript-definitions";
import * as replacePhotos from "../features/mandatory/replacePhotos";
import * as racePostEntityKill from "../features/race/callbacks/postEntityKill";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_ENTITY_KILL,
    mom,
    EntityType.MOM, // 45
  );

  mod.AddCallback(
    ModCallback.POST_ENTITY_KILL,
    hush,
    EntityType.HUSH, // 407
  );
}

// EntityType.MOM (45)
function mom(entity: Entity) {
  replacePhotos.postEntityKillMom(entity);
}

// EntityType.HUSH (407)
function hush(entity: Entity) {
  racePostEntityKill.hush(entity);
}
