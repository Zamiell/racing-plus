import CARD_MAP from "../cardMap";
import { VERSION } from "../constants";
import debugFunction, { debugFunction2 } from "../debugFunction";
import {
  EDEN_ACTIVE_ITEM,
  EDEN_PASSIVE_ITEM,
  SAVE_FILE_SEED,
} from "../features/mandatory/saveFileCheck";
import g from "../globals";
import { consoleCommand, gridToPos } from "../misc";
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
  const hasEucharist = g.p.HasCollectible(
    CollectibleType.COLLECTIBLE_EUCHARIST,
  );
  if (!hasEucharist) {
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_EUCHARIST, 0, false);
  }
  g.p.UseCard(Card.CARD_JOKER);
  if (!hasEucharist) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_EUCHARIST);
  }
});

functionMap.set("blackmarket", (_params: string) => {
  blackMarket();
});

functionMap.set("boss", (_params: string) => {
  g.p.UseCard(Card.CARD_EMPEROR);
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
    Isaac.ExecuteCommand(`g k${num}`);
    print(`Gave card: #${num}`);
    return;
  }

  let giveCardID = 0;
  for (const [word, cardID] of CARD_MAP) {
    if (params === word) {
      giveCardID = cardID;
      break;
    }
  }

  if (giveCardID === 0) {
    print("Unknown card.");
    return;
  }
  Isaac.ExecuteCommand(`g k${giveCardID}`);
  print(`Gave card: #${giveCardID}`);
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
  debugFunction();
});

functionMap.set("debug2", (_params: string) => {
  debugFunction2();
});

functionMap.set("devil", (_params: string) => {
  devil();
});

functionMap.set("char", (params: string) => {
  if (params === "") {
    print("You must specify a character number.");
  }

  const num = validateNumber(params);
  if (num === undefined) {
    return;
  }

  g.speedrun.characterNum = num;
});

functionMap.set("commands", (_params: string) => {
  commands(functionMap);
});

functionMap.set("fool", (_params: string) => {
  g.p.UseCard(Card.CARD_FOOL);
});

functionMap.set("error", (_params: string) => {
  IAMERROR();
});

// Used in: https://pastebin.com/1YY4jb4P
// cspell:disable-next-line
functionMap.set("getedenseed", (_params: string) => {
  print(
    `The seed to check for a fully-unlocked save file is: ${SAVE_FILE_SEED}`,
  );
  const activeItemName = g.itemConfig.GetCollectible(EDEN_ACTIVE_ITEM).Name;
  print(`Eden should start with an active item of: ${activeItemName}`);
  const passiveItemName = g.itemConfig.GetCollectible(EDEN_PASSIVE_ITEM).Name;
  print(`Eden should start with a passive item of: ${passiveItemName}`);
});

functionMap.set("help", (_params: string) => {
  commands(functionMap);
});

functionMap.set("iamerror", (_params: string) => {
  IAMERROR();
});

functionMap.set("list", (_params: string) => {
  // Used to print out all of the entities in the room
  Isaac.DebugString("Entities in the room:");
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
    Isaac.DebugString(debugString);
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
  print(`Player position: (${g.p.Position.X}, ${g.p.Position.Y})`);
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
  g.p.UseCard(Card.CARD_HERMIT);
});

functionMap.set("sound", (params: string) => {
  const soundEffect = validateNumber(params);
  if (soundEffect === undefined) {
    return;
  }
  g.sfx.Play(soundEffect);
});

functionMap.set("sounds", (_params: string) => {
  print("Printing out the currently playing sounds:");
  for (let i = 0; i < SoundEffect.NUM_SOUND_EFFECTS; i++) {
    if (g.sfx.IsPlaying(i)) {
      Isaac.DebugString(`Currently playing sound effect: ${i}`);
    }
  }
});

functionMap.set("speed", (_params: string) => {
  g.run.debugSpeed = !g.run.debugSpeed;
  const enabled = g.run.debugSpeed ? "Enabled" : "Disabled";
  print(`${enabled} max speed.`);

  // Also, give the player flight
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_LORD_OF_THE_PIT);
  // (adding this will trigger the speed stat modification, so we don't have to explicitly call
  // "EvaluateItems()")
});

functionMap.set("trap", (_params: string) => {
  trapdoor();
});

functionMap.set("trapdoor", (_params: string) => {
  trapdoor();
});

functionMap.set("treasure", (_params: string) => {
  g.p.UseCard(Card.CARD_STARS);
});

functionMap.set("version", (_params: string) => {
  const msg = `Racing+ version: ${VERSION}`;
  Isaac.DebugString(msg);
  print(msg);
});
