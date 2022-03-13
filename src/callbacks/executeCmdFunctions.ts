import {
  getGridEntities,
  getNPCs,
  getPlayers,
  getRoomGridIndexesForType,
  gridToPos,
  log,
  logAllSeedEffects,
  logTemporaryEffects,
  onSetSeed,
  PILL_GIANT_FLAG,
  printConsole,
  range,
  saveDataManagerSave,
  sfxManager,
  teleport,
} from "isaacscript-common";
import { VERSION } from "../constants";
import { debugFunction } from "../debugFunction";
import {
  setBuildVetosDebug,
  setCharacterOrderDebug,
} from "../features/changeCharOrder/v";
import { setDevilAngelDebugRoom } from "../features/optional/major/betterDevilAngelRooms/v";
import * as socketClient from "../features/race/socketClient";
import { logRaceData, RaceData } from "../features/race/types/RaceData";
import { RaceFormat } from "../features/race/types/RaceFormat";
import { RaceGoal } from "../features/race/types/RaceGoal";
import { RacerStatus } from "../features/race/types/RacerStatus";
import { RaceStatus } from "../features/race/types/RaceStatus";
import { speedrunSetNextCharacterAndRestart } from "../features/speedrun/callbacks/postRender";
import { restartOnNextFrame } from "../features/utils/restartOnNextFrame";
import g from "../globals";
import { ChallengeCustom } from "../types/ChallengeCustom";
import { consoleCommand, restart } from "../utils";
import { unseed } from "../utilsGlobals";
import {
  commands,
  crawlspace,
  devil,
  goldenBomb,
  goldenKey,
  IAMERROR,
  listEntities,
  movePlayer,
  planetarium,
  roomInfo,
  seededRaceChar,
  trapdoor,
  validateNumber,
} from "./executeCmdSubroutines";

const DEFAULT_SEEDED_RACE_STARTING_CHARACTER = PlayerType.PLAYER_ISAAC;
const DEFAULT_SEEDED_RACE_STARTING_ITEMS = [
  CollectibleType.COLLECTIBLE_CRICKETS_HEAD,
];

export const executeCmdFunctions = new Map<string, (params: string) => void>();

executeCmdFunctions.set("angelset", (params: string) => {
  if (params === "") {
    printConsole("You must provide an Angel Room number.");
  }

  const num = tonumber(params);
  if (num === undefined) {
    printConsole("That is an invalid Angel Room number.");
    return;
  }

  setDevilAngelDebugRoom(num);
});

executeCmdFunctions.set("changechar", (_params: string) => {
  consoleCommand(`challenge ${ChallengeCustom.CHANGE_CHAR_ORDER}`);
});

/*
executeCmdFunctions.set("char", (params: string) => {
  if (params === "") {
    printConsole("You must specify a character name or number.");
    return;
  }

  let character: PlayerType;
  const num = tonumber(params);
  if (num !== undefined) {
    character = num;
  } else {
    const match = getPartialMatchFromMap(params, CHARACTER_MAP) as
      | PlayerType
      | undefined;
    if (match === undefined) {
      printConsole("Unknown character.");
      return;
    }
    character = match;
  }

  restartAsCharacter(character);
  printConsole(`Restarting as character: ${character}`);
});
*/

executeCmdFunctions.set("coin", (params: string) => {
  let coins = 1;
  if (params !== "") {
    const num = validateNumber(params);
    if (num !== undefined) {
      coins = num;
    }
  }

  const player = Isaac.GetPlayer();
  player.AddCoins(coins);
});

executeCmdFunctions.set("coins", (_params: string) => {
  const player = Isaac.GetPlayer();
  player.AddCoins(99);
});

executeCmdFunctions.set("connect", (_params: string) => {
  if (socketClient.connect()) {
    printConsole("Successfully connected.");
  } else {
    printConsole("Failed to connect.");
  }
});

executeCmdFunctions.set("commands", (_params: string) => {
  commands(executeCmdFunctions);
});

executeCmdFunctions.set("crawl", (_params: string) => {
  crawlspace();
});

executeCmdFunctions.set("crawlspace", (_params: string) => {
  crawlspace();
});

executeCmdFunctions.set("debug", (_params: string) => {
  printConsole("Executing debug function.");
  debugFunction();
});

executeCmdFunctions.set("devil", (params: string) => {
  devil(params);
});

executeCmdFunctions.set("down", (params: string) => {
  movePlayer(params, Direction.DOWN);
});

executeCmdFunctions.set("fool", (_params: string) => {
  const player = Isaac.GetPlayer();
  player.UseCard(Card.CARD_FOOL);
});

executeCmdFunctions.set("effects", (_params: string) => {
  const player = Isaac.GetPlayer();
  logTemporaryEffects(player);
  printConsole('Logged the player\'s effects to the "log.txt" file.');
});

executeCmdFunctions.set("error", (_params: string) => {
  IAMERROR();
});

executeCmdFunctions.set("goldbomb", (_params: string) => {
  goldenBomb();
});

executeCmdFunctions.set("goldenbomb", (_params: string) => {
  goldenBomb();
});

executeCmdFunctions.set("goldenkey", (_params: string) => {
  goldenKey();
});

executeCmdFunctions.set("goldkey", (_params: string) => {
  goldenKey();
});

executeCmdFunctions.set("help", (_params: string) => {
  commands(executeCmdFunctions);
});

executeCmdFunctions.set("iamerror", (_params: string) => {
  IAMERROR();
});

executeCmdFunctions.set("key", (params: string) => {
  let keys = 1;
  if (params !== "") {
    const num = validateNumber(params);
    if (num !== undefined) {
      keys = num;
    }
  }

  const player = Isaac.GetPlayer();
  player.AddKeys(keys);
});

executeCmdFunctions.set("keys", (_params: string) => {
  const player = Isaac.GetPlayer();
  player.AddKeys(99);
});

executeCmdFunctions.set("list", (params: string) => {
  listEntities(params, false);
});

executeCmdFunctions.set("listall", (params: string) => {
  listEntities(params, true);
});

executeCmdFunctions.set("listgrid", (params: string) => {
  let entityTypeFilter: int | undefined;
  if (params !== "") {
    entityTypeFilter = validateNumber(params);
    if (entityTypeFilter === undefined) {
      return;
    }
  }

  let headerMsg = "Grid entities in the room";
  if (entityTypeFilter !== undefined) {
    headerMsg += ` (filtered to entity type ${entityTypeFilter})`;
  }
  headerMsg += " (not excluding walls)";
  log(headerMsg);

  const gridEntities = getGridEntities();
  let numMatchedEntities = 0;
  for (const gridEntity of gridEntities) {
    const gridEntityIndex = gridEntity.GetGridIndex();
    const gridEntityType = gridEntity.GetType();
    const gridEntityVariant = gridEntity.GetVariant();
    const gridEntityDesc = gridEntity.GetSaveState();

    // If a filter was specified, exclude all entities outside of the filter
    if (entityTypeFilter !== undefined && gridEntityType !== entityTypeFilter) {
      continue;
    }

    // Exclude walls (unless they were specifically requested)
    if (
      gridEntityType === GridEntityType.GRID_WALL &&
      entityTypeFilter !== GridEntityType.GRID_WALL
    ) {
      continue;
    }

    let debugString = `${gridEntityIndex} - ${gridEntityType}.${gridEntityVariant}.${gridEntity.State}`;

    const door = gridEntity.ToDoor();
    if (door !== undefined) {
      debugString += ` (door) (Slot: ${door.Slot}, Direction: ${door.Direction}, TargetRoomIndex: ${door.TargetRoomIndex}, TargetRoomType: ${door.TargetRoomType})`;
    }

    const pit = gridEntity.ToPit();
    if (pit !== undefined) {
      debugString += " (pit)";
    }

    const poop = gridEntity.ToPoop();
    if (poop !== undefined) {
      debugString += " (poop)";
    }

    const pressurePlate = gridEntity.ToPressurePlate();
    if (pressurePlate !== undefined) {
      debugString += " (pressurePlate)";
    }

    const rock = gridEntity.ToRock();
    if (rock !== undefined) {
      debugString += " (rock)";
    }

    const spikes = gridEntity.ToSpikes();
    if (spikes !== undefined) {
      debugString += " (spikes)";
    }

    const tnt = gridEntity.ToTNT();
    if (tnt !== undefined) {
      debugString += " (tnt)";
    }

    debugString += ` (VarData: ${gridEntity.VarData})`;
    debugString += ` (Position: ${gridEntity.Position.X}, ${gridEntity.Position.Y})`;
    debugString += ` (SpawnSeed: ${gridEntityDesc.SpawnSeed}, VariableSeed: ${gridEntityDesc.VariableSeed})`;
    log(debugString);

    numMatchedEntities += 1;
  }

  if (numMatchedEntities === 0) {
    log("(no grid entities matched)");
  }

  printConsole('Logged the grid entities in the room to the "log.txt" file.');
});

executeCmdFunctions.set("lowhp", (_params: string) => {
  for (const npc of getNPCs()) {
    npc.HitPoints = 1;
  }
  printConsole("Set every NPC to 1 HP.");
});

executeCmdFunctions.set("luck", (_params: string) => {
  consoleCommand("debug 9");
});

executeCmdFunctions.set("move", (_params: string) => {
  const player = Isaac.GetPlayer();

  // Move the player to a specific position
  const oneByOneRoomRightDoorNextToLoadingZone = Vector(593, 280); // 593 works, 593.1 is too far
  player.Position = oneByOneRoomRightDoorNextToLoadingZone;
});

executeCmdFunctions.set("next", (_params: string) => {
  speedrunSetNextCharacterAndRestart();
});

/*
executeCmdFunctions.set("pill", (params: string) => {
  if (params === "") {
    printConsole("You must specify a pill name or number.");
    return;
  }

  const num = tonumber(params);
  if (num !== undefined) {
    // Validate the pill ID
    if (num < 1 || num >= PillEffect.NUM_PILL_EFFECTS) {
      printConsole("That is an invalid pill effect ID.");
      return;
    }

    // They entered a number instead of a name, so just give the pill corresponding to this number
    consoleCommand(`g p${num}`);
    printConsole(`Gave pill: #${num}`);
    return;
  }

  const match = getPartialMatchFromMap(params, PILL_MAP);
  if (match === undefined) {
    printConsole("Unknown pill effect.");
    return;
  }
  const pillEffect = match;

  consoleCommand(`g p${pillEffect}`);
  printConsole(`Gave pill: #${pillEffect}`);
});
*/

executeCmdFunctions.set("pills", (_params: string) => {
  let pillColor = 1;
  let horse = false;
  for (let y = 0; y <= 6; y++) {
    for (let x = 0; x <= 12; x++) {
      if (pillColor === PillColor.NUM_PILLS) {
        if (horse) {
          return;
        }
        horse = true;
        pillColor = 1;
      }

      const horsePillColor = pillColor + PILL_GIANT_FLAG;
      const subType = horse ? horsePillColor : pillColor;
      const position = gridToPos(x, y);
      Isaac.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_PILL,
        subType,
        position,
        Vector.Zero,
        undefined,
      );

      pillColor += 1;
    }
  }
});

executeCmdFunctions.set("planet", (_params: string) => {
  planetarium();
});

executeCmdFunctions.set("planetarium", (_params: string) => {
  planetarium();
});

executeCmdFunctions.set("pocket", (params: string) => {
  if (params === "") {
    printConsole("You must supply a collectible type.");
    return;
  }

  const num = validateNumber(params);
  if (num === undefined) {
    return;
  }

  const collectibleType = num;
  const player = Isaac.GetPlayer();
  player.SetPocketActiveItem(collectibleType, ActiveSlot.SLOT_POCKET);
});

executeCmdFunctions.set("pos", (_params: string) => {
  for (const player of getPlayers()) {
    printConsole(
      `Player position: (${player.Position.X}, ${player.Position.Y})`,
    );
  }
});

executeCmdFunctions.set("prev", (_params: string) => {
  speedrunSetNextCharacterAndRestart(false);
});

executeCmdFunctions.set("previous", (_params: string) => {
  speedrunSetNextCharacterAndRestart(false);
});

executeCmdFunctions.set("race", (_params: string) => {
  logRaceData(g.race);
  printConsole('Logged the race statistics to the "log.txt" file.');
});

executeCmdFunctions.set("rankedsoloreset", (_params: string) => {
  printConsole("This command has to be performed on the Racing+ client.");
});

executeCmdFunctions.set("room", (_params: string) => {
  roomInfo();
});

executeCmdFunctions.set("roomindex", (_params: string) => {
  roomInfo();
});

executeCmdFunctions.set("roominfo", (_params: string) => {
  roomInfo();
});

executeCmdFunctions.set("s", (params: string) => {
  if (params === "") {
    printConsole("You must specify a stage number.");
    return;
  }

  const finalCharacter = params.slice(-1);
  let stageString: string;
  let stageType: string;
  if (
    finalCharacter === "a" ||
    finalCharacter === "b" ||
    finalCharacter === "c" ||
    finalCharacter === "d"
  ) {
    // e.g. "s 11a" for going to The Chest
    stageString = params.charAt(params.length - 2); // The second to last character
    stageType = finalCharacter;
  } else {
    // e.g. "s 11" for going to the Dark Room
    stageString = params;
    stageType = "";
  }

  const stage = validateNumber(stageString);
  if (stage === undefined) {
    return;
  }

  const minStage = 1;
  const maxStage = 13;
  if (stage < minStage || stage > maxStage) {
    printConsole(
      `Invalid stage number; must be between ${minStage} and ${maxStage}.`,
    );
    return;
  }

  consoleCommand(`stage ${stage}${stageType}`);
});

executeCmdFunctions.set("s0", (_params: string) => {
  consoleCommand(`challenge ${Challenge.CHALLENGE_NULL}`);
});

executeCmdFunctions.set("s1", (_params: string) => {
  consoleCommand(`challenge ${ChallengeCustom.SEASON_1}`);
  consoleCommand("setcharorder");
});

executeCmdFunctions.set("s2", (_params: string) => {
  consoleCommand(`challenge ${ChallengeCustom.SEASON_2}`);
  consoleCommand("setbuildvetos");
});

executeCmdFunctions.set("save", (_params: string) => {
  saveDataManagerSave();
  printConsole('Saved variables to the "save#.dat" file.');
});

executeCmdFunctions.set("seededrace", (params: string) => {
  if (params !== "") {
    printConsole(
      'The "seededrace" command does not take any arguments. (Set the seed first before using this command.)',
    );
    return;
  }

  if (!socketClient.isActive() || g.race.status !== RaceStatus.NONE) {
    printConsole(
      'You must have the Racing+ client open and be in the lobby in order to use the "seededrace" command.',
    );
    return;
  }

  if (!onSetSeed()) {
    printConsole(
      "You are not on a set seed; assuming that you want to use the current seed for the fake seeded race.",
    );
  }

  const startSeedString = g.seeds.GetStartSeedString();

  g.debug = true;
  g.race.status = RaceStatus.IN_PROGRESS;
  g.race.myStatus = RacerStatus.RACING;
  g.race.format = RaceFormat.SEEDED;
  g.race.seed = startSeedString;
  g.race.character = DEFAULT_SEEDED_RACE_STARTING_CHARACTER;
  g.race.startingItems = DEFAULT_SEEDED_RACE_STARTING_ITEMS;

  printConsole(`Enabled seeded race mode for seed: ${startSeedString}`);
  restart();
});

executeCmdFunctions.set("seededracechar", (params: string) => {
  seededRaceChar(params);
});

executeCmdFunctions.set("seededracecharacter", (params: string) => {
  seededRaceChar(params);
});

executeCmdFunctions.set("seededracebuild", (_params: string) => {
  printConsole('Use the "seededraceitem" command instead.');
});

executeCmdFunctions.set("seededraceitem", (params: string) => {
  const ERROR_MESSAGE =
    'You must enter an item number. (For example, "114" for Mom\'s Knife, or "245,2" for 20/20 + The Inner Eye.)';

  if (params === "") {
    printConsole(ERROR_MESSAGE);
  }

  const startingItemStrings = params.split(",");
  const startingItems: int[] = [];
  for (const startingItemString of startingItemStrings) {
    const num = validateNumber(startingItemString);
    if (num === undefined) {
      return;
    }
    startingItems.push(num);
  }

  g.race.startingItems = startingItems;
  printConsole(
    `Set the seeded race item(s) to: [${g.race.startingItems.join(",")}]`,
  );
  restart();
});

executeCmdFunctions.set("seededracegoal", (params: string) => {
  g.race.goal = params as RaceGoal;
  printConsole(`Set the seeded race goal to: ${g.race.goal}`);
  restart();
});

executeCmdFunctions.set("seededraceoff", (_params: string) => {
  g.race = new RaceData();
  unseed();
  restart();

  printConsole("Disabled seeded race mode.");
});

executeCmdFunctions.set("seeds", (_params: string) => {
  logAllSeedEffects();
  printConsole('Logged the seed effects to the "log.txt" file.');
});

executeCmdFunctions.set("setbuildvetos", (_params: string) => {
  setBuildVetosDebug();
  restartOnNextFrame();
});

executeCmdFunctions.set("setcharorder", (_params: string) => {
  setCharacterOrderDebug();
  restartOnNextFrame();
});

executeCmdFunctions.set("shop", (_params: string) => {
  const player = Isaac.GetPlayer();
  player.UseCard(Card.CARD_HERMIT);
});

executeCmdFunctions.set("sound", (params: string) => {
  const soundEffect = validateNumber(params);
  if (soundEffect === undefined) {
    return;
  }

  sfxManager.Play(soundEffect);
});

executeCmdFunctions.set("sounds", (_params: string) => {
  for (const soundEffect of range(0, SoundEffect.NUM_SOUND_EFFECTS - 1)) {
    if (sfxManager.IsPlaying(soundEffect)) {
      log(`Currently playing sound effect: ${soundEffect}`);
    }
  }

  printConsole(
    'Logged the currently playing sound effects to the "log.txt" file.',
  );
});

executeCmdFunctions.set("stick", (_params: string) => {
  const seedString = g.seeds.GetStartSeedString();
  consoleCommand(`seed ${seedString}`);
});

executeCmdFunctions.set("trap", (_params: string) => {
  trapdoor();
});

executeCmdFunctions.set("trapdoor", (_params: string) => {
  trapdoor();
});

executeCmdFunctions.set("treasure", (_params: string) => {
  const player = Isaac.GetPlayer();
  player.UseCard(Card.CARD_STARS);
});

executeCmdFunctions.set("ultra", (_params: string) => {
  const ultraSecretGridIndexes = getRoomGridIndexesForType(
    RoomType.ROOM_ULTRASECRET,
  );
  if (ultraSecretGridIndexes.length === 0) {
    printConsole("There are no Ultra Secret Rooms on this floor.");
    return;
  }

  const ultraSecretGridIndex = ultraSecretGridIndexes[0];
  teleport(ultraSecretGridIndex);
});

executeCmdFunctions.set("unseed", (_params: string) => {
  unseed();
  restart();
});

executeCmdFunctions.set("version", (_params: string) => {
  const msg = `Racing+ version: ${VERSION}`;
  log(msg);
  printConsole(msg);
});
