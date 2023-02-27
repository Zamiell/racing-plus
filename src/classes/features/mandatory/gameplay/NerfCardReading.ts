import {
  EffectVariant,
  EntityType,
  LevelStage,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  onStageOrHigher,
  removeAllMatchingEntities,
} from "isaacscript-common";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

/** Card Reading is too powerful, so it is nerfed in Racing+. */
export class NerfCardReading extends MandatoryModFeature {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.removeEndGamePortals();
  }

  removeEndGamePortals(): void {
    if (shouldRemoveEndGamePortals()) {
      removeAllMatchingEntities(
        EntityType.EFFECT,
        EffectVariant.PORTAL_TELEPORT,
      );
    }
  }
}

export function shouldRemoveEndGamePortals(): boolean {
  return onStageOrHigher(LevelStage.WOMB_2);
}
