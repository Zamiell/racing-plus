import shouldEnableFastClear from "../shouldDisable";

export function collectible(pickup: EntityPickup): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  checkVanillaAngelDrop(pickup);
  checkVanillaKrampusDrop(pickup);
}

function checkVanillaAngelDrop(pickup: EntityPickup) {
  // We don't check for the collectible type in case the player has Filigree Feather
  if (
    pickup.SpawnerType === EntityType.ENTITY_URIEL || // 271
    pickup.SpawnerType === EntityType.ENTITY_GABRIEL // 272
  ) {
    pickup.Remove();
  }
}

function checkVanillaKrampusDrop(pickup: EntityPickup) {
  // There is no need to check for the collectible type since the only situation where a Fallen NPC
  // can drop a collectible is Krampus dropping A Lump of Coal or Krampus' Head
  if (pickup.SpawnerType === EntityType.ENTITY_FALLEN) {
    pickup.Remove();
  }
}
