import { ChallengeCustom } from "../../../../enums/ChallengeCustom";

// EntityType.DOGMA (950)
export function season3PostNPCRenderDogma(npc: EntityNPC): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  deathFadeOut(npc);
}

/**
 * In season 3, dogma is removed in the middle of his phase 2 death animation, which looks buggy. To
 * counteract this, slowly fade him out as he dies.
 */
function deathFadeOut(npc: EntityNPC) {
  const sprite = npc.GetSprite();
  const animation = sprite.GetAnimation();
  if (animation !== "Death") {
    return;
  }

  const frame = sprite.GetFrame();
  const alpha = 1 - frame * 0.025;
  const fadeColor = Color(1, 1, 1, alpha, 0, 0, 0);
  npc.SetColor(fadeColor, 1000, 0, true, true);
}
