import { FamiliarVariant, PlayerType } from "isaac-typescript-definitions";
import {
  ColorDefault,
  getFamiliars,
  isCharacter,
  isJacobOrEsau,
  log,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { SeededDeathState } from "../../../enums/SeededDeathState";
import { inSeededRace } from "../../race/v";
import { QUARTER_FADED_COLOR, SEEDED_DEATH_DEBUG } from "./constants";
import v from "./v";

export function applySeededGhostFade(
  player: EntityPlayer,
  enabled: boolean,
): void {
  const sprite = player.GetSprite();
  const newColor = enabled ? QUARTER_FADED_COLOR : ColorDefault;
  sprite.Color = newColor;

  if (isCharacter(player, PlayerType.SOUL)) {
    const forgottenBodies = getFamiliars(FamiliarVariant.FORGOTTEN_BODY);
    for (const forgottenBody of forgottenBodies) {
      const forgottenSprite = forgottenBody.GetSprite();
      forgottenSprite.Color = newColor;
    }
  } else if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      const twinSprite = twin.GetSprite();
      twinSprite.Color = newColor;
    }
  }
}

export function logSeededDeathStateChange(): void {
  if (SEEDED_DEATH_DEBUG) {
    log(
      `Seeded death state changed: ${SeededDeathState[v.run.state]} (${
        v.run.state
      })`,
    );
  }
}

export function shouldSeededDeathFeatureApply(): boolean {
  const challenge = Isaac.GetChallenge();

  return inSeededRace() || challenge === ChallengeCustom.SEASON_2;
}
