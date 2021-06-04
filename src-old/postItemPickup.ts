/*
export function insertNearestCoin(): void {
  insertNearestPickup(PickupVariant.PICKUP_COIN);
}

export function insertNearestKey(): void {
  insertNearestPickup(PickupVariant.PICKUP_KEY);
}

export function insertNearestBomb(): void {
  insertNearestPickup(PickupVariant.PICKUP_BOMB);
}

export function insertNearestPill(): void {
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_STARTER_DECK)) {
    insertNearestPickup(PickupVariant.PICKUP_TAROTCARD);
  } else {
    insertNearestPickup(PickupVariant.PICKUP_PILL);
  }
}

export function insertNearestCard(): void {
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_LITTLE_BAGGY)) {
    insertNearestPickup(PickupVariant.PICKUP_PILL);
  } else {
    insertNearestPickup(PickupVariant.PICKUP_TAROTCARD);
  }
}

export function insertNearestCardPill(): void {
  // Prefer to equip cards over pills, since they are almost certainly going to be more useful
  if (!insertNearestPickup(PickupVariant.PICKUP_TAROTCARD)) {
    insertNearestPickup(PickupVariant.PICKUP_PILL);
  }
}

export function insertNearestTrinket(): void {
  insertNearestPickup(PickupVariant.PICKUP_TRINKET);
}

export function removeNearestTrinket(): void {
  removeNearestPickup(PickupVariant.PICKUP_TRINKET);
}

export function insertNearestPickup(variant: PickupVariant): boolean {
  const nearestPickup = getNearestPickup(variant);
  if (nearestPickup === null) {
    return false;
  }

  switch (variant) {
    // 20
    case PickupVariant.PICKUP_COIN: {
      return insertCoin(nearestPickup);
    }

    // 30
    case PickupVariant.PICKUP_KEY: {
      return insertKey(nearestPickup);
    }

    // 40
    case PickupVariant.PICKUP_BOMB: {
      return insertBomb(nearestPickup);
    }

    // 70
    case PickupVariant.PICKUP_PILL: {
      return insertPill(nearestPickup);
    }

    // 300
    case PickupVariant.PICKUP_TAROTCARD: {
      return insertCard(nearestPickup);
    }

    // 350
    case PickupVariant.PICKUP_TRINKET: {
      return insertTrinket(nearestPickup);
    }

    default: {
      return false;
    }
  }
}

export function removeNearestPickup(variant: PickupVariant): boolean {
  const nearestPickup = getNearestPickup(variant);
  if (nearestPickup === null) {
    return false;
  }

  nearestPickup.Remove();
  return true;
}

export function getNearestPickup(variant: PickupVariant): EntityPickup | null {
  const pickups = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    variant,
  );
  let nearestPickup: EntityPickup | null = null;
  let nearestPickupDistance: int | null = null;
  for (const entity of pickups) {
    const pickup = entity.ToPickup();
    if (
      pickup !== null &&
      pickup.FrameCount <= 1 &&
      pickup.SpawnerType === EntityType.ENTITY_PLAYER &&
      pickup.Touched === false &&
      pickup.Price === 0 &&
      // Make an exception for Sticky Nickels
      (variant !== PickupVariant.PICKUP_COIN || // 20
        pickup.SubType !== CoinSubType.COIN_STICKYNICKEL) &&
      // Make an exception for Troll Bombs / Mega Troll Bombs
      (variant !== PickupVariant.PICKUP_BOMB || // 40
        (pickup.SubType !== BombSubType.BOMB_TROLL && // 3
          pickup.SubType !== BombSubType.BOMB_SUPERTROLL)) && // 5
      // Make an exception for some detrimental (or potentially detrimental) trinkets
      (variant !== PickupVariant.PICKUP_TRINKET || // 350
        (pickup.SubType !== TrinketType.TRINKET_PURPLE_HEART && // 5
          pickup.SubType !== TrinketType.TRINKET_MOMS_TOENAIL && // 16
          pickup.SubType !== TrinketType.TRINKET_TICK && // 53
          pickup.SubType !== TrinketType.TRINKET_FADED_POLAROID && // 69
          pickup.SubType !== TrinketType.TRINKET_OUROBOROS_WORM)) // 96
    ) {
      const distance = g.p.Position.DistanceSquared(pickup.Position);
      if (nearestPickup === null) {
        nearestPickup = pickup;
        nearestPickupDistance = distance;
      } else if (
        nearestPickupDistance !== null &&
        distance < nearestPickupDistance
      ) {
        nearestPickup = pickup;
        nearestPickupDistance = distance;
      }
    }
  }

  return nearestPickup;
}

// PickupVariant.PICKUP_COIN (20)
function insertCoin(coin: EntityPickup) {
  switch (coin.SubType) {
    // 1
    case CoinSubType.COIN_PENNY: {
      g.p.AddCoins(1);
      break;
    }

    // 2
    case CoinSubType.COIN_NICKEL: {
      g.p.AddCoins(5);
      break;
    }

    // 3
    case CoinSubType.COIN_DIME: {
      g.p.AddCoins(10);
      break;
    }

    // 4
    case CoinSubType.COIN_DOUBLEPACK: {
      g.p.AddCoins(2);
      break;
    }

    // 5
    case CoinSubType.COIN_LUCKYPENNY: {
      g.p.AddCoins(1);
      // (just ignore the luck component for simplicity)
      break;
    }

    default: {
      // Don't put Sticky Nickels in our inventory automatically
      // Don't put unknown types in our inventory automatically
      return false;
    }
  }

  coin.Remove();

  // Arbitrarily use the "Touched" property to mark that it is in the process of being deleted
  coin.Touched = true;

  return true;
}

// PickupVariant.PICKUP_KEY (30)
function insertKey(key: EntityPickup) {
  switch (key.SubType) {
    // 1
    case KeySubType.KEY_NORMAL: {
      g.p.AddKeys(1);
      break;
    }

    // 2
    case KeySubType.KEY_GOLDEN: {
      g.p.AddGoldenKey();
      break;
    }

    // 3
    case KeySubType.KEY_DOUBLEPACK: {
      g.p.AddKeys(2);
      break;
    }

    // 4
    case KeySubType.KEY_CHARGED: {
      g.p.AddKeys(1);
      g.p.FullCharge();
      break;
    }

    default: {
      // Don't put unknown types in our inventory automatically
      return false;
    }
  }

  key.Remove();

  // Arbitrarily use the "Touched" property to mark that it is in the process of being deleted
  key.Touched = true;

  return true;
}

// PickupVariant.PICKUP_BOMB (40)
function insertBomb(bomb: EntityPickup) {
  switch (bomb.SubType) {
    // 1
    case BombSubType.BOMB_NORMAL: {
      g.p.AddBombs(1);
      break;
    }

    // 2
    case BombSubType.BOMB_DOUBLEPACK: {
      g.p.AddBombs(2);
      break;
    }

    // 4
    case BombSubType.BOMB_GOLDEN: {
      g.p.AddGoldenBomb();
      break;
    }

    default: {
      // Don't put Troll Bombs (3) or Mega Troll Bombs (5) in our inventory
      // Don't put unknown types in our inventory automatically
      return false;
    }
  }

  bomb.Remove();

  // Arbitrarily use the "Touched" property to mark that it is in the process of being deleted
  bomb.Touched = true;

  return true;
}

// PickupVariant.PICKUP_PILL (70)
function insertPill(pill: EntityPickup) {
  if (!checkPocketSlotOpen()) {
    return false;
  }

  g.p.AddPill(pill.SubType);
  pill.Remove();

  // Arbitrarily use the "Touched" property to mark that it is in the process of being deleted
  pill.Touched = true;

  return true;
}

// PickupVariant.PICKUP_TAROTCARD (300)
function insertCard(card: EntityPickup) {
  if (!checkPocketSlotOpen()) {
    return false;
  }

  g.p.AddCard(card.SubType);
  card.Remove();

  // Arbitrarily use the "Touched" property to mark that it is in the process of being deleted
  card.Touched = true;

  return true;
}

function checkPocketSlotOpen() {
  // Local variables
  const card1 = g.p.GetCard(0); // Returns 0 if no card
  const card2 = g.p.GetCard(1); // Returns 0 if no card
  const pill1 = g.p.GetPill(0); // Returns 0 if no pill
  const pill2 = g.p.GetPill(1); // Returns 0 if no pill
  const slot1Open = card1 === 0 && pill1 === 0;
  const slot2Open = card2 === 0 && pill2 === 0;

  const slots = g.p.GetMaxPoketItems();
  if (slots === 1) {
    return slot1Open;
  }
  if (slots === 2) {
    return slot1Open || slot2Open;
  }
  error(`The player has an unknown number of pocket item slots: ${slots}`);
  return false;
}

// PickupVariant.PICKUP_TRINKET (350)
function insertTrinket(trinket: EntityPickup) {
  if (!checkTrinketSlotOpen()) {
    return false;
  }

  g.p.AddTrinket(trinket.SubType);
  trinket.Remove();

  // Arbitrarily use the "Touched" property to mark that it is in the process of being deleted
  trinket.Touched = true;

  season8.removeTrinket(trinket.SubType);

  return true;
}

function checkTrinketSlotOpen() {
  // Local variables
  const trinket1 = g.p.GetTrinket(0); // Returns 0 if no trinket
  const trinket2 = g.p.GetTrinket(1); // Returns 0 if no trinket
  const slot1Open = trinket1 === 0;
  const slot2Open = trinket2 === 0;

  const slots = g.p.GetMaxTrinkets();
  if (slots === 1) {
    return slot1Open;
  }
  if (slots === 2) {
    return slot1Open || slot2Open;
  }
  error(`The player has an unknown number of trinket slots: ${slots}`);
  return false;
}
*/
