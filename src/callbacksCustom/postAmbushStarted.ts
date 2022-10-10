import { AmbushType, ModCallbackCustom } from "isaacscript-common";
import * as fastBossRush from "../features/optional/bosses/fastBossRush";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_AMBUSH_STARTED,
    bossRush,
    AmbushType.BOSS_RUSH,
  );
}

function bossRush() {
  fastBossRush.postAmbushStartedBossRush();
}
