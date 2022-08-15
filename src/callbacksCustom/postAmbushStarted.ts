import { AmbushType, ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as fastBossRush from "../features/optional/bosses/fastBossRush";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_AMBUSH_STARTED,
    bossRush,
    AmbushType.BOSS_RUSH,
  );
}

function bossRush() {
  fastBossRush.postAmbushStartedBossRush();
}
