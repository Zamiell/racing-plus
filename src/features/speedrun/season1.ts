import { getDoors, getRandomInt, onRepentanceStage } from "isaacscript-common";
import g from "../../globals";
import { giveItemAndRemoveFromPools } from "../../utilGlobals";
import * as trapdoor from "../optional/major/fastTravel/trapdoor";
import { ChallengeCustom } from "./enums";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_1) {
    return;
  }

  giveStartingItems();
}

function giveStartingItems() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  // Give extra items to some characters
  switch (character) {
    case PlayerType.PLAYER_ISAAC: {
      // Isaac does not get the D6 in challenges
      giveItemAndRemoveFromPools(player, CollectibleType.COLLECTIBLE_D6);
      break;
    }

    case PlayerType.PLAYER_KEEPER: {
      // Keeper does not get the Wooden Nickel in challenges
      giveItemAndRemoveFromPools(
        player,
        CollectibleType.COLLECTIBLE_WOODEN_NICKEL,
      );
      break;
    }

    case PlayerType.PLAYER_BETHANY:
    case PlayerType.PLAYER_BETHANY_B: {
      giveItemAndRemoveFromPools(player, CollectibleType.COLLECTIBLE_DUALITY);
      break;
    }

    default: {
      break;
    }
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkWomb2IAMERROR();
}

function checkWomb2IAMERROR() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const seed = g.l.GetDungeonPlacementSeed();

  if (stage !== 8 || roomType !== RoomType.ROOM_ERROR) {
    return;
  }

  // Since we are in a challenge that has 'altpath="true"',
  // the game will always spawn a beam of light going to the Cathedral
  // In vanilla, there would be a 50% chance to spawn a trapdoor
  // Emulate the vanilla functionality
  const trapdoorChance = getRandomInt(1, 2, seed);
  if (trapdoorChance === 1) {
    return;
  }

  const heavenDoors = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariant.HEAVEN_LIGHT_DOOR,
  );
  for (const heavenDoor of heavenDoors) {
    heavenDoor.Remove();
    Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, heavenDoor.Position, true);
  }
}

// ModCallbacks.MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  lockRepentanceDoorsAndSpawnTrapdoor();
}

function lockRepentanceDoorsAndSpawnTrapdoor() {
  const roomType = g.r.GetType();

  if (roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  lockRepentanceDoors();
  spawnTrapdoor();
}

function lockRepentanceDoors() {
  const stage = g.l.GetStage();

  for (const door of getDoors()) {
    if (
      door !== null &&
      door.TargetRoomIndex === GridRooms.ROOM_SECRET_EXIT_IDX
    ) {
      g.sfx.Stop(SoundEffect.SOUND_UNLOCK00);
      door.Close(true);

      if (
        (stage === 2 && onRepentanceStage()) ||
        ((stage === 3 || stage === 4) && !onRepentanceStage())
      ) {
        door.Bar();
        door.SetVariant(DoorVariant.DOOR_LOCKED_CRACKED);
      } else {
        door.SetLocked(true);
      }
    }
  }
}

function spawnTrapdoor() {
  const stage = g.l.GetStage();

  if (stage >= 8) {
    return;
  }

  trapdoor.spawnTrapdoorOnBossRooms();
}

export function preUseWeNeedToGoDeeper(rng: RNG): boolean | void {
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_1) {
    return undefined;
  }

  if (stage >= 8) {
    return undefined;
  }

  trapdoor.spawnTrapdoorWeNeedToGoDeeper(rng);
  return true;
}
