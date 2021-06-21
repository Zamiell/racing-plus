/*

// The challenge table maps challenge names to abbreviations and
// the number of elements in the "character order" table
export const CHALLENGE_DEFINITIONS = new Map<ChallengeCustom, [string, int]>([
  [ChallengeCustom.R9_SEASON_1, ["R9S1", 9]],
  [ChallengeCustom.R14_SEASON_1, ["R14S1", 14]],
  [ChallengeCustom.R7_SEASON_2, ["R7S2", 7]],
  [ChallengeCustom.R7_SEASON_3, ["R7S3", 7]],
  [ChallengeCustom.R7_SEASON_4, ["R7S4", 14]], // 14 = 7 characters + 7 starting items
  [ChallengeCustom.R7_SEASON_5, ["R7S5", 7]],
  [ChallengeCustom.R7_SEASON_6, ["R7S6", 11]], // 11 = 7 characters + 3 item bans + 1 big 4 item ban
  [ChallengeCustom.R7_SEASON_7, ["R7S7", 7]],
  [ChallengeCustom.R7_SEASON_8, ["R7S8", 7]],
  [ChallengeCustom.R7_SEASON_9, ["R7S9", 7]],
  [ChallengeCustom.R15_VANILLA, ["R15V", 15]],
]);

// The format of "charPosition" is: character ID, X, Y
export const CHANGE_CHAR_ORDER_POSITIONS: {
  [key in string]: SeasonDescription;
} = {
  R7S1: {
    X: 12,
    Y: 1,
    charPositions: [
      [0, 2, 1], // Isaac
      [2, 4, 1], // Cain
      [3, 6, 1], // Judas
      [7, 8, 1], // Azazel
      [9, 10, 1], // Eden
      [15, 5, 3], // Apollyon
      [1, 7, 3],  // Magdalene
    ],
  },

  R7S9: {
    X: 10,
    Y: 5,
    charPositions: [
      [0, 2, 1], // Isaac
      [1, 4, 1], // Magdalene
      [2, 6, 1], // Cain
      [3, 8, 1], // Judas
      [4, 10, 1], // Blue Baby
      [7, 5, 3], // Azazel
      [8, 7, 3], // Lazarus
    ],
  },
};

// The average build power level should be roughly equivalent to Proptosis
export const SEASON_9_STARTING_BUILDS = [
  // Big 4
  [CollectibleType.COLLECTIBLE_MOMS_KNIFE],
  [CollectibleType.COLLECTIBLE_TECH_X],
  [CollectibleType.COLLECTIBLE_IPECAC],
  [CollectibleType.COLLECTIBLE_EPIC_FETUS],

  // Single item starts (Treasure Room)
  [CollectibleType.COLLECTIBLE_CRICKETS_HEAD], // 4
  [CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM], // 12
  [CollectibleType.COLLECTIBLE_DR_FETUS], // 52
  [CollectibleType.COLLECTIBLE_TECHNOLOGY], // 68
  [CollectibleType.COLLECTIBLE_POLYPHEMUS], // 169
  [CollectibleType.COLLECTIBLE_TECH_5], // 244
  [CollectibleType.COLLECTIBLE_20_20], // 245
  [CollectibleType.COLLECTIBLE_PROPTOSIS], // 261
  [CollectibleType.COLLECTIBLE_ISAACS_HEART], // 276
  [CollectibleType.COLLECTIBLE_JUDAS_SHADOW], // 311

  // Single item starts (Devil Room)
  [CollectibleType.COLLECTIBLE_BRIMSTONE], // 118
  [CollectibleType.COLLECTIBLE_MAW_OF_VOID], // 399
  [CollectibleType.COLLECTIBLE_INCUBUS], // 360

  // Single item starts (Angel Room)
  [CollectibleType.COLLECTIBLE_SACRED_HEART], // 182
  [CollectibleType.COLLECTIBLE_GODHEAD], // 331
  [CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT], // 415

  // Double item starts
  [
    // #21
    CollectibleType.COLLECTIBLE_CRICKETS_BODY, // 224
    CollectibleType.COLLECTIBLE_SAD_ONION,
  ],
  [
    // #22
    CollectibleType.COLLECTIBLE_MONSTROS_LUNG, // 229
    CollectibleType.COLLECTIBLE_SAD_ONION,
  ],
  [
    // #23
    CollectibleType.COLLECTIBLE_DEATHS_TOUCH, // 237
    CollectibleType.COLLECTIBLE_SAD_ONION,
  ],
  [
    // #24
    CollectibleType.COLLECTIBLE_DEAD_EYE, // 373
    CollectibleType.COLLECTIBLE_APPLE,
  ],
  [
    // #25
    CollectibleType.COLLECTIBLE_JACOBS_LADDER, // 494
    CollectibleType.COLLECTIBLE_THERES_OPTIONS,
  ],
  [
    // #26
    CollectibleType.COLLECTIBLE_POINTY_RIB, // 544
    CollectibleType.COLLECTIBLE_POINTY_RIB,
  ],

  // Triple item starts
  [
    // #27
    CollectibleType.COLLECTIBLE_CHOCOLATE_MILK,
    CollectibleType.COLLECTIBLE_STEVEN,
    CollectibleType.COLLECTIBLE_SAD_ONION,
  ],
];

// This is how long the randomly-selected item start is "locked-in"
export const SEASON_9_ITEM_LOCK_TIME_MILLISECONDS = 60 * 1000; // 1 minute
export const SEASON_9_HISTORY_DATA_LABEL = "s9hbi";

export const SEASON_9_CHARACTER_ITEM_BANS = new Map([
  [PlayerType.PLAYER_CAIN, [CollectibleType.COLLECTIBLE_CRICKETS_BODY]], // 2
  [PlayerType.PLAYER_JUDAS, [CollectibleType.COLLECTIBLE_JUDAS_SHADOW]], // 3
  [PlayerType.PLAYER_XXX, [CollectibleType.COLLECTIBLE_IPECAC]], // 4
  [
    PlayerType.PLAYER_AZAZEL, // 7
    [
      CollectibleType.COLLECTIBLE_IPECAC, // 149
      CollectibleType.COLLECTIBLE_MUTANT_SPIDER, // 153
      CollectibleType.COLLECTIBLE_CRICKETS_BODY, // 224
      CollectibleType.COLLECTIBLE_ISAACS_HEART, // 276
      CollectibleType.COLLECTIBLE_DEAD_EYE, // 373
      CollectibleType.COLLECTIBLE_JUDAS_SHADOW, // 331
      CollectibleType.COLLECTIBLE_FIRE_MIND, // 257
      CollectibleType.COLLECTIBLE_GODHEAD, // 331
      CollectibleType.COLLECTIBLE_JACOBS_LADDER, // 494
    ],
  ],
  [
    PlayerType.PLAYER_THEFORGOTTEN, // 16
    [
      CollectibleType.COLLECTIBLE_DEATHS_TOUCH, // 237
      CollectibleType.COLLECTIBLE_FIRE_MIND, // 257
      CollectibleType.COLLECTIBLE_LIL_BRIMSTONE, // 275
      CollectibleType.COLLECTIBLE_JUDAS_SHADOW, // 311
      CollectibleType.COLLECTIBLE_INCUBUS, // 350
    ],
  ],
]);

*/
