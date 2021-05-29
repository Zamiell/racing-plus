import Config from "./Config";
import { SaveFileState } from "./enums";
import GlobalsRun from "./GlobalsRun";
import Hotkeys from "./Hotkeys";
import RaceData from "./RaceData";
import SpeedrunData from "./SpeedrunData";

export default class Globals {
  debug = false;
  corrupted = false;
  fastClear = false; // TODO remove this

  // Cached API functions
  g = Game();
  l = Game().GetLevel();
  r = Game().GetRoom();
  // "Isaac.GetPlayer()" will return nil if called from the main menu
  // We "lie" and say that it gets set to an EntityPlayer so that we don't have to do non-null
  // assertions everywhere
  // In reality, the value will be set in the PostPlayerInit callback, which should happen before
  // any other code gets run
  p = Isaac.GetPlayer() as EntityPlayer;
  seeds = Game().GetSeeds();
  itemPool = Game().GetItemPool();
  itemConfig = Isaac.GetItemConfig();
  sfx = SFXManager();
  music = MusicManager();

  // Variables configurable from Mod Config Menu
  config = new Config();
  hotkeys = new Hotkeys();

  // Variables per-run
  run = new GlobalsRun([]);

  race = new RaceData();
  speedrun = new SpeedrunData();

  // Checked in the PostGameStarted callback
  saveFile = {
    state: SaveFileState.NOT_CHECKED,
    fullyUnlocked: false,
    oldRun: {
      challenge: 0,
      character: 0,
      seededRun: false,
      seed: "",
    },
  };
}
