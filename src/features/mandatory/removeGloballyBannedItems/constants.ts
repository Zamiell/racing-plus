import { CollectibleType, TrinketType } from "isaac-typescript-definitions";

export const BANNED_COLLECTIBLES: ReadonlySet<CollectibleType> = new Set([
  CollectibleType.MERCURIUS,
  CollectibleType.TMTRAINER,
]);

export const BANNED_COLLECTIBLES_WITH_VOID: ReadonlySet<CollectibleType> =
  new Set([
    CollectibleType.MEGA_BLAST, // 441
    CollectibleType.MEGA_MUSH, // 625
  ]);

export const BANNED_TRINKETS: ReadonlySet<TrinketType> = new Set([
  // Since all Donation Machines are removed, it has no purpose.
  TrinketType.KARMA,
]);

export const BANNED_COLLECTIBLES_ON_SEEDED_RACES: ReadonlySet<CollectibleType> =
  new Set([
    // Since drops are seeded and given in order, Glyph of Balance does not work properly.
    CollectibleType.GLYPH_OF_BALANCE, // 464

    // Since Devil Rooms and Angel Rooms are pre-determined, Duality does not work properly.
    CollectibleType.DUALITY, // 498

    // Damocles is unseeded
    CollectibleType.DAMOCLES, // 577
    CollectibleType.DAMOCLES_PASSIVE, // 656

    // Sol is mostly useless if you start with the Compass.
    CollectibleType.SOL, // 588

    // R Key allows players to play a different seed.
    CollectibleType.R_KEY, // 636
  ]);

export const BANNED_TRINKETS_ON_SEEDED_RACES: ReadonlySet<TrinketType> =
  new Set([
    // Cain's Eye is useless if you start with the Compass.
    TrinketType.CAINS_EYE, // 59

    // Remove certain trinkets that mess up floor generation.
    TrinketType.SILVER_DOLLAR, // 110
    TrinketType.BLOODY_CROWN, // 111
    TrinketType.TELESCOPE_LENS, // 152
    TrinketType.HOLY_CROWN, // 155
    TrinketType.WICKED_CROWN, // 161

    // Dice Bag is seeded per room entrance instead of per room.
    TrinketType.DICE_BAG, // 154
  ]);
