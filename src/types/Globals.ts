import { log } from "isaacscript-common";
import RaceData from "../features/race/types/RaceData";
import RaceVars from "../features/race/types/RaceVars";
import SpeedrunData from "../features/speedrun/types/SpeedrunData";
import GlobalsRun from "./GlobalsRun";
import Sandbox from "./Sandbox";
import SocketClient from "./SocketClient";

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
  font = Font();

  /** Variables that are reset at the beginning of every run. */
  run = new GlobalsRun();
  /** Race variables that are set via the client communicating with us over a socket. */
  race = new RaceData();
  /** Extra variables for races that are separate from what the client knows about. */
  raceVars = new RaceVars();
  speedrun = new SpeedrunData();

  sandbox: Sandbox | null = null;

  socket = {
    enabled: false,
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
      log("Did not detect the sandbox environment.");
      return;
    }

    this.sandbox = requiredSandbox as Sandbox;

    if (!this.sandbox.isSocketInitialized()) {
      this.sandbox = null;
      log(
        'Detected sandbox environment, but the socket library failed to load. (The "--luadebug" flag is probably turned off.)',
      );
      return;
    }

    log("Detected sandbox environment.");
    this.socket.enabled = true;
  }
}
