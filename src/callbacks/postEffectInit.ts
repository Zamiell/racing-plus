import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { EffectVariantCustom } from "../enums/EffectVariantCustom";
import { seededDeathPostEffectInitBloodDrop } from "../features/mandatory/seededDeath/callbacks/postEffectInit";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_EFFECT_INIT,
    playerCreepGreen,
    EffectVariant.PLAYER_CREEP_GREEN, // 53
  );

  mod.AddCallback(
    ModCallback.POST_EFFECT_INIT,
    bloodDrop,
    EffectVariant.BLOOD_DROP, // 70
  );

  mod.AddCallback(
    ModCallback.POST_EFFECT_INIT,
    invisibleEffect,
    EffectVariantCustom.INVISIBLE_EFFECT,
  );
}

// EffectVariant.PLAYER_CREEP_GREEN (53)
function playerCreepGreen(effect: EntityEffect) {
  changeCreepColor.postEffectInitPlayerCreepGreen(effect);
}

// EffectVariant.BLOOD_DROP (70)
function bloodDrop(effect: EntityEffect) {
  seededDeathPostEffectInitBloodDrop(effect);
}

// EffectVariantCustom.INVISIBLE_EFFECT
function invisibleEffect(effect: EntityEffect) {
  effect.Remove();
}
