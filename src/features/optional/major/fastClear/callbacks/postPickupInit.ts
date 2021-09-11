export function collectible(pickup: EntityPickup): void {
  checkVanillaAngelDrop(pickup);
  checkVanillaKrampusDrop(pickup);
}

function checkVanillaAngelDrop(pickup: EntityPickup) {
  if (
    (pickup.SubType === CollectibleType.COLLECTIBLE_KEY_PIECE_1 || // 238
      pickup.SubType === CollectibleType.COLLECTIBLE_KEY_PIECE_2) && // 239
    (pickup.SpawnerType === EntityType.ENTITY_URIEL || // 271
      pickup.SpawnerType === EntityType.ENTITY_GABRIEL) // 272
  ) {
    pickup.Remove();
  }
}

function checkVanillaKrampusDrop(pickup: EntityPickup) {
  if (
    (pickup.SubType === CollectibleType.COLLECTIBLE_LUMP_OF_COAL || // 132
      pickup.SubType === CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS) && // 293
    pickup.SpawnerType === EntityType.ENTITY_FALLEN
  ) {
    pickup.Remove();
  }
}
