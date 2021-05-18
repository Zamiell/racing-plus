import { ChallengeCustom } from "../challenges/enums";
import * as season7 from "../challenges/season7";
import * as fastTravel from "../features/fastTravel";
import * as seededFloors from "../features/seededFloors";
import g from "../globals";
import * as soulJar from "../items/soulJar";
import * as misc from "../misc";
import { CollectibleTypeCustom } from "../types/enums";
import GlobalsRunLevel from "../types/GlobalsRunLevel";
import * as postNewRoom from "./postNewRoom";

function newLevel() {
  const customRun = g.seeds.IsCustomRun();
  const challenge = Isaac.GetChallenge();

  // Reset the RNG of some items that should be seeded per floor
  const stageSeed = g.seeds.GetStageSeed(stage);
  g.RNGCounter.teleport = stageSeed;
  g.RNGCounter.undefined = stageSeed;
  g.RNGCounter.telepills = stageSeed;
  for (let i = 0; i < 100; i++) {
    // Increment the RNG 100 times so that players cannot use knowledge of Teleport! teleports
    // to determine where the Telepills destination will be
    g.RNGCounter.telepills = misc.incrementRNG(g.RNGCounter.telepills);
  }

  // Make sure that the diversity placeholder items are removed
  if (stage >= 2) {
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3,
    );
  }

  // Handle the Soul Jar
  soulJar.postNewLevel();

  // Ensure that the "More Options" buff does not persist beyond Basement 1
  // (it is removed as soon as they enter the first Treasure Room,
  // but they might have skipped the Basement 1 Treasure Room for some reason)
  if (stage >= 2 && g.run.removeMoreOptions === true) {
    g.run.removeMoreOptions = false;
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS);
  }

  // Handle multi-character speedruns
  season7.postNewLevel();

  // Seed floors that are generated when a player uses a Forget Me Now or a 5-pip Dice Room
  if (g.run.forgetMeNow) {
    g.run.forgetMeNow = false;
    seededFloors.after();
  }

  // Call PostNewRoom manually (they get naturally called out of order)
  postNewRoom.newRoom();
}

// Reseed the floor if we have Duality and there is a narrow boss room
function checkDualityNarrowRoom() {
  if (!g.p.HasCollectible(CollectibleType.COLLECTIBLE_DUALITY)) {
    return false;
  }

  // It is only possible to get a Devil Deal on floors 2 through 8
  // Furthermore, it is not possible to get a narrow room on floor 8
  const stage = g.l.GetStage();
  if (stage <= 1 || stage >= 8) {
    return false;
  }

  // Check to see if the boss room is narrow
  const rooms = g.l.GetRooms();
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i); // This is 0 indexed
    if (room === null) {
      continue;
    }

    if (room.Data.Type === RoomType.ROOM_BOSS) {
      if (
        room.Data.Shape === RoomShape.ROOMSHAPE_IH || // 2
        room.Data.Shape === RoomShape.ROOMSHAPE_IV // 3
      ) {
        Isaac.DebugString(
          "Narrow boss room detected with Duality - reseeding.",
        );
        return true;
      }
    }
  }

  return false;
}

// If the Forgotten has Chocolate Milk or Brimstone, and then spends all of his soul hearts in a
// devil deal, then they can become softlocked in certain specific island rooms
function checkForgottenSoftlock() {
  const character = g.p.GetPlayerType();
  if (character !== PlayerType.PLAYER_THEFORGOTTEN) {
    return false;
  }

  const subPlayer = g.p.GetSubPlayer();
  const soulHearts = subPlayer.GetSoulHearts();
  if (soulHearts > 0) {
    return false;
  }

  if (
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) && // 69
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) && // 118
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) // 316
  ) {
    return false;
  }

  // Local variables
  const stage = g.l.GetStage();
  if (stage <= 2 || stage >= 9) {
    return false;
  }

  // Search through the floor for specific rooms
  const rooms = g.l.GetRooms();
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i); // This is 0 indexed
    if (room === null) {
      continue;
    }
    if (room.Data.Type === RoomType.ROOM_DEFAULT) {
      // Normalize the room ID (to account for flipped rooms)
      let roomID = room.Data.Variant;
      while (roomID >= 10000) {
        // The 3 flipped versions of room #1 would be #10001, #20001, and #30001
        roomID -= 10000;
      }

      const stageID = room.Data.StageID;
      if (
        // Caves / Flooded Caves
        ((stageID === 4 || stageID === 6) && roomID === 226) ||
        ((stageID === 4 || stageID === 6) && roomID === 251) ||
        ((stageID === 4 || stageID === 6) && roomID === 303) ||
        ((stageID === 4 || stageID === 6) && roomID === 500) ||
        // Caves / Catacombs / Flooded Caves
        ((stageID === 4 || stageID === 5 || stageID === 6) && roomID === 305) ||
        ((stageID === 4 || stageID === 5 || stageID === 6) && roomID === 337) ||
        ((stageID === 4 || stageID === 5 || stageID === 6) && roomID === 378) ||
        ((stageID === 4 || stageID === 5 || stageID === 6) && roomID === 450) ||
        ((stageID === 4 || stageID === 5 || stageID === 6) && roomID === 488) ||
        ((stageID === 4 || stageID === 5 || stageID === 6) && roomID === 742) ||
        ((stageID === 4 || stageID === 5 || stageID === 6) && roomID === 754) ||
        // Catacombs
        (stageID === 5 && roomID === 224) ||
        // Depths / Necropolis / Dank Depths
        ((stageID === 7 || stageID === 8 || stageID === 9) && roomID === 226) ||
        ((stageID === 7 || stageID === 8 || stageID === 9) && roomID === 227) ||
        ((stageID === 7 || stageID === 8 || stageID === 9) && roomID === 275) ||
        ((stageID === 7 || stageID === 8 || stageID === 9) && roomID === 390) ||
        ((stageID === 7 || stageID === 8 || stageID === 9) && roomID === 417) ||
        ((stageID === 7 || stageID === 8 || stageID === 9) && roomID === 446) ||
        ((stageID === 7 || stageID === 8 || stageID === 9) && roomID === 455) ||
        ((stageID === 7 || stageID === 8 || stageID === 9) && roomID === 492) ||
        ((stageID === 7 || stageID === 8 || stageID === 9) && roomID === 573) ||
        // Womb / Utero / Scarred Womb
        ((stageID === 10 || stageID === 11 || stageID === 12) &&
          roomID === 344) ||
        ((stageID === 10 || stageID === 11 || stageID === 12) &&
          roomID === 417) ||
        ((stageID === 10 || stageID === 11 || stageID === 12) &&
          roomID === 458) ||
        ((stageID === 10 || stageID === 11 || stageID === 12) && roomID === 459)
      ) {
        Isaac.DebugString(
          "Island room detected with low-range Forgotten - reseeding.",
        );
        return true;
      }
    }
  }

  return false;
}

// Reseed the floor if there are duplicate rooms
function checkDupeRooms() {
  // Local variables
  const stage = g.l.GetStage();
  const rooms = g.l.GetRooms();

  // Disable this feature if the "Infinite Basements" Easter Egg is enabled,
  // because the player will run out of rooms after around 40-50 floors
  if (g.seeds.HasSeedEffect(SeedEffect.SEED_INFINITE_BASEMENT)) {
    return false;
  }

  // Don't bother checking on Blue Womb, The Chest / Dark Room, or The Void
  if (stage === 9 || stage === 11 || stage === 12) {
    return false;
  }

  // Reset the room IDs if ( we are arriving at a level with a new stage type
  if (
    stage === 3 ||
    stage === 5 ||
    stage === 7 ||
    stage === 10 ||
    stage === 11
  ) {
    g.run.roomIDs = [];
  }

  const roomIDs: int[] = [];
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i); // This is 0 indexed
    if (room === null) {
      continue;
    }
    if (
      room.Data.Type === RoomType.ROOM_DEFAULT && // 1
      room.Data.Variant !== 2 && // This is the starting room
      room.Data.Variant !== 0 // This is the starting room on The Chest / Dark Room
    ) {
      // Normalize the room ID (to account for flipped rooms)
      let roomID = room.Data.Variant;
      while (roomID >= 10000) {
        // The 3 flipped versions of room #1 would be #10001, #20001, and #30001
        roomID -= 10000;
      }

      // Make Basement 1 exempt from duplication checking so that resetting is faster on bad
      // computers
      if (stage !== 1) {
        // Check to see if this room ID has appeared on previous floors
        if (g.run.roomIDs.includes(roomID)) {
          Isaac.DebugString(
            `Duplicate room ${roomID} found (on previous floor) - reseeding.`,
          );
          return true;
        }

        /*
        // Also check to see if this room ID appears multiple times on this floor
        for (let j = 0; j < roomIDs.length; j++) {
          if ( roomID === roomIDs[j] ) {
            Isaac.DebugString(
              "Duplicate room " + roomID + " found (on same floor) - reseeding."
            )
            return true
          }
        }
        */
      }

      // Keep track of this room ID
      roomIDs.push(roomID);
    }
  }

  // We have gone through all of the rooms and none are duplicated,
  // so permanently store them as rooms already seen
  for (const roomID of roomIDs) {
    g.run.roomIDs.push(roomID);
  }

  return false;
}
