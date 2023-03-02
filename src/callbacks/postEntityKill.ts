import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { game, getEntityID, log } from "isaacscript-common";
import * as replacePhotos from "../features/mandatory/replacePhotos";
import { fastClearPostEntityKill } from "../features/optional/major/fastClear/callbacks/postEntityKill";
import * as fastTravelPostEntityKill from "../features/optional/major/fastTravel/callbacks/postEntityKill";
import * as racePostEntityKill from "../features/race/callbacks/postEntityKill";
import { mod } from "../mod";

const POST_ENTITY_KILL_DEBUG = false as boolean;

export function init(): void {
  mod.AddCallback(ModCallback.POST_ENTITY_KILL, main);

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

function main(entity: Entity) {
  if (POST_ENTITY_KILL_DEBUG) {
    const gameFrameCount = game.GetFrameCount();
    const entityID = getEntityID(entity);

    let state: int | undefined;
    const npc = entity.ToNPC();
    if (npc !== undefined) {
      state = npc.State;
    }
    const stateText = state === undefined ? "n/a" : state.toString();

    log(
      `MC_POST_ENTITY_KILL - ${entityID} (state: ${stateText}) (on game frame ${gameFrameCount})`,
    );
  }

  fastClearPostEntityKill(entity);
  fastTravelPostEntityKill.main(entity);
}

// EntityType.MOM (45)
function mom(entity: Entity) {
  replacePhotos.postEntityKillMom(entity);
}

// EntityType.HUSH (407)
function hush(entity: Entity) {
  racePostEntityKill.hush(entity);
}
