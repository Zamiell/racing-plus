import { MINUTE_IN_MILLISECONDS, range } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../types/CollectibleTypeCustom";

export const SEASON_2_DEBUG = true;

export const SEASON_2_NUM_BANS = 3;

export const SEASON_2_CHARACTERS: readonly PlayerType[] = [
  PlayerType.PLAYER_CAIN, // 2
  PlayerType.PLAYER_EVE, // 5
  PlayerType.PLAYER_BLACKJUDAS, // 12
  PlayerType.PLAYER_THEFORGOTTEN, // 16
  PlayerType.PLAYER_ISAAC_B, // 21
  PlayerType.PLAYER_SAMSON_B, // 27
  PlayerType.PLAYER_AZAZEL_B, // 28
];

export const SEASON_2_STARTING_BUILDS: ReadonlyArray<
  ReadonlyArray<CollectibleType | CollectibleTypeCustom>
> = [
  // -------------------
  // Treasure Room items
  // -------------------

  // 0
  [CollectibleType.COLLECTIBLE_CRICKETS_HEAD], // 4

  // 1
  [CollectibleType.COLLECTIBLE_DR_FETUS], // 52

  // 2
  [CollectibleType.COLLECTIBLE_IPECAC], // 149

  // 3
  [CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM], // 12

  // 4
  [CollectibleType.COLLECTIBLE_POLYPHEMUS], // 169

  // 5
  [CollectibleType.COLLECTIBLE_PROPTOSIS], // 261

  // 6
  [CollectibleType.COLLECTIBLE_TECH_X], // 395

  // 7
  [CollectibleType.COLLECTIBLE_C_SECTION], // 678

  // ----------------
  // Devil Room items
  // ----------------

  // 8
  [CollectibleType.COLLECTIBLE_BRIMSTONE], // 118

  // 9
  [CollectibleType.COLLECTIBLE_MAW_OF_THE_VOID], // 399

  // ----------------
  // Angel Room items
  // ----------------

  // 10
  [CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT], // 415

  // 11
  [CollectibleType.COLLECTIBLE_GODHEAD], // 331

  // 12
  [CollectibleType.COLLECTIBLE_SACRED_HEART], // 182

  // 13
  // Revelation is nerfed (no soul hearts & no flight)
  [CollectibleType.COLLECTIBLE_REVELATION], // 643

  // -------------
  // Custom builds
  // -------------

  // 14
  [
    CollectibleType.COLLECTIBLE_TECHNOLOGY, // 68
    CollectibleType.COLLECTIBLE_LUMP_OF_COAL, // 132
  ],

  // 15
  [
    CollectibleType.COLLECTIBLE_CHOCOLATE_MILK, // 69
    CollectibleType.COLLECTIBLE_STEVEN, // 50
  ],

  // 16
  [
    CollectibleType.COLLECTIBLE_CRICKETS_BODY, // 224
    CollectibleType.COLLECTIBLE_STEVEN, // 50
  ],

  // 17
  [
    CollectibleType.COLLECTIBLE_MONSTROS_LUNG, // 229
    CollectibleType.COLLECTIBLE_SAD_ONION, // 1
  ],

  // 18
  [
    CollectibleType.COLLECTIBLE_DEATHS_TOUCH, // 237
    CollectibleType.COLLECTIBLE_SAD_ONION, // 1
  ],

  // 19
  [
    CollectibleType.COLLECTIBLE_TECH_5, // 244
    CollectibleType.COLLECTIBLE_JESUS_JUICE, // 197
  ],

  // 20
  [
    CollectibleType.COLLECTIBLE_20_20, // 245
    CollectibleType.COLLECTIBLE_INNER_EYE, // 2
  ],

  // 21
  [
    CollectibleType.COLLECTIBLE_FIRE_MIND, // 257
    CollectibleTypeCustom.COLLECTIBLE_13_LUCK, // Custom
  ],

  // 22
  [
    CollectibleType.COLLECTIBLE_INCUBUS, // 360
    CollectibleType.COLLECTIBLE_TWISTED_PAIR, // 698
    // The smelted Forgotten Lullaby is handled manually
  ],

  // 23
  [
    CollectibleType.COLLECTIBLE_DEAD_EYE, // 373
    CollectibleType.COLLECTIBLE_JESUS_JUICE, // 197
  ],

  // 24
  [
    CollectibleType.COLLECTIBLE_HAEMOLACRIA, // 531
    CollectibleType.COLLECTIBLE_SAD_ONION, // 1
  ],

  // 25
  [
    CollectibleType.COLLECTIBLE_POINTY_RIB, // 544
    CollectibleType.COLLECTIBLE_EVES_MASCARA, // 310
  ],

  // 26
  [
    CollectibleTypeCustom.COLLECTIBLE_SAWBLADE,
    CollectibleType.COLLECTIBLE_TRANSCENDENCE,
  ],
];

/**
 * A whitelist of builds that are good on Forgotten. In season 2, Forgotten is one of the weakest
 * characters, so to compensate for this, he is guaranteed a good starting item.
 */
const SEASON_2_FORGOTTEN_BUILDS: ReadonlySet<
  CollectibleType | CollectibleTypeCustom
> = new Set([
  CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM, // 12
  CollectibleType.COLLECTIBLE_CHOCOLATE_MILK, // 69
  CollectibleType.COLLECTIBLE_IPECAC, // 149
  CollectibleType.COLLECTIBLE_POLYPHEMUS, // 169
  CollectibleType.COLLECTIBLE_SACRED_HEART, // 182
  CollectibleType.COLLECTIBLE_PROPTOSIS, // 261
  CollectibleType.COLLECTIBLE_HAEMOLACRIA, // 531
  CollectibleType.COLLECTIBLE_POINTY_RIB, // 544
  CollectibleType.COLLECTIBLE_C_SECTION, // 678
]);

export const SEASON_2_STARTING_BUILD_INDEXES: readonly int[] = range(
  0,
  SEASON_2_STARTING_BUILDS.length - 1,
);
export const SEASON_2_FORGOTTEN_EXCEPTIONS: readonly int[] =
  SEASON_2_STARTING_BUILD_INDEXES.filter((buildIndex, i) => {
    const build = SEASON_2_STARTING_BUILDS[i];
    const [firstCollectible] = build;
    return !SEASON_2_FORGOTTEN_BUILDS.has(firstCollectible);
  });

/** How long the randomly-selected character & build combination is "locked-in". */
const SEASON_2_LOCK_MINUTES = 1.5;
export const SEASON_2_LOCK_MILLISECONDS =
  SEASON_2_LOCK_MINUTES * MINUTE_IN_MILLISECONDS;
