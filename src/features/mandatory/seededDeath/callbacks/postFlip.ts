import { runNextGameFrame, useActiveItemTemp } from "isaacscript-common";
import { SeededDeathState } from "../../../../enums/SeededDeathState";
import {
  applySeededGhostFade,
  shouldSeededDeathFeatureApply,
} from "../seededDeath";
import v from "../v";

export function seededDeathPostFlip(player: EntityPlayer): void {
  if (!shouldSeededDeathFeatureApply()) {
    return;
  }

  if (v.run.state !== SeededDeathState.GHOST_FORM) {
    return;
  }

  // If Tainted Lazarus clears a room while in ghost form, he will switch to other Lazarus
  // Prevent this from happening by switching back
  // If we do the switch now, Tainted Lazarus will enter a bugged state where he has a very fast
  // movement speed
  // Mark to do the switch a frame from now
  if (v.run.switchingBackToGhostLazarus) {
    v.run.switchingBackToGhostLazarus = false;

    // Flipping back from the other Lazarus will remove the seeded death fade,
    // so we have to reapply it
    applySeededGhostFade(player, true);
  } else {
    runNextGameFrame(() => {
      v.run.switchingBackToGhostLazarus = true;
      useActiveItemTemp(player, CollectibleType.COLLECTIBLE_FLIP);
    });
  }
}
