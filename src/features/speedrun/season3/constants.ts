import { CollectibleType, PlayerType } from "isaac-typescript-definitions";
import {
  arrayRemoveInPlace,
  copyArray,
  getVanillaCollectibleArray,
  getVanillaTrinketArray,
  isActiveCollectible,
} from "isaacscript-common";
import g from "../../../globals";
import {
  BANNED_COLLECTIBLES,
  BANNED_TRINKETS,
} from "../../mandatory/removeGloballyBannedItems/constants";
import {
  BANNED_DIVERSITY_COLLECTIBLES,
  BANNED_DIVERSITY_TRINKETS,
} from "../../race/formatSetup";

export const SEASON_3_CHARACTERS: readonly PlayerType[] = [
  PlayerType.JUDAS, // 3
  PlayerType.BLUE_BABY, // 4
  PlayerType.LAZARUS, // 8
  PlayerType.MAGDALENE_B, // 22
  PlayerType.JUDAS_B, // 24
  PlayerType.EVE_B, // 26
  PlayerType.JACOB_B, // 37
];

/** How long the randomly-selected character & build combination is "locked-in". */
const SEASON_3_LOCK_MINUTES = g.debug ? 0.01 : 1.25;
const SEASON_3_LOCK_SECONDS = SEASON_3_LOCK_MINUTES * 60;
export const SEASON_3_LOCK_MILLISECONDS = SEASON_3_LOCK_SECONDS * 1000;

export const NUM_DIVERSITY_PASSIVE_COLLECTIBLES = 3;

/**
 * - These are collectibles that are banned from all item pools during R+7 Season 3 only.
 * - They are mostly copied from R+7 Season 6 for Afterbirth+.
 * - The idea is that we want to normalize the lower-bound on any particular run.
 * - This was originally Dea1h's idea.
 */
export const BANNED_DIVERSITY_COLLECTIBLES_SEASON_ONLY: readonly CollectibleType[] =
  [
    CollectibleType.WE_NEED_TO_GO_DEEPER, // 84
    CollectibleType.MEGA_BLAST, // 441
    CollectibleType.MEGA_MUSH, // 625
  ];

/**
 * These are collectibles that can never be assigned as random starting items, but can still be
 * found in other pools in the middle of a run.
 *
 * This matches the list in "diversity.md" and "diversity.go". (The latter is a whitelist instead of
 * a blacklist.)
 */
const DIVERSITY_COLLECTIBLE_TYPE_BLACKLIST: readonly CollectibleType[] = [
  CollectibleType.HEART, // 15
  CollectibleType.RAW_LIVER, // 16
  CollectibleType.LUNCH, // 22
  CollectibleType.DINNER, // 23
  CollectibleType.DESSERT, // 24
  CollectibleType.BREAKFAST, // 25
  CollectibleType.ROTTEN_MEAT, // 26
  CollectibleType.MOMS_UNDERWEAR, // 29
  CollectibleType.MOMS_HEELS, // 30
  CollectibleType.MOMS_LIPSTICK, // 31
  CollectibleType.SUPER_BANDAGE, // 92
  CollectibleType.STEM_CELLS, // 176
  CollectibleType.MAGIC_8_BALL, // 194
  CollectibleType.BLACK_LOTUS, // 226
  CollectibleType.KEY_PIECE_1, // 238
  CollectibleType.KEY_PIECE_2, // 239
  CollectibleType.MAGIC_SCAB, // 253
  CollectibleType.MISSING_NO, // 258
  CollectibleType.BODY, // 334
  CollectibleType.SAFETY_PIN, // 339
  CollectibleType.MATCH_BOOK, // 344
  CollectibleType.SNACK, // 346
  CollectibleType.MOMS_PEARLS, // 355
  CollectibleType.PJS, // 428
  CollectibleType.DADS_LOST_COIN, // 455
  CollectibleType.MIDNIGHT_SNACK, // 456
  CollectibleType.KNIFE_PIECE_1, // 626
  CollectibleType.KNIFE_PIECE_2, // 627
  CollectibleType.DOGMA, // 633
  CollectibleType.R_KEY, // 636
  CollectibleType.DADS_NOTE, // 668
  CollectibleType.SUPPER, // 707
  CollectibleType.RECALL, // 714
];

const STARTING_COLLECTIBLE_TYPES: readonly CollectibleType[] = [
  // Treasure Room
  CollectibleType.CRICKETS_BODY, // 224
  CollectibleType.CRICKETS_HEAD, // 4
  CollectibleType.DEAD_EYE, // 373
  CollectibleType.DEATHS_TOUCH, // 237
  CollectibleType.DR_FETUS, // 52
  CollectibleType.IPECAC, // 149
  CollectibleType.MAGIC_MUSHROOM, // 12
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.POLYPHEMUS, // 169
  CollectibleType.PROPTOSIS, // 261
  CollectibleType.TECH_5, // 244
  CollectibleType.TECH_X, // 395
  CollectibleType.C_SECTION, // 678

  // Devil Room
  CollectibleType.BRIMSTONE, // 118
  CollectibleType.MAW_OF_THE_VOID, // 399

  // Angel Room
  CollectibleType.CROWN_OF_LIGHT, // 415
  CollectibleType.SACRED_HEART, // 182
  CollectibleType.SPIRIT_SWORD, // 579
  CollectibleType.REVELATION, // 643

  // Secret Room
  CollectibleType.EPIC_FETUS, // 168
];

/**
 * These are collectibles that can never be assigned as random starting items, but can still be
 * found in other pools in the middle of a run.
 *
 * This only applies during R+7 Season 3, not during diversity races.
 */
const DIVERSITY_COLLECTIBLE_TYPE_BLACKLIST_SEASON_ONLY: readonly CollectibleType[] =
  [
    ...STARTING_COLLECTIBLE_TYPES,
    CollectibleType.NOTCHED_AXE, // 147
    CollectibleType.CRYSTAL_BALL, // 158
    CollectibleType.JUDAS_SHADOW, // 311
    CollectibleType.MIND, // 333
    CollectibleType.TERRA, // 592
    CollectibleType.CARD_READING, // 660
  ];

const DIVERSITY_COLLECTIBLE_TYPES = copyArray(getVanillaCollectibleArray());
arrayRemoveInPlace(
  DIVERSITY_COLLECTIBLE_TYPES,
  ...BANNED_COLLECTIBLES,
  ...BANNED_DIVERSITY_COLLECTIBLES,
  ...BANNED_DIVERSITY_COLLECTIBLES_SEASON_ONLY,
  ...DIVERSITY_COLLECTIBLE_TYPE_BLACKLIST,
  ...DIVERSITY_COLLECTIBLE_TYPE_BLACKLIST_SEASON_ONLY,
);
export const DIVERSITY_ACTIVE_COLLECTIBLE_TYPES =
  DIVERSITY_COLLECTIBLE_TYPES.filter((collectibleType) =>
    isActiveCollectible(collectibleType),
  );
export const DIVERSITY_PASSIVE_COLLECTIBLE_TYPES =
  DIVERSITY_COLLECTIBLE_TYPES.filter(
    (collectibleType) => !isActiveCollectible(collectibleType),
  );

export const DIVERSITY_TRINKET_TYPES = copyArray(getVanillaTrinketArray());
arrayRemoveInPlace(
  DIVERSITY_TRINKET_TYPES,
  ...BANNED_TRINKETS,
  ...BANNED_DIVERSITY_TRINKETS,
);

export enum Season3Goal {
  BLUE_BABY = "Blue Baby",
  THE_LAMB = "The Lamb",
  MEGA_SATAN = "Mega Satan",
  BOSS_RUSH = "Boss Rush",
  HUSH = "Hush",
  MOTHER = "Mother",
  DOGMA = "Dogma",
}

/** We can't use `getEnumValues` on `Season3Goal` because they will be in a random order. */
export const SEASON_3_GOALS: readonly Season3Goal[] = [
  Season3Goal.BLUE_BABY,
  Season3Goal.THE_LAMB,
  Season3Goal.MEGA_SATAN,
  Season3Goal.BOSS_RUSH,
  Season3Goal.HUSH,
  Season3Goal.MOTHER,
  Season3Goal.DOGMA,
];
