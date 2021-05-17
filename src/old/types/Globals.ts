import { CHANGE_CHAR_ORDER_POSITIONS } from "../challenges/constants";
import { ChangeCharOrderPhase } from "../challenges/enums";
import {
  CollectibleTypeCustom,
  PlayerTypeCustom,
  SaveFileState,
} from "./enums";
import GlobalsRun from "./GlobalsRun";
import PillDescription from "./PillDescription";
import RaceData from "./RaceData";

export default class Globals {
  // Contains the mod object; this is filled in after registration
  racingPlus: Mod | null = null;

  // Cached API functions
  g = Game();
  l = Game().GetLevel();
  r = Game().GetRoom();
  // "Isaac.GetPlayer()" will return nil if called from the main menu
  // We "lie" and say that it gets set to an EntityPlayer so that we don't have to do non-null
  // assertions everywhere
  // In reality, the value will be set in the PostPlayerInit callback, which will happen before any
  // other code gets run
  p = Isaac.GetPlayer(0) as EntityPlayer;
  seeds = Game().GetSeeds();
  itemPool = Game().GetItemPool();
  itemConfig = Isaac.GetItemConfig();
  sfx = SFXManager();
  music = MusicManager();
  font = Font();
  numTotalCollectibles = 0; // This is initialized in the PostGameStarted callback

  debug = false;

  // All errors are checked in the PostGameStarted callback
  errors = {
    corrupted: false,
    invalidItemsXML: false,
    resumedOldRun: false,
  };

  // Checked in the PostGameStarted callback
  saveFile = {
    state: SaveFileState.NOT_CHECKED,
    fullyUnlocked: false,
    old: {
      challenge: 0,
      character: 0,
      seededRun: false,
      seed: "",
    },
  };

  luaDebug = false; // Whether or not they are running the game with the "--luadebug" flag
  socket: LuaSocket | null = null;

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

  // These are things that pertain to the race but are ! read from the "save.dat" file
  raceVars = {
    loadOnNextFrame: false,
    started: false,
    startedTime: 0,
    startedFrame: 0,
    finished: false,
    finishedTime: 0,
    finishedFrames: 0,
    fireworks: 0,
    victoryLaps: 0,
    shadowEnabled: false,
  };

  shadowClient = {
    connected: false, // Represents connection to mod server (mostly for shadow render)
    maxBufferSize: 1024,
  };

  speedrun = {
    sprites: [] as Sprite[], // Reset at the beginning of a new run (in the PostGameStarted callback)
    characterNum: 1, // Reset explicitly from a long-reset and on the first reset after a finish
    startedTime: 0, // Reset explicitly if we are on the first character
    startedFrame: 0, // Reset explicitly if we are on the first character
    // Reset explicitly if we are on the first character and when we touch a Checkpoint
    startedCharTime: 0,
    characterRunTimes: [] as int[], // Reset explicitly if we are on the first character
    finished: false, // Reset at the beginning of every run
    finishedTime: 0, // Reset at the beginning of every run
    finishedFrames: 0, // Reset at the beginning of every run
    fastReset: false, // Reset explicitly when we detect a fast reset
    // Reset after we touch the checkpoint and at the beginning of a new run
    spawnedCheckpoint: false,
    fadeFrame: 0, // Reset after we touch the checkpoint and at the beginning of a new run
    // Reset after we execute the "restart" command and at the beginning of a new run
    resetFrame: 0,
    liveSplitReset: false,
  };

  changeCharOrder = {
    phase: ChangeCharOrderPhase.SEASON_SELECT, // Reset when we enter the room
    // Reset when we enter the room
    seasonChosen: null as keyof typeof CHANGE_CHAR_ORDER_POSITIONS | null,
    createButtonsFrame: 0, // Reset when we enter the room
    charOrder: [] as Array<PlayerType | PlayerTypeCustom>, // Reset when we enter the room
    itemOrder: [] as CollectibleType[], // Reset when we enter the room
    sprites: {
      // Reset in the PostGameStarted callback
      seasons: new Map<string, Sprite>(),
      characters: [] as Sprite[],
      items: [] as Sprite[],
    },
  };

  changeKeybindings = {
    challengePhase: 0,
    challengeFramePressed: 0,
  };

  season5 = {
    remainingStartingItems: [] as Array<
      CollectibleType | CollectibleTypeCustom
    >,
    selectedStartingItems: [] as Array<CollectibleType | CollectibleTypeCustom>,
  };

  season6 = {
    remainingStartingBuilds: [] as Array<
      Array<CollectibleType | CollectibleTypeCustom>
    >,
    selectedStartingBuilds: [] as Array<
      Array<CollectibleType | CollectibleTypeCustom>
    >,
    timeItemAssigned: 0, // Reset when the time limit elapses
    lastBuildItem: 0 as CollectibleType | CollectibleTypeCustom, // Set when a new build is assigned
    // Set when a new build is assigned on the first character
    lastBuildItemOnFirstChar: 0 as CollectibleType | CollectibleTypeCustom,
    vetoList: [] as Array<CollectibleType | CollectibleTypeCustom>,
    vetoSprites: [] as Sprite[],
    vetoTimer: 0,
  };

  season7 = {
    remainingGoals: [] as string[],
  };

  season8 = {
    touchedItems: [] as CollectibleType[], // Reset at the beginning of a new run on the first character
    touchedTrinkets: [] as TrinketType[], // Reset at the beginning of a new run on the first character
    remainingCards: [] as Card[], // Reset at the beginning of a new run on the first character
    runPillEffects: [] as PillEffect[], // Reset at the beginning of a new run on the first character
    identifiedPills: [] as PillDescription[], // Reset at the beginning of a new run on the first character
    starterSprites: [] as Sprite[], // Reset whenever a new item is touched
    devilSprites: [] as Sprite[], // Reset whenever a new item is touched
    angelSprites: [] as Sprite[], // Reset whenever a new item is touched
  };

  season9 = {
    remainingStartingBuilds: [] as Array<
      Array<CollectibleType | CollectibleTypeCustom>
    >,
    selectedStartingBuildIndexes: [] as int[],
    timeBuildAssigned: 0, // Reset when the time limit elapses
    loadedSaveDat: false,
    historicalBuildIndexes: [] as int[],
    setBuild: null as null | int, // For debugging a specific build
  };

  RNGCounter = {
    // Seeded at the beginning of the run
    bookOfSin: 0, // 97
    deadSeaScrolls: 0, // 124
    guppysHead: 0, // 145
    guppysCollar: 0, // 212
    butterBean: 0, // 294

    // Devil Rooms and Angel Rooms go in order on seeded races
    devilRoomKrampus: 0,
    devilRoomChoice: 0,
    devilRoomItem: 0,
    devilRoomBeggar: 0,
    angelRoomChoice: 0,
    angelRoomItem: 0,
    angelRoomMisc: 0,

    // Seeded at the beginning of the floor
    teleport: 0, // 44 (Broken Remote also uses this)
    undefined: 0, // 324
    telepills: 0, // 19
  };

  // The contents of the "Racing+ Data" mod save.dat file is cached in memory
  saveData = {};

  constructor() {
    // Load the font
    this.font.Load("font/teammeatfont10.fnt");

    // Check for the "--luadebug" flag and the socket library
    const [ok, socket] = pcall(require, "socket");
    if (ok && socket) {
      this.luaDebug = true;
      this.socket = socket as LuaSocket;
      // eslint-disable-next-line no-underscore-dangle
      Isaac.DebugString(`Initialized socket: ${this.socket._VERSION}`);
    } else {
      Isaac.DebugString(
        'Importing socket failed: The "--luadebug" flag is not turned on in the Steam launch options.',
      );
    }
  }
}
