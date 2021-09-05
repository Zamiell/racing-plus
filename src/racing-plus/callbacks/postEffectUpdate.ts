import * as clearerShadowAttacks from "../features/optional/enemies/clearerShadowAttacks";
import * as stickyNickel from "../features/optional/graphics/stickyNickel";
import * as fastTravelPostEffectUpdate from "../features/optional/major/fastTravel/callbacks/postEffectUpdate";
import * as fastLuna from "../features/optional/quality/fastLuna";
import { EffectVariantCustom } from "../types/enums";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_EFFECT_UPDATE,
    target,
    EffectVariant.TARGET, // 30
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_EFFECT_UPDATE,
    heavenLightDoor,
    EffectVariant.HEAVEN_LIGHT_DOOR, // 39
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_EFFECT_UPDATE,
    stickyNickelEffect,
    EffectVariantCustom.STICKY_NICKEL,
  );
}

// EffectVariant.TARGET (30)
function target(effect: EntityEffect) {
  clearerShadowAttacks.postEffectUpdateTarget(effect);
}

// EffectVariant.HEAVEN_LIGHT_DOOR (39)
function heavenLightDoor(effect: EntityEffect) {
  fastTravelPostEffectUpdate.heavenLightDoor(effect);
  fastLuna.postEffectUpdateHeavenLightDoor(effect);
}

// EffectVariantCustom.STICKY_NICKEL
function stickyNickelEffect(effect: EntityEffect) {
  stickyNickel.postEffectUpdateStickyNickel(effect);
}
