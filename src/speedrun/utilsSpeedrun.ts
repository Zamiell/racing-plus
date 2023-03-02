import {
  CollectibleType,
  EntityCollisionClass,
} from "isaac-typescript-definitions";
import {
  isEven,
  removeCollectibleFromAllPlayers,
  removeCollectiblePickupDelay,
} from "isaacscript-common";
import { speedrunGetCharacterNum } from "../classes/features/speedrun/characterProgress/v";
import { isSeededDeathActive } from "../features/mandatory/seededDeath/v";
import { mod } from "../mod";
import {
  CUSTOM_CHALLENGES_SET,
  CUSTOM_CHALLENGES_THAT_ALTERNATE_BETWEEN_CHEST_AND_DARK_ROOM,
  SEASON_NUM_TO_CHALLENGE,
} from "./constantsSpeedrun";

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

export function postSpawnCheckpoint(checkpoint: EntityPickup): void {
  removeCollectiblePickupDelay(checkpoint);

  // IBS can cause the Checkpoint to be overridden with poop, causing a soft-lock.
  removeCollectibleFromAllPlayers(CollectibleType.IBS);

  // If the player kills the final boss while the seeded death mechanic is active, they should not
  // be able to take the checkpoint.
  if (isSeededDeathActive()) {
    // The collision class on the collectible will be updated 4 frames from now, so if we set a new
    // collision class now, it will be overwritten. Thus, we have to wait at least 4 frames.

    // First, set the "Wait" property to an arbitrary value longer than 4 frames to prevent the
    // player from picking up the Checkpoint.
    checkpoint.Wait = 10;

    const checkpointPtr = EntityPtr(checkpoint);
    mod.runInNGameFrames(() => {
      if (checkpointPtr.Ref !== undefined && checkpointPtr.Ref.Exists()) {
        checkpoint.EntityCollisionClass = EntityCollisionClass.NONE;
      }
    }, 4);
  }
}
