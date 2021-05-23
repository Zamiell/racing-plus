import Config from "./types/Config";

export type ConfigDescriptionArray = Array<
  [keyof Config, [ModConfigMenuOptionType, string, string, string]]
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
    "fastClear",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "005",
      "Fast room clear",
      "Makes doors open at the beginning of the death animation instead of at the end.",
    ],
  ],
  /*
  [
    "fastTravel",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "005",
      "Fast floor travel",
      "Replace the fade-in and fade-out with a custom animation where you jump out of a hole.",
    ],
  ],
  */
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

export const GAMEPLAY_AND_QUALITY_OF_LIFE_CHANGES: ConfigDescriptionArray = [
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
    "showEdenStartingItems",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "023",
      "Show Eden's starting items",
      "Draw both of Eden's starting items on the screen while in the first room.",
    ],
  ],
  [
    "showDreamCatcherItem",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "024",
      "Show the Dream Catcher item",
      "If you have Dream Catcher, draw the Treasure Room item while in the starting room of the floor.",
    ],
  ],
  [
    "speedUpFadeIn",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "025",
      "Speed-up new run fade-ins",
      "Speed-up the fade-in that occurs at the beginning of a new run.",
    ],
  ],
  [
    "customConsole",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "026",
      "Enable the custom console",
      "Press enter to bring up a custom console that is better than the vanilla console.",
    ],
  ],
];

export const BUG_FIXES: ConfigDescriptionArray = [
  [
    "fixTeleportInvalidEntrance",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "051",
      "Fix bad teleports",
      "Never teleport to a non-existent entrance.",
    ],
  ],
];

export const ALL_DESCRIPTIONS = [
  ...MAJOR_CHANGES,
  ...CUSTOM_HOTKEYS,
  ...GAMEPLAY_AND_QUALITY_OF_LIFE_CHANGES,
  ...BUG_FIXES,
];
