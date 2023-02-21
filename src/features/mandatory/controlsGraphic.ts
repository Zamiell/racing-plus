// Racing+ reimplements the controls graphic in the starting room so that it will not interfere with
// other kinds of graphics. Some code is borrowed from Revelations / StageAPI.

// This feature is not configurable because we destroy the original starting room graphic file.

import { EffectVariant, StageType } from "isaac-typescript-definitions";
import {
  game,
  inStartingRoom,
  onFirstFloor,
  spawnEffect,
} from "isaacscript-common";
import { CreepRedSubTypeCustom } from "../../enums/CreepRedSubTypeCustom";
import { RaceFormat } from "../../enums/RaceFormat";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import { g } from "../../globals";

const BURNING_BASEMENT_COLOR = Color(0.5, 0.5, 0.5);

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  drawControlsGraphic();
}

function drawControlsGraphic() {
  if (!shouldDrawControlsGraphic()) {
    return;
  }

  const stageType = g.l.GetStageType();
  const centerPos = g.r.GetCenterPos();

  // Spawn the custom "Floor Effect Creep" entity.
  const controlsEffect = spawnEffect(
    EffectVariant.PLAYER_CREEP_RED,
    CreepRedSubTypeCustom.FLOOR_EFFECT_CREEP,
    centerPos,
  );

  controlsEffect.CollisionDamage = 0;
  controlsEffect.Timeout = 1000000;
  const controlsSprite = controlsEffect.GetSprite();
  controlsSprite.Load("gfx/backdrop/controls_custom.anm2", true);
  controlsSprite.Play("Idle", true);

  // Always set the scale to 1 in case the player has an item like Lost Cork. (Otherwise, it will
  // have a scale of 1.75.)
  controlsEffect.Scale = 1;

  // On vanilla, the sprite is a slightly different color on the Burning Basement.
  if (stageType === StageType.AFTERBIRTH) {
    controlsSprite.Color = BURNING_BASEMENT_COLOR;
  }
}

/**
 * Only draw the graphic in the starting room of the first floor. We ignore Greed Mode to simplify
 * things, even though on vanilla, the sprite will display in Greed Mode.
 */
function shouldDrawControlsGraphic() {
  const isGreedMode = game.IsGreedMode();

  return (
    !isGreedMode &&
    onFirstFloor() &&
    inStartingRoom() &&
    !inSeededOrDiversityRace()
  );
}

function inSeededOrDiversityRace() {
  return (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    (g.race.format === RaceFormat.SEEDED ||
      g.race.format === RaceFormat.DIVERSITY)
  );
}
