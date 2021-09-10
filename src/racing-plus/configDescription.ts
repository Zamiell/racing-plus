import Config from "./types/Config";
import Hotkeys from "./types/Hotkeys";

export type ConfigDescriptions = Array<
  [
    keyof Config | keyof Hotkeys | null,
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
      "Replace the fade-in and fade-out with a custom animation where you jump out of a hole. Also, replace the crawlspace animation.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Room fixes",
      "Fixes various softlocks and bugs. This cannot be disabled because it affects the STB files.",
    ],
  ],
  [
    null,
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
      ModConfigMenuOptionType.KEYBIND_KEYBOARD,
      "",
      "Fast drop",
      "Drop all of your items instantaneously.",
    ],
  ],
  [
    "fastDropTrinkets",
    [
      ModConfigMenuOptionType.KEYBIND_KEYBOARD,
      "",
      "Fast drop (trinkets)",
      "Drop your trinkets instantaneously.",
    ],
  ],
  [
    "fastDropPocket",
    [
      ModConfigMenuOptionType.KEYBIND_KEYBOARD,
      "",
      "Fast drop (pocket)",
      "Drop your pocket items instantaneously.",
    ],
  ],
  [
    "schoolbagSwitch",
    [
      ModConfigMenuOptionType.KEYBIND_KEYBOARD,
      "",
      "Switch Schoolbag items",
      "Switch between Schoolbag items without swapping cards or switching to The Soul.",
    ],
  ],
  [
    "autofire",
    [
      ModConfigMenuOptionType.KEYBIND_KEYBOARD,
      "",
      "Toggle autofire",
      "Enable autofire, which toggles the fire input on every frame.",
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
    "lostShowHealth", // 10
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0204",
      "Show The Lost hearts on the UI",
      "Force the heart UI to display when playing as The Lost.",
    ],
  ],
  [
    "lostUseHolyCard", // 31
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0205",
      "Automatically use the Holy Card",
      "Automatically use the Holy Card when starting a run as Tainted Lost.",
    ],
  ],
  [
    "taintedKeeperMoney", // 33
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0206",
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
    "killExtraEnemies",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0302",
      "Fade dead bosses",
      "Make bosses faded during their death animation so that you can see the dropped item.",
    ],
  ],
  [
    "stopDeathSlow", // 66
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0303",
      "Stop Death's slow attack",
      "Stop Death from performing the attack that reduces your speed by a factor of 2.",
    ],
  ],
  [
    "fastSatan", // 84
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0304",
      "Fast Satan",
      "All of the waiting during the Satan Fight is removed.",
    ],
  ],
  [
    "fastHaunt", // 260
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0305",
      "Fast The Haunt",
      "Some animations in The Haunt fight are sped up.",
    ],
  ],
  [
    "removeLambBody", // 273
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0306",
      "Remove The Lamb body",
      "Remove The Lamb body entirely once it dies.",
    ],
  ],
  [
    "stopVictoryLapPopup", // 273
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0307",
      "Stop the Victory Lap popup",
      "Prevent the Victory Lap popup from appearing once you defeat The Lamb.",
    ],
  ],
  [
    "openHushDoor", // 407
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0308",
      "Open the Hush door",
      "Automatically open the big door to Hush when you arrive on the Blue womb.",
    ],
  ],
  [
    "fastBigHorn", // 411
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0309",
      "Fast Big Horn",
      "Make Big Horn spend less time underground.",
    ],
  ],
  [
    "fastColostomia", // 917
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0310",
      "Fast Colostomia",
      "Make Colostomia appear instantly.",
    ],
  ],
];

// 0311-0320
export const BOSS_CHANGES_2: ConfigDescriptions = [
  [
    "fastDogma", // 950
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0311",
      "Fast Dogma",
      "Automatically skip Dogma's death cutscene.",
    ],
  ],
  [
    null, // 274
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fast Mega Satan",
      "Remove some of the animations in the Mega Satan fight.",
    ],
  ],
  [
    null, // 274
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Prevent Mega Satan ending",
      "Defeating Mega Satan no longer has a chance to immediately end the run.",
    ],
  ],
  [
    null, // 407
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fast Hush",
      'Make Hush no longer play an "Appear" animation.',
    ],
  ],
  [
    null, // 951
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Prevent The Beast ending",
      "Defeating The Beast no longer has a chance to immediately end the run.",
    ],
  ],
];

// 0401-0410
export const ENEMY_CHANGES: ConfigDescriptions = [
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
      "Make shadow attacks more clear",
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
    "holyMantleUI", // 313
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0507",
      "Show Holy Mantle on the hearts UI",
      "Show the presence of a Holy Mantle shield on the hearts UI.",
    ],
  ],
  [
    "leadPencilChargeBar", // 444
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0508",
      "Show Holy Mantle on the hearts UI",
      "Show the presence of a Holy Mantle shield on the hearts UI.",
    ],
  ],
  [
    "combinedDualityDoors", // 498
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0509",
      "Duality revamp",
      "Make Duality combine the Devil Room door and the Angel Room door together.",
    ],
  ],
  [
    "removeFortuneCookieBanners", // 557
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0510",
      "Remove Fortune Cookie banners",
      "Remove Fortune Cookie banners when don't get any pickups.",
    ],
  ],
];

// 0511-0520
export const QUALITY_OF_LIFE_CHANGES_2: ConfigDescriptions = [
  [
    "showDreamCatcherItem", // 566
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0511",
      "Show the Dream Catcher item",
      "If you have Dream Catcher, draw the Treasure Room item while in the starting room of the floor.",
    ],
  ],
  [
    "fastLuna", // 589
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0512",
      "Fast Luna",
      "Make Moonlights from Luna able to be entered as soon as they spawn.",
    ],
  ],
  [
    "fadeVasculitisTears", // 657
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0513",
      "Fade Vasculitis tears",
      "Fade the tears that explode out of enemies when you have Vasculitis.",
    ],
  ],
  [
    "removePerfectionVelocity", // 145
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0514",
      "Remove Perfection velocity",
      "Make the Perfection trinket spawn in a stationary spot so that it won't go over a pit.",
    ],
  ],
  [
    "removePerfectionOnEndFloors", // 145
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0515",
      "Remove Perfection on end floors",
      "Prevent the Perfection trinket from spawning on the final floor of a run.",
    ],
  ],
  [
    "automaticItemInsertion",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0516",
      "Automatically insert pickups",
      "When taking an item that drops pickups, automatically insert them into your inventory.",
    ],
  ],
  [
    "chargePocketItemFirst",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0517",
      "Charge the Pocket item first",
      "Make batteries charge the pocket item first over the active item.",
    ],
  ],
  [
    "showMaxFamiliars",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0518",
      "Show max familiars",
      "Show an icon on the UI when you have the maximum amount of familiars (i.e. 64).",
    ],
  ],
  [
    "showPills",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0519",
      "Remember pills",
      "Hold the map button to see a list of identified pills for easy reference.",
    ],
  ],
  [
    "fadeDevilStatue",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0520",
      "Fade Devil statue",
      "Fade the statue in a Devil Room if there are pickups behind it.",
    ],
  ],
];

// 0521-0530
export const QUALITY_OF_LIFE_CHANGES_3: ConfigDescriptions = [
  [
    null,
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
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Sawblade",
      "An extra orbital item is added to the Treasure Room pool.",
    ],
  ],
  [
    null,
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
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove Mercurius",
      "It is incredibly powerful and not very skill-based. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove TMTRAINER",
      "It can trivialize runs and cause softlocks/crashes. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove glitched items",
      "They can trivialize runs and cause softlocks/crashes. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove Karma trinket",
      "Since all Donation Machines are removed, it has no effect. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove Amnesia and ??? pills",
      "Since curses are automatically removed, these pills have no effect. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove unbalanced Void synergies",
      "Make Mega Blast and Mega Mush removed from pools if the player starts with Void.",
    ],
  ],
  [
    null,
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
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove intro cutscene",
      "Remove the intro cutscene so that you go straight to the main menu upon launching the game.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove ending cutscenes",
      "Remove the cutscenes that play upon completing a run.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove boss cutscenes",
      "Remove the cutscenes that play upon entering a boss room.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      'Remove "giantbook" animations',
      'Remove all "giantbook" style animations (with the exception of Book of Revelations, Satanic Bible, eternal hearts, and rainbow poop).',
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove pausing/unpausing animations",
      "Pause and unpause the game instantaneously.",
    ],
  ],
];

// 0901-0910
export const BUG_FIXES: ConfigDescriptions = [
  [
    "battery9VoltSynergy",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0901",
      "Fix The Battery + 9 Volt synergy",
      "Make these items work together properly.",
    ],
  ],
  [
    "teleportInvalidEntrance",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0902",
      "Fix bad teleports",
      "Never teleport to a non-existent entrance.",
    ],
  ],
  [
    "removeInvalidPitfalls",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0903",
      "Remove invalid Pitfalls",
      "Remove buggy Pitfalls that incorrectly respawn after not having time to finish their disappearing animation.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix shop Restock Machines",
      "Restock Machines are supposed to appear 25% of the time, but this does not happen in vanilla.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix Black Market entrances",
      "Entering a Black Market will no longer send you to the I AM ERROR room. (This is a bug introduced in v820.)",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix crawlspace exits",
      "Returning from a crawlspace outside of the grid will no longer send you to the wrong room. (This is part of Fast-Travel.)",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix I AM ERROR exits",
      "Exits in an I AM ERROR room will be blocked if the room is not clear. (This is part of Fast-Travel.)",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Seeded teleports",
      "Make Teleport!, Cursed Eye, Broken Remote, and Telepills teleports seeded properly.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.BOOLEAN,
      "",
      "Fix infinite Genesis",
      "Saving & quitting in a Genesis room will now delete all collectibles in the room to prevent players from exploiting the Genesis bug.",
    ],
  ],
  [
    null,
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
    "flyItemSprites",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1001",
      "Fix fly colors",
      "Make the Distant Admiration, Forever Alone, and Friend Zone sprites match the color of the familiars.",
    ],
  ],
  [
    "twentyTwenty",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1002",
      "Better 20/20",
      "Make the 20/20 sprite easier to see.",
    ],
  ],
  [
    "starOfBethlehem",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1003",
      "Better Star of Bethlehem",
      "Make the Star of Bethlehem sprite more distinct from Eden's Soul.",
    ],
  ],
  [
    "paschalCandle",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1004",
      "Better Paschal Candle",
      'Make Paschal Candle "fill up" so that you can easily tell at a glance if it is maxed out.',
    ],
  ],
  [
    "scaredHeart",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1005",
      "Distinct Scared Hearts",
      "Make Sticky Nickels have a custom animation so that they are easier to identify.",
    ],
  ],
  [
    "stickyNickel",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1006",
      "Distinct Sticky Nickels",
      "Make Sticky Nickels have a custom effect so that they are easier to identify.",
    ],
  ],
  [
    "uniqueCardBacks",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1007",
      "Unique card backs",
      "Make some cards have a unique card back or modified graphic so that they are easier to identify.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix Locust of Famine",
      "Make the Locust of Famine sprite match the color of the flies.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix Error",
      "Make the Error trinket sprite have an outline.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Consistent pill orientation",
      "Pills now have a consistent orientation on the ground.",
    ],
  ],
];

// 1011-1020
export const GRAPHIC_CHANGES_2: ConfigDescriptions = [
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better pill colors",
      "The color of some pills are changed to make them easier to identify at a glance.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Purity colors",
      "The colors of some Purity auras have been changed to make them easier to see. Speed is now green and range is now yellow.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Dirty Bedroom icon",
      "Make the icon for a dirty bedroom a cobweb so that it is more distinct from a clean bedroom.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Speedrunning controls graphic",
      "The controls graphic in the start room is changed to be speedrunning-themed.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove the in-game timer",
      "Hold Tab to see a custom in-game timer.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Reduce opacity of fortunes",
      "Set the opacity for fortunes and custom seeds to 15%.",
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
    "customConsole",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1201",
      "Enable the custom console",
      "Press enter to bring up a custom console that is better than the vanilla console. (not finished yet)",
    ],
  ],
];

export const ALL_CONFIG_DESCRIPTIONS = [
  ...MAJOR_CHANGES,
  ...CHARACTER_CHANGES,
  ...BOSS_CHANGES_1,
  ...BOSS_CHANGES_2,
  ...ENEMY_CHANGES,
  ...QUALITY_OF_LIFE_CHANGES_1,
  ...QUALITY_OF_LIFE_CHANGES_2,
  ...QUALITY_OF_LIFE_CHANGES_3,
  ...GAMEPLAY_CHANGES,
  ...CUTSCENE_CHANGES,
  ...REMOVALS,
  ...BUG_FIXES,
  ...GRAPHIC_CHANGES_1,
  ...GRAPHIC_CHANGES_2,
  ...SOUND_CHANGES,
  ...OTHER_FEATURES,
];

export const ALL_HOTKEY_DESCRIPTIONS = [...CUSTOM_HOTKEYS];
