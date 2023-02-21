import { DogmaVariant, PickupVariant } from "isaac-typescript-definitions";
import { asNumber, spawnPickup } from "isaacscript-common";
import { season3HasDogmaGoal } from "../../../../classes/features/speedrun/season3/v";
import { g } from "../../../../globals";
import { mod } from "../../../../mod";
import { onSeason } from "../../speedrun";

// EntityType.DOGMA (950)
export function season3PostEntityKillDogma(entity: Entity): void {
  if (!onSeason(3)) {
    return;
  }

  if (entity.Variant !== asNumber(DogmaVariant.ANGEL_PHASE_2)) {
    return;
  }

  if (!season3HasDogmaGoal()) {
    return;
  }

  // The Big Chest will be replaced by a Checkpoint or Trophy on the subsequent frame.
  const centerPos = g.r.GetCenterPos();
  spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);

  // When Dogma dies, it triggers the static fade out effect, which will take the player to the
  // Beast Room. In this circumstance, since we are not on the Home floor, the game will crash.
  // Thus, we need to stop the fade out effect from occurring. Since the effect is only triggered
  // once Dogma's death animation ends, we can prevent the effect by removing Dogma on the frame
  // before the death animation completes.
  const entityPtr = EntityPtr(entity);
  mod.runInNGameFrames(() => {
    const futureEntity = entityPtr.Ref;
    if (futureEntity !== undefined) {
      futureEntity.Remove();
    }
  }, 41); // 42 triggers the static.
}
