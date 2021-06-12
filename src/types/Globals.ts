import Config from "./Config";
import { SaveFileState } from "./enums";
import GlobalsRun from "./GlobalsRun";
import Hotkeys from "./Hotkeys";
import RaceData from "./RaceData";
import Sandbox from "./Sandbox";
import SocketClient from "./SocketClient";
import SpeedrunData from "./SpeedrunData";

export default class Globals {
  debug = false;
  corrupted = false;

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
  font = Font();

  // Variables configurable from Mod Config Menu
  config = new Config();
  hotkeys = new Hotkeys();

  // Variables per-run
  run = new GlobalsRun([]);

  race = new RaceData();
  speedrun = new SpeedrunData();

  // Checked in the PostGameStarted callback
  saveFile = {
    state: SaveFileState.NotChecked,
    fullyUnlocked: false,
    oldRun: {
      challenge: 0,
      character: 0,
      seededRun: false,
      seed: "",
    },
  };

  socket = {
    enabled: false,
    sandbox: null as Sandbox | null,
    client: null as SocketClient | null,
    connectionAttemptFrame: 0,
  };

  constructor() {
    this.font.Load("font/droid.fnt");
    this.checkEnableSocket();
  }

  // Racing+ installs a sandbox that prevents mods from accessing DLLs
  // If the sandbox is in place, then we should be clear to request a socket later on
  checkEnableSocket(): void {
    const [ok, requiredSandbox] = pcall(require, "sandbox");
    if (!ok) {
      Isaac.DebugString("Did not detect the sandbox environment.");
      return;
    }

    this.socket.sandbox = requiredSandbox as Sandbox;

    if (!this.socket.sandbox.isSocketInitialized()) {
      this.socket.sandbox = null;
      Isaac.DebugString(
        'Detected sandbox environment, but the socket library failed to load. (The "--luadebug" flag is probably turned off.)',
      );
      return;
    }

    Isaac.DebugString("Detected sandbox environment.");
    this.socket.enabled = true;
  }
}
