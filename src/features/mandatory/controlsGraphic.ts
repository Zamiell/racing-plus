// Racing+ re-implements the controls graphic in the starting room so that it will not interfere
// with other kinds of graphics
// Some code is borrowed from Revelations / StageAPI
// This feature is not configurable because we destroy the original starting room graphic file

import g from "../../globals";
import { getRoomIndex } from "../../misc";
import { EffectSubTypeCustom } from "../../types/enums";

export function postNewRoom(): void {
  drawControlsGraphic();
}

function drawControlsGraphic() {
  if (!shouldDrawControlsGraphic()) {
    return;
  }

  const stageType = g.l.GetStageType();
  const centerPos = g.r.GetCenterPos();

  // Spawn the custom "Floor Effect Creep" entity
  const controlsEffect = Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.PLAYER_CREEP_RED,
    EffectSubTypeCustom.FLOOR_EFFECT_CREEP,
    centerPos,
    Vector.Zero,
    null,
  ).ToEffect();
  if (controlsEffect === null) {
    return;
  }

  controlsEffect.Timeout = 1000000;
  const controlsSprite = controlsEffect.GetSprite();
  controlsSprite.Load("gfx/backdrop/controls_custom.anm2", true);
  controlsSprite.Play("Idle", true);

  // Always set the scale to 1 in case the player has an item like Lost Cork
  // (otherwise, it will have a scale of 1.75)
  controlsEffect.Scale = 1;

  // On vanilla, the sprite is a slightly different color on the Burning Basement
  if (stageType === StageType.STAGETYPE_AFTERBIRTH) {
    controlsSprite.Color = Color(0.5, 0.5, 0.5, 1, 0, 0, 0);
  }
}

function shouldDrawControlsGraphic() {
  // Only draw the graphic in the starting room of the first floor
  // We ignore Greed Mode to simplify things
  // (even though on vanilla the sprite will display in Greed Mode)
  const stage = g.l.GetStage();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const roomIndex = getRoomIndex();

  return (
    (g.g.Difficulty === Difficulty.DIFFICULTY_NORMAL ||
      g.g.Difficulty === Difficulty.DIFFICULTY_HARD) &&
    stage === 1 &&
    roomIndex === startingRoomIndex
    // TODO add logic for races
  );
}
