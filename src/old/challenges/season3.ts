import { ZERO_VECTOR } from "../constants";
import g from "../globals";
import * as schoolbag from "../items/schoolbag";
import * as misc from "../misc";
import { CollectibleTypeCustom } from "../types/enums";
import { ChallengeCustom } from "./enums";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  // Local variables
  const character = g.p.GetPlayerType();

  Isaac.DebugString("In the R+7 (Season 3) challenge.");

  // Everyone starts with the Schoolbag in this season
  misc.giveItemAndRemoveFromPools(
    CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
  );

  // Give extra items, depending on the character
  switch (character) {
    // 0
    case PlayerType.PLAYER_ISAAC: {
      schoolbag.put(CollectibleType.COLLECTIBLE_MOVING_BOX, -1);
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MOVING_BOX);
      break;
    }

    // 1
    case PlayerType.PLAYER_MAGDALENA: {
      schoolbag.put(CollectibleType.COLLECTIBLE_HOW_TO_JUMP, -1);
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_HOW_TO_JUMP);
      break;
    }

    // 3
    case PlayerType.PLAYER_JUDAS: {
      // We need to touch it to lock in the Bookworm touch
      misc.giveItemAndRemoveFromPools(
        CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL,
      );
      g.p.AddCollectible(CollectibleType.COLLECTIBLE_D6, 6, false);
      schoolbag.put(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL, -1);
      break;
    }

    // 5
    case PlayerType.PLAYER_EVE: {
      schoolbag.put(CollectibleType.COLLECTIBLE_CANDLE, -1);
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_CANDLE);
      break;
    }

    // 6
    case PlayerType.PLAYER_SAMSON: {
      schoolbag.put(CollectibleType.COLLECTIBLE_MR_ME, -1);
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MR_ME);
      break;
    }

    // 8
    case PlayerType.PLAYER_LAZARUS: {
      schoolbag.put(CollectibleType.COLLECTIBLE_VENTRICLE_RAZOR, -1);
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_VENTRICLE_RAZOR);
      break;
    }

    // 10
    case PlayerType.PLAYER_THELOST: {
      schoolbag.put(CollectibleType.COLLECTIBLE_GLASS_CANNON, -1);
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_GLASS_CANNON);

      break;
    }

    default: {
      break;
    }
  }
}

// Replace Blue Baby and The Lamb with custom bosses
export function postNewRoom(): void {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_3) {
    return;
  }

  if (stage !== 10 && stage !== 11) {
    return;
  }

  if (roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  if (roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
    return;
  }

  if (roomClear) {
    return;
  }

  // Don't do anything if we have somehow gone the wrong direction
  // (via We Need to Go Deeper!, Undefined, etc.)
  let direction = g.speedrun.characterNum % 2; // 1 is up, 2 is down
  if (direction === 0) {
    direction = 2;
  }
  if (stageType === 1 && direction === 2) {
    // Cathedral or The Chest
    return;
  }
  if (stageType === 0 && direction === 1) {
    // Sheol or Dark Room
    return;
  }

  for (const entity of Isaac.GetRoomEntities()) {
    if (
      stageType === 1 && // Cathedral
      entity.Type === EntityType.ENTITY_ISAAC
    ) {
      entity.Remove();
    } else if (
      stageType === 0 && // Sheol
      entity.Type === EntityType.ENTITY_SATAN
    ) {
      entity.Remove();
    } else if (
      stageType === 1 && // The Chest
      entity.Type === EntityType.ENTITY_ISAAC
    ) {
      entity.Remove();
    } else if (
      stageType === 0 && // Dark Room
      entity.Type === EntityType.ENTITY_THE_LAMB
    ) {
      entity.Remove();
    }
  }

  // Spawn the replacement boss
  if (stage === 10) {
    const jrFetusType = Isaac.GetEntityTypeByName("Dr Fetus Jr");
    Isaac.Spawn(jrFetusType, 0, 0, g.r.GetCenterPos(), ZERO_VECTOR, null);
    Isaac.DebugString("Spawned Jr. Fetus (for season 3).");
  } else if (stage === 11) {
    const mahalathType = Isaac.GetEntityTypeByName("Mahalath");
    Isaac.Spawn(mahalathType, 0, 0, g.r.GetCenterPos(), ZERO_VECTOR, null);
    Isaac.DebugString("Spawned Mahalath (for season 3).");
  }
}
