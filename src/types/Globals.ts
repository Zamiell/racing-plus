import RaceData from "../features/race/types/RaceData";
import RaceVars from "../features/race/types/RaceVars";
import SpeedrunData from "../features/speedrun/types/SpeedrunData";

export default class Globals {
  debug = true;

  // Cached API functions
  g = Game();
  l = Game().GetLevel();
  r = Game().GetRoom();
  seeds = Game().GetSeeds();
  itemPool = Game().GetItemPool();
  itemConfig = Isaac.GetItemConfig();
  sfx = SFXManager();
  music = MusicManager();
  fontDroid = Font();
  fontPF = Font();

  /** Variables that are reset at the beginning of every run. */
  run = {
    /**
     * Whether or not to restart the run on the next frame.
     * This variable is used because the game prevents you from executing a "restart" console command
     * while in the PostGameStarted callback.
     */
    restart: false,

    roomsEntered: 0,
  };

  /** Race variables that are set via the client communicating with us over a socket. */
  race = new RaceData();

  /** Extra variables for races that are separate from what the client knows about. */
  raceVars = new RaceVars();

  speedrun = new SpeedrunData();

  constructor() {
    this.fontDroid.Load("font/droid.fnt");
    this.fontPF.Load("font/pftempestasevencondensed.fnt");
  }
}
