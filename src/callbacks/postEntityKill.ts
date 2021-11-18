import { log } from "isaacscript-common";
import * as beastPreventEnd from "../features/mandatory/beastPreventEnd";
import * as fastDogma from "../features/mandatory/fastDogma";
import * as megaSatanPreventEnd from "../features/mandatory/megaSatanPreventEnd";
import * as replacePhotos from "../features/mandatory/replacePhotos";
import * as fadeBosses from "../features/optional/bosses/fadeBosses";
import * as fastAngels from "../features/optional/bosses/fastAngels";
import * as fastKrampus from "../features/optional/bosses/fastKrampus";
import * as killExtraEnemies from "../features/optional/bosses/killExtraEnemies";
import * as stopVictoryLapPopup from "../features/optional/bosses/stopVictoryLapPopup";
import { fastClearPostEntityKill } from "../features/optional/major/fastClear/callbacks/postEntityKill";
import * as fastTravelPostEntityKill from "../features/optional/major/fastTravel/callbacks/postEntityKill";
import * as racePostEntityKill from "../features/race/callbacks/postEntityKill";

const DEBUG = false;

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_ENTITY_KILL,
    mom,
    EntityType.ENTITY_MOM, // 45
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_ENTITY_KILL,
    momsHeart,
    EntityType.ENTITY_MOMS_HEART, // 78
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_ENTITY_KILL,
    fallen,
    EntityType.ENTITY_FALLEN, // 81
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_ENTITY_KILL,
    lamb,
    EntityType.ENTITY_THE_LAMB, // 273
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_ENTITY_KILL,
    uriel,
    EntityType.ENTITY_URIEL, // 271
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_ENTITY_KILL,
    gabriel,
    EntityType.ENTITY_GABRIEL, // 272
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_ENTITY_KILL,
    megaSatan2,
    EntityType.ENTITY_MEGA_SATAN_2, // 275
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_ENTITY_KILL,
    hush,
    EntityType.ENTITY_HUSH, // 407
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_ENTITY_KILL,
    dogma,
    EntityType.ENTITY_DOGMA, // 950
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_ENTITY_KILL,
    theBeast,
    EntityType.ENTITY_BEAST, // 951
  );
}

export function main(entity: Entity): void {
  if (DEBUG) {
    log(
      `MC_POST_ENTITY_KILL - ${entity.Type}.${entity.Variant}.${
        entity.SubType
      } (on game frame ${Game().GetFrameCount()})`,
    );
  }

  fastClearPostEntityKill(entity);
  fastTravelPostEntityKill.main(entity);
  fadeBosses.postEntityKill(entity);
}

// EntityType.ENTITY_MOM (45)
function mom(entity: Entity) {
  replacePhotos.postEntityKillMom(entity);
  killExtraEnemies.postEntityKillMom();
}

// EntityType.ENTITY_MOMS_HEART (78)
function momsHeart(_entity: Entity) {
  killExtraEnemies.postEntityKillMomsHeart();
}

// EntityType.ENTITY_FALLEN (81)
function fallen(entity: Entity) {
  fastKrampus.postEntityKillFallen(entity);
}

// EntityType.ENTITY_THE_LAMB (273)
function lamb(entity: Entity) {
  stopVictoryLapPopup.postEntityKillLamb(entity);
}

// EntityType.ENTITY_URIEL (271)
function uriel(entity: Entity) {
  fastAngels.postEntityKillUriel(entity);
}

// EntityType.ENTITY_GABRIEL (272)
function gabriel(entity: Entity) {
  fastAngels.postEntityKillGabriel(entity);
}

// EntityType.ENTITY_MEGA_SATAN_2 (275)
function megaSatan2(entity: Entity) {
  megaSatanPreventEnd.postEntityKillMegaSatan2(entity);
}

// EntityType.ENTITY_HUSH (407)
function hush(entity: Entity) {
  racePostEntityKill.hush(entity);
}

// EntityType.ENTITY_DOGMA (950)
function dogma(entity: Entity) {
  fastDogma.postEntityKillDogma(entity);
}

// EntityType.ENTITY_BEAST (951)
function theBeast(entity: Entity) {
  beastPreventEnd.postEntityKillTheBeast(entity);
}
