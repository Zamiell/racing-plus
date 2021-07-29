import { log } from "isaacscript-common";
import CARD_MAP from "../cardMap";
import CHARACTER_MAP from "../characterMap";
import { VERSION } from "../constants";
import debugFunction, { debugFunction2 } from "../debugFunction";
import * as socket from "../features/race/socket";
import g from "../globals";
import { consoleCommand, restartAsCharacter } from "../util";
import { getPlayers, gridToPos } from "../utilGlobals";
import {
  blackMarket,
  chaosCardTears,
  commands,
  crawlspace,
  devil,
  IAMERROR,
  trapdoor,
  validateNumber,
} from "./executeCmdSubroutines";

const functionMap = new Map<string, (params: string) => void>();
export default functionMap;

functionMap.set("angel", (_params: string) => {
  const player = Isaac.GetPlayer();
  const hasEucharist = player.HasCollectible(
    CollectibleType.COLLECTIBLE_EUCHARIST,
  );
  if (!hasEucharist) {
    player.AddCollectible(CollectibleType.COLLECTIBLE_EUCHARIST, 0, false);
  }
  player.UseCard(Card.CARD_JOKER);
  if (!hasEucharist) {
    player.RemoveCollectible(CollectibleType.COLLECTIBLE_EUCHARIST);
  }
});

// cspell:disable-next-line
functionMap.set("blackmarket", (_params: string) => {
  blackMarket();
});

functionMap.set("bomb", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    player.AddBombs(1);
  }
});

functionMap.set("bombs", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    player.AddBombs(99);
  }
});

functionMap.set("boss", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    player.UseCard(Card.CARD_EMPEROR);
  }
});

functionMap.set("bm", (_params: string) => {
  blackMarket();
});

functionMap.set("card", (params: string) => {
  if (params === "") {
    print("You must specify a card name.");
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

functionMap.set("cards", (_params: string) => {
  let cardNum = 1;
  for (let y = 0; y <= 6; y++) {
    for (let x = 0; x <= 12; x++) {
      if (cardNum < Card.NUM_CARDS) {
        const pos = gridToPos(x, y);
        Isaac.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_TAROTCARD,
          cardNum,
          pos,
          Vector.Zero,
          null,
        );
        cardNum += 1;
      }
    }
  }
});

functionMap.set("cc", (_params: string) => {
  chaosCardTears();
});

functionMap.set("chaos", (_params: string) => {
  chaosCardTears();
});

functionMap.set("char", (params: string) => {
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
});

functionMap.set("coin", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    player.AddCoins(1);
  }
});

functionMap.set("coins", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    player.AddCoins(99);
  }
});

functionMap.set("connect", (_params: string) => {
  if (socket.connect()) {
    print("Successfully connected.");
  } else {
    print("Failed to connect.");
  }
});

functionMap.set("commands", (_params: string) => {
  commands(functionMap);
});

functionMap.set("crawl", (_params: string) => {
  crawlspace();
});

functionMap.set("crawlspace", (_params: string) => {
  crawlspace();
});

functionMap.set("dd", (_params: string) => {
  devil();
});

functionMap.set("debug", (_params: string) => {
  print("Executing debug function.");
  debugFunction();
});

functionMap.set("debug2", (_params: string) => {
  debugFunction2();
});

functionMap.set("devil", (_params: string) => {
  devil();
});

functionMap.set("fool", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    player.UseCard(Card.CARD_FOOL);
  }
});

functionMap.set("effects", (_params: string) => {
  const player = Isaac.GetPlayer();
  const effects = player.GetEffects();
  const effectsList = effects.GetEffectsList();
  if (effectsList.Size === 0) {
    print("There are no current temporary effects.");
    return;
  }
  for (let i = 0; i < effectsList.Size; i++) {
    const effect = effectsList.Get(i);
    if (effect !== null) {
      log(`${i + 1} - ${effect.Item.Name}`);
    }
  }
  print('Logged the player\'s effects to the "log.txt" file.');
});

functionMap.set("error", (_params: string) => {
  IAMERROR();
});

functionMap.set("help", (_params: string) => {
  commands(functionMap);
});

functionMap.set("iamerror", (_params: string) => {
  IAMERROR();
});

functionMap.set("key", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    player.AddKeys(1);
  }
});

functionMap.set("keys", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    player.AddKeys(99);
  }
});

functionMap.set("list", (_params: string) => {
  // Used to print out all of the entities in the room
  log("Entities in the room:");
  const roomEntities = Isaac.GetRoomEntities();
  for (let i = 0; i < roomEntities.length; i++) {
    const entity = roomEntities[i];
    let debugString = `${i + 1}  - ${entity.Type}.${entity.Variant}.${
      entity.SubType
    }`;
    const npc = entity.ToNPC();
    if (npc !== null) {
      debugString += `.${npc.State}`;
    }
    debugString += ` (InitSeed: ${entity.InitSeed})`;
    log(debugString);
  }
  print('Logged the entities in the room to the "log.txt" file.');
});

functionMap.set("luck", (_params: string) => {
  consoleCommand("debug 9");
});

functionMap.set("pills", (_params: string) => {
  let pillNum = 1;
  for (let y = 0; y <= 6; y++) {
    for (let x = 0; x <= 12; x++) {
      if (pillNum < PillColor.NUM_PILLS) {
        const pos = gridToPos(x, y);
        Isaac.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_PILL,
          pillNum,
          pos,
          Vector.Zero,
          null,
        );
        pillNum = +1;
      }
    }
  }
});

functionMap.set("pos", (_params: string) => {
  for (const player of getPlayers()) {
    print(`Player position: (${player.Position.X}, ${player.Position.Y})`);
  }
});

functionMap.set("s", (params: string) => {
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

functionMap.set("shop", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    player.UseCard(Card.CARD_HERMIT);
  }
});

functionMap.set("sound", (params: string) => {
  const soundEffect = validateNumber(params);
  if (soundEffect === undefined) {
    return;
  }
  g.sfx.Play(soundEffect);
});

functionMap.set("sounds", (_params: string) => {
  print("Printing out the currently playing sounds to the log.txt.");
  for (let i = 0; i < SoundEffect.NUM_SOUND_EFFECTS; i++) {
    if (g.sfx.IsPlaying(i)) {
      log(`Currently playing sound effect: ${i}`);
    }
  }
});

functionMap.set("speed", (_params: string) => {
  const player = Isaac.GetPlayer();

  g.run.debugSpeed = !g.run.debugSpeed;
  const enabled = g.run.debugSpeed ? "Enabled" : "Disabled";
  print(`${enabled} max speed.`);

  // Also, give the player flight
  if (!player.HasCollectible(CollectibleType.COLLECTIBLE_LORD_OF_THE_PIT)) {
    player.AddCollectible(CollectibleType.COLLECTIBLE_LORD_OF_THE_PIT);
  }

  player.AddCacheFlags(CacheFlag.CACHE_SPEED);
  player.EvaluateItems();
});

functionMap.set("trap", (_params: string) => {
  trapdoor();
});

functionMap.set("trapdoor", (_params: string) => {
  trapdoor();
});

functionMap.set("treasure", (_params: string) => {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    player.UseCard(Card.CARD_STARS);
  }
});

// cspell:disable-next-line
functionMap.set("unseed", (_params: string) => {
  g.seeds.Reset();
  consoleCommand("restart");
});

functionMap.set("version", (_params: string) => {
  const msg = `Racing+ version: ${VERSION}`;
  log(msg);
  print(msg);
});
