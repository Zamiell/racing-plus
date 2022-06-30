import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as seededGlitterBombs from "../features/mandatory/seededGlitterBombs";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED, main);
}

function main(bomb: EntityBomb) {
  seededGlitterBombs.postBombExploded(bomb);
}
