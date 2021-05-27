import g from "../../../../../globals";
import { EffectVariantCustom } from "../../../../../types/enums";
import { FastTravelEntityState } from "../enums";

export function main(): void {
  if (!g.config.fastTravel) {
    return;
  }

  openClosedHeavenDoors();
}

function openClosedHeavenDoors() {
  const heavenDoors = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.HEAVEN_DOOR_FAST_TRAVEL,
    -1,
    false,
    false,
  );
  for (const heavenDoor of heavenDoors) {
    const effect = heavenDoor.ToEffect();
    if (effect !== null && effect.State === FastTravelEntityState.Closed) {
      effect.State = FastTravelEntityState.Open;
      const sprite = effect.GetSprite();
      sprite.Play("Appear", true);
    }
  }
}
