import { ZERO_VECTOR } from "../constants";
import * as seededDeath from "../features/seededDeath";
import * as seededRooms from "../features/seededRooms";
import g from "../globals";
import * as misc from "../misc";
import * as sprites from "../sprites";
import { CollectibleTypeCustom } from "../types/enums";
import { THREE_DOLLAR_BILL_EFFECTS, VICTORY_LAP_BOSSES } from "./constants";

export function main(): void {
  // Remove some sprites if they are showing
  sprites.init("place2", "");
  sprites.init("dps-button", "");
  sprites.init("victory-lap-button", "");

  gotoRaceRoom();
  threeDollarBill();
  checkEverythingFloorSkip();
  checkOpenMegaSatanDoor();
  checkVictoryLapBossReplace();

  // Check for the special death mechanic
  seededDeath.postNewRoom();
  seededDeath.postNewRoomCheckSacrificeRoom();

  // Check for rooms that should be manually seeded during seeded races
  seededRooms.postNewRoom();
}

// Go to the custom "Race Room"
function gotoRaceRoom() {
  if (g.race.status === "open" || g.race.status === "starting") {
    if (g.run.roomsEntered === 1) {
      Isaac.ExecuteCommand("stage 1a"); // The Cellar is the cleanest floor
      g.run.goingToDebugRoom = true;
      Isaac.ExecuteCommand("goto d.0"); // We do more things in the next "PostNewRoom" callback
    } else if (g.run.roomsEntered === 2) {
      raceStartRoom();
    }
  }
}

export function threeDollarBill(): void {
  if (
    !g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_3_DOLLAR_BILL_SEEDED)
  ) {
    return;
  }

  // Local variables
  const roomSeed = g.r.GetSpawnSeed();

  // Remove the old item
  if (g.run.threeDollarBillItem !== 0) {
    g.p.RemoveCollectible(g.run.threeDollarBillItem);
    misc.removeItemFromItemTracker(g.run.threeDollarBillItem);
  }

  // Get the new item effect
  math.randomseed(roomSeed);
  let effectIndex = math.random(0, THREE_DOLLAR_BILL_EFFECTS.length - 1);
  const itemID = THREE_DOLLAR_BILL_EFFECTS[effectIndex];
  if (!g.p.HasCollectible(itemID)) {
    g.run.threeDollarBillItem = itemID;
    g.p.AddCollectible(itemID, 0, false);
    return;
  }

  // We already have this item
  // Keep iterating over the effect table until we find an item that we do not have yet
  const originalIndex = effectIndex;
  do {
    effectIndex += 1;
    if (effectIndex > THREE_DOLLAR_BILL_EFFECTS.length - 1) {
      effectIndex = 0;
    }

    const newItemID = THREE_DOLLAR_BILL_EFFECTS[effectIndex];
    if (!g.p.HasCollectible(newItemID)) {
      g.run.threeDollarBillItem = newItemID;
      g.p.AddCollectible(newItemID, 0, false);
      return;
    }
  } while (effectIndex !== originalIndex);

  // We have every single item in the list, so do nothing
  g.run.threeDollarBillItem = 0;
}

function checkEverythingFloorSkip() {
  // Local variables
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomType = g.r.GetType();
  const gridSize = g.r.GetGridSize();

  // Prevent players from skipping a floor on the "Everything" race goal
  if (
    g.race.goal === "Everything" &&
    (roomType === RoomType.ROOM_ERROR || // 3
      roomType === RoomType.ROOM_BLACK_MARKET) // 22
  ) {
    let convertTrapdoorsToBeamsOfLight = false;
    let convertBeamsOfLightToTrapdoors = false;
    if (stage === 8) {
      convertTrapdoorsToBeamsOfLight = true;
    } else if (stage === 10 && stageType === 1) {
      // Cathedral
      convertBeamsOfLightToTrapdoors = true;
    } else if (stage === 10 && stageType === 0) {
      // Sheol
      convertTrapdoorsToBeamsOfLight = true;
    }
    // (it is impossible to get a I AM ERROR room or a Black Market on The Chest or the Dark Room)

    if (convertTrapdoorsToBeamsOfLight) {
      // Replace all trapdoors with beams of light
      for (let i = 1; i <= gridSize; i++) {
        const gridEntity = g.r.GetGridEntity(i);
        if (gridEntity !== null) {
          const saveState = gridEntity.GetSaveState();
          if (saveState.Type === GridEntityType.GRID_TRAPDOOR) {
            // Remove the crawlspace and spawn a Heaven Door (1000.39),
            // which will get replaced on the next frame
            // in the "FastTravel.ReplaceHeavenDoor()" function
            // Make the spawner entity the player so that we can distinguish it from the vanilla
            // heaven door
            g.r.RemoveGridEntity(i, 0, false); // gridEntity.Destroy() does not work
            Isaac.Spawn(
              EntityType.ENTITY_EFFECT,
              EffectVariant.HEAVEN_LIGHT_DOOR,
              0,
              gridEntity.Position,
              ZERO_VECTOR,
              g.p,
            );
            Isaac.DebugString(
              "Replaced a trapdoor with a heaven door for an Everything race.",
            );
          }
        }
      }
    }

    if (convertBeamsOfLightToTrapdoors) {
      // Replace all beams of light with trapdoors
      const heavenDoors = Isaac.FindByType(
        EntityType.ENTITY_EFFECT,
        EffectVariant.HEAVEN_LIGHT_DOOR,
        -1,
        false,
        false,
      );
      for (const heavenDoor of heavenDoors) {
        heavenDoor.Remove();

        // Spawn a trapdoor (it will get replaced with the fast-travel version on this frame)
        Isaac.GridSpawn(
          GridEntityType.GRID_TRAPDOOR,
          0,
          heavenDoor.Position,
          true,
        );
        Isaac.DebugString(
          "Replaced a heaven door with a trapdoor for an Everything race.",
        );
      }
    }
  }
}

function raceStartRoom() {
  // Remove all enemies
  for (const entity of Isaac.GetRoomEntities()) {
    const npc = entity.ToNPC();
    if (npc !== null) {
      entity.Remove();
    }
  }
  g.r.SetClear(true);

  // Prevent the mod from thinking the room was cleared in a vanilla way
  g.run.room.fastCleared = true;

  // We want to trap the player in the room, so delete all 4 doors
  for (let i = 0; i <= 3; i++) {
    g.r.RemoveDoor(i);
  }

  // Put the player next to the bottom door
  const pos = Vector(320, 400);
  g.p.Position = pos;

  // Put familiars next to the bottom door, if any
  const familiars = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    -1,
    -1,
    false,
    false,
  );
  for (const familiar of familiars) {
    familiar.Position = pos;
  }

  // Spawn two Gaping Maws (235.0)
  const positions = [
    [5, 5],
    [7, 5],
  ];
  for (const [x, y] of positions) {
    Isaac.Spawn(
      EntityType.ENTITY_GAPING_MAW,
      0,
      0,
      misc.gridToPos(x, y),
      ZERO_VECTOR,
      null,
    );
  }

  // Disable the MinimapAPI to emulate what happens with the vanilla map
  if (MinimapAPI !== null) {
    MinimapAPI.Config.Disable = true;
  }
}

function checkOpenMegaSatanDoor() {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();

  // Check to see if we need to open the Mega Satan Door
  if (
    stage === 11 && // The Chest or Dark Room
    roomIndex === g.l.GetStartingRoomIndex() &&
    (g.race.goal === "Mega Satan" ||
      g.raceVars.finished ||
      (g.race.goal === "Everything" && g.run.killedLamb))
  ) {
    const door = g.r.GetDoor(1); // The top door is always 1
    if (door !== null) {
      door.TryUnlock(true);
      g.sfx.Stop(SoundEffect.SOUND_UNLOCK00);
      // door.IsOpen() is always equal to false here for some reason,
      // so just open it every time we enter the room and silence the sound effect
      Isaac.DebugString("Opened the Mega Satan door.");
    }
  }
}

function checkVictoryLapBossReplace() {
  // Local variables
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomStageID = roomDesc.Data.StageID;
  const roomVariant = roomDesc.Data.Variant;
  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();

  // Check to see if we need to spawn Victory Lap bosses
  if (
    g.raceVars.finished &&
    !roomClear &&
    roomStageID === 0 &&
    // Blue Baby
    (roomVariant === 3390 ||
      roomVariant === 3391 ||
      roomVariant === 3392 ||
      roomVariant === 3393 ||
      // The Lamb
      roomVariant === 5130)
  ) {
    // Replace Blue Baby or The Lamb with some random bosses (based on the number of Victory Laps)
    const isaacs = Isaac.FindByType(
      EntityType.ENTITY_ISAAC,
      -1,
      -1,
      false,
      false,
    );
    for (const entity of isaacs) {
      entity.Remove();
    }
    const lambs = Isaac.FindByType(
      EntityType.ENTITY_THE_LAMB,
      -1,
      -1,
      false,
      false,
    );
    for (const entity of lambs) {
      entity.Remove();
    }

    let randomBossSeed = roomSeed;
    const numBosses = g.raceVars.victoryLaps + 1;
    for (let i = 1; i <= numBosses; i++) {
      randomBossSeed = misc.incrementRNG(randomBossSeed);
      math.randomseed(randomBossSeed);
      const randomBossIndex = math.random(0, VICTORY_LAP_BOSSES.length - 1);
      const randomBoss = VICTORY_LAP_BOSSES[randomBossIndex];
      if (randomBoss[0] === EntityType.ENTITY_LARRYJR) {
        // Larry Jr. and The Hollow require multiple segments
        for (let j = 1; j <= 6; j++) {
          spawnBoss(randomBoss);
        }
      } else {
        spawnBoss(randomBoss);
      }
    }
    Isaac.DebugString(
      `Replaced Blue Baby / The Lamb with ${numBosses} random bosses.`,
    );
  }
}

function spawnBoss(bossArray: [int, int, int]) {
  const [entityType, variant, subType] = bossArray;
  Isaac.Spawn(
    entityType,
    variant,
    subType,
    g.r.GetCenterPos(),
    ZERO_VECTOR,
    null,
  );
}
