import { game } from "isaacscript-common";
import { ChatMessage } from "../types/ChatMessage";
import { RaceData } from "./RaceData";
import { RaceVars } from "./RaceVars";

export class Globals {
  debug = false;

  // Cached API functions
  g = game;
  l = game.GetLevel();
  r = game.GetRoom();
  seeds = game.GetSeeds();
  itemPool = game.GetItemPool();
  readonly fonts = {
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
