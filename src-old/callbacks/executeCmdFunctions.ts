/*
const functionMap = new Map<string, (params: string) => void>();
export default functionMap;

functionMap.set("angel", (_params: string) => {
  if (!g.p.HasCollectible(CollectibleType.COLLECTIBLE_EUCHARIST)) {
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_EUCHARIST, 0, false);
  }
  g.p.UseCard(Card.CARD_JOKER);
});

functionMap.set("blackmarket", (_params: string) => {
  blackMarket();
});

functionMap.set("boss", (_params: string) => {
  g.run.bossCommand = true;
  g.p.UseCard(Card.CARD_EMPEROR);
  g.run.bossCommand = false;
});

functionMap.set("bm", (_params: string) => {
  blackMarket();
});

functionMap.set("card", (params: string) => {
  if (params === "") {
    misc.console("You must specify a card name.");
    return;
  }

  const num = tonumber(params);
  if (num !== undefined) {
    // Validate the card ID
    if (num < 1 || num >= Card.NUM_CARDS) {
      misc.console("That is an invalid card ID.");
      return;
    }

    // They entered a number instead of a name, so just give the card corresponding to this number
    Isaac.ExecuteCommand(`g k${num}`);
    misc.console(`Gave card: #${num}`);
    return;
  }

  let giveCardID = 0;
  for (const [word, cardID] of CARD_NAME_TO_ID_MAP) {
    if (params === word) {
      giveCardID = cardID;
      break;
    }
  }

  if (giveCardID === 0) {
    misc.console("Unknown card.");
    return;
  }
  Isaac.ExecuteCommand(`g k${giveCardID}`);
  misc.console(`Gave card: #${giveCardID}`);
});

functionMap.set("cards", (_params: string) => {
  let cardNum = 1;
  for (let y = 0; y <= 6; y++) {
    for (let x = 0; x <= 12; x++) {
      if (cardNum < Card.NUM_CARDS) {
        const pos = misc.gridToPos(x, y);
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
    misc.console("You must specify a character number.");
  }

  const num = validateNumber(params);
  if (num === undefined) {
    return;
  }

  g.speedrun.characterNum = num;
});

functionMap.set("commands", (_params: string) => {
  commands();
});

functionMap.set("damage", (_params: string) => {
  g.run.debugDamage = !g.run.debugDamage;
  g.p.AddCacheFlags(CacheFlag.CACHE_ALL);
  g.p.EvaluateItems();
});

functionMap.set("db", (_params: string) => {
  debugFunction();
});

functionMap.set("dd", (_params: string) => {
  g.p.UseCard(Card.CARD_JOKER);
});

functionMap.set("debug", (_params: string) => {
  debugFunction();
});

functionMap.set("devil", (_params: string) => {
  g.p.UseCard(Card.CARD_JOKER);
});

functionMap.set("doors", (_params: string) => {
  // Print out all the doors in the room
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (door !== null) {
      misc.console(`Door ${i} - (${door.Position.X}, ${door.Position.Y})`);
    }
  }
});

functionMap.set("finish", (_params: string) => {
  Isaac.ExecuteCommand("stage 11a");
  Isaac.ExecuteCommand("boss");
  Isaac.ExecuteCommand("cc");
  Isaac.ExecuteCommand("speed");
});

functionMap.set("fool", (_params: string) => {
  g.p.UseCard(Card.CARD_FOOL);
});

functionMap.set("effects", (_params: string) => {
  const effects = g.p.GetEffects();
  const effectsList = effects.GetEffectsList();

  for (let i = 0; i < effectsList.Size; i++) {
    const effect = effectsList.Get(i);
    if (effect === null) {
      misc.console(`Temp effect ${i}: null`);
    } else {
      misc.console(`Temp effect ${i}: ${effect.Item.ID}`);
    }
  }
});

functionMap.set("error", (_params: string) => {
  IAMERROR();
});

functionMap.set("getframe", (_params: string) => {
  // Used for debugging
  misc.console(`Isaac frame count is at: ${Isaac.GetFrameCount()}`);
  misc.console(`Game frame count is at: ${g.g.GetFrameCount()}`);
  misc.console(`Room frame count is at: ${g.r.GetFrameCount()}`);
});

functionMap.set("getroom", (_params: string) => {
  const roomIndex = g.l.GetCurrentRoomIndex();
  misc.console(`Room index is: ${roomIndex}`);
});

functionMap.set("ghost", (_params: string) => {
  shadow();
});

functionMap.set("ghosts", (_params: string) => {
  shadow();
});

functionMap.set("help", (_params: string) => {
  commands();
});

functionMap.set("iamerror", (_params: string) => {
  IAMERROR();
});

functionMap.set("level", (params: string) => {
  // Used to go to the proper floor and stage
  // (always assume a seeded race)
  if (params === "") {
    misc.console("You must specify a level number.");
    return;
  }

  const stage = validateNumber(params);
  if (stage === undefined) {
    return;
  }

  let stageType = fastTravel.trapdoor.getStageType(stage);
  if (stage === 10 || stage === 11) {
    stageType = 1;
  }

  let command = `stage ${stage}`;
  if (stageType === 1) {
    command += "a";
  } else if (stageType === 2) {
    command += "b";
  }

  seededFloors.before(stage);
  misc.executeCommand(command);
  seededFloors.after();
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
  misc.console('Logged the entities in the room to the "log.txt" file.');
});

functionMap.set("next", (_params: string) => {
  // Used to go to the next character in a multi-character speedrun
  speedrunPostUpdate.checkCheckpointTouched(true);
});

/*
ExecuteCmd.functions["pills"] = function(params)
  let pillNum = 1
  for y = 0, 6 ) {
    for x = 0, 12 ) {
      if ( pillNum < PillColor.NUM_PILLS ) {
        let pos = misc.gridToPos(x, y)
        Isaac.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_PILL,
          pillNum,
          pos,
          Vector.Zero,
          null
        )
        pillNum = pillNum + 1
      }
    }
  }
});

ExecuteCmd.functions["pos"] = function(params)
  misc.console("Player position. " + g.p.Position.X + ", " + g.p.Position.Y)
});

ExecuteCmd.functions["previous"] = function(params)
  // Used to go to the previous character in a multi-character speedrun
  if ( g.speedrun.characterNum === 1 ) {
    return
  }
  g.speedrun.characterNum = g.speedrun.characterNum - 2
  SpeedrunPostUpdate.CheckCheckpointTouched(true)
});

ExecuteCmd.functions["removeall"] = function(params)
  // Copied from the "seededDeath.debuffOn()" function
  for (let itemID = 1; itemID <= g.numTotalCollectibles; itemID++) {
    const numItems = g.p.GetCollectibleNum(i)
    if (numItems > 0 && g.p.HasCollectible(itemID)) {
      // Checking both "GetCollectibleNum()" and "HasCollectible()" prevents bugs such as Lilith
      // having 1 Incubus
      for (let i = 1; i <= numItems; i++) {
        g.p.RemoveCollectible(itemID)
        misc.removeItemFromItemTracker(itemID);
        g.p.TryRemoveCollectibleCostume(itemID, false)
      }
    }
  }
});

// "s" is a crash-safe wrapper for the vanilla "stage" command
ExecuteCmd.functions["s"] = function(params)
  if ( params === "" ) {
    misc.console("You must specify a stage number.")
    return
  }

  let finalCharacter = string.sub(params, -1)
  let stageNum
  let stageType
  if ( finalCharacter === "a" || finalCharacter === "b" ) {
    // e.g. "s 11a" for going to The Chest
    stageNum = string.sub(1,params.length - 1)
    stageType = finalCharacter
  } else {
    // e.g. "s 11" for going to the Dark Room
    stageNum = params
    stageType = ""
  }
  let stage = ExecuteCmd.ValidateNumber(stageNum)
  if ( stage === null ) {
    return
  }

  if ( stage < 1 || stage > 12 ) {
    misc.console("Invalid stage number; must be between 1 && 12.")
    return
  }

  g.ExecuteCommand("stage " + stage + stageType)
});

ExecuteCmd.functions["sb"] = function(params)
  ExecuteCmd.Schoolbag(params)
});

ExecuteCmd.functions["schoolbag"] = function(params)
  ExecuteCmd.Schoolbag(params)
});

function ExecuteCmd.Schoolbag(params)
  if ( params === "" ) {
    misc.console("You must specify a Schoolbag item.")
    return
  }

  let itemID = validateNumber(params)
  if ( itemID === null ) {
    return
  }

  let totalItems = g.GetTotalItemCount()
  if ( item < 0 || item > g.GetTotalItemCount() ) {
    misc.console("Invalid item number; must be between 0 && " + totalItems + ".")
    return
  }

  schoolbag.put(item, -1)
});

ExecuteCmd.functions["setbuild"] = function(params)
  if ( params === "" ) {
    misc.console("You must specify a build index.")
  }

  let num = ExecuteCmd.ValidateNumber(params)
  if ( num === null ) {
    return
  }

  Season9.setBuild = num
  Season9.timeBuildAssigned = 0
  Isaac.DebugString("Set the Season 9 build to. " + Season9.setBuild)
});

ExecuteCmd.functions["shadow"] = function(params)
  ExecuteCmd.Shadow()
});

ExecuteCmd.functions["shadows"] = function(params)
  ExecuteCmd.Shadow()
});

function ExecuteCmd.Shadow() {
  // We don't have to verify "g.luaDebug" here before it will be drawn on the screen as an error
  // message in the "Errors.lua" file
  g.raceVars.shadowEnabled = ! g.raceVars.shadowEnabled
  let msg
  if ( g.raceVars.shadowEnabled ) {
    msg = "Enabled"
  } else {
    msg = "Disabled"
  }
  msg = msg + " opponent's ghost / shadow."
  if ( RacingPlusData === null ) {
    msg = (
      msg
      + " (Subscribe to the Racing+ Data mod && enable if ( you want this option to be remembered.)"
    )
  } else {
    RacingPlusData.Set("shadowEnabled", g.raceVars.shadowEnabled)
  }
  misc.console(msg)
});

ExecuteCmd.functions["shadowstatus"] = function(params)
  let msg = "Opponent's ghost / shadow is "
  if ( g.raceVars.shadowEnabled ) {
    msg = msg + "enabled."
  } else {
    msg = msg + "disabled."
  }
  misc.console(msg)

  if ( g.raceVars.shadowEnabled ) {
    misc.console("Connected to the server. " + ShadowClient.connected)
  }
});

ExecuteCmd.functions["shop"] = function(params)
  g.p.UseCard(Card.CARD_HERMIT) // 10
});

ExecuteCmd.functions["sounds"] = function(params)
  misc.console("Printing out the currently playing sounds.")
  for i = 0, SoundEffect.NUM_SOUND_EFFECTS ) {
    if ( g.sfx.IsPlaying(i) ) {
      Isaac.DebugString("Currently playing sound effect. " + i)
    }
  }
});

ExecuteCmd.functions["spam"] = function(params)
  g.run.spamButtons = ! g.run.spamButtons
});

ExecuteCmd.functions["speed"] = function(params)
  g.run.debugSpeed = true
  if ( ! g.p.HasCollectible(CollectibleType.COLLECTIBLE_LORD_OF_THE_PIT) ) {
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_LORD_OF_THE_PIT, 0, false)
  }
  g.p.AddCacheFlags(CacheFlag.CACHE_SPEED) // 16
  g.p.EvaluateItems()
});

ExecuteCmd.functions["tears"] = function(params)
  g.run.debugTears = ! g.run.debugTears
  g.p.AddCacheFlags(CacheFlag.CACHE_FIREDELAY) // 2
  g.p.EvaluateItems()
});

ExecuteCmd.functions["teleport"] = function(params)
  if ( params === "" ) {
    misc.console("You must specify a room index number.")
    return
  }

  let roomIndex = ExecuteCmd.ValidateNumber(params)
  if ( roomIndex === null ) {
    return
  }

  // You have to set LeaveDoor before every teleport || } else { it will send you to the wrong room
  g.l.LeaveDoor = -1

  g.l.ChangeRoom(roomIndex)
});

ExecuteCmd.functions["trapdoor"] = function(params)
  g.p.UseActiveItem(CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER, true, false, false, false) // 84
});

ExecuteCmd.functions["treasure"] = function(params)
  g.p.UseCard(Card.CARD_STARS) // 18
});

function blackMarket() {
  // Mark to potentially reposition the player (if they appear at a non-existent entrance)
  g.run.usedTeleport = true;

  // You have to set LeaveDoor before every teleport or else it will send you to the wrong room
  g.l.LeaveDoor = -1;

  g.g.StartRoomTransition(
    GridRooms.ROOM_BLACK_MARKET_IDX,
    Direction.NO_DIRECTION,
    RoomTransition.TRANSITION_TELEPORT,
  );
}

function chaosCardTears() {
  g.run.debugChaosCard = !g.run.debugChaosCard;
  const enabled = g.run.debugChaosCard ? "Enabled" : "Disabled";
  misc.console(`${enabled} Chaos Card tears.`);
}

function commands() {
  // Compile a list of the commands && sort them
  const commandNames: string[] = [];
  for (const [commandName] of functionMap) {
    commandNames.push(commandName);
  }
  table.sort(commandNames);

  misc.console("List of Racing+ commands:");
  const text = commandNames.join(" ");
  misc.console(text);
}

function debugFunction() {
  Isaac.ExecuteCommand("debug 3");
  Isaac.ExecuteCommand("debug 8");
  Isaac.ExecuteCommand("debug 10");
  Isaac.ExecuteCommand("damage");
  Isaac.ExecuteCommand("speed");
  if (!g.p.HasCollectible(CollectibleType.COLLECTIBLE_XRAY_VISION)) {
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_XRAY_VISION, 0, false);
  }
  if (!g.p.HasCollectible(CollectibleType.COLLECTIBLE_MIND)) {
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_MIND, 0, false);
  }
  g.p.AddCoins(99);
  g.p.AddBombs(99);
  g.p.AddKeys(99);
  misc.console(
    'Added "debug 3", "debug 8", "debug 10", "damage", "speed", X-Ray Vision, The Mind, 99 coins, 99 bombs, and 99 keys.',
  );
}

function IAMERROR() {
  // Mark to potentially reposition the player (if they appear at a non-existent entrance)
  g.run.usedTeleport = true;

  // You have to set LeaveDoor before every teleport or else it will send you to the wrong room
  g.l.LeaveDoor = -1;

  g.g.StartRoomTransition(
    GridRooms.ROOM_ERROR_IDX,
    Direction.NO_DIRECTION,
    RoomTransition.TRANSITION_TELEPORT,
  );
}

function validateNumber(params: string) {
  const num = tonumber(params);
  if (num === undefined) {
    misc.console("You must specify a number.");
  }
  return num;
}
*/
