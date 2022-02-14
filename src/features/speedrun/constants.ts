import { CollectibleTypeCustom } from "../../types/CollectibleTypeCustom";
import { ChallengeCustom } from "./enums";

// Values are the season abbreviations and the number of elements in the "character order" table
export const CHALLENGE_DEFINITIONS = new Map<ChallengeCustom, [string, int]>([
  [ChallengeCustom.SEASON_1, ["R7S1", 7]],
]);

export const BIG_4_ITEMS = [
  CollectibleType.COLLECTIBLE_MOMS_KNIFE, // 114
  CollectibleType.COLLECTIBLE_TECH_X, // 395
  CollectibleType.COLLECTIBLE_EPIC_FETUS, // 168
  CollectibleType.COLLECTIBLE_IPECAC, // 149
];

/** Roughly matches the builds for online races in "builds.json". */
export const SEASON_6_STARTING_BUILDS = [
  // Treasure Room items
  [CollectibleType.COLLECTIBLE_CRICKETS_HEAD], // 4
  [CollectibleType.COLLECTIBLE_CRICKETS_BODY], // 224
  [CollectibleType.COLLECTIBLE_DEAD_EYE], // 373
  [CollectibleType.COLLECTIBLE_DEATHS_TOUCH], // 237
  [CollectibleType.COLLECTIBLE_DR_FETUS], // 52
  [CollectibleType.COLLECTIBLE_IPECAC], // 149
  [CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM], // 12
  // [CollectibleType.COLLECTIBLE_MOMS_KNIFE], // 114
  // (Mom's Knife is banned due to being too powerful)
  [CollectibleType.COLLECTIBLE_POLYPHEMUS], // 169
  [CollectibleType.COLLECTIBLE_PROPTOSIS], // 261
  [CollectibleType.COLLECTIBLE_TECH_5], // 244
  [CollectibleType.COLLECTIBLE_TECH_X], // 395
  [CollectibleType.COLLECTIBLE_C_SECTION], // 678

  // Devil Room items
  [CollectibleType.COLLECTIBLE_BRIMSTONE], // 118
  [CollectibleType.COLLECTIBLE_MAW_OF_THE_VOID], // 399

  // Angel Room items
  [CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT], // 415
  [CollectibleType.COLLECTIBLE_SACRED_HEART], // 182
  // [CollectibleType.COLLECTIBLE_SPIRIT_SWORD], // 579
  // (Spirit Sword is banned due to being too powerful)
  [CollectibleType.COLLECTIBLE_REVELATION], // 643

  // Secret Room items
  [CollectibleType.COLLECTIBLE_EPIC_FETUS], // 168

  // Custom items
  // [CollectibleTypeCustom.COLLECTIBLE_SAWBLADE],
  // (Sawblade is banned due to not being powerful enough)

  // Custom builds
  [
    CollectibleType.COLLECTIBLE_20_20, // 245
    CollectibleType.COLLECTIBLE_INNER_EYE, // 2
  ],
  [
    CollectibleType.COLLECTIBLE_CHOCOLATE_MILK, // 69
    CollectibleType.COLLECTIBLE_STEVEN, // 50
  ],
  [
    CollectibleType.COLLECTIBLE_GODHEAD, // 331
    CollectibleType.COLLECTIBLE_CUPIDS_ARROW, // 48
  ],
  [
    CollectibleType.COLLECTIBLE_HAEMOLACRIA, // 531
    CollectibleType.COLLECTIBLE_SAD_ONION, // 1
  ],
  [
    CollectibleType.COLLECTIBLE_INCUBUS, // 360
    CollectibleType.COLLECTIBLE_INCUBUS, // 360
  ],
  [
    CollectibleType.COLLECTIBLE_MONSTROS_LUNG, // 229
    CollectibleType.COLLECTIBLE_SAD_ONION, // 1
  ],
  [
    CollectibleType.COLLECTIBLE_TECHNOLOGY, // 68
    CollectibleType.COLLECTIBLE_LUMP_OF_COAL, // 132
  ],
  [
    CollectibleType.COLLECTIBLE_TWISTED_PAIR, // 698
    CollectibleType.COLLECTIBLE_TWISTED_PAIR, // 698
  ],
  [
    CollectibleType.COLLECTIBLE_POINTY_RIB, // 544
    CollectibleType.COLLECTIBLE_EVES_MASCARA, // 310
  ],
  [
    CollectibleType.COLLECTIBLE_FIRE_MIND, // 257
    CollectibleType.COLLECTIBLE_MYSTERIOUS_LIQUID, // 317
    CollectibleTypeCustom.COLLECTIBLE_13_LUCK, // Custom
  ],
  [
    CollectibleType.COLLECTIBLE_EYE_OF_THE_OCCULT, // 572
    CollectibleType.COLLECTIBLE_LOKIS_HORNS, // 87
    CollectibleTypeCustom.COLLECTIBLE_15_LUCK,
  ],
  /*
  [
    CollectibleType.COLLECTIBLE_DISTANT_ADMIRATION, // 57
    CollectibleType.COLLECTIBLE_FRIEND_ZONE, // 364
    CollectibleType.COLLECTIBLE_FOREVER_ALONE, // 128
    CollectibleType.COLLECTIBLE_BFFS, // 247
  ],
  */
  // (the fly build is banned due to not being fun)
];

const MINUTE_IN_MILLISECONDS = 1000;

/** How long the randomly-selected item start is "locked-in". */
export const SEASON_6_ITEM_LOCK_MILLISECONDS = 60 * MINUTE_IN_MILLISECONDS;

/** How often the special "Veto" button can be used. */
export const SEASON_6_VETO_BUTTON_LENGTH = 5 * 60 * MINUTE_IN_MILLISECONDS;
