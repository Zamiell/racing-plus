import Config from "./types/Config";
import Hotkeys from "./types/Hotkeys";

export type ConfigDescriptionArray = Array<
  [
    keyof Config | keyof Hotkeys | null,
    [ModConfigMenuOptionType, string, string, string],
  ]
>;

export const MAJOR_CHANGES: ConfigDescriptionArray = [
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
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Customized Devil/Angel Rooms",
      "Improves the quality and variety of Devil Rooms & Angel Rooms. This cannot be disabled because it affects the STB files.",
    ],
  ],
  [
    "freeDevilItem",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "003",
      "Free devil item",
      "Awards a Your Soul trinket upon entering the Basement 2 Devil Room if you have not taken damage.",
    ],
  ],
  [
    "fastReset",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "004",
      "Fast reset",
      "Instantaneously restart the game as soon as you press the R key.",
    ],
  ],
  [
    "fastClear4",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "005",
      "Fast room clear (v4)",
      "Makes doors open at the beginning of the death animation instead of at the end.",
    ],
  ],
  [
    "fastTravel",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "006",
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

export const CUSTOM_HOTKEYS: ConfigDescriptionArray = [
  [
    "fastDropAllKeyboard",
    [
      ModConfigMenuOptionType.KEYBIND_KEYBOARD,
      "011",
      "Fast drop",
      "Drop all of your items instantaneously.",
    ],
  ],
  [
    "fastDropAllController",
    [
      ModConfigMenuOptionType.KEYBIND_CONTROLLER,
      "011",
      "Fast drop",
      "Drop all of your items instantaneously.",
    ],
  ],
  [
    "fastDropTrinketsKeyboard",
    [
      ModConfigMenuOptionType.KEYBIND_KEYBOARD,
      "011",
      "Fast drop (pocket)",
      "Drop your pocket items instantaneously.",
    ],
  ],
  [
    "fastDropTrinketsController",
    [
      ModConfigMenuOptionType.KEYBIND_CONTROLLER,
      "011",
      "Fast drop (trinkets)",
      "Drop your trinkets instantaneously.",
    ],
  ],
  [
    "fastDropPocketKeyboard",
    [
      ModConfigMenuOptionType.KEYBIND_KEYBOARD,
      "011",
      "Fast drop (pocket)",
      "Drop your pocket items instantaneously.",
    ],
  ],
  [
    "fastDropPocketController",
    [
      ModConfigMenuOptionType.KEYBIND_CONTROLLER,
      "011",
      "Fast drop (pocket)",
      "Drop your pocket items instantaneously.",
    ],
  ],
];

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

export const ENEMY_CHANGES: ConfigDescriptionArray = [
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
    "replaceCodWorms",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "032",
      "Replace Cod Worms",
      "Cod Worms are replaced with Para-Bites.",
    ],
  ],
  [
    "fastSatan",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "033",
      "Fast Satan",
      "All of the waiting during the Satan Fight is removed.",
    ],
  ],
  [
    "disableInvulnerability",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "034",
      "Disable invulnerability",
      "Wizoobs, Red Ghosts, and Lil' Haunts no longer have invulnerability frames after spawning.",
    ],
  ],
  [
    "fastGhosts",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "035",
      "Fast ghosts",
      "Wizoobs and Red Ghosts have faster attack patterns.",
    ],
  ],
  [
    "fastHands",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "036",
      "Fast hands",
      "Mom's Hands and Mom's Dead Hands have faster attack patterns.",
    ],
  ],
  [
    "appearHands",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "037",
      "Reveal hands",
      "Mom's Hands and Mom's Dead Hands will play an \"Appear\" animation.",
    ],
  ],
];

export const QUALITY_OF_LIFE_CHANGES: ConfigDescriptionArray = [
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
      "041",
      "Speed-up new run fade-ins",
      "Speed-up the fade-in that occurs at the beginning of a new run.",
    ],
  ],
  [
    "showDreamCatcherItem",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "042",
      "Show the Dream Catcher item",
      "If you have Dream Catcher, draw the Treasure Room item while in the starting room of the floor.",
    ],
  ],
  [
    "subvertTeleport",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "043",
      "Subvert disruptive teleports",
      "Stop the disruptive teleport that happens when entering a room with Gurdy, Mom, Mom's Heart, or It Lives!",
    ],
  ],
  [
    "deleteVoidPortals",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "044",
      "Delete Void portals",
      "Automatically delete the Void portals that spawn after bosses.",
    ],
  ],
  [
    "fadeVasculitisTears",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "045",
      "Fade Vasculitis tears",
      "Fade the tears that explode out of enemies when you have Vasculitis.",
    ],
  ],
  [
    "openHushDoor",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "046",
      "Open the Hush door",
      "Automatically open the big door to Hush when you arrive on the Blue womb.",
    ],
  ],
  [
    "showPills",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "047",
      "Remember pills",
      "Hold the map button to see a list of identified pills for easy reference.",
    ],
  ],
  [
    "showMaxFamiliars",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "048",
      "Show max familiars",
      "Show an icon on the UI when you have the maximum amount of familiars (i.e. 64).",
    ],
  ],
];

export const GAMEPLAY_CHANGES: ConfigDescriptionArray = [
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
];

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
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove pausing/unpausing animations",
      "Pause and unpause the game instantaneously.",
    ],
  ],
];

export const BUG_FIXES: ConfigDescriptionArray = [
  [
    "fixTeleportInvalidEntrance",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "071",
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
      "Exits in an I AM ERROR room will be properly blocked if the room is not clear.",
    ],
  ],
];

export const GRAPHIC_CHANGES: ConfigDescriptionArray = [
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Paschal Candle",
      'Paschal Candle now visually "fills up" so that you can easily tell at a glance if it is maxed out.',
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix fly colors",
      "The Distant Admiration, Forever Alone, and Friend Zone sprites now match the color of the actual familiars.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better 20/20",
      "The 20/20 sprite is now easier to see.",
    ],
  ],
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Star of Bethlehem",
      "The Star of Bethlehem sprite is more distinct from Eden's Soul.",
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
      "Speedrunning controls graphic",
      "The controls graphic in the start room is changed to be speedrunning-themed.",
    ],
  ],
];

export const SOUND_CHANGES: ConfigDescriptionArray = [
  [
    null,
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Silence mom & dad",
      "The audio clips of mom and dad on the Ascent are silenced.",
    ],
  ],
];

export const OTHER_FEATURES: ConfigDescriptionArray = [
  [
    "customConsole",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "101",
      "Enable the custom console",
      "Press enter to bring up a custom console that is better than the vanilla console. (not finished yet)",
    ],
  ],
];

export const ALL_CONFIG_DESCRIPTIONS = [
  ...MAJOR_CHANGES,
  ...CHARACTER_CHANGES,
  ...ENEMY_CHANGES,
  ...QUALITY_OF_LIFE_CHANGES,
  ...GAMEPLAY_CHANGES,
  ...CUTSCENE_CHANGES,
  ...BUG_FIXES,
  ...GRAPHIC_CHANGES,
  ...SOUND_CHANGES,
  ...OTHER_FEATURES,
];

export const ALL_HOTKEY_DESCRIPTIONS = [...CUSTOM_HOTKEYS];
