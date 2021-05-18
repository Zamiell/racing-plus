const featuresMap = new Map<keyof Config, [string, string, string]>([
  [
    "startWithD6",
    [
      "001",
      "Start with the D6",
      "Makes each character start with a D6 or a pocket D6.",
    ],
  ],
  [
    "disableCurses",
    ["002", "Disable curses", "Disables all curses, like Curse of the Maze."],
  ],
  [
    "extraStartingHealth",
    [
      "003",
      "Give extra starting health",
      "Gives extra health to some characters so that they can consistently take a devil deal.",
    ],
  ],
  [
    "judasAddBomb",
    [
      "004",
      "Add a bomb to Judas",
      "Makes Judas start with 1 bomb instead of 0 bombs.",
    ],
  ],
  [
    "samsonDropHeart",
    [
      "005",
      "Make Samson drop his trinket",
      "Makes Samson automatically drop his Child's Heart trinket at the beginning of a run.",
    ],
  ],
  [
    "fastClear",
    [
      "007",
      "Fast room clear",
      "Makes doors open at the beginning of the death animation instead of at the end.",
    ],
  ],
  [
    "fastReset",
    [
      "010",
      "Fast reset",
      "Instantaneously restart the game as soon as you press the R key.",
    ],
  ],
]);
export default featuresMap;
