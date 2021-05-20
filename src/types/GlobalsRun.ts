import GlobalsRunLevel from "./GlobalsRunLevel";
import GlobalsRunRoom from "./GlobalsRunRoom";

// Per-run variables
export default class GlobalsRun {
  // Tracking per run
  /**
   * Whether or not to restart the run on the next frame.
   * This variable is used because the game prevents you from executing a "restart" console command
   * while in the PostGameStarted callback.
   */
  restart = false;
  roomsEntered = 0;

  // Tracking per level
  // We start at stage 0 instead of stage 1 so that we can trigger the PostNewRoom callback after
  // the PostNewLevel callback
  level = new GlobalsRunLevel(0, 0);

  // Tracking per room
  room = new GlobalsRunRoom();

  race = {
    finished: false,
    finishedTime: 0,
    victoryLaps: 0,
  };

  fastClear = {
    /**
     * Keys are NPC pointer hashes, values are isBoss.
     * Note that we cannot use "npc.Index" as an index for the map because it is always set to 0 in
     * the PostNPCInit callback (even in Repentance).
     * We have to use a LuaTable instead of a Map because Maps don't get converted to JSON properly.
     */
    aliveEnemies: new LuaTable<int, boolean | null>(),
    aliveEnemiesCount: 0,
    aliveBossesCount: 0,

    /** Reset to false in the PostNewRoom callback. */
    buttonsAllPushed: false,

    /** Reset to false in the PostNewRoom callback. */
    roomInitializing: false,
    delayFrame: 0,

    /** Used to prevent the vanilla photos from spawning. */
    vanillaPhotosSpawning: false,

    paschalCandleCounters: 0,

    /** Used to generate seeded rewards after a fast-clear. */
    roomClearAwardSeed: 0,
    /** Used to generate seeded rewards after a fast-clear. */
    roomClearAwardSeedDevilAngel: 0,
  };

  fastReset = {
    frame: 0,
    /** If this is set, fast-resetting is disabled. */
    consoleOpened: false,
  };
}
