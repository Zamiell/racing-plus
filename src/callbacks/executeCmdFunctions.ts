import {
  getNPCs,
  getPlayers,
  gridToPos,
  log,
  logAllSeedEffects,
  logTemporaryEffects,
  onSetSeed,
  printConsole,
  range,
  saveDataManagerSave,
} from "isaacscript-common";
import { VERSION } from "../constants";
import { debugFunction } from "../debugFunction";
import {
  setBuildVetosDebug,
  setCharacterOrderDebug,
} from "../features/changeCharOrder/v";
import * as debugPowers from "../features/mandatory/debugPowers";
import * as socketClient from "../features/race/socketClient";
import { RaceData } from "../features/race/types/RaceData";
import { RaceFormat } from "../features/race/types/RaceFormat";
import { RaceGoal } from "../features/race/types/RaceGoal";
import { RacerStatus } from "../features/race/types/RacerStatus";
import { RaceStatus } from "../features/race/types/RaceStatus";
import { speedrunSetNextCharacterAndRestart } from "../features/speedrun/callbacks/postRender";
import { restartOnNextFrame } from "../features/utils/restartOnNextFrame";
import g from "../globals";
import { CARD_MAP } from "../maps/cardMap";
import { CHARACTER_MAP } from "../maps/characterMap";
import { PILL_MAP } from "../maps/pillMap";
import { ChallengeCustom } from "../types/ChallengeCustom";
import {
  consoleCommand,
  getPartialMatchFromMap,
  restart,
  restartAsCharacter,
} from "../utils";
import { unseed } from "../utilsGlobals";
import {
  angel,
  blackMarket,
  chaosCardTears,
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

const DEFAULT_SEEDED_RACE_STARTING_CHARACTER = PlayerType.PLAYER_ISAAC_B;
const DEFAULT_SEEDED_RACE_STARTING_ITEMS = [
  CollectibleType.COLLECTIBLE_20_20,
  CollectibleType.COLLECTIBLE_INNER_EYE,
];

export const executeCmdFunctions = new Map<string, (params: string) => void>();

executeCmdFunctions.set("angel", (params: string) => {
  angel(params);
});

executeCmdFunctions.set("ascent", (_params: string) => {
  g.g.SetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH_INIT, true);
  g.g.SetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH, true);

  printConsole("Set Ascent flags.");
});

executeCmdFunctions.set("blackmarket", (_params: string) => {
  blackMarket();
});

executeCmdFunctions.set("bomb", (params: string) => {
  let bombs = 1;
  if (params !== "") {
    const num = validateNumber(params);
    if (num !== undefined) {
      bombs = num;
    }
  }

  const player = Isaac.GetPlayer();
  player.AddBombs(bombs);
});

executeCmdFunctions.set("bombs", (_params: string) => {
  const player = Isaac.GetPlayer();
  player.AddBombs(99);
});

executeCmdFunctions.set("boss", (_params: string) => {
  const player = Isaac.GetPlayer();
  player.UseCard(Card.CARD_EMPEROR);
});

executeCmdFunctions.set("bm", (_params: string) => {
  blackMarket();
});

executeCmdFunctions.set("card", (params: string) => {
  if (params === "") {
    printConsole("You must specify a card name or number.");
    return;
  }

  const num = tonumber(params);
  if (num !== undefined) {
    // Validate the card ID
    if (num < 1 || num >= Card.NUM_CARDS) {
      printConsole("That is an invalid card ID.");
      return;
    }

    // They entered a number instead of a name, so just give the card corresponding to this number
    consoleCommand(`g k${num}`);
    printConsole(`Gave card: #${num}`);
    return;
  }

  const match = getPartialMatchFromMap(params, CARD_MAP);
  if (match === undefined) {
    printConsole("Unknown card.");
    return;
  }
  const card = match;

  consoleCommand(`g k${card}`);
  printConsole(`Gave card: #${card}`);
});

executeCmdFunctions.set("cards", (_params: string) => {
  let cardNum = 1;
  for (let y = 0; y <= 6; y++) {
    for (let x = 0; x <= 12; x++) {
      if (cardNum === Card.NUM_CARDS) {
        return;
      }

      const position = gridToPos(x, y);
      Isaac.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TAROTCARD,
        cardNum,
        position,
        Vector.Zero,
        undefined,
      );
      cardNum += 1;
    }
  }
});

executeCmdFunctions.set("cc", (_params: string) => {
  chaosCardTears();
});

executeCmdFunctions.set("changechar", (_params: string) => {
  consoleCommand(`challenge ${ChallengeCustom.CHANGE_CHAR_ORDER}`);
});

executeCmdFunctions.set("chaos", (_params: string) => {
  chaosCardTears();
});

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

executeCmdFunctions.set("dd", (params: string) => {
  devil(params);
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

      const subType = horse ? pillColor + PillColor.PILL_GIANT_FLAG : pillColor;
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

executeCmdFunctions.set("seededrace", (_params: string) => {
  if (!onSetSeed()) {
    printConsole(
      'You must be on a set seed in order to use the "seededrace" command.',
    );
    return;
  }

  if (!socketClient.isActive() || g.race.status !== RaceStatus.NONE) {
    printConsole(
      'You must have the Racing+ client open and be in the lobby in order to use the "seededrace" command.',
    );
    return;
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
});

executeCmdFunctions.set("seededracegoal", (params: string) => {
  g.race.goal = params as RaceGoal;
  printConsole(`Set the seeded race goal to: ${g.race.goal}`);
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

  g.sfx.Play(soundEffect);
});

executeCmdFunctions.set("sounds", (_params: string) => {
  for (const soundEffect of range(0, SoundEffect.NUM_SOUND_EFFECTS - 1)) {
    if (g.sfx.IsPlaying(soundEffect)) {
      log(`Currently playing sound effect: ${soundEffect}`);
    }
  }

  printConsole(
    'Logged the currently playing sound effects to the "log.txt" file.',
  );
});

executeCmdFunctions.set("spam", (_params: string) => {
  debugPowers.toggleSpam();
});

executeCmdFunctions.set("speed", (_params: string) => {
  debugPowers.toggleSpeed();
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

executeCmdFunctions.set("unseed", (_params: string) => {
  unseed();
  restart();
});

executeCmdFunctions.set("version", (_params: string) => {
  const msg = `Racing+ version: ${VERSION}`;
  log(msg);
  printConsole(msg);
});
