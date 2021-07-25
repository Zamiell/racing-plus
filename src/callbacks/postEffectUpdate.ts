import * as fastTravelPostEffectUpdate from "../features/optional/major/fastTravel/callbacks/postEffectUpdate";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_EFFECT_UPDATE,
    heavenLightDoor,
    EffectVariant.HEAVEN_LIGHT_DOOR, // 39
  );
}

export function heavenLightDoor(effect: EntityEffect): void {
  fastTravelPostEffectUpdate.heavenLightDoor(effect);
}
