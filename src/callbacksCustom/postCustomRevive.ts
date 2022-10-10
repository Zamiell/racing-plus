import { ModCallbackCustom } from "isaacscript-common";
import { RevivalType } from "../enums/RevivalType";
import { seededDeathPostCustomRevive } from "../features/mandatory/seededDeath/callbacks/postCustomRevive";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_CUSTOM_REVIVE,
    seededDeath,
    RevivalType.SEEDED_DEATH,
  );
}

function seededDeath(player: EntityPlayer) {
  seededDeathPostCustomRevive(player);
}
