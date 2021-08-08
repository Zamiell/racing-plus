/*

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

*/
