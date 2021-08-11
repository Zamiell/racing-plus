const DETRIMENTAL_TRINKETS = [
  TrinketType.TRINKET_PURPLE_HEART, // 5
  TrinketType.TRINKET_MOMS_TOENAIL, // 16
  TrinketType.TRINKET_TICK, // 53
  TrinketType.TRINKET_FADED_POLAROID, // 69
  TrinketType.TRINKET_OUROBOROS_WORM, // 96
  TrinketType.TRINKET_M, // 138
];

export default function insertPickup(
  pickup: EntityPickup,
  player: EntityPlayer,
): boolean {
  switch (pickup.Variant) {
    // 20
    case PickupVariant.PICKUP_COIN: {
      return insertCoin(pickup, player);
    }

    // 30
    case PickupVariant.PICKUP_KEY: {
      return insertKey(pickup, player);
    }

    // 40
    case PickupVariant.PICKUP_BOMB: {
      return insertBomb(pickup, player);
    }

    // 70
    case PickupVariant.PICKUP_PILL: {
      return insertPill(pickup, player);
    }

    // 300
    case PickupVariant.PICKUP_TAROTCARD: {
      return insertCard(pickup, player);
    }

    // 350
    case PickupVariant.PICKUP_TRINKET: {
      return insertTrinket(pickup, player);
    }

    default: {
      error(
        `The automatic item insertion feature encountered an unknown pickup of variant: ${pickup.Variant}`,
      );
      return false;
    }
  }
}

// PickupVariant.PICKUP_COIN (20)
function insertCoin(coin: EntityPickup, player: EntityPlayer) {
  switch (coin.SubType) {
    // 1
    case CoinSubType.COIN_PENNY: {
      player.AddCoins(1);
      return true;
    }

    // 2
    case CoinSubType.COIN_NICKEL: {
      player.AddCoins(5);
      return true;
    }

    // 3
    case CoinSubType.COIN_DIME: {
      player.AddCoins(10);
      return true;
    }

    // 4
    case CoinSubType.COIN_DOUBLEPACK: {
      player.AddCoins(2);
      return true;
    }

    // 5
    case CoinSubType.COIN_LUCKYPENNY: {
      player.AddCoins(1);
      player.DonateLuck(1);
      return true;
    }

    // 6
    case CoinSubType.COIN_STICKYNICKEL: {
      // Don't put Sticky Nickels in our inventory automatically
      return false;
    }

    case CoinSubType.COIN_GOLDEN: {
      // Don't put Golden Coins in our inventory automatically
      return false;
    }

    default: {
      error(
        `The automatic item insertion feature encountered an unknown coin subtype of: ${coin.SubType}`,
      );
      return false;
    }
  }
}

// PickupVariant.PICKUP_KEY (30)
function insertKey(key: EntityPickup, player: EntityPlayer) {
  switch (key.SubType) {
    // 1
    case KeySubType.KEY_NORMAL: {
      player.AddKeys(1);
      return true;
    }

    // 2
    case KeySubType.KEY_GOLDEN: {
      player.AddGoldenKey();
      return true;
    }

    // 3
    case KeySubType.KEY_DOUBLEPACK: {
      player.AddKeys(2);
      return true;
    }

    // 4
    case KeySubType.KEY_CHARGED: {
      player.AddKeys(1);
      player.FullCharge();
      return true;
    }

    default: {
      error(
        `The automatic item insertion feature encountered an unknown key subtype of: ${key.SubType}`,
      );
      return false;
    }
  }
}

// PickupVariant.PICKUP_BOMB (40)
function insertBomb(bomb: EntityPickup, player: EntityPlayer) {
  switch (bomb.SubType) {
    // 1
    case BombSubType.BOMB_NORMAL: {
      player.AddBombs(1);
      return true;
    }

    // 2
    case BombSubType.BOMB_DOUBLEPACK: {
      player.AddBombs(2);
      return true;
    }

    // 3
    case BombSubType.BOMB_TROLL: {
      // Don't put Troll Bombs in our inventory automatically
      return false;
    }

    // 4
    case BombSubType.BOMB_GOLDEN: {
      player.AddGoldenBomb();
      return true;
    }

    // 5
    case BombSubType.BOMB_SUPERTROLL: {
      // Don't put Mega Troll Bombs in our inventory automatically
      return false;
    }

    // 6
    case BombSubType.BOMB_GOLDENTROLL: {
      // Don't put Golden Troll Bombs in our inventory automatically
      return false;
    }

    // 7
    case BombSubType.BOMB_GIGA: {
      // Don't put Giga Bombs in our inventory automatically
      return false;
    }

    default: {
      error(
        `The automatic item insertion feature encountered an unknown key subtype of: ${bomb.SubType}`,
      );
      return false;
    }
  }
}

// PickupVariant.PICKUP_PILL (70)
function insertPill(pill: EntityPickup, player: EntityPlayer) {
  if (!checkPocketSlotOpen(player)) {
    return false;
  }

  player.AddPill(pill.SubType);
  return true;
}

// PickupVariant.PICKUP_TAROTCARD (300)
function insertCard(card: EntityPickup, player: EntityPlayer) {
  if (!checkPocketSlotOpen(player)) {
    return false;
  }

  player.AddCard(card.SubType);
  return true;
}

// PickupVariant.PICKUP_TRINKET (350)
function insertTrinket(trinket: EntityPickup, player: EntityPlayer) {
  if (!checkTrinketSlotOpen(player)) {
    return false;
  }

  // Do not automatically insert trinkets that are detrimental (or potentially detrimental)
  if (DETRIMENTAL_TRINKETS.includes(trinket.SubType)) {
    return false;
  }

  player.AddTrinket(trinket.SubType);
  return true;
}

function checkPocketSlotOpen(player: EntityPlayer) {
  const card1 = player.GetCard(0); // Returns 0 if no card
  const card2 = player.GetCard(1); // Returns 0 if no card
  const pill1 = player.GetPill(0); // Returns 0 if no pill
  const pill2 = player.GetPill(1); // Returns 0 if no pill
  const slot1Open = card1 === 0 && pill1 === 0;
  const slot2Open = card2 === 0 && pill2 === 0;

  const slots = player.GetMaxPocketItems();
  if (slots === 1) {
    return slot1Open;
  }
  if (slots === 2) {
    return slot1Open || slot2Open;
  }
  error(`The player has an unknown number of pocket item slots: ${slots}`);
  return false;
}

function checkTrinketSlotOpen(player: EntityPlayer) {
  const trinket1 = player.GetTrinket(0); // Returns 0 if no trinket
  const trinket2 = player.GetTrinket(1); // Returns 0 if no trinket
  const slot1Open = trinket1 === 0;
  const slot2Open = trinket2 === 0;

  const slots = player.GetMaxTrinkets();
  if (slots === 1) {
    return slot1Open;
  }
  if (slots === 2) {
    return slot1Open || slot2Open;
  }
  error(`The player has an unknown number of trinket slots: ${slots}`);
  return false;
}
