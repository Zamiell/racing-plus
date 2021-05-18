import * as changeCharOrder from "../challenges/changeCharOrder";
import * as changeKeybindings from "../challenges/changeKeybindings";
import { ChallengeCustom } from "../challenges/enums";
import * as speedrunPostNewRoom from "../challenges/postNewRoom";
import { Vector.Zero } from "../constants";
import * as bossRush from "../features/bossRush";
import * as challengeRooms from "../features/challengeRooms";
import * as fastTravel from "../features/fastTravel";
import g from "../globals";
import * as schoolbag from "../items/schoolbag";
import * as misc from "../misc";
import * as racePostNewRoom from "../race/postNewRoom";
import * as sprites from "../sprites";
import { EntityTypeCustom } from "../types/enums";
import GlobalsRunRoom from "../types/GlobalsRunRoom";

export function main(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomStageID = roomDesc.Data.StageID;
  const roomVariant = roomDesc.Data.Variant;

  // Make sure the callbacks run in the right order
  // (naturally, PostNewRoom gets called before the PostNewLevel and PostGameStarted callbacks)
  if (
    gameFrameCount === 0 ||
    g.run.level.stage !== stage ||
    g.run.level.stageType !== stageType
  ) {
    // Make an exception if we are using the "goto" command to go to a debug room
    if (g.run.goingToDebugRoom && roomStageID === 2 && roomVariant === 0) {
      g.run.goingToDebugRoom = false;
    } else {
      return;
    }
  }

  // Don't enter the callback if ( we are planning on immediately reseeding the floor
  if (g.run.reseedNextFloor) {
    Isaac.DebugString(
      "Not entering the NewRoom() function due to an imminent reseed.",
    );
    return;
  }

  newRoom();
}

export function newRoom(): void {
  // Local variables
  const stage = g.l.GetStage();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomStageID = roomDesc.Data.StageID;
  const roomVariant = roomDesc.Data.Variant;
  const roomClear = g.r.IsClear();

  Isaac.DebugString(
    `MC_POST_NEW_ROOM2 - ${roomStageID}.${roomVariant} (on stage ${stage})`,
  );

  // Keep track of how many rooms we enter over the course of the run
  g.run.roomsEntered += 1;

  // Reset the state of whether the room is clear or not
  // (this is needed so that we don't get credit for clearing a room when
  // bombing from a room with enemies into an empty room)
  g.run.currentRoomClearState = roomClear;

  // Check to see if we need to remove the heart container from a Strength card on Keeper
  // (this has to be done before the resetting of the "g.run.usedStrength" variable)
  checkRemoveKeeperHeartContainerFromStrength();

  samael.CheckHairpin(); // Check to see if we need to fix the Wraith Skull + Hairpin bug
  schoolbag.postNewRoom(); // Handle the Glowing Hour Glass mechanics relating to the Schoolbag
  bossRush.postNewRoom();
  challengeRooms.postNewRoom();
  // Check to see if we need to respawn trapdoors / crawlspaces / beams of light
  fastTravel.entity.checkRespawn();
  fastTravel.trapdoor.checkNewFloor(); // Check if we are just arriving on a new floor
  fastTravel.crawlspace.checkMiscBugs(); // Check for miscellaneous crawlspace bugs

  checkDrawEdenStartingItems();
  // Remove the "More Options" buff if they have entered a Treasure Room
  checkRemoveMoreOptions();
  checkZeroHealth(); // Fix the bug where we don't die at 0 hearts
  checkStartingRoom(); // Draw the starting room graphic
  checkPostTeleportInvalidEntrance();
  checkSatanRoom(); // Check for the Satan room
  checkMegaSatanRoom(); // Check for Mega Satan on "Everything" races
  checkScolexRoom(); // Check for all of the Scolex boss rooms
  checkDepthsPuzzle(); // Check for the unavoidable puzzle room in the Dank Depths
  checkEntities(); // Check for various NPCs
  // Check to see if we need to respawn an end-of-race or end-of-speedrun trophy
  checkRespawnTrophy();
  banB1TreasureRoom(); // Certain formats ban the Treasure Room in Basement 1
  banB1CurseRoom(); // Certain formats ban the Curse Room in Basement 1

  changeCharOrder.postNewRoom(); // The "Change Char Order" custom challenge
  changeKeybindings.postNewRoom(); // The "Change Keybindings" custom challenge
  racePostNewRoom.main(); // Do race related stuff
  speedrunPostNewRoom.main(); // Do speedrun related stuff
}

// Check to see if we need to remove the heart container from a Strength card on Keeper
// (this has to be done before the resetting of the "g.run.usedStrength" variable)
function checkRemoveKeeperHeartContainerFromStrength() {
  // Local variables
  const character = g.p.GetPlayerType();

  if (
    character === PlayerType.PLAYER_KEEPER &&
    g.run.keeper.baseHearts === 4 &&
    g.run.room.usedStrength
  ) {
    g.run.keeper.baseHearts = 2;
    g.p.AddMaxHearts(-2, true); // Take away a heart container
    Isaac.DebugString(
      "Took away 1 heart container from Keeper (via a Strength card). (PostNewRoom)",
    );
  }
}

function checkDrawEdenStartingItems() {
  // Show only the items in the starting room
  if (g.run.roomsEntered >= 2) {
    sprites.init("eden-item1", "");
    sprites.init("eden-item2", "");
    return;
  }

  const character = g.p.GetPlayerType();
  if (character !== PlayerType.PLAYER_EDEN) {
    return;
  }

  const [edenItem1, edenItem2] = g.run.edenStartingItems;
  sprites.init("eden-item1", edenItem1.toString());
  sprites.init("eden-item2", edenItem2.toString());
}

// Remove the "More Options" buff if they have entered a Treasure Room
function checkRemoveMoreOptions() {
  // Local variables
  const roomType = g.r.GetType();

  if (g.run.removeMoreOptions === true && roomType === RoomType.ROOM_TREASURE) {
    g.run.removeMoreOptions = false;
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS);
  }
}

// Check health (to fix the bug where we don't die at 0 hearts)
// (this happens if Keeper uses Guppy's Paw or when Magdalene takes a devil deal that grants
// soul/black hearts)
function checkZeroHealth() {
  // Local variables
  const hearts = g.p.GetHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();

  if (
    hearts === 0 &&
    soulHearts === 0 &&
    boneHearts === 0 &&
    !g.run.seededSwap.swapping && // Make an exception if we are manually swapping health values
    InfinityTrueCoopInterface === undefined // Make an exception if the True Co-op mod is on
  ) {
    g.p.Kill();
    Isaac.DebugString(
      "Manually killing the player since they are at 0 hearts.",
    );
  }
}

// Racing+ re-implements the starting room graphic so that it will not interfere with other kinds of
// graphics (some code is borrowed from Revelations / StageAPI)
function checkStartingRoom() {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const centerPos = g.r.GetCenterPos();

  // Only draw the graphic in the starting room of the first floor
  // (and ignore Greed Mode, even though on vanilla the sprite will display in Greed Mode)
  if (
    g.run.startingRoomGraphics ||
    g.g.Difficulty >= Difficulty.DIFFICULTY_GREED ||
    stage !== 1 ||
    roomIndex !== g.l.GetStartingRoomIndex()
  ) {
    return;
  }

  // Spawn the custom "Floor Effect Creep" entity (1000.46.12545)
  const controlsEffect = Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.PLAYER_CREEP_RED,
    12545, // There is no "Isaac.GetEntitySubTypeByName()" function
    centerPos,
    Vector.Zero,
    null,
  ).ToEffect();
  if (controlsEffect === null) {
    return;
  }

  controlsEffect.Timeout = 1000000;
  const controlsSprite = controlsEffect.GetSprite();
  controlsSprite.Load("gfx/backdrop/controls.anm2", true);
  controlsSprite.Play("Idle", true);

  // Always set the scale to 1 in case the player has an item like Lost Cork
  // (otherwise, it will have a scale of 1.75)
  controlsEffect.Scale = 1;

  // On vanilla, the sprite is a slightly different color on the Burning Basement
  if (stageType === StageType.STAGETYPE_AFTERBIRTH) {
    controlsSprite.Color = Color(0.5, 0.5, 0.5, 1, 0, 0, 0);
  }
}

function checkPostTeleportInvalidEntrance() {
  if (!g.run.usedTeleport) {
    return;
  }
  g.run.usedTeleport = false;

  // Local variables
  const roomShape = g.r.GetRoomShape();

  // Don't bother fixing entrances in big room,
  // as teleporting the player to a valid door can cause the camera to jerk in a buggy way
  if (roomShape >= RoomShape.ROOMSHAPE_1x2) {
    return;
  }

  // Check to see if they are at an entrance
  let nextToADoor = false;
  let firstDoorSlot: int | null = null;
  let firstDoorPosition: Vector | null = null;
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (
      door !== null &&
      door.TargetRoomType !== RoomType.ROOM_SECRET && // 7
      door.TargetRoomType !== RoomType.ROOM_SUPERSECRET // 8
    ) {
      if (firstDoorSlot === null) {
        firstDoorSlot = i;
        firstDoorPosition = Vector(door.Position.X, door.Position.Y);
      }
      if (door.Position.Distance(g.p.Position) < 60) {
        nextToADoor = true;
        break;
      }
    }
  }

  // Some rooms have no doors, like I AM ERROR rooms
  if (!nextToADoor && firstDoorSlot !== null && firstDoorPosition !== null) {
    // They teleported to a non-existent entrance,
    // so manually move the player next to the first door in the room
    // We can't move them directly to the door position or they would just enter the loading zone
    // Players always appear 40 units away from the door when entering a room,
    // so calculate the offset based on the door slot
    let x = firstDoorPosition.X;
    let y = firstDoorPosition.Y;
    if (firstDoorSlot === DoorSlot.LEFT0 || firstDoorSlot === DoorSlot.LEFT1) {
      x += 40;
    } else if (
      firstDoorSlot === DoorSlot.UP0 ||
      firstDoorSlot === DoorSlot.UP1
    ) {
      y += 40;
    } else if (
      firstDoorSlot === DoorSlot.RIGHT0 ||
      firstDoorSlot === DoorSlot.RIGHT1
    ) {
      x -= 40;
    } else if (
      firstDoorSlot === DoorSlot.DOWN0 ||
      firstDoorSlot === DoorSlot.DOWN1
    ) {
      y -= 40;
    }

    // Move the player
    const newPosition = Vector(x, y);
    g.p.Position = newPosition;

    // Also move the familiars
    const familiars = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR,
      -1,
      -1,
      false,
      false,
    );
    for (const familiar of familiars) {
      familiar.Position = newPosition;
    }
  }
}

// Instantly spawn the first part of the fight
// (there is an annoying delay before The Fallen and the leeches spawn)
function checkSatanRoom() {
  // Local variables
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomStageID = roomDesc.Data.StageID;
  const roomVariant = roomDesc.Data.Variant;
  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();
  const challenge = Isaac.GetChallenge();

  if (roomClear) {
    return;
  }

  // There is only one Satan room
  if (roomStageID !== 0 || roomVariant !== 3600) {
    return;
  }

  // In the season 3 speedrun challenge, there is a custom boss instead of Satan
  if (challenge === ChallengeCustom.R7_SEASON_3) {
    return;
  }

  // Spawn 2x Kamikaze Leech (55.1) & 1x Fallen (81.0)
  let seed = roomSeed;
  seed = misc.incrementRNG(seed);
  g.g.Spawn(
    EntityType.ENTITY_LEECH,
    1,
    misc.gridToPos(5, 3),
    Vector.Zero,
    null,
    0,
    seed,
  );
  seed = misc.incrementRNG(seed);
  g.g.Spawn(
    EntityType.ENTITY_LEECH,
    1,
    misc.gridToPos(7, 3),
    Vector.Zero,
    null,
    0,
    seed,
  );
  seed = misc.incrementRNG(seed);
  g.g.Spawn(
    EntityType.ENTITY_FALLEN,
    0,
    misc.gridToPos(6, 3),
    Vector.Zero,
    null,
    0,
    seed,
  );

  // Prime the statue to wake up quicker
  const satans = Isaac.FindByType(
    EntityType.ENTITY_SATAN,
    -1,
    -1,
    false,
    false,
  );
  for (const satan of satans) {
    const npc = satan.ToNPC();
    if (npc !== null) {
      npc.I1 = 1;
    }
  }

  Isaac.DebugString("Spawned the first wave manually and primed the statue.");
}

// Check to see if we are entering the Mega Satan room so we can update the floor tracker and
// prevent cheating on the "Everything" race goal
function checkMegaSatanRoom() {
  // Local variables
  const roomIndex = misc.getRoomIndex();

  // Check to see if we are entering the Mega Satan room
  if (roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX) {
    return;
  }

  // Emulate reaching a new floor, using a custom floor number of 13 (The Void is 12)
  Isaac.DebugString("Entered the Mega Satan room.");

  // Check to see if we are cheating on the "Everything" race goal
  if (g.race.goal === "Everything" && !g.run.killedLamb) {
    // Do a little something fun
    g.sfx.Play(SoundEffect.SOUND_THUMBS_DOWN, 1, 0, false, 1);
    for (let i = 0; i < 20; i++) {
      const pos = g.r.FindFreePickupSpawnPosition(g.p.Position, 50, true);
      // Use a value of 50 to spawn them far from the player
      const monstro = Isaac.Spawn(
        EntityType.ENTITY_MONSTRO,
        0,
        0,
        pos,
        Vector.Zero,
        null,
      );
      monstro.MaxHitPoints = 1000000;
      monstro.HitPoints = 1000000;
    }
  }
}

function checkScolexRoom() {
  // Local variables
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomStageID = roomDesc.Data.StageID;
  const roomVariant = roomDesc.Data.Variant;
  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();
  const challenge = Isaac.GetChallenge();

  // We don't need to modify Scolex if the room is already cleared
  if (roomClear) {
    return;
  }

  // We only need to check for rooms from the "Special Rooms" STB
  if (roomStageID !== 0) {
    return;
  }

  // Don't do anything if we are not in one of the Scolex boss rooms
  // (there are no Double Trouble rooms with any Scolex)
  if (
    roomVariant !== 1070 &&
    roomVariant !== 1071 &&
    roomVariant !== 1072 &&
    roomVariant !== 1073 &&
    roomVariant !== 1074 &&
    roomVariant !== 1075
  ) {
    return;
  }

  if (
    g.race.rFormat === "seeded" ||
    challenge === ChallengeCustom.R7_SEASON_6
  ) {
    // Since Scolex (62.1) attack patterns ruin seeded races, delete it and replace it with two Frails
    // (there are 10 Scolex entities)
    const scolexes = Isaac.FindByType(
      EntityType.ENTITY_PIN,
      1,
      -1,
      false,
      false,
    );
    for (const scolex of scolexes) {
      scolex.Remove(); // This takes a game frame to actually get removed
    }

    let seed = roomSeed;
    for (let i = 0; i < 2; i++) {
      // We don't want to spawn both of them on top of each other since that would make them behave
      // a little glitchy
      const pos = g.r.GetCenterPos();
      if (i === 1) {
        pos.X -= 150;
      } else if (i === 2) {
        pos.X += 150;
      }
      // Note that pos.X += 200 causes the hitbox to appear too close to the left/right side,
      // causing damage if the player moves into the room too quickly
      seed = misc.incrementRNG(seed);
      const frail = g.g.Spawn(
        EntityType.ENTITY_PIN,
        2,
        pos,
        Vector.Zero,
        null,
        0,
        seed,
      );
      // It will show the head on the first frame after spawning unless we hide it
      frail.Visible = false;
      // The game will automatically make the entity visible later on
    }
    Isaac.DebugString("Spawned 2 replacement Frails for Scolex.");
  }
}

// Prevent unavoidable damage in a specific room in the Dank Depths
function checkDepthsPuzzle() {
  // Local variables
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomVariant = roomDesc.Data.Variant;
  const gridSize = g.r.GetGridSize();

  // We only need to check if we are in the Dank Depths
  if (stage !== 5 && stage !== 6) {
    return;
  }
  if (stageType !== 2) {
    return;
  }

  if (
    roomVariant !== 41 &&
    roomVariant !== 10041 && // (flipped)
    roomVariant !== 20041 && // (flipped)
    roomVariant !== 30041 // (flipped)
  ) {
    return;
  }

  // Scan the entire room to see if any rocks were replaced with spikes
  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== null) {
      const saveState = gridEntity.GetSaveState();
      if (saveState.Type === GridEntityType.GRID_SPIKES) {
        // Remove the spikes
        gridEntity.Sprite = Sprite(); // If we don't do this, it will still show for a frame
        g.r.RemoveGridEntity(i, 0, false); // gridEntity.Destroy() does not work

        // Originally, we would add a rock here with:
        // "Isaac.GridSpawn(GridEntityType.GRID_ROCK, 0, gridEntity.Position, true)"
        // However, this results in invisible collision persisting after the rock is killed
        // This bug can probably be subverted by waiting a frame for the spikes to fully despawn,
        // but then having rocks spawn "out of nowhere" would look glitchy,
        // so just remove the spikes and don't do anything else
        Isaac.DebugString(
          "Removed spikes from the Dank Depths bomb puzzle room.",
        );
      }
    }
  }
}

// Check for various NPCs all at once
// (we want to loop through all of the entities in the room only for performance reasons)
function checkEntities() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const roomClear = g.r.IsClear();
  const roomShape = g.r.GetRoomShape();
  const roomSeed = g.r.GetSpawnSeed();
  const character = g.p.GetPlayerType();

  let subvertTeleport = false;
  let pinFound = false;
  for (const entity of Isaac.GetRoomEntities()) {
    if (
      entity.Type === EntityType.ENTITY_GURDY || // 36
      entity.Type === EntityType.ENTITY_MOM || // 45
      entity.Type === EntityType.ENTITY_MOMS_HEART // 78 (this includes It Lives!)
    ) {
      subvertTeleport = true;
      if (entity.Type === EntityType.ENTITY_MOM) {
        g.run.room.forceMomStomp = true;
      }
    } else if (
      entity.Type === EntityType.ENTITY_SLOTH || // Sloth (46.0) and Super Sloth (46.1)
      entity.Type === EntityType.ENTITY_PRIDE // Pride (52.0) and Super Pride (52.1)
    ) {
      // Replace all Sloths / Super Sloths / Prides / Super Prides with a new one that has an
      // InitSeed equal to the room
      // (we want the card drop to always be the same if there happens to be more than one in the
      // room; in vanilla the type of card that drops depends on the order you kill them in)
      g.g.Spawn(
        entity.Type,
        entity.Variant,
        entity.Position,
        entity.Velocity,
        entity.Parent,
        entity.SubType,
        roomSeed,
      );
      entity.Remove();
    } else if (entity.Type === EntityType.ENTITY_PIN) {
      // 62
      pinFound = true;
    } else if (
      entity.Type === EntityType.ENTITY_THE_HAUNT &&
      entity.Variant === 0
    ) {
      // Haunt (260.0)
      // Speed up the first Lil' Haunt attached to a Haunt (1/3)
      // Later on this frame, the Lil' Haunts will spawn and have their state altered
      // in the "PostNPCInit.Main()" function
      // We will mark to actually detach one of them one frame from now
      // (or two of them, if there are two Haunts in the room)
      g.run.speedLilHauntsFrame = gameFrameCount + 1;

      // We also need to check for the black champion version of The Haunt,
      // since both of his Lil' Haunts should detach at the same time
      const npc = entity.ToNPC();
      if (npc !== null && npc.GetBossColorIdx() === 17) {
        g.run.speedLilHauntsBlack = true;
      }
    } else if (
      entity.Type === EntityType.ENTITY_PITFALL &&
      entity.Variant === 1 &&
      roomClear
    ) {
      // Suction Pitfall (291.1)
      // Prevent the bug where if Suction Pitfalls do not complete their "Disappear" animation by
      // the time the player leaves the room, they will re-appear the next time the player enters
      // the room (even though the room is already cleared and they should be gone)
      entity.Remove();
      Isaac.DebugString("Removed a buggy stray Suction Pitfall.");
    }
  }

  // Subvert the disruptive teleportation from Gurdy, Mom, Mom's Heart, and It Lives
  if (
    subvertTeleport &&
    !roomClear &&
    roomShape === RoomShape.ROOMSHAPE_1x1
    // (there are Double Trouble rooms with Gurdy but they don't cause a teleport)
  ) {
    g.run.room.teleportSubverted = true;

    // Make the player invisible or else it will show them on the teleported position for 1 frame
    // (we can't just move the player here because the teleport occurs after this callback finishes)
    g.run.room.teleportSubvertScale = g.p.SpriteScale;
    g.p.SpriteScale = Vector.Zero;
    // (we actually move the player on the next frame in the "checkSubvertTeleport()" function)

    // Also make the familiars invisible
    // (for some reason, we can use the "Visible" property instead of resorting to "SpriteScale"
    // like we do for the player)
    const familiars = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR,
      -1,
      -1,
      false,
      false,
    );
    for (const familiar of familiars) {
      familiar.Visible = false;
    }

    // If we are The Soul, the Forgotten body will also need to be teleported
    // However, if we change its position manually,
    // it will just warp back to the same spot on the next frame
    // Thus, just manually switch to the Forgotten to avoid this bug
    if (character === PlayerType.PLAYER_THESOUL) {
      g.run.switchForgotten = true;
    }

    Isaac.DebugString("Subverted a position teleport (1/2).");
  }

  // If Pin is in the room, cause a rumble as a warning for deaf players
  if (pinFound) {
    g.g.ShakeScreen(20);
    Isaac.DebugString("Pin detected; shaking the screen.");
  }
}

// Check to see if we need to respawn an end-of-race or end-of-speedrun trophy
function checkRespawnTrophy() {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();

  if (
    g.run.trophy.spawned === false ||
    g.run.trophy.stage !== stage ||
    g.run.trophy.roomIndex !== roomIndex
  ) {
    return;
  }

  // Don't respawn the trophy if we already touched it and finished a race/speedrun
  if (g.raceVars.finished || g.speedrun.finished) {
    return;
  }

  // We are re-entering a room where a trophy spawned (which is a custom entity),
  // so we need to respawn it
  Isaac.Spawn(
    EntityTypeCustom.ENTITY_RACE_TROPHY,
    0,
    0,
    g.run.trophy.position,
    Vector.Zero,
    null,
  );
  Isaac.DebugString("Respawned the end of race/speedrun trophy.");
}

function banB1TreasureRoom() {
  if (!shouldBanB1TreasureRoom()) {
    return;
  }

  // Delete the doors to the Basement 1 treasure room, if any
  // (this includes the doors in a Secret Room)
  // (we must delete the door before changing the minimap, or else the icon will remain)
  const roomIndex = g.l.QueryRoomTypeIndex(
    RoomType.ROOM_TREASURE,
    false,
    RNG(),
  );
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (door !== null && door.TargetRoomIndex === roomIndex) {
      g.r.RemoveDoor(i);
      Isaac.DebugString("Removed the Treasure Room door on B1.");
    }
  }

  // Delete the icon on the minimap
  // (this has to be done on every room, because it will reappear)
  let roomDesc;
  if (MinimapAPI === null) {
    roomDesc = g.l.GetRoomByIdx(roomIndex);
    roomDesc.DisplayFlags = 0;
    g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
  } else {
    roomDesc = MinimapAPI.GetRoomByIdx(roomIndex);
    if (roomDesc !== null) {
      roomDesc.Remove();
    }
  }
}

function shouldBanB1TreasureRoom() {
  // Local variables
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();

  return (
    stage === 1 &&
    (g.race.rFormat === "seeded" ||
      challenge === ChallengeCustom.R7_SEASON_4 ||
      (challenge === ChallengeCustom.R7_SEASON_5 &&
        g.speedrun.characterNum >= 2) ||
      challenge === ChallengeCustom.R7_SEASON_6 ||
      challenge === ChallengeCustom.R7_SEASON_9)
  );
}

function banB1CurseRoom() {
  if (!shouldBanB1CurseRoom()) {
    return;
  }

  // Delete the doors to the Basement 1 curse room, if any
  // (this includes the doors in a Secret Room)
  // (we must delete the door before changing the minimap, or else the icon will remain)
  let roomIndex: int | null = null;
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    // We check for "door.TargetRoomType" instead of "door.TargetRoomIndex" because it leads to bugs
    if (door !== null && door.TargetRoomType === RoomType.ROOM_CURSE) {
      g.r.RemoveDoor(i);
      roomIndex = door.TargetRoomIndex;
      Isaac.DebugString("Removed the Curse Room door on B1.");
    }
  }
  if (roomIndex === null) {
    return;
  }

  // Delete the icon on the minimap
  // (this has to be done on every room, because it will reappear)
  let roomDesc;
  if (MinimapAPI === undefined) {
    roomDesc = g.l.GetRoomByIdx(roomIndex);
    roomDesc.DisplayFlags = 0;
    g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
  } else {
    roomDesc = MinimapAPI.GetRoomByIdx(roomIndex);
    if (roomDesc !== null) {
      roomDesc.Remove();
    }
  }
}

function shouldBanB1CurseRoom() {
  // Local variables
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();

  return stage === 1 && challenge === ChallengeCustom.R7_SEASON_9;
}
