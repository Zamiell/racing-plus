import { CollectibleType } from "isaac-typescript-definitions";
import {
  ReadonlySet,
  assertDefined,
  getArrayIndexes,
  itemConfig,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";

/**
 * Roughly corresponds to the ordering from `builds.json` from the `isaac-racing-common` repository,
 * with some explicit exceptions outlined below.
 */
export const RANDOM_STARTING_BUILDS = [
  // -------------------
  // Treasure Room items
  // -------------------

  // 0
  [CollectibleType.CRICKETS_HEAD], // 4

  // (Dr. Fetus is too weak to be included.)

  // (Epic Fetus is too powerful to be included.)

  // 1
  [CollectibleType.IPECAC], // 149

  // 2
  [CollectibleType.MAGIC_MUSHROOM], // 12

  // (Mom's Knife is too powerful to be included.)

  // 3
  [CollectibleType.POLYPHEMUS], // 169

  // 4
  [CollectibleType.PROPTOSIS], // 261

  // 5
  [CollectibleType.TECH_X], // 395

  // ----------------
  // Devil Room items
  // ----------------

  // 6
  [CollectibleType.BRIMSTONE], // 118

  // 7
  [CollectibleType.MAW_OF_THE_VOID], // 399

  // ----------------
  // Angel Room items
  // ----------------

  // 8
  [CollectibleType.CROWN_OF_LIGHT], // 415

  // 9
  [CollectibleType.GODHEAD], // 331

  // 10
  [CollectibleType.SACRED_HEART], // 182

  // (Spirit Sword is too powerful to be included.)

  // 11
  // Revelation is nerfed (no soul hearts & no flight).
  [CollectibleType.REVELATION], // 643

  // -------------
  // Custom builds
  // -------------

  // 12
  [
    CollectibleType.TWENTY_TWENTY, // 245
    CollectibleType.INNER_EYE, // 2
  ],

  // 13
  [
    CollectibleType.C_SECTION, // 678
    CollectibleType.STEVEN, // 50
  ],

  // 14
  [
    CollectibleType.CHOCOLATE_MILK, // 69
    CollectibleType.STEVEN, // 50
  ],

  // 15
  [
    CollectibleType.CRICKETS_BODY, // 224
    CollectibleType.STEVEN, // 50
  ],

  // 16
  [
    CollectibleType.DEAD_EYE, // 373
    CollectibleType.JESUS_JUICE, // 197
  ],

  // 17
  [
    CollectibleType.DEATHS_TOUCH, // 237
    CollectibleType.SAD_ONION, // 1
  ],

  // 18
  [
    CollectibleType.FIRE_MIND, // 257
    CollectibleTypeCustom.THIRTEEN_LUCK,
  ],

  // 19
  [
    CollectibleType.HAEMOLACRIA, // 531
    CollectibleType.SAD_ONION, // 1
  ],

  // 20
  [
    CollectibleType.INCUBUS, // 360
    CollectibleType.TWISTED_PAIR, // 698
    // The smelted Forgotten Lullaby is handled manually.
  ],

  // 21
  [
    CollectibleType.MONSTROS_LUNG, // 229
    CollectibleType.SAD_ONION, // 1
  ],

  // 22
  [
    CollectibleType.TECHNOLOGY, // 68
    CollectibleType.LUMP_OF_COAL, // 132
  ],

  // 23
  [
    CollectibleType.TECH_5, // 244
    CollectibleType.JESUS_JUICE, // 197
  ],

  // 24
  [
    CollectibleType.POINTY_RIB, // 544
    CollectibleType.EVES_MASCARA, // 310
  ],

  // (Sawblade is not included since it was deemed to be too weak.)

  // (The builds with more than two items are too wonky to be included.)
] as const;

export const RANDOM_STARTING_BUILD_INDEXES: readonly int[] = getArrayIndexes(
  RANDOM_STARTING_BUILDS,
);

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

/** The blacklist of build indexes computed from Forgotten whitelist. */
export const RANDOM_STARTING_BUILD_FORGOTTEN_EXCEPTIONS: readonly int[] =
  RANDOM_STARTING_BUILD_INDEXES.filter((buildIndex) => {
    const build = RANDOM_STARTING_BUILDS[buildIndex];
    if (build === undefined) {
      return false;
    }

    const firstCollectible = build[0];
    return !SEASON_2_FORGOTTEN_BUILDS.has(firstCollectible);
  });

export const NUM_REVELATION_SOUL_HEARTS = (() => {
  const itemConfigItem = itemConfig.GetCollectible(CollectibleType.REVELATION);
  assertDefined(
    itemConfigItem,
    `Failed to get the item config for: CollectibleType.REVELATION (${CollectibleType.REVELATION})`,
  );

  return itemConfigItem.AddSoulHearts;
})();
