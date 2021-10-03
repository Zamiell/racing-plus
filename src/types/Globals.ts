import RaceData from "../features/race/types/RaceData";
import RaceVars from "../features/race/types/RaceVars";
import ChatMessage from "./ChatMessage";

export default class Globals {
  debug = false;

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

  chatMessages: ChatMessage[] = [];

  /** Race variables that are set via the client communicating with us over a socket. */
  race = new RaceData();

  /** Extra variables for races that are separate from what the client knows about. */
  raceVars = new RaceVars();

  constructor() {
    this.fontDroid.Load("font/droid.fnt");
    this.fontPF.Load("font/pftempestasevencondensed.fnt");
  }
}
