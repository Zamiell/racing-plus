import {
  getPlayers,
  getRoomIndex,
  gridToPos,
  log,
  saveDataManagerSave,
} from "isaacscript-common";
import { CARD_MAP } from "../cardMap";
import { CHARACTER_MAP } from "../characterMap";
import { VERSION } from "../constants";
import { debugFunction } from "../debugFunction";
import { setCharacterOrderDebug } from "../features/changeCharOrder/v";
import * as debugPowers from "../features/mandatory/debugPowers";
import * as socketClient from "../features/race/socketClient";
import { RaceFormat } from "../features/race/types/RaceFormat";
import { RacerStatus } from "../features/race/types/RacerStatus";
import { RaceStatus } from "../features/race/types/RaceStatus";
import { ChallengeCustom } from "../features/speedrun/enums";
import { speedrunSetNext } from "../features/speedrun/exported";
import { restartOnNextFrame } from "../features/util/restartOnNextFrame";
import g from "../globals";
import { PILL_MAP } from "../pillMap";
import { consoleCommand, restart, restartAsCharacter } from "../util";
import { unseed } from "../utilGlobals";
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
  list,
  movePlayer,
  trapdoor,
  validateNumber,
} from "./executeCmdSubroutines";

export const executeCmdFunctions = new Map<string, (params: string) => void>();

executeCmdFunctions.set("angel", (params: string) => {
  angel(params);
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
  if (player !== undefined) {
    player.AddBombs(bombs);
  }
});

executeCmdFunctions.set("bombs", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== undefined) {
    player.AddBombs(99);
  }
});

executeCmdFunctions.set("boss", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== undefined) {
    player.UseCard(Card.CARD_EMPEROR);
  }
});

executeCmdFunctions.set("bm", (_params: string) => {
  blackMarket();
});

executeCmdFunctions.set("card", (params: string) => {
  if (params === "") {
    print("You must specify a card name or number.");
    return;
  }

  const num = tonumber(params);
  if (num !== undefined) {
    // Validate the card ID
    if (num < 1 || num >= Card.NUM_CARDS) {
      print("That is an invalid card ID.");
      return;
    }

    // They entered a number instead of a name, so just give the card corresponding to this number
    consoleCommand(`g k${num}`);
    print(`Gave card: #${num}`);
    return;
  }

  const word = params.toLowerCase();
  const card = CARD_MAP.get(word);
  if (card === undefined) {
    print("Unknown card.");
    return;
  }
  consoleCommand(`g k${card}`);
  print(`Gave card: #${card}`);
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
    print("You must specify a character name or number.");
    return;
  }

  let character: PlayerType;
  const num = tonumber(params);
  if (num !== undefined) {
    character = num;
  } else {
    const word = params.toLowerCase();
    const characterFromMap = CHARACTER_MAP.get(word);
    if (characterFromMap === undefined) {
      print("Unknown character.");
      return;
    }
    character = characterFromMap;
  }

  restartAsCharacter(character);
  print(`Restarting as character: ${character}`);
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
  if (player !== undefined) {
    player.AddCoins(coins);
  }
});

executeCmdFunctions.set("coins", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== undefined) {
    player.AddCoins(99);
  }
});

executeCmdFunctions.set("connect", (_params: string) => {
  if (socketClient.connect()) {
    print("Successfully connected.");
  } else {
    print("Failed to connect.");
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
  print("Executing debug function.");
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
  if (player !== undefined) {
    player.UseCard(Card.CARD_FOOL);
  }
});

executeCmdFunctions.set("effects", (_params: string) => {
  const player = Isaac.GetPlayer();
  const effects = player.GetEffects();
  const effectsList = effects.GetEffectsList();
  if (effectsList.Size === 0) {
    print("There are no current temporary effects.");
    return;
  }
  for (let i = 0; i < effectsList.Size; i++) {
    const effect = effectsList.Get(i);
    if (effect !== undefined) {
      log(`${i + 1} - ${effect.Item.Name}`);
    }
  }
  print('Logged the player\'s effects to the "log.txt" file.');
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
  if (player !== undefined) {
    player.AddKeys(keys);
  }
});

executeCmdFunctions.set("keys", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== undefined) {
    player.AddKeys(99);
  }
});

executeCmdFunctions.set("list", (_params: string) => {
  list();
});

executeCmdFunctions.set("listall", (_params: string) => {
  list(true);
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
  speedrunSetNext();
});

executeCmdFunctions.set("pill", (params: string) => {
  if (params === "") {
    print("You must specify a pill name or number.");
    return;
  }

  const num = tonumber(params);
  if (num !== undefined) {
    // Validate the pill ID
    if (num < 1 || num >= PillEffect.NUM_PILL_EFFECTS) {
      print("That is an invalid pill effect ID.");
      return;
    }

    // They entered a number instead of a name, so just give the pill corresponding to this number
    consoleCommand(`g p${num}`);
    print(`Gave pill: #${num}`);
    return;
  }

  const word = params.toLowerCase();
  const pillEffect = PILL_MAP.get(word);
  if (pillEffect === undefined) {
    print("Unknown pill.");
    return;
  }

  consoleCommand(`g p${pillEffect}`);
  print(`Gave pill: #${pillEffect}`);
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

executeCmdFunctions.set("pos", (_params: string) => {
  for (const player of getPlayers()) {
    print(`Player position: (${player.Position.X}, ${player.Position.Y})`);
  }
});

executeCmdFunctions.set("previous", (_params: string) => {
  speedrunSetNext(true);
});

executeCmdFunctions.set("roomindex", (_params: string) => {
  const roomIndex = getRoomIndex();
  print(roomIndex);
});

executeCmdFunctions.set("s", (params: string) => {
  if (params === "") {
    print("You must specify a stage number.");
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
    print(`Invalid stage number; must be between ${minStage} and ${maxStage}.`);
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

executeCmdFunctions.set("save", (_params: string) => {
  saveDataManagerSave();
  print('Saved variables to the "save#.dat" file.');
});

executeCmdFunctions.set("seededrace", (params: string) => {
  const enabled = params !== "off";

  g.race.status = enabled ? RaceStatus.IN_PROGRESS : RaceStatus.NONE;
  g.race.myStatus = enabled ? RacerStatus.RACING : RacerStatus.NOT_READY;
  g.race.format = enabled ? RaceFormat.SEEDED : RaceFormat.UNSEEDED;

  const enabledText = enabled ? "Enabled" : "Disabled";
  print(`${enabledText} seeded race mode.`);
});

executeCmdFunctions.set("setcharorder", (_params: string) => {
  setCharacterOrderDebug();
  restartOnNextFrame();
});

executeCmdFunctions.set("shop", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== undefined) {
    player.UseCard(Card.CARD_HERMIT);
  }
});

executeCmdFunctions.set("sound", (params: string) => {
  const soundEffect = validateNumber(params);
  if (soundEffect === undefined) {
    return;
  }
  g.sfx.Play(soundEffect);
});

executeCmdFunctions.set("sounds", (_params: string) => {
  print("Printing out the currently playing sounds to the log.txt.");
  for (let i = 0; i < SoundEffect.NUM_SOUND_EFFECTS; i++) {
    if (g.sfx.IsPlaying(i)) {
      log(`Currently playing sound effect: ${i}`);
    }
  }
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
  if (player !== undefined) {
    player.UseCard(Card.CARD_STARS);
  }
});

executeCmdFunctions.set("unseed", (_params: string) => {
  unseed();
  restart();
});

executeCmdFunctions.set("version", (_params: string) => {
  const msg = `Racing+ version: ${VERSION}`;
  log(msg);
  print(msg);
});
