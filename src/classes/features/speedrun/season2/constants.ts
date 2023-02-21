import { CollectibleType } from "isaac-typescript-definitions";
import { getArrayIndexes, ReadonlySet } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";

export const SEASON_2_NUM_BANS = 3;

/**
 * Roughly corresponds to the ordering from `builds.json` from the `isaac-racing-common` repository,
 * with some explicit exceptions outlined below.
 */
export const SEASON_2_STARTING_BUILDS = [
  // -------------------
  // Treasure Room items
  // -------------------

  // 0
  [CollectibleType.CRICKETS_HEAD], // 4

  // 1
  [CollectibleType.DR_FETUS], // 52

  // (Epic Fetus is too powerful to be included.)

  // 2
  [CollectibleType.IPECAC], // 149

  // 3
  [CollectibleType.MAGIC_MUSHROOM], // 12

  // (Mom's Knife is too powerful to be included.)

  // 4
  [CollectibleType.POLYPHEMUS], // 169

  // 5
  [CollectibleType.PROPTOSIS], // 261

  // 6
  [CollectibleType.TECH_X], // 395

  // ----------------
  // Devil Room items
  // ----------------

  // 7
  [CollectibleType.BRIMSTONE], // 118

  // 8
  [CollectibleType.MAW_OF_THE_VOID], // 399

  // ----------------
  // Angel Room items
  // ----------------

  // 9
  [CollectibleType.CROWN_OF_LIGHT], // 415

  // 10
  [CollectibleType.GODHEAD], // 331

  // 11
  [CollectibleType.SACRED_HEART], // 182

  // (Spirit Sword is too powerful to be included.)

  // 12
  // Revelation is nerfed (no soul hearts & no flight).
  [CollectibleType.REVELATION], // 643

  // -------------
  // Custom builds
  // -------------

  // 13
  [
    CollectibleType.TWENTY_TWENTY, // 245
    CollectibleType.INNER_EYE, // 2
  ],

  // 14
  [
    CollectibleType.C_SECTION, // 678
    CollectibleType.STEVEN, // 50
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
    CollectibleType.DEAD_EYE, // 373
    CollectibleType.JESUS_JUICE, // 197
  ],

  // 18
  [
    CollectibleType.DEATHS_TOUCH, // 237
    CollectibleType.SAD_ONION, // 1
  ],

  // 19
  [
    CollectibleType.FIRE_MIND, // 257
    CollectibleTypeCustom.THIRTEEN_LUCK, // Custom
  ],

  // 20
  [
    CollectibleType.HAEMOLACRIA, // 531
    CollectibleType.SAD_ONION, // 1
  ],

  // 21
  [
    CollectibleType.INCUBUS, // 360
    CollectibleType.TWISTED_PAIR, // 698
    // The smelted Forgotten Lullaby is handled manually.
  ],

  // 22
  [
    CollectibleType.MONSTROS_LUNG, // 229
    CollectibleType.SAD_ONION, // 1
  ],

  // 23
  [
    CollectibleType.TECHNOLOGY, // 68
    CollectibleType.LUMP_OF_COAL, // 132
  ],

  // 24
  [
    CollectibleType.TECH_5, // 244
    CollectibleType.JESUS_JUICE, // 197
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

  // (The builds with more than two items are too wonky to be included.)
] as const;

/**
 * A whitelist of builds that are good on Forgotten. In season 2, Forgotten is one of the weakest
 * characters, so to compensate for this, he is guaranteed a good starting item.
 */
const SEASON_2_FORGOTTEN_BUILDS = new ReadonlySet<CollectibleType>([
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

export const NUM_REVELATION_SOUL_HEARTS = 4;
