import { DogmaVariant } from "isaac-typescript-definitions";
import { config } from "../../../modConfigMenu";
import { consoleCommand } from "../../../utils";

// ModCallback.POST_ENTITY_KILL (68)
// EntityType.DOGMA (950)
export function postEntityKillDogma(entity: Entity): void {
  if (!config.fastDogma) {
    return;
  }

  // As soon as the player kills the second phase of Dogma, warp them immediately to The Beast fight
  // without playing the cutscene.
  if (entity.Variant === (DogmaVariant.ANGEL_PHASE_2 as int)) {
    consoleCommand("goto x.itemdungeon.666");
  }
}
