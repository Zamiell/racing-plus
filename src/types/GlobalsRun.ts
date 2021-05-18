import GlobalsRunLevel from "./GlobalsRunLevel";
import GlobalsRunRoom from "./GlobalsRunRoom";

// Per-run variables
export default class GlobalsRun {
  // Tracking per run
  roomsEntered = 0;

  // Tracking per level
  // We start at stage 0 instead of stage 1 so that we can trigger the PostNewRoom callback after
  // the PostNewLevel callback
  level = new GlobalsRunLevel(0, 0);

  // Tracking per room
  room = new GlobalsRunRoom();

  // 007
  fastClear = {
    /**
     * Keys are NPC pointer hashes, values are isBoss.
     * Note that we cannot use "npc.Index" as an index for the map because it is always set to 0 in
     * the PostNPCInit callback (even in Repentance).
     */
    aliveEnemies: new Map<int, boolean>(),
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
    roomClearAwardRNG: RNG(),
    /**
     * Used to generate seeded rewards after a fast-clear.
     * Specifically used for Devil Rooms and Angel Rooms.
     */
    roomClearAwardRNG2: RNG(),
  };

  // 010
  fastReset = {
    frame: 0,
    /** If this is set, fast-resetting is disabled. */
    consoleOpened: false,
  };
}
