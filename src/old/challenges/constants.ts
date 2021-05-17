import { CollectibleTypeCustom, PlayerTypeCustom } from "../types/enums";
import SeasonDescription from "../types/SeasonDescription";
import { ChallengeCustom } from "./enums";

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
  R15V: {
    X: 0,
    Y: 1,
    charPositions: [
      [0, 1, 1], // Isaac
      [1, 3, 1], // Magdalene
      [2, 5, 1], // Cain
      [3, 7, 1], // Judas
      [4, 9, 1], // Blue Baby
      [5, 11, 1], // Eve
      [6, 1, 3], // Samson
      [7, 3, 3], // Azazel
      [8, 5, 3], // Lazarus
      [9, 7, 3], // Eden
      [10, 9, 3], // The Lost
      [13, 11, 3], // Lilith
      [14, 1, 5], // Keeper
      [15, 3, 5], // Apollyon
      [16, 11, 5], // The Forgotten
    ],
  },

  R9S1: {
    X: 4,
    Y: 1,
    charPositions: [
      [2, 2, 1], // Cain
      [3, 4, 1], // Judas
      [4, 6, 1], // Blue Baby
      [5, 8, 1], // Eve
      [6, 10, 1], // Samson
      [7, 3, 3], // Azazel
      [8, 5, 3], // Lazarus
      [10, 7, 3], // The Lost
      [14, 9, 3], // Keeper
    ],
  },

  R14S1: {
    X: 8,
    Y: 1,
    charPositions: [
      [0, 1, 1], // Isaac
      [1, 3, 1], // Magdalene
      [2, 5, 1], // Cain
      [3, 7, 1], // Judas
      [4, 9, 1], // Blue Baby
      [5, 11, 1], // Eve
      [6, 1, 3], // Samson
      [7, 3, 3], // Azazel
      [8, 5, 3], // Lazarus
      [9, 7, 3], // Eden
      [10, 9, 3], // The Lost
      [13, 11, 3], // Lilith
      [14, 2, 5], // Keeper
      [15, 10, 5], // Apollyon
    ],
  },

  R7S2: {
    X: 12,
    Y: 1,
    charPositions: [
      [0, 2, 1], // Isaac
      [2, 4, 1], // Cain
      [3, 6, 1], // Judas
      [7, 8, 1], // Azazel
      [9, 10, 1], // Eden
      [15, 5, 3], // Apollyon
      [PlayerTypeCustom.PLAYER_SAMAEL, 7, 3], // Samael
    ],
  },

  R7S3: {
    X: 0,
    Y: 3,
    charPositions: [
      [0, 2, 1], // Isaac
      [1, 4, 1], // Magdalene
      [3, 6, 1], // Judas
      [5, 8, 1], // Eve
      [6, 10, 1], // Samson
      [8, 5, 3], // Lazarus
      [10, 7, 3], // The Lost
    ],
  },

  R7S4: {
    X: 4,
    Y: 3,
    charPositions: [
      [2, 2, 1], // Cain
      [3, 4, 1], // Judas
      [4, 6, 1], // Blue Baby
      [7, 8, 1], // Azazel
      [8, 10, 1], // Lazarus
      [13, 5, 3], // Lilith
      [15, 7, 3], // Apollyon
    ],
    itemPositions: [
      [172, 1, 1], // Sacrificial Dagger
      [224, 3, 1], // Cricket's Body
      [373, 5, 1], // Dead Eye
      [52, 7, 1], // Dr. Fetus
      [229, 9, 1], // Monstro's Lung
      [311, 11, 1], // Judas' Shadow
      [1006, 1, 3], // Chocolate Milk + Steven
      [1005, 11, 3], // Jacob's Ladder + There's Options

      [1001, 9, 5], // Mutant Spider + The Inner Eye
      [1002, 10, 5], // Technology + A Lump of Coal
      [1003, 11, 5], // Fire Mind + Mysterious Liquid + 13 luck
      [1004, 12, 5], // Kamikaze! + Host Hat

      [114, 0, 5], // Mom's Knife
      [395, 1, 5], // Tech X
      [168, 2, 5], // Epic Fetus
      [149, 3, 5], // Ipecac
    ],
  },

  R7S6: {
    X: 8,
    Y: 3,
    charPositions: [
      [3, 2, 1], // Judas
      [4, 4, 1], // Blue Baby
      [5, 6, 1], // Eve
      [7, 8, 1], // Azazel
      [9, 10, 1], // Eden
      [10, 5, 3], // The Lost
      [16, 7, 3], // The Forgotten
    ],
    itemPositionsBig4: [
      [114, 3, 5], // Mom's Knife
      [395, 5, 5], // Tech X
      [168, 7, 5], // Epic Fetus
      [149, 9, 5], // Ipecac
    ],
    itemPositionsNormal: [
      [172, 1, 1], // Sacrificial Dagger
      [245, 2, 1], // 20/20
      [261, 3, 1], // Proptosis
      [275, 4, 1], // Lil Brimstone
      [12, 5, 1], // Magic Mushroom
      [244, 6, 1], // Tech.5
      [169, 7, 1], // Polyphemus
      [4, 8, 1], // Cricket's Head
      [237, 9, 1], // Death's Touch
      [373, 10, 1], // Dead Eye
      [224, 11, 1], // Cricket's Body
      [52, 1, 3], // Dr. Fetus
      [229, 2, 3], // Monstro's Lung
      [311, 3, 3], // Judas' Shadow

      [1006, 5, 3], // Chocolate Milk + Steven
      [1005, 6, 3], // Jacob's Ladder + There's Options

      [118, 8, 3], // Brimstone
      [360, 9, 3], // Incubus
      [415, 10, 3], // Crown of Light
      [182, 11, 3], // Sacred Heart

      [1001, 1, 5], // Mutant Spider + The Inner Eye
      [1002, 2, 5], // Technology + A Lump of Coal
      [1003, 3, 5], // Fire Mind + Mysterious Liquid + 13 luck
    ],
    itemBans: 3,
  },

  R7S7: {
    X: 12,
    Y: 3,
    charPositions: [
      [2, 2, 1], // Cain
      [3, 4, 1], // Judas
      [6, 6, 1], // Samson
      [7, 8, 1], // Azazel
      [8, 10, 1], // Lazarus
      [10, 5, 3], // The Lost
      [13, 7, 3], // Lilith
    ],
  },

  R7S8: {
    X: 2,
    Y: 5,
    charPositions: [
      [0, 2, 1], // Isaac
      [2, 4, 1], // Cain
      [3, 6, 1], // Judas
      [5, 8, 1], // Eve
      [11, 10, 1], // Lazarus II
      [12, 5, 3], // Dark Judas
      [15, 7, 3], // Apollyon
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

export const BIG_4_ITEMS = [
  CollectibleType.COLLECTIBLE_MOMS_KNIFE, // 114
  CollectibleType.COLLECTIBLE_TECH_X, // 395
  CollectibleType.COLLECTIBLE_EPIC_FETUS, // 168
  CollectibleType.COLLECTIBLE_IPECAC, // 149
];

export const SEASON_5_CHARACTER_NAME = "Random Baby";

export const SEASON_5_ITEM_STARTS = [
  CollectibleType.COLLECTIBLE_MOMS_KNIFE, // 114
  CollectibleType.COLLECTIBLE_TECH_X, // 395
  CollectibleType.COLLECTIBLE_EPIC_FETUS, // 168
  CollectibleType.COLLECTIBLE_IPECAC, // 149
  CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER, // 172
  CollectibleType.COLLECTIBLE_20_20, // 245
  CollectibleType.COLLECTIBLE_PROPTOSIS, // 261
  CollectibleType.COLLECTIBLE_LIL_BRIMSTONE, // 275
  CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM, // 12
  CollectibleType.COLLECTIBLE_TECH_5, // 244
  CollectibleType.COLLECTIBLE_POLYPHEMUS, // 169
  CollectibleType.COLLECTIBLE_MAXS_HEAD, // 4
  CollectibleType.COLLECTIBLE_DEATHS_TOUCH, // 237
  CollectibleType.COLLECTIBLE_DEAD_EYE, // 373
  CollectibleType.COLLECTIBLE_CRICKETS_BODY, // 224
  CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT, // 415
  CollectibleType.COLLECTIBLE_INCUBUS, // 360
  CollectibleType.COLLECTIBLE_SACRED_HEART, // 182
  CollectibleTypeCustom.COLLECTIBLE_MUTANT_SPIDER_INNER_EYE, // Custom
];

export const SEASON_6_STARTING_BUILDS = [
  [CollectibleType.COLLECTIBLE_MOMS_KNIFE], // 114
  [CollectibleType.COLLECTIBLE_TECH_X], // 395
  [CollectibleType.COLLECTIBLE_EPIC_FETUS], // 168
  [CollectibleType.COLLECTIBLE_IPECAC], // 149
  [CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER], // 172
  [CollectibleType.COLLECTIBLE_20_20], // 245
  [CollectibleType.COLLECTIBLE_PROPTOSIS], // 261
  [CollectibleType.COLLECTIBLE_LIL_BRIMSTONE], // 275
  [CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM], // 12
  [CollectibleType.COLLECTIBLE_TECH_5], // 244
  [CollectibleType.COLLECTIBLE_POLYPHEMUS], // 169
  [CollectibleType.COLLECTIBLE_MAXS_HEAD], // 4
  [CollectibleType.COLLECTIBLE_DEATHS_TOUCH], // 237
  [CollectibleType.COLLECTIBLE_DEAD_EYE], // 373
  [CollectibleType.COLLECTIBLE_CRICKETS_BODY], // 224
  [CollectibleType.COLLECTIBLE_DR_FETUS], // 52
  [CollectibleType.COLLECTIBLE_MONSTROS_LUNG], // 229
  [CollectibleType.COLLECTIBLE_JUDAS_SHADOW], // 311
  [
    CollectibleType.COLLECTIBLE_CHOCOLATE_MILK, // 69
    CollectibleType.COLLECTIBLE_STEVEN, // 50
  ],
  [
    CollectibleType.COLLECTIBLE_JACOBS_LADDER, // 494
    CollectibleType.COLLECTIBLE_THERES_OPTIONS, // 249
  ],
  [CollectibleType.COLLECTIBLE_BRIMSTONE], // 118
  [CollectibleType.COLLECTIBLE_INCUBUS], // 360
  [CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT], // 415
  [CollectibleType.COLLECTIBLE_SACRED_HEART], // 182
  [
    CollectibleType.COLLECTIBLE_MUTANT_SPIDER, // 153
    CollectibleType.COLLECTIBLE_INNER_EYE, // 2
  ],
  [
    CollectibleType.COLLECTIBLE_TECHNOLOGY, // 68
    CollectibleType.COLLECTIBLE_LUMP_OF_COAL, // 132
  ],
  [
    CollectibleType.COLLECTIBLE_FIRE_MIND, // 257
    CollectibleType.COLLECTIBLE_MYSTERIOUS_LIQUID, // 317
    CollectibleTypeCustom.COLLECTIBLE_13_LUCK, // Custom
  ],
];

// This is how long the randomly-selected item start is "locked-in"
export const SEASON_6_ITEM_LOCK_MILLISECONDS = 60 * 1000; // 1 minute

// This is how often the special "Veto" button can be used
export const SEASON_6_VETO_BUTTON_LENGTH = 5 * 60 * 1000; // 5 minutes

export const SEASON_7_GOALS = [
  "Boss Rush",
  "It Lives!",
  "Hush",
  "Blue Baby",
  "The Lamb",
  "Mega Satan",
  "Ultra Greed",
];

export const SEASON_7_EXTRA_ACTIVE_ITEM_BANS = [
  CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER, // 84
  CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH, // 441
  CollectibleType.COLLECTIBLE_CRYSTAL_BALL, // 158
];

export const SEASON_7_VALID_ACTIVE_ITEMS: CollectibleType[] = [];

export const SEASON_7_EXTRA_PASSIVE_ITEM_BANS = [
  CollectibleType.COLLECTIBLE_20_20, // 245
  CollectibleType.COLLECTIBLE_CRICKETS_BODY, // 224
  CollectibleType.COLLECTIBLE_MAXS_HEAD, // 4
  CollectibleType.COLLECTIBLE_DEAD_EYE, // 373
  CollectibleType.COLLECTIBLE_DEATHS_TOUCH, // 237
  CollectibleType.COLLECTIBLE_DR_FETUS, // 52
  CollectibleType.COLLECTIBLE_EPIC_FETUS, // 168
  CollectibleType.COLLECTIBLE_IPECAC, // 149
  CollectibleType.COLLECTIBLE_JUDAS_SHADOW, // 311
  CollectibleType.COLLECTIBLE_LIL_BRIMSTONE, // 275
  CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM, // 12
  CollectibleType.COLLECTIBLE_MOMS_KNIFE, // 114
  CollectibleType.COLLECTIBLE_MONSTROS_LUNG, // 229
  CollectibleType.COLLECTIBLE_POLYPHEMUS, // 169
  CollectibleType.COLLECTIBLE_PROPTOSIS, // 261
  CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER, // 172
  CollectibleType.COLLECTIBLE_TECH_5, // 244
  CollectibleType.COLLECTIBLE_TECH_X, // 395

  CollectibleType.COLLECTIBLE_BRIMSTONE, // 118
  CollectibleType.COLLECTIBLE_INCUBUS, // 360
  CollectibleType.COLLECTIBLE_MAW_OF_VOID, // 399

  CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT, // 415
  CollectibleType.COLLECTIBLE_GODHEAD, // 331
  CollectibleType.COLLECTIBLE_SACRED_HEART, // 182

  CollectibleType.COLLECTIBLE_CHOCOLATE_MILK, // 69
  CollectibleType.COLLECTIBLE_JACOBS_LADDER, // 494

  CollectibleType.COLLECTIBLE_TINY_PLANET, // 233
  CollectibleType.COLLECTIBLE_SOY_MILK, // 330
  CollectibleType.COLLECTIBLE_MIND, // 333
];

export const SEASON_7_VALID_PASSIVE_ITEMS: CollectibleType[] = [];

export const SEASON_7_EXTRA_TRINKET_BANS = [
  TrinketType.TRINKET_BROKEN_REMOTE, // 4
  TrinketType.TRINKET_OUROBOROS_WORM, // 96
];

export const SEASON_7_VALID_TRINKETS: TrinketType[] = [];

export const SEASON_7_CHARACTER_ITEM_BANS = new Map([
  [PlayerType.PLAYER_CAIN, [CollectibleType.COLLECTIBLE_LUCKY_FOOT]], // 2
  [
    PlayerType.PLAYER_EVE, // 5
    [
      CollectibleType.COLLECTIBLE_DEAD_BIRD, // 117
      CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON, // 122
    ],
  ],
  [PlayerType.PLAYER_SAMSON, [CollectibleType.COLLECTIBLE_BLOODY_LUST]], // 6
  [PlayerType.PLAYER_LAZARUS, [CollectibleType.COLLECTIBLE_ANEMIC]], // 8
  [PlayerType.PLAYER_THELOST, [CollectibleType.COLLECTIBLE_HOLY_MANTLE]], // 10
  [PlayerType.PLAYER_LILITH, [CollectibleType.COLLECTIBLE_CAMBION_CONCEPTION]], // 13
  [PlayerType.PLAYER_KEEPER, [CollectibleType.COLLECTIBLE_ABADDON]], // 14
]);

export const SEASON_8_STARTING_ITEMS = [
  CollectibleType.COLLECTIBLE_MOMS_KNIFE, // 114
  CollectibleType.COLLECTIBLE_TECH_X, // 395
  CollectibleType.COLLECTIBLE_EPIC_FETUS, // 168
  CollectibleType.COLLECTIBLE_IPECAC, // 149
  CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER, // 172
  CollectibleType.COLLECTIBLE_20_20, // 245
  CollectibleType.COLLECTIBLE_PROPTOSIS, // 261
  CollectibleType.COLLECTIBLE_LIL_BRIMSTONE, // 275
  CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM, // 12
  CollectibleType.COLLECTIBLE_TECH_5, // 244
  CollectibleType.COLLECTIBLE_POLYPHEMUS, // 169
  CollectibleType.COLLECTIBLE_MAXS_HEAD, // 4
  CollectibleType.COLLECTIBLE_DEATHS_TOUCH, // 237
  CollectibleType.COLLECTIBLE_DEAD_EYE, // 373
  CollectibleType.COLLECTIBLE_CRICKETS_BODY, // 224
  CollectibleType.COLLECTIBLE_DR_FETUS, // 52
  CollectibleType.COLLECTIBLE_MONSTROS_LUNG, // 229
];

export const SEASON_8_GOOD_DEVIL_ITEMS = [
  CollectibleType.COLLECTIBLE_MOMS_KNIFE, // 114
  CollectibleType.COLLECTIBLE_BRIMSTONE, // 118
  CollectibleType.COLLECTIBLE_MAW_OF_VOID, // 399
  CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER, // 172
  CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER, // 84
  CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH, // 441
  CollectibleType.COLLECTIBLE_INCUBUS, // 360
  CollectibleType.COLLECTIBLE_ABADDON, // 230
  CollectibleType.COLLECTIBLE_DEATHS_TOUCH, // 237
  CollectibleType.COLLECTIBLE_LIL_BRIMSTONE, // 275
  CollectibleType.COLLECTIBLE_SUCCUBUS, // 417
];

export const SEASON_8_GOOD_ANGEL_ITEMS = [
  CollectibleType.COLLECTIBLE_GODHEAD, // 331
  CollectibleType.COLLECTIBLE_SACRED_HEART, // 182
  CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT, // 415
  CollectibleType.COLLECTIBLE_MIND, // 333
];

export const SEASON_8_PILL_EFFECTS = [
  PillEffect.PILLEFFECT_BALLS_OF_STEEL, // 2
  PillEffect.PILLEFFECT_BOMBS_ARE_KEYS, // 3
  PillEffect.PILLEFFECT_HEALTH_DOWN, // 6
  PillEffect.PILLEFFECT_HEALTH_UP, // 7
  PillEffect.PILLEFFECT_PRETTY_FLY, // 10
  PillEffect.PILLEFFECT_SPEED_DOWN, // 13
  PillEffect.PILLEFFECT_SPEED_UP, // 14
  PillEffect.PILLEFFECT_TEARS_DOWN, // 15
  PillEffect.PILLEFFECT_TEARS_UP, // 16
  PillEffect.PILLEFFECT_TELEPILLS, // 19
  PillEffect.PILLEFFECT_48HOUR_ENERGY, // 20
  PillEffect.PILLEFFECT_SEE_FOREVER, // 23
  PillEffect.PILLEFFECT_POWER, // 36
  PillEffect.PILLEFFECT_IM_DROWSY, // 41
  PillEffect.PILLEFFECT_GULP, // 43
];

// The average build power level should be roughly equivalent to Proptosis
export const SEASON_9_STARTING_BUILDS = [
  // Big 4
  [CollectibleType.COLLECTIBLE_MOMS_KNIFE],
  [CollectibleType.COLLECTIBLE_TECH_X],
  [CollectibleType.COLLECTIBLE_IPECAC],
  [CollectibleType.COLLECTIBLE_EPIC_FETUS],

  // Single item starts (Treasure Room)
  [CollectibleType.COLLECTIBLE_MAXS_HEAD], // 4
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
