import g from "./globals";

export default function debugFunction(): void {
  // Enable debug mode
  g.debug = true;

  /*
  const centerPos = g.r.GetCenterPos();
  const entity = Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.NPC_DEATH_ANIMATION,
    0,
    centerPos,
    Vector.Zero,
    null,
  );
  const sprite = entity.GetSprite();
  */
}

export function debugFunction2(): void {}
