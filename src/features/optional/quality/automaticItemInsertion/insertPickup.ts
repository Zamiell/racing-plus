import {
  BombSubType,
  CoinSubType,
  HeartSubType,
  KeySubType,
  PickupVariant,
  PlayerType,
  PoopPickupSubType,
} from "isaac-typescript-definitions";
import {
  ensureAllCases,
  getCoinValue,
  hasOpenPocketItemSlot,
  hasOpenTrinketSlot,
} from "isaacscript-common";
import { DETRIMENTAL_TRINKETS } from "./constants";

export function insertPickup(
  pickup: EntityPickup,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  switch (pickup.Variant) {
    // 10
    case PickupVariant.HEART: {
      return insertBloodOrSoulCharge(pickup as EntityPickupHeart, player);
    }

    // 20
    case PickupVariant.COIN: {
      return insertCoin(pickup as EntityPickupCoin, player);
    }

    // 30
    case PickupVariant.KEY: {
      return insertKey(pickup as EntityPickupKey, player);
    }

    // 40
    case PickupVariant.BOMB: {
      return insertBomb(pickup as EntityPickupBomb, player);
    }

    // 42
    case PickupVariant.POOP: {
      return insertPoop(pickup as EntityPickupPoop, player);
    }

    // 70
    case PickupVariant.PILL: {
      return insertPill(pickup as EntityPickupPill, player);
    }

    // 300
    case PickupVariant.TAROT_CARD: {
      return insertCard(pickup as EntityPickupCard, player);
    }

    // 350
    case PickupVariant.TRINKET: {
      return insertTrinket(pickup as EntityPickupTrinket, player);
    }

    default: {
      // Ignore other pickups.
      return undefined;
    }
  }
}

// PickupVariant.HEART (10)
function insertBloodOrSoulCharge(
  heart: EntityPickupHeart,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  const character = player.GetPlayerType();

  switch (heart.SubType) {
    // 0
    case HeartSubType.NULL: {
      return undefined;
    }

    // 1
    case HeartSubType.FULL: {
      if (character !== PlayerType.BETHANY_B) {
        return undefined;
      }

      const value = 2;
      player.AddBloodCharge(value);
      return [PickupVariant.HEART, value];
    }

    // 2
    case HeartSubType.HALF: {
      if (character !== PlayerType.BETHANY_B) {
        return undefined;
      }

      const value = 1;
      player.AddBloodCharge(value);
      return [PickupVariant.HEART, value];
    }

    // 3, 6
    case HeartSubType.SOUL:
    case HeartSubType.BLACK: {
      if (character !== PlayerType.BETHANY) {
        return undefined;
      }

      const value = 2;
      player.AddSoulCharge(value);
      return [PickupVariant.HEART, value];
    }

    // 5
    case HeartSubType.DOUBLE_PACK: {
      if (character !== PlayerType.BETHANY_B) {
        return undefined;
      }

      const value = 4;
      player.AddBloodCharge(value);
      return [PickupVariant.HEART, value];
    }

    // 8
    case HeartSubType.HALF_SOUL: {
      if (character !== PlayerType.BETHANY) {
        return undefined;
      }

      const value = 1;
      player.AddSoulCharge(value);
      return [PickupVariant.HEART, value];
    }

    case HeartSubType.ETERNAL:
    case HeartSubType.GOLDEN:
    case HeartSubType.SCARED:
    case HeartSubType.BLENDED:
    case HeartSubType.BONE:
    case HeartSubType.ROTTEN: {
      return undefined;
    }

    default: {
      ensureAllCases(heart.SubType);

      // Ignore modded heart sub-types.
      // @ts-expect-error Modded pickups fall outside of the type system.
      return undefined;
    }
  }
}

// PickupVariant.COIN (20)
function insertCoin(
  coin: EntityPickupCoin,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  const coinValue = getCoinValue(coin.SubType);

  switch (coin.SubType) {
    // 0
    case CoinSubType.NULL: {
      return undefined;
    }

    // 1, 2, 3
    case CoinSubType.PENNY:
    case CoinSubType.NICKEL:
    case CoinSubType.DIME:
    case CoinSubType.DOUBLE_PACK: {
      player.AddCoins(coinValue);
      return [PickupVariant.COIN, coinValue];
    }

    // 5
    case CoinSubType.LUCKY_PENNY: {
      player.AddCoins(coinValue);
      player.DonateLuck(1);
      return [PickupVariant.COIN, coinValue];
    }

    // 6
    case CoinSubType.STICKY_NICKEL: {
      // Don't put Sticky Nickels in our inventory automatically.
      return undefined;
    }

    // 7
    case CoinSubType.GOLDEN: {
      // Don't put Golden Coins in our inventory automatically.
      return undefined;
    }

    default: {
      ensureAllCases(coin.SubType);

      // Ignore modded coin sub-types.
      // @ts-expect-error Modded pickups fall outside of the type system.
      return undefined;
    }
  }
}

// PickupVariant.KEY (30)
function insertKey(
  key: EntityPickupKey,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  switch (key.SubType) {
    // 0
    case KeySubType.NULL: {
      return undefined;
    }

    // 1
    case KeySubType.NORMAL: {
      const value = 1;
      player.AddKeys(value);
      return [PickupVariant.KEY, value];
    }

    // 2
    case KeySubType.GOLDEN: {
      const value = 0;
      player.AddGoldenKey();
      return [PickupVariant.KEY, value];
    }

    // 3
    case KeySubType.DOUBLE_PACK: {
      const value = 2;
      player.AddKeys(value);
      return [PickupVariant.KEY, value];
    }

    // 4
    case KeySubType.CHARGED: {
      const value = 1;
      player.AddKeys(value);
      player.FullCharge();
      return [PickupVariant.KEY, value];
    }

    default: {
      ensureAllCases(key.SubType);

      // Ignore modded key sub-types.
      // @ts-expect-error Modded pickups fall outside of the type system.
      return undefined;
    }
  }
}

// PickupVariant.BOMB (40)
function insertBomb(
  bomb: EntityPickupBomb,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  switch (bomb.SubType) {
    // 0
    case BombSubType.NULL: {
      return undefined;
    }

    // 1
    case BombSubType.NORMAL: {
      const value = 1;
      player.AddBombs(value);
      return [PickupVariant.BOMB, value];
    }

    // 2
    case BombSubType.DOUBLE_PACK: {
      const value = 2;
      player.AddBombs(value);
      return [PickupVariant.BOMB, value];
    }

    // 3
    case BombSubType.TROLL: {
      // Don't put Troll Bombs in our inventory automatically.
      return undefined;
    }

    // 4
    case BombSubType.GOLDEN: {
      const value = 0;
      player.AddGoldenBomb();
      return [PickupVariant.BOMB, value];
    }

    // 5
    case BombSubType.MEGA_TROLL: {
      // Don't put Mega Troll Bombs in our inventory automatically.
      return undefined;
    }

    // 6
    case BombSubType.GOLDEN_TROLL: {
      // Don't put Golden Troll Bombs in our inventory automatically.
      return undefined;
    }

    // 7
    case BombSubType.GIGA: {
      // Don't put Giga Bombs in our inventory automatically.
      return undefined;
    }

    default: {
      ensureAllCases(bomb.SubType);

      // Ignore modded bomb sub-types.
      // @ts-expect-error Modded pickups fall outside of the type system.
      return undefined;
    }
  }
}

// PickupVariant.POOP (42)
function insertPoop(
  poop: EntityPickupPoop,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  switch (poop.SubType) {
    // 0
    case PoopPickupSubType.SMALL: {
      const value = 1;
      player.AddPoopMana(value);
      return [PickupVariant.BOMB, value];
    }

    // 1
    case PoopPickupSubType.BIG: {
      const value = 3;
      player.AddPoopMana(value);
      return [PickupVariant.BOMB, value];
    }

    default: {
      ensureAllCases(poop.SubType);

      // Ignore modded poop sub-types.
      // @ts-expect-error Modded pickups fall outside of the type system.
      return undefined;
    }
  }
}

// PickupVariant.PILL (70)
function insertPill(
  pill: EntityPickupPill,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  if (!hasOpenPocketItemSlot(player)) {
    return undefined;
  }

  player.AddPill(pill.SubType);
  return [PickupVariant.PILL, 1];
}

// PickupVariant.TAROT_CARD (300)
function insertCard(
  card: EntityPickupCard,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  if (!hasOpenPocketItemSlot(player)) {
    return undefined;
  }

  player.AddCard(card.SubType);
  return [PickupVariant.TAROT_CARD, 1];
}

// PickupVariant.TRINKET (350)
function insertTrinket(
  trinket: EntityPickupTrinket,
  player: EntityPlayer,
): [PickupVariant, int] | undefined {
  if (!hasOpenTrinketSlot(player)) {
    return undefined;
  }

  // Do not automatically insert trinkets that are detrimental (or potentially detrimental).
  if (DETRIMENTAL_TRINKETS.has(trinket.SubType)) {
    return undefined;
  }

  player.AddTrinket(trinket.SubType);
  return [PickupVariant.TRINKET, 1];
}
