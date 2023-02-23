import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { EffectVariantCustom } from "../enums/EffectVariantCustom";
import * as stickyNickel from "../features/optional/graphics/stickyNickel";
import * as fastTravelPostEffectUpdate from "../features/optional/major/fastTravel/callbacks/postEffectUpdate";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";
import * as fadeDevilStatue from "../features/optional/quality/fadeDevilStatue";
import * as fastLuna from "../features/optional/quality/fastLuna";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_EFFECT_UPDATE,
    devil,
    EffectVariant.DEVIL, // 6
  );

  mod.AddCallback(
    ModCallback.POST_EFFECT_UPDATE,
    creepRed,
    EffectVariant.CREEP_RED, // 22
  );

  mod.AddCallback(
    ModCallback.POST_EFFECT_UPDATE,
    heavenLightDoor,
    EffectVariant.HEAVEN_LIGHT_DOOR, // 39
  );

  mod.AddCallback(
    ModCallback.POST_EFFECT_UPDATE,
    playerCreepRed,
    EffectVariant.PLAYER_CREEP_RED, // 46
  );

  mod.AddCallback(
    ModCallback.POST_EFFECT_UPDATE,
    stickyNickelEffect,
    EffectVariantCustom.STICKY_NICKEL,
  );
}

// EffectVariant.DEVIL (6)
function devil(effect: EntityEffect) {
  fadeDevilStatue.postEffectUpdateDevil(effect);
}

// EffectVariant.CREEP_RED (22)
function creepRed(effect: EntityEffect) {
  changeCreepColor.postEffectUpdateCreepRed(effect);
}

// EffectVariant.HEAVEN_LIGHT_DOOR (39)
function heavenLightDoor(effect: EntityEffect) {
  fastTravelPostEffectUpdate.heavenLightDoor(effect);
  fastLuna.postEffectUpdateHeavenLightDoor(effect);
}

// EffectVariant.PLAYER_CREEP_RED (46)
function playerCreepRed(effect: EntityEffect) {
  changeCreepColor.postEffectUpdatePlayerCreepRed(effect);
}

// EffectVariantCustom.STICKY_NICKEL
function stickyNickelEffect(effect: EntityEffect) {
  stickyNickel.postEffectUpdateStickyNickel(effect);
}
