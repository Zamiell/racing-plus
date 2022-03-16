import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import { RevivalType } from "../enums/RevivalType";
import { seededDeathPostCustomRevive } from "../features/mandatory/seededDeath/callbacks/postCustomRevive";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_CUSTOM_REVIVE,
    seededDeath,
    RevivalType.SEEDED_DEATH,
  );
}

function seededDeath(player: EntityPlayer) {
  seededDeathPostCustomRevive(player);
}
