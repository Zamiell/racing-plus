import { FastTravelState } from "../features/optional/major/fastTravel/enums";
import SeededDeathState from "../features/race/types/SeededDeathState";
import log from "../log";
import GlobalsRunLevel from "./GlobalsRunLevel";
import GlobalsRunRoom from "./GlobalsRunRoom";
import PickingUpItemDescription from "./PickingUpItemDescription";
import PillDescription from "./PillDescription";

// Per-run variables
export default class GlobalsRun {
  // We start at stage 0 instead of stage 1 so that we can trigger the PostNewRoom callback after
  // the PostNewLevel callback
  level = new GlobalsRunLevel(0, 0);
  /** Used to go to a new floor on game frame 0. */
  forceNextLevel = false; //
  room = new GlobalsRunRoom(true);
  /** Used to go to a new room on game frame 0. */
  forceNextRoom = false;

  currentCharacters = new LuaTable<PlayerLuaTableIndex, PlayerType>();
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
    paschalCandleCounters: new LuaTable<PlayerLuaTableIndex, int>(),
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

  fireworksSpawned = 0;

  freeDevilItem = {
    tookDamage: new LuaTable<PlayerLuaTableIndex, boolean>(),
    granted: false,
  };

  maxFamiliars = false;

  pickingUpItem = new LuaTable<PlayerLuaTableIndex, PickingUpItemDescription>();

  /** We track all identified pills so that we can display them. */
  pills: PillDescription[] = [];
  pillsPHD = false;
  pillsFalsePHD = false;
  pocketActiveD6Charge = new LuaTable<PlayerLuaTableIndex, int>();

  /** Used to give only one double item Treasure Room. */
  removeMoreOptions = false;
  /**
   * Whether or not to restart the run on the next frame.
   * This variable is used because the game prevents you from executing a "restart" console command
   * while in the PostGameStarted callback.
   */
  restart = false;
  roomsEntered = 0;

  seededDeath = {
    state: SeededDeathState.Disabled,
  };

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
  transformations = new LuaTable<PlayerLuaTableIndex, boolean[]>();
  victoryLaps = 0;

  // Initialize variables that are tracked per player
  // (this cannot be done in the PostPlayerInit callback since the "g.run" table is not initialized
  // yet at that point)
  constructor(players: EntityPlayer[]) {
    for (const player of players) {
      initPlayerVariables(player, this);
    }
  }
}

export function initPlayerVariables(
  player: EntityPlayer,
  run: GlobalsRun,
): void {
  const character = player.GetPlayerType();
  const index = getPlayerLuaTableIndex(player);

  run.currentCharacters.set(index, character);
  run.fastClear.paschalCandleCounters.set(index, 1);
  run.freeDevilItem.tookDamage.set(index, false);

  run.pickingUpItem.set(index, {
    id: CollectibleType.COLLECTIBLE_NULL,
    type: ItemType.ITEM_NULL,
    roomIndex: -1,
  });

  run.pocketActiveD6Charge.set(index, 6);

  const transformationArray = [];
  for (let i = 0; i < PlayerForm.NUM_PLAYER_FORMS; i++) {
    transformationArray.push(false);
  }
  run.transformations.set(index, transformationArray);

  log(`Initialized variables for player: ${index}`);
}

// This represents the special case of a pointer hash converted to a string;
// see the explanation below
type PlayerLuaTableIndex = string;

export function getPlayerLuaTableIndex(
  player: EntityPlayer,
): PlayerLuaTableIndex {
  // We cannot use "player.ControllerIndex" as an index because it fails in the case of Jacob & Esau
  // or Tainted Forgotten
  // The PtrHash of the player will correctly persist after saving and quitting and continuing,
  // but it will be different after completely closing and re-opening the game
  // We explicitly don't handle this case since the code complexity isn't worth the tradeoff
  // We convert the pointer hash to a string to avoid null element creation when saving the table as
  // JSON (which is done to handle save & quit)
  return GetPtrHash(player).toString();
}
