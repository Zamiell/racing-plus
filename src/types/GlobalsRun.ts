import { FastTravelState } from "../features/optional/major/fastTravel/enums";
import GlobalsRunLevel from "./GlobalsRunLevel";
import GlobalsRunRoom from "./GlobalsRunRoom";
import PickingUpItemDescription from "./PickingUpItemDescription";
import PillDescription from "./PillDescription";

// Several variables are maps that track things for each player
// If we have a Lua table indexed by ControllerIndex,
// that will cause problems because Lua will interpret it as an array instead of a map
// Instead, we use a Lua table with keys that are the ControllerIndex converted to a string
// The valid values for this are "0", "1", "2", and "3"
// It is inconvenient to set this explicitly on the type since we would have to do many assertions
type ControllerIndexString = string;

// Per-run variables
export default class GlobalsRun {
  // We start at stage 0 instead of stage 1 so that we can trigger the PostNewRoom callback after
  // the PostNewLevel callback
  level = new GlobalsRunLevel(0, 0);

  room = new GlobalsRunRoom(true);

  race = {
    finished: false,
    finishedTime: 0,
    victoryLaps: 0,
  };

  currentCharacters = new LuaTable<ControllerIndexString, PlayerType>();
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
     * This cannot be on the "g.run.room" table because NPCs initialize before PostNewRoom fires.
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

    /**
     * After picking up the Paschal Candle, it automatically grants one rooms worth of tear-rate.
     */
    paschalCandleCounters: new LuaTable<ControllerIndexString, int>(),
  };

  /** Needed for speedruns to return to the same character. */
  fastResetFrame = 0;

  fastTravel = {
    state: FastTravelState.Disabled,
    /** These are Isaac frames, not game frames. */
    framesPassed: 0,
    playerIndexTouchedTrapdoor: -1,
    upwards: false,
    blueWomb: false,
    theVoid: false,
    /**
     * Antibirth secret exits are located in the room outside the grid.
     * (e.g. GridRooms.ROOM_SECRET_EXIT_IDX)
     */
    antibirthSecretExit: false,
    reseed: false,
  };

  freeDevilItem = {
    tookDamage: new LuaTable<ControllerIndexString, boolean>(),
    granted: false,
  };

  ghostForm = new LuaTable<ControllerIndexString, boolean>();
  maxFamiliars = false;

  pickingUpItem = new LuaTable<
    ControllerIndexString,
    PickingUpItemDescription
  >();

  /** We track all identified pills so that we can display them. */
  pills: PillDescription[] = [];
  pillsPHD = false;
  pillsFalsePHD = false;
  pocketActiveD6Charge = new LuaTable<ControllerIndexString, int>();

  /**
   * Whether or not to restart the run on the next frame.
   * This variable is used because the game prevents you from executing a "restart" console command
   * while in the PostGameStarted callback.
   */
  restart = false;
  roomsEntered = 0;

  seededDrops = {
    roomClearAwardSeed: 0,
    roomClearAwardSeedDevilAngel: 0,
  };

  slideAnimationHappening = false;
  spedUpFadeIn = false;
  startedTime = 0;

  /** Text that appears after players touch an item, reach a new level, etc. */
  streakText = {
    text: "",
    /** Text of less importance that is only shown if there is no main text. */
    tabText: "",
    frame: 0,
  };

  switchForgotten = false;

  transformations = new LuaTable<ControllerIndexString, boolean[]>();

  // Initialize variables that are tracked per player
  // (this cannot be done in the PostPlayerInit callback since the "g.run" table is not initialized
  // yet at that point)
  constructor(players: EntityPlayer[]) {
    for (const player of players) {
      const character = player.GetPlayerType();
      // The index must be calculated in the same way as the "getPlayerLuaTableIndex()" function
      const index = player.ControllerIndex.toString();

      this.ghostForm.set(index, false);
      this.currentCharacters.set(index, character);
      this.fastClear.paschalCandleCounters.set(index, 1);
      this.freeDevilItem.tookDamage.set(index, false);

      this.pickingUpItem.set(index, {
        id: CollectibleType.COLLECTIBLE_NULL,
        type: ItemType.ITEM_NULL,
        roomIndex: -1,
      });

      this.pocketActiveD6Charge.set(index, 6);

      const transformationArray = [];
      for (let i = 0; i < PlayerForm.NUM_PLAYER_FORMS; i++) {
        transformationArray.push(false);
      }
      this.transformations.set(index, transformationArray);
    }
  }
}
