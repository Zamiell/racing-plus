import { getPickups, inRectangle } from "isaacscript-common";

const MOSTLY_FADED_COLOR = Color(1, 1, 1, 0.3, 0, 0, 0);
const X_DISTANCE = 35;
const Y_DISTANCE_ABOVE = 78;

// ModCallbacks.MC_POST_EFFECT_UPDATE (55)
// EffectVariant.DEVIL (6)
export function postEffectUpdateDevil(effect: EntityEffect): void {
  // Fade the statue if there are any collectibles in a rectangle above the effect
  const rectangleTopLeft = Vector(
    effect.Position.X - X_DISTANCE,
    effect.Position.Y - Y_DISTANCE_ABOVE,
  );
  const rectangleBottomRight = Vector(
    effect.Position.X + X_DISTANCE,
    effect.Position.Y, // Below the statue does not block visibility
  );

  const pickups = getPickups();
  const isAnyPickupInRectangle = pickups.some((pickup) =>
    inRectangle(pickup.Position, rectangleTopLeft, rectangleBottomRight),
  );
  if (isAnyPickupInRectangle) {
    effect.SetColor(MOSTLY_FADED_COLOR, 1000, 0, true, true);
  }
}
