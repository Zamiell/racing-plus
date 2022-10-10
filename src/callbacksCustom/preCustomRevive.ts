import { ModCallbackCustom } from "isaacscript-common";
import { seededDeathPreCustomRevive } from "../features/mandatory/seededDeath/callbacks/preCustomRevive";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.PRE_CUSTOM_REVIVE, main);
}

function main(player: EntityPlayer): int | undefined {
  return seededDeathPreCustomRevive(player);
}
