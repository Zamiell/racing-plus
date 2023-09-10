import { ActiveSlot, EntityCollisionClass } from "isaac-typescript-definitions";
import {
  anyPlayerHoldingItem,
  getAllPlayers,
  isEven,
  removeCollectiblePickupDelay,
  repeat,
} from "isaacscript-common";
import { isSeededDeathActive } from "../classes/features/mandatory/misc/seededDeath/v";
import { speedrunGetCharacterNum } from "../classes/features/speedrun/characterProgress/v";
import { mod } from "../mod";
import {
  COLLECTIBLES_THAT_INTERFERE_WITH_CHECKPOINT,
  CUSTOM_CHALLENGES_SET,
  CUSTOM_CHALLENGES_THAT_ALTERNATE_BETWEEN_CHEST_AND_DARK_ROOM,
  SEASON_NUM_TO_CHALLENGE,
} from "./constants";

export function inSpeedrun(): boolean {
  const challenge = Isaac.GetChallenge();
  return CUSTOM_CHALLENGES_SET.has(challenge);
}

export function onSeason(num: keyof typeof SEASON_NUM_TO_CHALLENGE): boolean {
  const challenge = Isaac.GetChallenge();
  const challengeCustom = SEASON_NUM_TO_CHALLENGE[num];

  return challenge === challengeCustom;
}

export function onSpeedrunWithDarkRoomGoal(): boolean {
  const challenge = Isaac.GetChallenge();

  if (
    CUSTOM_CHALLENGES_THAT_ALTERNATE_BETWEEN_CHEST_AND_DARK_ROOM.has(challenge)
  ) {
    const characterNum = speedrunGetCharacterNum();
    return isEven(characterNum);
  }

  return false;
}

export function preSpawnCheckpoint(): void {
  // Before spawning a Checkpoint, remove any collectibles that could conflict with picking it up.
  for (const player of getAllPlayers()) {
    for (const collectibleType of COLLECTIBLES_THAT_INTERFERE_WITH_CHECKPOINT) {
      const numCollectible = player.GetCollectibleNum(collectibleType);
      repeat(numCollectible, () => {
        // We don't want to affect transformations.
        player.RemoveCollectible(
          collectibleType,
          false,
          ActiveSlot.PRIMARY,
          false,
        );
      });
    }
  }
}

export function postSpawnCheckpoint(checkpoint: EntityPickup): void {
  removeCollectiblePickupDelay(checkpoint);
  setSeededDeathCollectibleIntangible(checkpoint);

  // If the player is holding a poop from IBS, they should not be able to take the checkpoint (since
  // throwing the poop can cause a race condition where the checkpoint will be deleted).
  if (anyPlayerHoldingItem()) {
    checkpoint.Wait = 20; // 20 is the vanilla/normal value.
  }
}

/**
 * If the player kills the final boss while the seeded death mechanic is active, they should not be
 * able to take the checkpoint.
 */
function setSeededDeathCollectibleIntangible(checkpoint: EntityPickup) {
  if (!isSeededDeathActive()) {
    return;
  }

  // The collision class on the collectible will be updated 4 frames from now, so if we set a new
  // collision class now, it will be overwritten. Thus, we have to wait at least 4 frames.

  // First, set the "Wait" property to an arbitrary value longer than 4 frames to prevent the player
  // from picking up the Checkpoint.
  checkpoint.Wait = 20; // 20 is the vanilla/normal value.

  const checkpointPtr = EntityPtr(checkpoint);
  mod.runInNGameFrames(() => {
    if (checkpointPtr.Ref !== undefined && checkpointPtr.Ref.Exists()) {
      checkpoint.EntityCollisionClass = EntityCollisionClass.NONE;
    }
  }, 4);
}
