import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import { seededDeathPreCustomRevive } from "../features/mandatory/seededDeath/callbacks/preCustomRevive";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_PRE_CUSTOM_REVIVE, main);
}

function main(player: EntityPlayer): int | void {
  return seededDeathPreCustomRevive(player);
}
