import { hasOpenPocketItemSlot, hasOpenTrinketSlot } from "isaacscript-common";
import { DETRIMENTAL_TRINKETS } from "./constants";

export function insertPickup(
  pickup: EntityPickup,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
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
      return undefined;
    }
  }
}

// PickupVariant.PICKUP_COIN (20)
function insertCoin(
  coin: EntityPickup,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  switch (coin.SubType) {
    // 1
    case CoinSubType.COIN_PENNY: {
      const value = 1;
      player.AddCoins(value);
      return [PickupVariant.PICKUP_COIN, value];
    }

    // 2
    case CoinSubType.COIN_NICKEL: {
      const value = 5;
      player.AddCoins(value);
      return [PickupVariant.PICKUP_COIN, value];
    }

    // 3
    case CoinSubType.COIN_DIME: {
      const value = 10;
      player.AddCoins(value);
      return [PickupVariant.PICKUP_COIN, value];
    }

    // 4
    case CoinSubType.COIN_DOUBLEPACK: {
      const value = 2;
      player.AddCoins(value);
      return [PickupVariant.PICKUP_COIN, value];
    }

    // 5
    case CoinSubType.COIN_LUCKYPENNY: {
      const value = 1;
      player.AddCoins(value);
      player.DonateLuck(1);
      return [PickupVariant.PICKUP_COIN, value];
    }

    // 6
    case CoinSubType.COIN_STICKYNICKEL: {
      // Don't put Sticky Nickels in our inventory automatically
      return undefined;
    }

    case CoinSubType.COIN_GOLDEN: {
      // Don't put Golden Coins in our inventory automatically
      return undefined;
    }

    default: {
      error(
        `The automatic item insertion feature encountered an unknown coin subtype of: ${coin.SubType}`,
      );
      return undefined;
    }
  }
}

// PickupVariant.PICKUP_KEY (30)
function insertKey(
  key: EntityPickup,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  switch (key.SubType) {
    // 1
    case KeySubType.KEY_NORMAL: {
      const value = 1;
      player.AddKeys(value);
      return [PickupVariant.PICKUP_KEY, value];
    }

    // 2
    case KeySubType.KEY_GOLDEN: {
      const value = 0;
      player.AddGoldenKey();
      return [PickupVariant.PICKUP_KEY, value];
    }

    // 3
    case KeySubType.KEY_DOUBLEPACK: {
      const value = 2;
      player.AddKeys(value);
      return [PickupVariant.PICKUP_KEY, value];
    }

    // 4
    case KeySubType.KEY_CHARGED: {
      const value = 1;
      player.AddKeys(value);
      player.FullCharge();
      return [PickupVariant.PICKUP_KEY, value];
    }

    default: {
      error(
        `The automatic item insertion feature encountered an unknown key subtype of: ${key.SubType}`,
      );
      return undefined;
    }
  }
}

// PickupVariant.PICKUP_BOMB (40)
function insertBomb(
  bomb: EntityPickup,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  switch (bomb.SubType) {
    // 1
    case BombSubType.BOMB_NORMAL: {
      const value = 1;
      player.AddBombs(value);
      return [PickupVariant.PICKUP_BOMB, value];
    }

    // 2
    case BombSubType.BOMB_DOUBLEPACK: {
      const value = 2;
      player.AddBombs(value);
      return [PickupVariant.PICKUP_BOMB, value];
    }

    // 3
    case BombSubType.BOMB_TROLL: {
      // Don't put Troll Bombs in our inventory automatically
      return undefined;
    }

    // 4
    case BombSubType.BOMB_GOLDEN: {
      const value = 0;
      player.AddGoldenBomb();
      return [PickupVariant.PICKUP_BOMB, value];
    }

    // 5
    case BombSubType.BOMB_SUPERTROLL: {
      // Don't put Mega Troll Bombs in our inventory automatically
      return undefined;
    }

    // 6
    case BombSubType.BOMB_GOLDENTROLL: {
      // Don't put Golden Troll Bombs in our inventory automatically
      return undefined;
    }

    // 7
    case BombSubType.BOMB_GIGA: {
      // Don't put Giga Bombs in our inventory automatically
      return undefined;
    }

    default: {
      error(
        `The automatic item insertion feature encountered an unknown key subtype of: ${bomb.SubType}`,
      );
      return undefined;
    }
  }
}

// PickupVariant.PICKUP_PILL (70)
function insertPill(
  pill: EntityPickup,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  if (!hasOpenPocketItemSlot(player)) {
    return undefined;
  }

  player.AddPill(pill.SubType);
  return [PickupVariant.PICKUP_PILL, 1];
}

// PickupVariant.PICKUP_TAROTCARD (300)
function insertCard(
  card: EntityPickup,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  if (!hasOpenPocketItemSlot(player)) {
    return undefined;
  }

  player.AddCard(card.SubType);
  return [PickupVariant.PICKUP_TAROTCARD, 1];
}

// PickupVariant.PICKUP_TRINKET (350)
function insertTrinket(
  trinket: EntityPickup,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  if (!hasOpenTrinketSlot(player)) {
    return undefined;
  }

  // Do not automatically insert trinkets that are detrimental (or potentially detrimental)
  if (DETRIMENTAL_TRINKETS.has(trinket.SubType)) {
    return undefined;
  }

  player.AddTrinket(trinket.SubType);
  return [PickupVariant.PICKUP_TRINKET, 1];
}
