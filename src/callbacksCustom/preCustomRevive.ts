import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { seededDeathPreCustomRevive } from "../features/mandatory/seededDeath/callbacks/preCustomRevive";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.PRE_CUSTOM_REVIVE, main);
}

function main(player: EntityPlayer): int | undefined {
  return seededDeathPreCustomRevive(player);
}
