import * as pc from "../features/optional/graphics/paschalCandle";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_FAMILIAR_INIT,
    paschalCandle,
    FamiliarVariant.PASCHAL_CANDLE, // 221
  );
}

function paschalCandle(familiar: EntityFamiliar) {
  pc.postFamiliarInit(familiar);
}
