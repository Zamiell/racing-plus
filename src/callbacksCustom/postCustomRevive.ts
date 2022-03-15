import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import { seededDeathPostCustomRevive } from "../features/mandatory/seededDeath/callbacks/postCustomRevive";
import { RevivalType } from "../features/race/types/RevivalType";

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
