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
  room = new GlobalsRunRoom(true);

  race = {
    finished: false,
    finishedTime: 0,
    victoryLaps: 0,
  };

  // ----------------
  // Custom Callbacks
  // ----------------

  ghostForm = false;
  currentCharacter = -1 as PlayerType;

  // --------
  // Features
  // --------

  debugChaosCard = false;
  debugSpeed = false;

  edenStartingItems = {
    active: 0 as CollectibleType,
    passive: 0 as CollectibleType,
    activeSprite: null as Sprite | null,
    passiveSprite: null as Sprite | null,
  };

  fastClear = {
    /**
     * Keys are NPC pointer hashes, the value is whether or not the NPC is a boss.
     * Note that we cannot use "npc.Index" as an index for the map because it is always set to 0 in
     * the PostNPCInit callback (even in Repentance).
     * We have to use a LuaTable instead of a Map because Maps don't get converted to JSON properly.
     */
    aliveEnemies: new LuaTable<int, boolean | null>(),
    /**
     * We need to track the count separately from the hash map because there is no method in Lua to
     * get the number of entries in a table.
     */
    aliveEnemiesCount: 0,
    aliveBossesCount: 0,

    /** Reset to false in the PostNewRoom callback. */
    buttonsAllPushed: false,

    /** Reset to false in the PostNewRoom callback. */
    roomInitializing: false,
    delayFrame: 0,

    /** Used to prevent the vanilla photos from spawning. */
    vanillaPhotosSpawning: false,

    /**
     * If we are in ghost form after touching a white fire, then we need to allow the vanilla room
     * clear to happen at least once so that the game can turn us back from the ghost form.
     */
    deferClearForGhost: false,

    paschalCandleCounters: 0,
  };

  /** Needed for speedruns to return to the same character. */
  fastResetFrame = 0;

  freeDevilItem = {
    /** Index is player ControllerIndex. Value is whether or not they have taken damage. */
    takenDamage: new LuaTable<int, boolean>(),
    granted: false,
  };

  pocketActiveD6Charge: int = 0;
  pillEffects: PillEffect[] = [];

  seededDrops = {
    roomClearAwardSeed: 0,
    roomClearAwardSeedDevilAngel: 0,
  };

  slideAnimationHappening = false;
  spedUpFadeIn = false;
}
