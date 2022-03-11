import * as debugFunction from "../debugFunction";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_EFFECT_RENDER, main);
}

function main(effect: EntityEffect, _renderOffset: Vector) {
  debugFunction.postEffectRender(effect);
}
