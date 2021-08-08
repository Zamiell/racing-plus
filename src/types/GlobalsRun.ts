import { getPlayerIndex, log, PlayerIndex } from "isaacscript-common";
import { FastTravelState } from "../features/optional/major/fastTravel/enums";
import SeededDeathState from "../features/race/types/SeededDeathState";
import GlobalsRunLevel from "./GlobalsRunLevel";
import PickingUpItemDescription from "./PickingUpItemDescription";
import PillDescription from "./PillDescription";

// Per-run variables
export default class GlobalsRun {
  // We start at stage 0 instead of stage 1 so that we can trigger the PostNewRoom callback after
  // the PostNewLevel callback
  level = new GlobalsRunLevel(0, 0);

  /** Remember the alt floors we traveled to respawn them in Backwards path. */
  altFloorsTraveled = {
    downpour1: false,
    dross1: false,
    downpour2: false,
    dross2: false,
    mines1: false,
    ashpit1: false,
    mines2: false,
    ashpit2: false,
  };

  beastDefeated = false;
  currentCharacters = new LuaTable<PlayerIndex, PlayerType>();
  debugChaosCard = false;
  debugSpeed = false;

  edenStartingItems = {
    active: 0 as CollectibleType,
    passive: 0 as CollectibleType,
    activeSprite: null as Sprite | null,
    passiveSprite: null as Sprite | null,
  };

  errors = {
    corrupted: false,
    incompleteSave: false,
    otherModsEnabled: false,
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
     * Repentance secret exits are located in the room outside the grid.
     * (e.g. GridRooms.ROOM_SECRET_EXIT_IDX)
     */
    repentanceSecretExit: false,

    reseed: false,
  };

  fireworksSpawned = 0;

  freeDevilItem = {
    tookDamage: new LuaTable<PlayerIndex, boolean>(),
    granted: false,
  };

  /** Used for Tainted Keeper when racing to the Boss Rush. */
  madeBossRushItemsFree = false;

  maxFamiliars = false;
  pickingUpItem = new LuaTable<PlayerIndex, PickingUpItemDescription>();

  /** We track all identified pills so that we can display them. */
  pills: PillDescription[] = [];

  pillsPHD = false;
  pillsFalsePHD = false;
  pocketActiveD6Charge = new LuaTable<PlayerIndex, int>();

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
    seed: 0,
    seedDevilAngel: 0,
  };

  /** Used for the seeded rooms feature of seeded races. */
  seededRooms = {
    metKrampus: false,
    RNG: {
      krampus: 0,
      devilSelection: 0,
      devilEntities: 0,
      angelSelection: 0,
      angelEntities: 0,
    },
  };

  slideAnimationHappening = false;

  /** Used in races to Mother. */
  spawnedCorpseTrapdoor = false;

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
  transformations = new LuaTable<PlayerIndex, boolean[]>();

  /** If we have used the Esau Jr. item yet on this run. */
  usedEsauJrAtLeastOnce = false;

  /** Needed because the player does not change until one frame after Esau Jr. is activated. */
  usedEsauJrFrame = 0;

  /** If we have used Tainted Lazarus' Flip item yet on this run. */
  usedFlipAtLeastOnce = false;

  victoryLaps = 0;

  // Initialize variables that are tracked per player
  // (this cannot be done in the PostPlayerInit callback since the "g.run" table is not initialized
  // yet at that point)
  constructor(startSeed: int, players: EntityPlayer[]) {
    const RNGObject = this.seededRooms.RNG;
    for (const key of Object.keys(RNGObject)) {
      const property = key as keyof typeof RNGObject;
      this.seededRooms.RNG[property] = startSeed;
    }

    for (const player of players) {
      initPlayerVariables(player, this);
    }
  }
}

export function initPlayerVariables(
  player: EntityPlayer,
  run: GlobalsRun,
): void {
  // Exclude players with a non-null parent, since they are not real players
  // (e.g. the Strawman Keeper)
  if (player.Parent !== null) {
    return;
  }

  const character = player.GetPlayerType();
  const index = getPlayerIndex(player);

  run.currentCharacters.set(index, character);
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
