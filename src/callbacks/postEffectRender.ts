import * as debugFunction from "../debugFunction";

export function main(effect: EntityEffect, _renderOffset: Vector): void {
  debugFunction.postEffectRender(effect);
}
