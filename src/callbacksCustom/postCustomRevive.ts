import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import racePostCustomRevive from "../features/race/callbacks/postCustomRevive";
import RevivalType from "../features/race/types/RevivalType";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_CUSTOM_REVIVE,
    seededDeath,
    RevivalType.SEEDED_DEATH,
  );
}

function seededDeath(player: EntityPlayer, _revivalType: int) {
  racePostCustomRevive(player);
}
