import g from "./globals";

export default function debugFunction(): void {
  // Enable debug mode
  g.debug = true;

  /*
  const heavenDoors = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariant.HEAVEN_LIGHT_DOOR,
  );
  if (heavenDoors.length > 0) {
    const heavenDoor = heavenDoors[0];
    const position = findFreePosition(heavenDoor.Position);
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TRINKET,
      TrinketType.TRINKET_PERFECTION,
      position,
      Vector.Zero,
      null,
    );
  }
  */
}

export function debugFunction2(): void {}
