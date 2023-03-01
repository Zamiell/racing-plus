import { FamiliarVariant, PlayerType } from "isaac-typescript-definitions";
import {
  getFamiliars,
  isCharacter,
  isJacobOrEsau,
  log,
  setEntityOpacity,
} from "isaacscript-common";
import { SeededDeathState } from "../../../enums/SeededDeathState";
import { onSeason } from "../../../speedrun/utilsSpeedrun";
import { inSeededRace } from "../../race/v";
import { SEEDED_DEATH_DEBUG, SEEDED_DEATH_FADE_AMOUNT } from "./constants";
import { v } from "./v";

export function applySeededGhostFade(
  player: EntityPlayer,
  enabled: boolean,
): void {
  const alpha = enabled ? SEEDED_DEATH_FADE_AMOUNT : 1;
  setEntityOpacity(player, alpha);

  if (isCharacter(player, PlayerType.SOUL)) {
    const forgottenBodies = getFamiliars(FamiliarVariant.FORGOTTEN_BODY);
    for (const forgottenBody of forgottenBodies) {
      setEntityOpacity(forgottenBody, alpha);
    }
  } else if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      setEntityOpacity(twin, alpha);
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
  return inSeededRace() || onSeason(2);
}
