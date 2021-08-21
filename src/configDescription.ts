import Config from "./types/Config";
import Hotkeys from "./types/Hotkeys";

export type ConfigDescriptionArray = Array<
  [
    keyof Config | keyof Hotkeys | null,
    [ModConfigMenuOptionType, string, string, string],
  ]
>;

// 01X
export const MAJOR_CHANGES: ConfigDescriptionArray = [
  [
    "clientCommunication",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "000",
      "Enable client support",
      "Allow the mod to talk with the Racing+ client. You can disable this if you are not using the client to very slightly reduce lag.",
    ],
  ],
  [
    "startWithD6",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "001",
      "Start with the D6",
      "Makes each character start with a D6 or a pocket D6.",
    ],
  ],
  [
    "disableCurses",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "002",
      "Disable curses",
      "Disables all curses, like Curse of the Maze.",
    ],
  ],
  [
    "betterDevilAngelRooms",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "003",
      "Customized Devil/Angel Rooms",
      "Improves the quality and variety of Devil Rooms & Angel Rooms.",
    ],
  ],
  [
    "freeDevilItem",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "004",
      "Free devil item",
      "Awards a Your Soul trinket upon entering the Basement 2 Devil Room if you have not taken damage.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Extra Treasure Room Items",
      "Puts several extra good items in the Treasure Room pool to make finding a starting item easier.",
    ],
  ],
  [
    "fastReset",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "005",
      "Fast reset",
      "Instantaneously restart the game as soon as you press the R key.",
    ],
  ],
  [
    "fastClear",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "006",
      "Fast room clear",
      "Makes doors open at the beginning of the death animation instead of at the end.",
    ],
  ],
  [
    "fastTravel",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "007",
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
export const CUSTOM_HOTKEYS: ConfigDescriptionArray = [
  [
    "fastDropAllKeyboard",
    [
      ModConfigMenuOptionType.KEYBIND_KEYBOARD,
      "",
      "Fast drop",
      "Drop all of your items instantaneously.",
    ],
  ],
  [
    "fastDropAllController",
    [
      ModConfigMenuOptionType.KEYBIND_CONTROLLER,
      "",
      "Fast drop",
      "Drop all of your items instantaneously.",
    ],
  ],
  [
    "fastDropTrinketsKeyboard",
    [
      ModConfigMenuOptionType.KEYBIND_KEYBOARD,
      "",
      "Fast drop (pocket)",
      "Drop your pocket items instantaneously.",
    ],
  ],
  [
    "fastDropTrinketsController",
    [
      ModConfigMenuOptionType.KEYBIND_CONTROLLER,
      "",
      "Fast drop (trinkets)",
      "Drop your trinkets instantaneously.",
    ],
  ],
  [
    "fastDropPocketKeyboard",
    [
      ModConfigMenuOptionType.KEYBIND_KEYBOARD,
      "",
      "Fast drop (pocket)",
      "Drop your pocket items instantaneously.",
    ],
  ],
  [
    "fastDropPocketController",
    [
      ModConfigMenuOptionType.KEYBIND_CONTROLLER,
      "",
      "Fast drop (pocket)",
      "Drop your pocket items instantaneously.",
    ],
  ],
];

// 02X
export const CHARACTER_CHANGES: ConfigDescriptionArray = [
  [
    "judasAddBomb",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "021",
      "Add a bomb to Judas",
      "Makes Judas start with 1 bomb instead of 0 bombs.",
    ],
  ],
  [
    "samsonDropHeart",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "022",
      "Make Samson drop his trinket",
      "Makes Samson automatically drop his Child's Heart trinket at the beginning of a run.",
    ],
  ],
  [
    "taintedKeeperMoney",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "023",
      "Tainted Keeper extra money",
      "Make Tainted Keeper start with 15 cents. This gives him enough money to start a Treasure Room item.",
    ],
  ],
  [
    "showEdenStartingItems",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "024",
      "Show Eden's starting items",
      "Draw both of Eden's starting items on the screen while in the first room.",
    ],
  ],
];

// 03X
export const BOSS_CHANGES: ConfigDescriptionArray = [
  [
    "fadeBosses",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "031",
      "Fade dead bosses",
      "Make bosses faded during their death animation so that you can see the dropped item.",
    ],
  ],
  [
    "stopDeathSlow",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "032",
      "Stop Death's slow attack",
      "Stop Death from performing the attack that reduces your speed by a factor of 2.",
    ],
  ],
  [
    "fastHaunt",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "033",
      "Fast The Haunt",
      "Some animations in The Haunt fight are sped up.",
    ],
  ],
  [
    "fastSatan",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "034",
      "Fast Satan",
      "All of the waiting during the Satan Fight is removed.",
    ],
  ],
  [
    "fastBigHorn",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "035",
      "Fast Big Horn",
      "Make Big horn spend less time underground.",
    ],
  ],
  [
    "removeLambBody",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "036",
      "Remove The Lamb body",
      "Remove The Lamb body entirely once it dies.",
    ],
  ],
  [
    "stopVictoryLapPopup",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "037",
      "Stop the Victory Lap popup",
      "Prevent the Victory Lap popup from appearing once you defeat The Lamb.",
    ],
  ],
  [
    "openHushDoor",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "038",
      "Open the Hush door",
      "Automatically open the big door to Hush when you arrive on the Blue womb.",
    ],
  ],
];

// 04X
export const ENEMY_CHANGES: ConfigDescriptionArray = [
  [
    "replaceCodWorms",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "041",
      "Replace Cod Worms",
      "Cod Worms are replaced with Para-Bites.",
    ],
  ],
  [
    "disableInvulnerability",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "042",
      "Disable invulnerability",
      "Wizoobs, Red Ghosts, and Lil' Haunts no longer have invulnerability frames after spawning.",
    ],
  ],
  [
    "fastGhosts",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "043",
      "Fast ghosts",
      "Wizoobs and Red Ghosts have faster attack patterns.",
    ],
  ],
  [
    "fastHands",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "044",
      "Fast hands",
      "Mom's Hands and Mom's Dead Hands have faster attack patterns.",
    ],
  ],
  [
    "appearHands",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "045",
      "Reveal hands",
      "Mom's Hands and Mom's Dead Hands will play an \"Appear\" animation.",
    ],
  ],
  [
    "globinSoftlock",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "046",
      "Fix Globin softlocks",
      "Make Globins permanently die on the 4th regeneration to prevent Epic Fetus softlocks.",
    ],
  ],
  [
    "removeTreasureRoomEnemies",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "047",
      "Remove Treasure Room enemies",
      "Remove all enemies from Treasure Rooms.",
    ],
  ],
];

// 05X / 06X
export const QUALITY_OF_LIFE_CHANGES_1: ConfigDescriptionArray = [
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Start in the center",
      "On a new run, start in the center of the room (instead of at the bottom).",
    ],
  ],
  [
    "speedUpFadeIn",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "051",
      "Speed-up new run fade-ins",
      "Speed-up the fade-in that occurs at the beginning of a new run.",
    ],
  ],
  [
    "easyFirstFloorItems",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "052",
      "Easier first floor items",
      "Slightly change first floor Treasure Rooms so that you never have to spend a bomb or walk on spikes.",
    ],
  ],
  [
    "changeCreepColor",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "053",
      "Consistent creep color",
      "Change enemy red creep to green and change friendly green creep to red.",
    ],
  ],
  [
    "subvertTeleport",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "054",
      "Subvert disruptive teleports",
      "Stop the disruptive teleport that happens when entering a room with Gurdy, Mom, Mom's Heart, or It Lives!",
    ],
  ],
  [
    "deleteVoidPortals",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "055",
      "Delete Void portals",
      "Automatically delete the Void portals that spawn after bosses.",
    ],
  ],
  [
    "showNumSacrifices",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "056",
      "Show the number of sacrifices",
      "Show the number of sacrifices in the top-left when in a Sacrifice Room.",
    ],
  ],
  [
    "removeFortuneCookieBanners",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "057",
      "Remove Fortune Cookie banners",
      "Remove Fortune Cookie banners when don't get any pickups.",
    ],
  ],
  [
    "showDreamCatcherItem",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "058",
      "Show the Dream Catcher item",
      "If you have Dream Catcher, draw the Treasure Room item while in the starting room of the floor.",
    ],
  ],
  [
    "fadeVasculitisTears",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "059",
      "Fade Vasculitis tears",
      "Fade the tears that explode out of enemies when you have Vasculitis.",
    ],
  ],
];

export const QUALITY_OF_LIFE_CHANGES_2: ConfigDescriptionArray = [
  [
    "removePerfectionVelocity",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "060",
      "Remove Perfection velocity",
      "Make the Perfection trinket spawn in a stationary spot so that it won't go over a pit.",
    ],
  ],
  [
    "automaticItemInsertion",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "061",
      "Automatically insert pickups",
      "When taking an item that drops pickups, automatically insert them into your inventory.",
    ],
  ],
  [
    "showMaxFamiliars",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "062",
      "Show max familiars",
      "Show an icon on the UI when you have the maximum amount of familiars (i.e. 64).",
    ],
  ],
  [
    "showPills",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "063",
      "Remember pills",
      "Hold the map button to see a list of identified pills for easy reference.",
    ],
  ],
];

// 07X
export const GAMEPLAY_CHANGES: ConfigDescriptionArray = [
  [
    "sawblade",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "071",
      "Sawblade",
      "An extra orbital item added to the Treasure Room pool.",
    ],
  ],
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
      "Make Mega Blast and Magic Mush removed from pools if the player starts with Void.",
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
  [
    "combinedDualityDoors",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "072",
      "Duality revamp",
      "Make Duality combine the Devil Room door and the Angel Room door together.",
    ],
  ],
  [
    "consistentTrollBombs",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "073",
      "Consistent troll bombs",
      "Make Troll Bombs and Mega Troll Bombs always have a fuse timer of exactly 2 seconds.",
    ],
  ],
  [
    "pillsCancelAnimations",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "074",
      "Pills cancel animations",
      "Make Power Pill and Horf! cancel animations like all the other pills do.",
    ],
  ],
];

// 08X
export const CUTSCENE_CHANGES: ConfigDescriptionArray = [
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
    "fastTeleports",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "081",
      "Fast teleports",
      "Teleport animations are sped up by a factor of 2.",
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

// 09X
export const BUG_FIXES: ConfigDescriptionArray = [
  [
    "teleportInvalidEntrance",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "091",
      "Fix bad teleports",
      "Never teleport to a non-existent entrance.",
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
      "Fix Duality not giving both rooms",
      "Many boss rooms that only have 2 possible doors have been adjusted to have 3 doors.",
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
];

// 10X
export const GRAPHIC_CHANGES: ConfigDescriptionArray = [
  [
    "flyItemSprites",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "101",
      "Fix fly colors",
      "Make the Distant Admiration, Forever Alone, and Friend Zone sprites match the color of the familiars.",
    ],
  ],
  [
    "twentyTwenty",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "102",
      "Better 20/20",
      "Make the 20/20 sprite easier to see.",
    ],
  ],
  [
    "starOfBethlehem",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "103",
      "Better Star of Bethlehem",
      "Make the Star of Bethlehem sprite more distinct from Eden's Soul.",
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
    "paschalCandle",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "104",
      "Better Paschal Candle",
      'Paschal Candle now "fills up" so that you can easily tell at a glance if it is maxed out.',
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
      "Speedrunning controls graphic",
      "The controls graphic in the start room is changed to be speedrunning-themed.",
    ],
  ],
];

// 11X
export const SOUND_CHANGES: ConfigDescriptionArray = [
  [
    "silenceMomDad",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "111",
      "Silence mom & dad",
      "The audio clips of mom and dad on the Ascent are silenced.",
    ],
  ],
];

// 12X
export const OTHER_FEATURES: ConfigDescriptionArray = [
  [
    "customConsole",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "121",
      "Enable the custom console",
      "Press enter to bring up a custom console that is better than the vanilla console. (not finished yet)",
    ],
  ],
];

export const ALL_CONFIG_DESCRIPTIONS = [
  ...MAJOR_CHANGES,
  ...CHARACTER_CHANGES,
  ...BOSS_CHANGES,
  ...ENEMY_CHANGES,
  ...QUALITY_OF_LIFE_CHANGES_1,
  ...QUALITY_OF_LIFE_CHANGES_2,
  ...GAMEPLAY_CHANGES,
  ...CUTSCENE_CHANGES,
  ...BUG_FIXES,
  ...GRAPHIC_CHANGES,
  ...SOUND_CHANGES,
  ...OTHER_FEATURES,
];

export const ALL_HOTKEY_DESCRIPTIONS = [...CUSTOM_HOTKEYS];
