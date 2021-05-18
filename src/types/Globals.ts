import GlobalsRun from "./GlobalsRun";
import RaceData from "./RaceData";

export default class Globals {
  // Cached API functions
  g = Game();
  l = Game().GetLevel();
  r = Game().GetRoom();
  // "Isaac.GetPlayer()" will return nil if called from the main menu
  // We "lie" and say that it gets set to an EntityPlayer so that we don't have to do non-null
  // assertions everywhere
  // In reality, the value will be set in the PostPlayerInit callback, which should happen before
  // any other code gets run
  p = Isaac.GetPlayer(0) as EntityPlayer;
  seeds = Game().GetSeeds();
  itemPool = Game().GetItemPool();
  itemConfig = Isaac.GetItemConfig();
  sfx = SFXManager();
  music = MusicManager();

  // Special variables
  debug = false;

  // Variables configurable from Mod Config Menu
  config: Config = {
    startWithD6: true,
    disableCurses: true,
    extraStartingHealth: true,
    judasAddBomb: true,
    samsonDropHeart: true,
    fastClear: true,
    fastReset: true,
  };

  // Variables per-run
  run = new GlobalsRun();

  // This is the table that gets updated from the "save.dat" file
  race: RaceData = {
    userID: 0,
    raceID: 0,
    status: "none",
    myStatus: "not ready",
    ranked: false,
    solo: false,
    rFormat: "unseeded",
    difficulty: "normal",
    character: PlayerType.PLAYER_JUDAS,
    goal: "Blue Baby",
    seed: "-",
    startingItems: [],
    countdown: -1,
    placeMid: 0,
    place: 1,
    numEntrants: 1,
  };

  speedrun = {
    fastReset: false,
  };
}
