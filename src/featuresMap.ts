import Config from "./types/Config";

const featuresMap: Record<keyof Config, [string, string, string]> = {
  // Major Changes
  startWithD6: [
    "001",
    "Start with the D6",
    "Makes each character start with a D6 or a pocket D6.",
  ],
  disableCurses: [
    "002",
    "Disable curses",
    "Disables all curses, like Curse of the Maze.",
  ],
  freeDevilItem: [
    "003",
    "Free devil item",
    "Awards a Your Soul trinket upon entering the Basement 2 Devil Room if you have not taken damage.",
  ],
  fastClear: [
    "004",
    "Fast room clear",
    "Makes doors open at the beginning of the death animation instead of at the end.",
  ],

  // Custom Hotkeys
  // TODO

  // Gameplay & Quality of Life Changes
  judasAddBomb: [
    "021",
    "Add a bomb to Judas",
    "Makes Judas start with 1 bomb instead of 0 bombs.",
  ],
  samsonDropHeart: [
    "022",
    "Make Samson drop his trinket",
    "Makes Samson automatically drop his Child's Heart trinket at the beginning of a run.",
  ],
  fastReset: [
    "023",
    "Fast reset",
    "Instantaneously restart the game as soon as you press the R key.",
  ],
};
export default featuresMap;
