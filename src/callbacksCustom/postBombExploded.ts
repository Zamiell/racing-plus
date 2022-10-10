import { ModCallbackCustom } from "isaacscript-common";
import * as seededGlitterBombs from "../features/mandatory/seededGlitterBombs";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED, main);
}

function main(bomb: EntityBomb) {
  seededGlitterBombs.postBombExploded(bomb);
}
