// Note: Position, SpawnerType, SpawnerVariant, and MaxDistance are not initialized yet in this
// callback

import g from "../globals";

// EffectVariant.POOF01 (15)
export function poof01(effect: EntityEffect): void {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Fix the bug where Lilith's familiar poofs will be at the bottom of the screen at the beginning
  // of a run
  if (gameFrameCount === 0) {
    // Even though we remove it below, it will still appear for a frame,
    // so we need to make it invisible
    effect.Visible = false;
    effect.Remove();
  }
}

// EffectVariant.HOT_BOMB_FIRE (51)
export function hotBombFire(effect: EntityEffect): void {
  // Turn enemy fires into a different color
  if (effect.SubType !== 0) {
    // Enemy fires are never subtype 0
    const color = Color(2, 0.4, 0.4, 1, 1, 1, 1);
    effect.SetColor(color, 10000, 10000, false, false);
  }
}
