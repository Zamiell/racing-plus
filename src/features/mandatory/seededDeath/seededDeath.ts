import {
  getDefaultColor,
  getFamiliars,
  isJacobOrEsau,
  log,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { SeededDeathState } from "../../../types/SeededDeathState";
import { RaceFormat } from "../../race/types/RaceFormat";
import { RacerStatus } from "../../race/types/RacerStatus";
import { RaceStatus } from "../../race/types/RaceStatus";
import { ChallengeCustom } from "../../speedrun/enums";
import { QUARTER_FADED_COLOR, SEEDED_DEATH_DEBUG } from "./constants";
import v from "./v";

export function applySeededGhostFade(
  player: EntityPlayer,
  enabled: boolean,
): void {
  const character = player.GetPlayerType();

  const sprite = player.GetSprite();
  const newColor = enabled ? QUARTER_FADED_COLOR : getDefaultColor();
  sprite.Color = newColor;

  if (character === PlayerType.PLAYER_THESOUL) {
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

export function logSeededDeathStateChange() {
  if (SEEDED_DEATH_DEBUG) {
    log(`Changed seeded death state: ${SeededDeathState[v.run.state]}`);
  }
}

export function shouldSeededDeathApply(): boolean {
  const challenge = Isaac.GetChallenge();

  return inSeededRace() || challenge === ChallengeCustom.SEASON_2;
}

function inSeededRace() {
  return (
    config.clientCommunication &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format === RaceFormat.SEEDED
  );
}
