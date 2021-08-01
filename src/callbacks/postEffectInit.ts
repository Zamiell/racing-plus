import * as centerStart from "../features/mandatory/centerStart";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";
import { EffectVariantCustom } from "../types/enums";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_EFFECT_INIT,
    poof01,
    EffectVariant.POOF01, // 15
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_EFFECT_INIT,
    creepRed,
    EffectVariant.CREEP_RED, // 22
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_EFFECT_INIT,
    playerCreepGreen,
    EffectVariant.PLAYER_CREEP_GREEN, // 53
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_EFFECT_INIT,
    invisibleEffect,
    EffectVariantCustom.INVISIBLE_EFFECT,
  );
}

// EffectVariant.POOF01 (15)
function poof01(effect: EntityEffect) {
  centerStart.poof01(effect);
}

// EffectVariant.CREEP_RED (22)
function creepRed(effect: EntityEffect) {
  changeCreepColor.postEffectInitCreepRed(effect);
}

// EffectVariant.PLAYER_CREEP_GREEN (53)
function playerCreepGreen(effect: EntityEffect) {
  changeCreepColor.postEffectInitPlayerCreepGreen(effect);
}

// EffectVariantCustom.INVISIBLE_EFFECT
function invisibleEffect(effect: EntityEffect) {
  effect.Remove();
}
