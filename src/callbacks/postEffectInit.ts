import * as centerStart from "../features/mandatory/centerStart";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";

// EffectVariant.POOF01 (15)
export function poof01(effect: EntityEffect): void {
  centerStart.poof01(effect);
}

// EffectVariant.CREEP_RED (22)
export function creepRed(effect: EntityEffect): void {
  changeCreepColor.postEffectInitCreepRed(effect);
}

// EffectVariant.PLAYER_CREEP_GREEN (53)
export function playerCreepGreen(effect: EntityEffect): void {
  changeCreepColor.postEffectInitPlayerCreepGreen(effect);
}
