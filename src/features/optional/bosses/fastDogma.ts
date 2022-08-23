import { DogmaVariant } from "isaac-typescript-definitions";
import { asNumber } from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { config } from "../../../modConfigMenu";
import { consoleCommand } from "../../../utils";

// ModCallback.POST_ENTITY_KILL (68)
// EntityType.DOGMA (950)
export function postEntityKillDogma(entity: Entity): void {
  if (!config.fastDogma) {
    return;
  }

  // This feature does not apply when playing Season 3.
  const challenge = Isaac.GetChallenge();
  if (challenge === ChallengeCustom.SEASON_3) {
    return;
  }

  // As soon as the player kills the second phase of Dogma, warp them immediately to The Beast fight
  // without playing the cutscene.
  if (entity.Variant === asNumber(DogmaVariant.ANGEL_PHASE_2)) {
    consoleCommand("goto x.itemdungeon.666");
  }
}

// ModCallback.POST_NPC_RENDER (28)
// EntityType.DOGMA (950)
export function postNPCRenderDogma(npc: EntityNPC): void {
  const sprite = npc.GetSprite();
  const animation = sprite.GetAnimation();
  if (animation === "Transition" || animation === "Appear") {
    sprite.SetLastFrame();
  }
}
