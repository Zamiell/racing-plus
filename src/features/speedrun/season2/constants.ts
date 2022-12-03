import { CollectibleType, PlayerType } from "isaac-typescript-definitions";
import { getArrayIndexes } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";

export const SEASON_2_NUM_BANS = 3;

export const SEASON_2_CHARACTERS = [
  PlayerType.CAIN, // 2
  PlayerType.EVE, // 5
  PlayerType.DARK_JUDAS, // 12
  PlayerType.FORGOTTEN, // 16
  PlayerType.ISAAC_B, // 21
  PlayerType.SAMSON_B, // 27
  PlayerType.AZAZEL_B, // 28
] as const;

export const SEASON_2_STARTING_BUILDS = [
  // -------------------
  // Treasure Room items
  // -------------------

  // 0
  [CollectibleType.CRICKETS_HEAD], // 4

  // 1
  [CollectibleType.DR_FETUS], // 52

  // 2
  [CollectibleType.IPECAC], // 149

  // 3
  [CollectibleType.MAGIC_MUSHROOM], // 12

  // 4
  [CollectibleType.POLYPHEMUS], // 169

  // 5
  [CollectibleType.PROPTOSIS], // 261

  // 6
  [CollectibleType.TECH_X], // 395

  // 7
  [CollectibleType.C_SECTION], // 678

  // ----------------
  // Devil Room items
  // ----------------

  // 8
  [CollectibleType.BRIMSTONE], // 118

  // 9
  [CollectibleType.MAW_OF_THE_VOID], // 399

  // ----------------
  // Angel Room items
  // ----------------

  // 10
  [CollectibleType.CROWN_OF_LIGHT], // 415

  // 11
  [CollectibleType.GODHEAD], // 331

  // 12
  [CollectibleType.SACRED_HEART], // 182

  // 13
  // Revelation is nerfed (no soul hearts & no flight).
  [CollectibleType.REVELATION], // 643

  // -------------
  // Custom builds
  // -------------

  // 14
  [
    CollectibleType.TECHNOLOGY, // 68
    CollectibleType.LUMP_OF_COAL, // 132
  ],

  // 15
  [
    CollectibleType.CHOCOLATE_MILK, // 69
    CollectibleType.STEVEN, // 50
  ],

  // 16
  [
    CollectibleType.CRICKETS_BODY, // 224
    CollectibleType.STEVEN, // 50
  ],

  // 17
  [
    CollectibleType.MONSTROS_LUNG, // 229
    CollectibleType.SAD_ONION, // 1
  ],

  // 18
  [
    CollectibleType.DEATHS_TOUCH, // 237
    CollectibleType.SAD_ONION, // 1
  ],

  // 19
  [
    CollectibleType.TECH_5, // 244
    CollectibleType.JESUS_JUICE, // 197
  ],

  // 20
  [
    CollectibleType.TWENTY_TWENTY, // 245
    CollectibleType.INNER_EYE, // 2
  ],

  // 21
  [
    CollectibleType.FIRE_MIND, // 257
    CollectibleTypeCustom.THIRTEEN_LUCK, // Custom
  ],

  // 22
  [
    CollectibleType.INCUBUS, // 360
    CollectibleType.TWISTED_PAIR, // 698
    // The smelted Forgotten Lullaby is handled manually.
  ],

  // 23
  [
    CollectibleType.DEAD_EYE, // 373
    CollectibleType.JESUS_JUICE, // 197
  ],

  // 24
  [
    CollectibleType.HAEMOLACRIA, // 531
    CollectibleType.SAD_ONION, // 1
  ],

  // 25
  [
    CollectibleType.POINTY_RIB, // 544
    CollectibleType.EVES_MASCARA, // 310
  ],

  // 26
  [
    CollectibleTypeCustom.SAWBLADE,
    CollectibleType.FATE, // 179
  ],
] as const;

/**
 * A whitelist of builds that are good on Forgotten. In season 2, Forgotten is one of the weakest
 * characters, so to compensate for this, he is guaranteed a good starting item.
 */
const SEASON_2_FORGOTTEN_BUILDS: ReadonlySet<CollectibleType> = new Set([
  CollectibleType.MAGIC_MUSHROOM, // 12
  CollectibleType.CHOCOLATE_MILK, // 69
  CollectibleType.IPECAC, // 149
  CollectibleType.POLYPHEMUS, // 169
  CollectibleType.SACRED_HEART, // 182
  CollectibleType.PROPTOSIS, // 261
  CollectibleType.HAEMOLACRIA, // 531
  CollectibleType.POINTY_RIB, // 544
  CollectibleType.C_SECTION, // 678
]);

export const SEASON_2_STARTING_BUILD_INDEXES: readonly int[] = getArrayIndexes(
  SEASON_2_STARTING_BUILDS,
);
export const SEASON_2_FORGOTTEN_EXCEPTIONS: readonly int[] =
  SEASON_2_STARTING_BUILD_INDEXES.filter((buildIndex) => {
    const build = SEASON_2_STARTING_BUILDS[buildIndex];
    if (build === undefined) {
      return false;
    }

    const firstCollectible = build[0];
    return !SEASON_2_FORGOTTEN_BUILDS.has(firstCollectible);
  });

/** How long the randomly-selected character & build combination is "locked-in". */
const SEASON_2_LOCK_MINUTES = 1.25;
export const SEASON_2_LOCK_SECONDS = SEASON_2_LOCK_MINUTES * 60;
export const SEASON_2_LOCK_MILLISECONDS = SEASON_2_LOCK_SECONDS * 1000;
