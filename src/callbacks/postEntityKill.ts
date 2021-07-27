import * as megaSatanPreventEnd from "../features/mandatory/megaSatanPreventEnd";
import * as postWombPath from "../features/mandatory/postWombPath";
import * as replacePhotos from "../features/mandatory/replacePhotos";
import * as fadeBosses from "../features/optional/bosses/fadeBosses";
import * as stopVictoryLapPopup from "../features/optional/bosses/stopVictoryLapPopup";
import fastClearPostEntityKill from "../features/optional/major/fastClear/callbacks/postEntityKill";
import * as racePostEntityKill from "../features/race/callbacks/postEntityKill";

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
    lamb,
    EntityType.ENTITY_THE_LAMB, // 273
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
    theBeast,
    EntityType.ENTITY_BEAST, // 951
  );
}

export function main(entity: Entity): void {
  /*
  log(
    `MC_POST_ENTITY_KILL - ${entity.Type}.${entity.Variant}.${
      entity.SubType
    } (on game frame ${Game().GetFrameCount()})`,
  );
  */

  fastClearPostEntityKill(entity);
  fadeBosses.postEntityKill(entity);
}

// EntityType.ENTITY_MOM (45)
function mom(entity: Entity) {
  replacePhotos.postEntityKillMom(entity);
  racePostEntityKill.mom(entity);
}

// EntityType.ENTITY_MOMS_HEART (78)
function momsHeart(entity: Entity) {
  postWombPath.postEntityKillMomsHeart(entity);
}

// EntityType.ENTITY_THE_LAMB (273)
function lamb(entity: Entity) {
  stopVictoryLapPopup.postEntityKillLamb(entity);
}

// EntityType.ENTITY_MEGA_SATAN_2 (275)
function megaSatan2(entity: Entity) {
  megaSatanPreventEnd.postEntityKillMegaSatan2(entity);
}

// EntityType.ENTITY_HUSH (407)
function hush(entity: Entity) {
  postWombPath.postEntityKillHush(entity);
  racePostEntityKill.hush(entity);
}

// EntityType.ENTITY_BEAST (951)
function theBeast(entity: Entity) {
  racePostEntityKill.theBeast(entity);
}
