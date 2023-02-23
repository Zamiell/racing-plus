import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { game, getEntityID, log } from "isaacscript-common";
import * as fastAngels from "../classes/features/optional/bosses/FastAngels";
import * as replacePhotos from "../features/mandatory/replacePhotos";
import * as fadeBosses from "../features/optional/bosses/fadeBosses";
import * as fastDogma from "../features/optional/bosses/fastDogma";
import * as fastKrampus from "../features/optional/bosses/fastKrampus";
import * as killExtraEnemies from "../features/optional/bosses/killExtraEnemies";
import * as preventVictoryLapPopup from "../features/optional/bosses/preventVictoryLapPopup";
import { betterDevilAngelRoomsPostEntityKillFallen } from "../features/optional/major/betterDevilAngelRooms/callbacks/postEntityKill";
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
    momsHeart,
    EntityType.MOMS_HEART, // 78
  );

  mod.AddCallback(
    ModCallback.POST_ENTITY_KILL,
    fallen,
    EntityType.FALLEN, // 81
  );

  mod.AddCallback(
    ModCallback.POST_ENTITY_KILL,
    lamb,
    EntityType.THE_LAMB, // 273
  );

  mod.AddCallback(
    ModCallback.POST_ENTITY_KILL,
    uriel,
    EntityType.URIEL, // 271
  );

  mod.AddCallback(
    ModCallback.POST_ENTITY_KILL,
    gabriel,
    EntityType.GABRIEL, // 272
  );

  mod.AddCallback(
    ModCallback.POST_ENTITY_KILL,
    hush,
    EntityType.HUSH, // 407
  );

  mod.AddCallback(
    ModCallback.POST_ENTITY_KILL,
    dogma,
    EntityType.DOGMA, // 950
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
  fadeBosses.postEntityKill(entity);
}

// EntityType.MOM (45)
function mom(entity: Entity) {
  replacePhotos.postEntityKillMom(entity);
  killExtraEnemies.postEntityKillMom();
}

// EntityType.MOMS_HEART (78)
function momsHeart(_entity: Entity) {
  killExtraEnemies.postEntityKillMomsHeart();
}

// EntityType.FALLEN (81)
function fallen(entity: Entity) {
  fastKrampus.postEntityKillFallen(entity);
  betterDevilAngelRoomsPostEntityKillFallen(entity);
}

// EntityType.THE_LAMB (273)
function lamb(entity: Entity) {
  preventVictoryLapPopup.postEntityKillLamb(entity);
}

// EntityType.URIEL (271)
function uriel(entity: Entity) {
  fastAngels.postEntityKillUriel(entity);
}

// EntityType.GABRIEL (272)
function gabriel(entity: Entity) {
  fastAngels.postEntityKillGabriel(entity);
}

// EntityType.HUSH (407)
function hush(entity: Entity) {
  racePostEntityKill.hush(entity);
}

// EntityType.DOGMA (950)
function dogma(entity: Entity) {
  fastDogma.postEntityKillDogma(entity);
}
