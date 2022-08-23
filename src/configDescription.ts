import { Config } from "./classes/Config";
import { Hotkeys } from "./classes/Hotkeys";

export type ConfigDescriptions = ReadonlyArray<
  [
    keyof Config | keyof Hotkeys | "",
    [ModConfigMenuOptionType, string, string, string],
  ]
>;

// 0001-0010
export const MAJOR_CHANGES: ConfigDescriptions = [
  [
    "clientCommunication",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "001",
      "Enable client support",
      "Allow the mod to talk with the Racing+ client. You can disable this if you are not using the client to very slightly reduce lag.",
    ],
  ],
  [
    "startWithD6",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "002",
      "Start with the D6",
      "Makes each character start with a D6 or a pocket D6.",
    ],
  ],
  [
    "disableCurses",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "003",
      "Disable curses",
      "Disables all curses, like Curse of the Maze.",
    ],
  ],
  [
    "betterDevilAngelRooms",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "004",
      "Better Devil/Angel Rooms",
      "Improves the quality and variety of Devil Rooms & Angel Rooms.",
    ],
  ],
  [
    "freeDevilItem",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "005",
      "Free devil item",
      "Awards a Your Soul trinket upon entering the Basement 2 Devil Room if you have not taken damage.",
    ],
  ],
  [
    "fastReset",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "006",
      "Fast reset",
      "Instantaneously restart the game as soon as you press the R key.",
    ],
  ],
  [
    "fastClear",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "007",
      "Fast room clear",
      "Makes doors open at the beginning of the death animation instead of at the end.",
    ],
  ],
  [
    "fastTravel",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "008",
      "Fast floor travel",
      "Replace the fade-in and fade-out with a custom animation where you jump out of a hole. Also, replace the crawl space animation.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Room fixes",
      "Fixes various softlocks and bugs. This cannot be disabled because it affects the STB files.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Room flipping",
      "To increase run variety, all rooms have a chance to be flipped on the X axis, Y axis, or both axes.",
    ],
  ],
];

// n/a
export const CUSTOM_HOTKEYS: ConfigDescriptions = [
  [
    "fastDropAll",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Fast drop",
      "Drop all of your items instantaneously.",
    ],
  ],
  [
    "fastDropTrinkets",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Fast drop (trinkets)",
      "Drop your trinkets instantaneously.",
    ],
  ],
  [
    "fastDropPocket",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Fast drop (pocket)",
      "Drop your pocket items instantaneously.",
    ],
  ],
  [
    "schoolbagSwitch",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Switch Schoolbag items",
      "Switch between Schoolbag items without swapping cards or switching to The Soul.",
    ],
  ],
  [
    "autofire",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Toggle autofire",
      "Enable autofire, which toggles the fire input on every frame.",
    ],
  ],
  [
    "console",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Toggle chat",
      "When in a race, this toggles the chat entry console. When not in a race, this will do nothing. If not set, this will default to Enter.",
    ],
  ],
  [
    "roll",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Roll",
      "Do a barrel roll.",
    ],
  ],
];

// 0201-0210
export const CHARACTER_CHANGES: ConfigDescriptions = [
  [
    "judasAddBomb", // 3
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0201",
      "Add a bomb to Judas",
      "Makes Judas start with 1 bomb instead of 0 bombs.",
    ],
  ],
  [
    "samsonDropHeart", // 6
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0202",
      "Make Samson drop his trinket",
      "Makes Samson automatically drop his Child's Heart trinket at the beginning of a run.",
    ],
  ],
  [
    "showEdenStartingItems", // 9, 30
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0203",
      "Show Eden's starting items",
      "Draw both of Eden's starting items on the screen while in the first room.",
    ],
  ],
  [
    "lostUseHolyCard", // 31
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0204",
      "Automatically use the Holy Card",
      "Automatically use the Holy Card when starting a run as Tainted Lost.",
    ],
  ],
  [
    "taintedKeeperMoney", // 33
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0205",
      "Tainted Keeper extra money",
      "Make Tainted Keeper start with 15 cents. This gives him enough money to start a Treasure Room item.",
    ],
  ],
];

// 0301-0310
export const BOSS_CHANGES_1: ConfigDescriptions = [
  [
    "fadeBosses",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0301",
      "Fade dead bosses",
      "Make bosses faded during their death animation so that you can see the dropped item.",
    ],
  ],
  [
    "removeArmor",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0302",
      "Remove armor",
      "Remove damage scaling from all of the bosses that have it.",
    ],
  ],
  [
    "fastBossRush",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0303",
      "Fast Boss Rush",
      "The mandatory waiting between bosses is removed.",
    ],
  ],
  [
    "killExtraEnemies", // 45, 78
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0304",
      "Kill extra enemies",
      "Extra enemies will properly die after defeating Mom, Mom's Heart, or It Lives!",
    ],
  ],
  [
    "fastPin", // 62
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0305",
      "Fast Pin",
      "Make Pin, Frail, Scolex, and Wormwood spend less time underground.",
    ],
  ],
  [
    "preventDeathSlow", // 66
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0306",
      "Stop Death's slow attack",
      "Stop Death from performing the attack that reduces your speed by a factor of 2.",
    ],
  ],
  [
    "fastKrampus", // 81
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0307",
      "Fast Krampus",
      "Make Krampus immediately drop his item once he is killed.",
    ],
  ],
  [
    "fastSatan", // 84
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0308",
      "Fast Satan",
      "All of the waiting during the Satan Fight is removed.",
    ],
  ],
  [
    "fastHaunt", // 260
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0309",
      "Fast The Haunt",
      "Some animations in The Haunt fight are sped up.",
    ],
  ],
  [
    "fastAngels", // 271, 272
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0310",
      "Fast angels",
      "Make Uriel and Gabriel immediately drop their key piece once they are killed.",
    ],
  ],
];

// 0311-0320
export const BOSS_CHANGES_2: ConfigDescriptions = [
  [
    "consistentAngels", // 271, 272
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0311",
      "Consistent angels",
      "Prevent two of the same angel boss from spawning in the same room.",
    ],
  ],
  [
    "removeLambBody", // 273
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0312",
      "Remove The Lamb body",
      "Remove The Lamb body entirely once it dies.",
    ],
  ],
  [
    "preventVictoryLapPopup", // 273
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0313",
      "Stop the Victory Lap popup",
      "Prevent the Victory Lap popup from appearing once you defeat The Lamb.",
    ],
  ],
  [
    "openHushDoor", // 407
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0314",
      "Open the Hush door",
      "Automatically open the big door to Hush when you arrive on the Blue womb.",
    ],
  ],
  [
    "fastBigHorn", // 411
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0315",
      "Fast Big Horn",
      "Make Big Horn spend less time underground.",
    ],
  ],
  [
    "fastColostomia", // 917
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0316",
      "Fast Colostomia",
      "Make Colostomia appear instantly.",
    ],
  ],
  [
    "fastDogma", // 950
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0317",
      "Fast Dogma",
      "Speed up Dogma's death animation (and skip the death cutscene).",
    ],
  ],
  [
    "", // 274, 275
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fast Mega Satan",
      "Remove some of the animations in the Mega Satan fight.",
    ],
  ],
  [
    "", // 275
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Prevent Mega Satan ending",
      "Defeating Mega Satan no longer has a chance to immediately end the run.",
    ],
  ],
  [
    "", // 407
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fast Hush",
      'Make Hush no longer play an "Appear" animation.',
    ],
  ],
];

// 0311-0320
export const BOSS_CHANGES_3: ConfigDescriptions = [
  [
    "", // 951
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Prevent The Beast ending",
      "Defeating The Beast no longer has a chance to immediately end the run.",
    ],
  ],
];

// 0401-0410
export const ENEMY_CHANGES_1: ConfigDescriptions = [
  [
    "removeTreasureRoomEnemies",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0401",
      "Remove Treasure Room enemies",
      "Remove all enemies from Treasure Rooms.",
    ],
  ],
  [
    "clearerShadowAttacks",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0402",
      "Make shadow attacks clearer",
      "Make a blue target appear on the ground for the specific attacks that come from above.",
    ],
  ],
  [
    "globinSoftlock", // 24
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0403",
      "Fix Globin softlocks",
      "Make Globins permanently die on the 4th regeneration to prevent Epic Fetus softlocks.",
    ],
  ],
  [
    "fastHands", // 213, 287
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0404",
      "Fast hands",
      "Mom's Hands and Mom's Dead Hands have faster attack patterns.",
    ],
  ],
  [
    "appearHands", // 213, 287
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0405",
      "Reveal hands",
      "Mom's Hands and Mom's Dead Hands will play an \"Appear\" animation.",
    ],
  ],
  [
    "disableInvulnerability", // 219, 260, 285
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0406",
      "Disable invulnerability",
      "Wizoobs, Red Ghosts, and Lil' Haunts no longer have invulnerability frames after spawning.",
    ],
  ],
  [
    "fastGhosts", // 219, 285
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0407",
      "Fast ghosts",
      "Wizoobs and Red Ghosts have faster attack patterns.",
    ],
  ],
  [
    "replaceCodWorms", // 221
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0408",
      "Replace Cod Worms",
      "Cod Worms are replaced with Para-Bites.",
    ],
  ],
  [
    "removeStrayPitfalls", // 291
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0409",
      "Remove stray Pitfalls",
      "Kill all Pitfalls on room clear.",
    ],
  ],
  [
    "fastPolties", // 816
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0410",
      "Fast Polties/Kinetis",
      "Make Polties & Kinetis show themselves immediately upon entering the room.",
    ],
  ],
];

// 0411-0420
export const ENEMY_CHANGES_2: ConfigDescriptions = [
  [
    "fastNeedles", // 881
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0411",
      "Fast Needles/Pasties",
      "Make Needles & Pasties spend less time underground.",
    ],
  ],
  [
    "fastDusts", // 882
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0412",
      "Fast Dusts",
      "Make Dusts never disappear.",
    ],
  ],
];

// 0501-0510
export const QUALITY_OF_LIFE_CHANGES_1: ConfigDescriptions = [
  [
    "speedUpFadeIn",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0501",
      "Speed-up new run fade-ins",
      "Speed-up the fade-in that occurs at the beginning of a new run.",
    ],
  ],
  [
    "easyFirstFloorItems",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0502",
      "Easier first floor items",
      "Slightly change first floor Treasure Rooms so that you never have to spend a bomb or walk on spikes.",
    ],
  ],
  [
    "changeCreepColor",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0503",
      "Consistent creep color",
      "Change enemy red creep to green and change friendly green creep to red.",
    ],
  ],
  [
    "subvertTeleport",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0504",
      "Subvert disruptive teleports",
      "Stop the disruptive teleport that happens when entering a room with Gurdy, Mom, Mom's Heart, or It Lives!",
    ],
  ],
  [
    "deleteVoidPortals",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0505",
      "Delete Void portals",
      "Automatically delete the Void portals that spawn after bosses.",
    ],
  ],
  [
    "showNumSacrifices",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0506",
      "Show the number of sacrifices",
      "Show the number of sacrifices in the top-left when in a Sacrifice Room.",
    ],
  ],
  [
    "taintedSamsonChargeBar",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0507",
      "Show Tainted Samson charge bar",
      "Show a custom charge bar that lets you know how close you are to Berserk! activation.",
    ],
  ],
  [
    "bloodyLustChargeBar",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0508",
      "Show Bloody Lust charge bar",
      "Show a custom charge bar that lets you know how close you are to getting the maximum amount of damage from Bloody Lust.",
    ],
  ],
  [
    "leadPencilChargeBar", // 444
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0509",
      "Show Lead Pencil charge bar",
      "It will only show in situations where the Lead Pencil will work normally.",
    ],
  ],
  [
    "azazelsRageChargeBar", // 669
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0510",
      "Show Azazels' Rage charge bar",
      "Show a custom charge bar that lets you know how close you are to the blast firing.",
    ],
  ],
];

// 0511-0520
export const QUALITY_OF_LIFE_CHANGES_2: ConfigDescriptions = [
  [
    "combinedDualityDoors", // 498
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0511",
      "Duality revamp",
      "Make Duality combine the Devil Room door and the Angel Room door together.",
    ],
  ],
  [
    "removeFortuneCookieBanners", // 557
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0512",
      "Remove Fortune Cookie UI",
      "Remove the banners that occur when you use Fortune Cookie.",
    ],
  ],
  [
    "showDreamCatcherItem", // 566
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0513",
      "Show the Dream Catcher item",
      "If you have Dream Catcher, draw the Treasure Room item while in the starting room of the floor.",
    ],
  ],
  [
    "fastLuna", // 589
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0514",
      "Fast Luna",
      "Make Moonlights from Luna able to be entered as soon as they spawn.",
    ],
  ],
  [
    "fadeVasculitisTears", // 657
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0515",
      "Fade Vasculitis tears",
      "Fade the tears that explode out of enemies when you have Vasculitis.",
    ],
  ],
  [
    "fastVanishingTwin", // 697
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0516",
      "Fast Vanishing Twin",
      "Speed up the Vanishing Twin familiar by replacing it with a custom implementation.",
    ],
  ],
  [
    "flipCustom", // 711
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0517",
      "Custom Flip",
      "Replace Flip with a custom version that works on every item and properly shows what each item will change into.",
    ],
  ],
  [
    "removePerfectionVelocity", // 145
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0518",
      "Remove Perfection velocity",
      "Make the Perfection trinket spawn in a stationary spot so that it won't go over a pit.",
    ],
  ],
  [
    "removePerfectionOnEndFloors", // 145
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0519",
      "Remove Perfection at the end",
      "Prevent the Perfection trinket from spawning on the final floor of a run.",
    ],
  ],
  [
    "automaticItemInsertion",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0520",
      "Automatically insert pickups",
      "When taking an item that drops pickups, automatically insert them into your inventory.",
    ],
  ],
];

// 0521-0530
export const QUALITY_OF_LIFE_CHANGES_3: ConfigDescriptions = [
  [
    "chargePocketItemFirst",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0521",
      "Charge the Pocket item first",
      "Make batteries charge the pocket item first over the active item.",
    ],
  ],
  [
    "showMaxFamiliars",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0522",
      "Show max familiars",
      "Show an icon on the UI when you have the maximum amount of familiars (i.e. 64).",
    ],
  ],
  [
    "showPills",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0523",
      "Remember pills",
      "Hold the map button to see a list of identified pills for easy reference.",
    ],
  ],
  [
    "fadeDevilStatue",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0524",
      "Fade Devil statue",
      "Fade the statue in a Devil Room if there are pickups behind it.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Start in the center",
      "On a new run, start in the center of the room (instead of at the bottom).",
    ],
  ],
];

// 0601-0610
export const GAMEPLAY_CHANGES: ConfigDescriptions = [
  [
    "extraStartingItems",
    [
      ModConfigMenuOptionType.TEXT,
      "0601",
      "Extra Treasure Room Items",
      "Puts several extra good items in the Treasure Room pool to make finding a starting item easier.",
    ],
  ],
  [
    "consistentTrollBombs",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0602",
      "Consistent troll bombs",
      "Make Troll Bombs and Mega Troll Bombs always have a fuse timer of exactly 2 seconds.",
    ],
  ],
  [
    "pillsCancelAnimations",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0603",
      "Pills cancel animations",
      "Make Power Pill and Horf! cancel animations like all the other pills do.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Nerf Card Reading",
      "Make Card Reading no longer spawn portals on Womb 2 and beyond.",
    ],
  ],
];

// n/a
export const REMOVALS: ConfigDescriptions = [
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove Mercurius",
      "It is incredibly powerful and not very skill-based. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove TMTRAINER",
      "It can trivialize runs and cause softlocks/crashes. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove glitched items",
      "They can trivialize runs and cause softlocks/crashes. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove Karma trinket",
      "Since all Donation Machines are removed, it has no effect. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove Amnesia and ??? pills",
      "Since curses are automatically removed, these pills have no effect. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove unbalanced Void synergies",
      "Make Mega Blast and Mega Mush removed from pools if the player starts with Void.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove Mom's Knife",
      "Remove Mom's Knife from the Treasure Room pool specifically.",
    ],
  ],
];

// 0801-0810
export const CUTSCENE_CHANGES: ConfigDescriptions = [
  [
    "fastTeleports",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0801",
      "Fast teleports",
      "Teleport animations are sped up by a factor of 2.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove intro cutscene",
      "Remove the intro cutscene so that you go straight to the main menu upon launching the game.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove ending cutscenes",
      "Remove the cutscenes that play upon completing a run.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove boss cutscenes",
      "Remove the cutscenes that play upon entering a boss room.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      'Remove "giantbook" animations',
      'Remove all "giantbook" style animations (with the exception of Book of Revelations, Satanic Bible, eternal hearts, and rainbow poop).',
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove pausing/unpausing animations",
      "Pause and unpause the game instantaneously.",
    ],
  ],
];

// 0901-0910
export const BUG_FIXES_1: ConfigDescriptions = [
  [
    "keeperHeal",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0901",
      "Fix Keeper + double pennies ",
      "Make double pennies heal Keeper and Tainted Keeper for the proper amount.",
    ],
  ],
  [
    "taintedIsaacCollectibleDelay",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0902",
      "Fix Tainted Isaac chest bugs",
      "Make Tainted Isaac not automatically pick up pedestal items from chests.",
    ],
  ],
  [
    "battery9VoltSynergy",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0903",
      "Fix The Battery + 9 Volt synergy",
      "Make these items work together properly.",
    ],
  ],
  [
    "reverseJusticeFix",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0904",
      "Fix Justice? cards",
      "Prevent Justice? cards from needlessly removing items from pools.",
    ],
  ],
  [
    "preventUltraSecretRoomSoftlock",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0905",
      "Fix Ultra Secret Rooms softlocks",
      "A fool card will be spawned in Ultra Secret Rooms with no doors.",
    ],
  ],
  [
    "batteryBumFix",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0906",
      "Fix Battery Bums",
      "Make Battery Bums properly charge pocket active items.",
    ],
  ],
  [
    "teleportInvalidEntrance",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0907",
      "Fix bad teleports",
      "Never teleport to a non-existent entrance.",
    ],
  ],
  [
    "removeInvalidPitfalls",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0908",
      "Remove invalid Pitfalls",
      "Remove buggy Pitfalls that incorrectly respawn after not having time to finish their disappearing animation.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix crawl space exits",
      "Returning from a crawl space outside of the grid will no longer send you to the wrong room. (This is part of Fast-Travel.)",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix I AM ERROR exits",
      "Exits in an I AM ERROR room will be blocked if the room is not clear. (This is part of Fast-Travel.)",
    ],
  ],
];

// 0911-0920
export const BUG_FIXES_2: ConfigDescriptions = [
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Seeded teleports",
      "Make Teleport!, Cursed Eye, Broken Remote, and Telepills teleports seeded properly.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "",
      "Seeded GB Bug",
      "Make morphed GB Bug pickups seeded in order.",
    ],
  ],
];

// 1001-1010
export const GRAPHIC_CHANGES_1: ConfigDescriptions = [
  [
    "paschalCandle", // 3.221
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1001",
      "Better Paschal Candle",
      'Make Paschal Candle "fill up" so that you can easily tell at a glance if it is maxed out.',
    ],
  ],
  [
    "scaredHeart", // 5.10.9
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1002",
      "Distinct Scared Hearts",
      "Make Sticky Nickels have a custom animation so that they are easier to identify.",
    ],
  ],
  [
    "stickyNickel", // 5.20.6
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1003",
      "Distinct Sticky Nickels",
      "Make Sticky Nickels have a custom effect so that they are easier to identify.",
    ],
  ],
  [
    "uniqueCardBacks", // 5.300
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1004",
      "Unique card backs",
      "Make some cards have a unique card back or modified graphic so that they are easier to identify.",
    ],
  ],
  [
    "hudOffsetFix",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1005",
      "Fix HUD offset",
      "Fix the default HUD offset to be the same as it was in Afterbirth+.",
    ],
  ],
  [
    "holidayHats",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1006",
      "Holiday hats",
      "Show a festive hat during a holiday.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix Heart UI",
      "Make empty red hearts easier to see.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Consistent pill orientation",
      "Pills now have a consistent orientation on the ground.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better pill colors",
      "The color of some pills are changed to make them easier to identify at a glance.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Purity colors",
      "The colors of some Purity auras have been changed to make them easier to see. Speed is now green and range is now yellow.",
    ],
  ],
];

// 1011-1020
export const GRAPHIC_CHANGES_2: ConfigDescriptions = [
  [
    "", // 5.100.57, 5.100.128, 5.100.364
    [
      ModConfigMenuOptionType.BOOLEAN,
      "",
      "Fix fly colors",
      "Make the Distant Admiration, Forever Alone, and Friend Zone sprites match the color of the familiars.",
    ],
  ],
  [
    "", // 5.100.245
    [
      ModConfigMenuOptionType.BOOLEAN,
      "",
      "Better 20/20",
      "Make the 20/20 sprite easier to see.",
    ],
  ],
  [
    "", // 5.100.651
    [
      ModConfigMenuOptionType.BOOLEAN,
      "",
      "Better Star of Bethlehem",
      "Make the Star of Bethlehem sprite more distinct from Eden's Soul.",
    ],
  ],
  [
    "", // 5.350.75
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Error trinket",
      "Make the Error trinket sprite have an outline.",
    ],
  ],
  [
    "", // 5.350.115
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Locust of Famine",
      "Make the Locust of Famine sprite match the color of the flies.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Dirty Bedroom icon",
      "Make the icon for a dirty bedroom a cobweb so that it is more distinct from a clean bedroom.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Speedrunning controls graphic",
      "The controls graphic in the start room is changed to be speedrunning-themed.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove the in-game timer",
      "Hold Tab to see a custom in-game timer.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Reduce opacity of fortunes",
      "Set the opacity for fortunes and custom seeds to 15%.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove fog",
      "Make elements on the screen easier to see and increase performance.",
    ],
  ],
];

// 1101-1110
export const SOUND_CHANGES: ConfigDescriptions = [
  [
    "silenceMomDad",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1101",
      "Silence mom & dad",
      "The audio clips of mom and dad on the Ascent are silenced.",
    ],
  ],
];

// 1201-1210
export const OTHER_FEATURES: ConfigDescriptions = [
  [
    "shadows",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1201",
      "Draw opponent's shadows",
      "Enable the drawing of race opponents as faded sprites during seeded races.",
    ],
  ],
  [
    "chat",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1202",
      "Draw race chat",
      "Enable the drawing of race chat on the screen.",
    ],
  ],
  [
    "roll",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1203",
      "Enable rolling",
      "Turn on experimental rolling, which will invalidate your run for online races and offline leaderboards.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "",
      "Force faded console display",
      'Enabled the "faded console display" feature in the "options.ini" file, which allows you to visually see when an error in the game happens.',
    ],
  ],
];

export const ALL_CONFIG_DESCRIPTIONS: ConfigDescriptions = [
  ...MAJOR_CHANGES,
  ...CHARACTER_CHANGES,
  ...BOSS_CHANGES_1,
  ...BOSS_CHANGES_2,
  ...BOSS_CHANGES_3,
  ...ENEMY_CHANGES_1,
  ...ENEMY_CHANGES_2,
  ...QUALITY_OF_LIFE_CHANGES_1,
  ...QUALITY_OF_LIFE_CHANGES_2,
  ...QUALITY_OF_LIFE_CHANGES_3,
  ...GAMEPLAY_CHANGES,
  ...CUTSCENE_CHANGES,
  ...REMOVALS,
  ...BUG_FIXES_1,
  ...BUG_FIXES_2,
  ...GRAPHIC_CHANGES_1,
  ...GRAPHIC_CHANGES_2,
  ...SOUND_CHANGES,
  ...OTHER_FEATURES,
];

export const ALL_HOTKEY_DESCRIPTIONS: ConfigDescriptions = [...CUSTOM_HOTKEYS];
