import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import * as fastTravelPostEffectUpdate from "../features/optional/major/fastTravel/callbacks/postEffectUpdate";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";
import * as fadeDevilStatue from "../features/optional/quality/fadeDevilStatue";
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
}

// EffectVariant.PLAYER_CREEP_RED (46)
function playerCreepRed(effect: EntityEffect) {
  changeCreepColor.postEffectUpdatePlayerCreepRed(effect);
}
