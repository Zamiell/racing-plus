import { RaceData } from "../features/race/types/RaceData";
import { RaceVars } from "../features/race/types/RaceVars";
import { ChatMessage } from "./ChatMessage";

export class Globals {
  debug = true;

  // Cached API functions
  g = Game();
  l = Game().GetLevel();
  r = Game().GetRoom();
  seeds = Game().GetSeeds();
  itemPool = Game().GetItemPool();
  itemConfig = Isaac.GetItemConfig();
  sfx = SFXManager();
  fonts = {
    droid: Font(),
    pf: Font(),
  };

  readonly chatMessages: ChatMessage[] = [];

  /** Race variables that are set via the client communicating with us over a socket. */
  race = new RaceData();

  /** Extra variables for races that are separate from what the client knows about. */
  raceVars = new RaceVars();

  constructor() {
    this.fonts.droid.Load("font/droid.fnt");
    this.fonts.pf.Load("font/pftempestasevencondensed.fnt");
  }
}
