import { LevelCurse } from "isaac-typescript-definitions";
import { SeededDeathState } from "../../../../enums/SeededDeathState";
import { g } from "../../../../globals";
import {
  logSeededDeathStateChange,
  shouldSeededDeathFeatureApply,
} from "../seededDeath";
import v from "../v";
import { playAppearAnimationAndFade } from "./postNewRoom";

export function seededDeathPostCustomRevive(player: EntityPlayer): void {
  if (!shouldSeededDeathFeatureApply()) {
    return;
  }

  // The 1-Up animation has started playing, so we need to cancel it by playing the fetal position
  // animation again.
  playAppearAnimationAndFade(player);

  // Before the revival, use added Curse of the Unknown to hide the health UI. Now that we have
  // revived, set things back to normal.
  g.l.RemoveCurses(LevelCurse.UNKNOWN);

  v.run.state = SeededDeathState.FETAL_POSITION;
  logSeededDeathStateChange();
}
