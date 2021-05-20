/*
export const DEFAULT_COLOR = Color(1, 1, 1, 1, 0, 0, 0);
export const DEFAULT_KCOLOR = KColor(1, 1, 1, 1);

export const TRANSFORMATION_NAMES = [
  "Guppy",
  "Beelzebub",
  "Fun Guy",
  "Seraphim",
  "Bob",
  "Spun",
  "Yes Mother?",
  "Conjoined",
  "Leviathan",
  "Oh Crap",
  "Bookworm",
  "Adult",
  "Spider Baby",
  "Stompy",
];

export const SPLITTING_BOSSES = [
  EntityType.ENTITY_LARRYJR, // 19
  EntityType.ENTITY_FISTULA_BIG, // 71
  EntityType.ENTITY_FISTULA_MEDIUM, // 72
  EntityType.ENTITY_FISTULA_SMALL, // 73
  EntityType.ENTITY_BLASTOCYST_BIG, // 74
  EntityType.ENTITY_BLASTOCYST_MEDIUM, // 75
  EntityType.ENTITY_BLASTOCYST_SMALL, // 76
  EntityType.ENTITY_FALLEN, // 81
  EntityType.ENTITY_BROWNIE, // 402
];

// Used to fix Greed's Gullet bugs
export const HEALTH_UP_ITEMS = [
  12, // Magic Mushroom (already has range cache)
  15, // <3
  16, // Raw Liver (gives 2 containers)
  22, // Lunch
  23, // Dinner
  24, // Dessert
  25, // Breakfast
  26, // Rotten Meat
  81, // Dead Cat
  92, // Super Bandage
  101, // The Halo (already has range cache)
  119, // Blood Bag
  121, // Odd Mushroom (Thick) (already has range cache)
  129, // Bucket of Lard (gives 2 containers)
  138, // Stigmata
  176, // Stem Cells
  182, // Sacred Heart (already has range cache)
  184, // Holy Grail
  189, // SMB Super Fan (already has range cache)
  193, // Meat!
  218, // Placenta
  219, // Old Bandage
  226, // Black Lotus
  230, // Abaddon
  253, // Magic Scab
  307, // Capricorn (already has range cache)
  312, // Maggy's Bow
  314, // Thunder Thighs
  334, // The Body (gives 3 containers)
  342, // Blue Cap
  346, // A Snack
  354, // Crack Jacks
  456, // Moldy Bread
  1000, // Health Up (pill)
];

export const ALL_CACHE_FLAGS_MINUS_FAMILIARS =
  CacheFlag.CACHE_DAMAGE + // 1
  CacheFlag.CACHE_FIREDELAY + // 2
  CacheFlag.CACHE_SHOTSPEED + // 4
  CacheFlag.CACHE_RANGE + // 8
  CacheFlag.CACHE_SPEED + // 16
  CacheFlag.CACHE_TEARFLAG + // 32
  CacheFlag.CACHE_TEARCOLOR + // 64
  CacheFlag.CACHE_FLYING + // 128
  CacheFlag.CACHE_WEAPON + // 256
  CacheFlag.CACHE_LUCK; // 1024

export const SEEDED_DEATH_DEBUFF_SECONDS = 45;

*/

/* eslint-disable prettier/prettier */

export const DIVERSITY_VALID_ACTIVE_ITEMS = [
  // Rebirth items
  33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
  44, 45, 47, 49, 56, 58, 65, 66, 77, 78,
  83, 84, 85, 86, 93, 97, 102, 105, 107, 111,
  123, 124, 126, 127, 130, 133, 135, 136, 137, 145,
  146, 147, 158, 160, 164, 166, 171, 175, 177, 181,
  186, 192, 282, 285, 286, 287, 288, 289, 290, 291, // D100 (283) and D4 (284) are banned
  292, 293, 294, 295, 296, 297, 298, 323, 324, 325,
  326, 338,

  // Afterbirth items
  347, 348, 349, 351, 352, 357, 382, 383, 386, 396,
  406, 419, 421, 422, 427, 434, 437, 439, 441,

  // Afterbirth+ items
  475, 476, 477, 478, 479, 480, 481, 482, 483, 484,
  485, 486, 487, 488, 490, 504, 507, 510, // D Infinity (489) is banned

  // Booster Pack items
  512, 515, 516, 521, 522, 523, 527, 536, 545,
];

export const DIVERSITY_VALID_PASSIVE_ITEMS = [
  // Rebirth items
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  // <3 (15), Raw Liver (16), Lunch (22), Dinner (23), Dessert (24), Breakfast (25),
  // and Rotten Meat (26) are banned
  11, 12, 13, 14, 17, 18, 19, 20, 21, 27,
  // Mom's Underwear (29), Moms Heels (30), Moms Lipstick (31), and Lucky Foot (46) are banned
  28, 32, 48, 50, 51, 52, 53, 54, 55, 57,
  60, 62, 63, 64, 67, 68, 69, 70, 71, 72,
  73, 74, 75, 76, 79, 80, 81, 82, 87, 88,
  89, 90, 91, 94, 95, 96, 98, 99, 100, 101, // Super Bandage (92) is banned
  103, 104, 106, 108, 109, 110, 112, 113, 114, 115,
  116, 117, 118, 119, 120, 121, 122, 125, 128, 129,
  131, 132, 134, 138, 139, 140, 141, 142, 143, 144,
  148, 149, 150, 151, 152, 153, 154, 155, 156, 157,
  159, 161, 162, 163, 165, 167, 168, 169, 170, 172,
  173, 174, 178, 179, 180, 182, 183, 184, 185, 187, // Stem Cells (176) is banned
  188, 189, 190, 191, 193, 195, 196, 197, 198, 199, // Magic 8 Ball (194) is banned
  200, 201, 202, 203, 204, 205, 206, 207, 208, 209,
  210, 211, 212, 213, 214, 215, 216, 217, 218, 219,
  220, 221, 222, 223, 224, 225, 227, 228, 229, 230, // Black Lotus (226) is banned
  // Key Piece #1 (238) and Key Piece #2 (239) are banned
  231, 232, 233, 234, 236, 237, 240, 241, 242, 243,
  244, 245, 246, 247, 248, 249, 250, 251, 252, 254, // Magic Scab (253) is banned
  255, 256, 257, 259, 260, 261, 262, 264, 265, 266, // Missing No. (258) is banned
  267, 268, 269, 270, 271, 272, 273, 274, 275, 276,
  277, 278, 279, 280, 281, 299, 300, 301, 302, 303,
  304, 305, 306, 307, 308, 309, 310, 311, 312, 313,
  314, 315, 316, 317, 318, 319, 320, 321, 322, 327,
  // The Body (334) and Safety Pin (339) are banned
  328, 329, 330, 331, 332, 333, 335, 336, 337, 340,
  341, 342, 343, 345, // Match Book (344) and A Snack (346) are banned

  // Afterbirth items
  350, 353, 354, 356, 358, 359, 360, 361, 362, 363, // Mom's Pearls (355) is banned
  364, 365, 366, 367, 368, 369, 370, 371, 372, 373,
  374, 375, 376, 377, 378, 379, 380, 381, 384, 385,
  387, 388, 389, 390, 391, 392, 393, 394, 395, 397,
  398, 399, 400, 401, 402, 403, 404, 405, 407, 408,
  409, 410, 411, 412, 413, 414, 415, 416, 417, 418,
  420, 423, 424, 425, 426, 429, 430, 431, 432, 433, // PJs (428) is banned
  435, 436, 438, 440,

  // Afterbirth+ items
  442, 443, 444, 445, 446, 447, 448, 449, 450, 451,
  // Dad's Lost Coin (455) and Moldy Bread (456) are banned
  452, 453, 454, 457, 458, 459, 460, 461, 462, 463,
  464, 465, 466, 467, 468, 469, 470, 471, 472, 473,
  474, 491, 492, 493, 494, 495, 496, 497, 498, 499,
  500, 501, 502, 503, 505, 506, 508, 509,

  // Booster Pack items
  511, 513, 514, 517, 518, 519, 520, 524, 525, 526,
  528, 529, 530, 531, 532, 533, 535, 537, 538, 539, // Schoolbag (534) is given on every run already
  540, 541, 542, 543, 544, 546, 547, 548, 549,
]

export const DIVERSITY_VALID_TRINKETS = [
  // Rebirth trinkets
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 48, 49, 50, 51,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61,

  // Afterbirth trinkets
  62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
  72, 73, 74, 75, 76, 77, 78, 79, 80, 81,
  82, 83, 84, 86, 87, 88, 89, 90, // Karma (85) is banned

  // Afterbirth+ trinkets
  91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
  101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
  111, 112, 113, 114, 115, 116, 117, 118, 119,

  // Booster pack trinkets
  120, 121, 122, 123, 124, 125, 126, 127, 128,
]

/* eslint-enable prettier/prettier */

export const ISAAC_SERVER_HOST = "isaacracing.net";
export const ISAAC_SERVER_PORT = 9001;
