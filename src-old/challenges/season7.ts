import {
  DEFAULT_KCOLOR,
  DIVERSITY_VALID_ACTIVE_ITEMS,
  DIVERSITY_VALID_PASSIVE_ITEMS,
  DIVERSITY_VALID_TRINKETS,
  Vector.Zero,
} from "../constants";
import g from "../globals";
import * as misc from "../misc";
import * as racePostGameStarted from "../race/postGameStarted";
import * as sprites from "../sprites";
import { EffectVariantCustom } from "../types/enums";
import {
  SEASON_7_EXTRA_ACTIVE_ITEM_BANS,
  SEASON_7_EXTRA_PASSIVE_ITEM_BANS,
  SEASON_7_EXTRA_TRINKET_BANS,
  SEASON_7_GOALS,
  SEASON_7_VALID_ACTIVE_ITEMS,
  SEASON_7_VALID_PASSIVE_ITEMS,
  SEASON_7_VALID_TRINKETS,
} from "./constants";
import { ChallengeCustom } from "./enums";

export function initValidItems(): void {
  if (SEASON_7_VALID_ACTIVE_ITEMS.length === 0) {
    for (const itemID of DIVERSITY_VALID_ACTIVE_ITEMS) {
      if (!SEASON_7_EXTRA_ACTIVE_ITEM_BANS.includes(itemID)) {
        SEASON_7_VALID_ACTIVE_ITEMS.push(itemID);
      }
    }
  }

  if (SEASON_7_VALID_PASSIVE_ITEMS.length === 0) {
    for (const itemID of DIVERSITY_VALID_PASSIVE_ITEMS) {
      if (!SEASON_7_EXTRA_PASSIVE_ITEM_BANS.includes(itemID)) {
        SEASON_7_VALID_PASSIVE_ITEMS.push(itemID);
      }
    }
  }

  if (SEASON_7_VALID_TRINKETS.length === 0) {
    for (const trinketID of DIVERSITY_VALID_TRINKETS) {
      if (!SEASON_7_EXTRA_TRINKET_BANS.includes(trinketID)) {
        SEASON_7_VALID_PASSIVE_ITEMS.push(trinketID);
      }
    }
  }
}

// We have to handle going into the Ultra Greed room with the Door Stop trinket
// Called from the "SpeedrunPostUpdate.Main()" function
export function checkUltraGreedSpawned(): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_7) {
    return;
  }

  if (!g.run.spawnedUltraGreed) {
    return;
  }
  g.run.spawnedUltraGreed = false;

  // If a door is open (e.g. if a player has Door Stop),
  // we want to delete the overlapping Ultra Greed Door
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (door !== null && door.IsOpen()) {
      // Find the Ultra Greed Door that overlaps with this open door
      const ultraGreedDoors = Isaac.FindByType(
        EntityType.ENTITY_ULTRA_DOOR, // 294
        -1,
        -1,
        false,
        false,
      );
      for (const ultraGreedDoor of ultraGreedDoors) {
        if (ultraGreedDoor.Position.Distance(door.Position) < 25) {
          ultraGreedDoor.Remove();
        }
      }
    }
  }
}

// Called from the "SpeedrunPostUpdate.CheckCheckpointTouched()" function
export function checkpointTouched(): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_7) {
    return;
  }

  removeGoalThatWasJustCompleted();
}

function removeGoalThatWasJustCompleted() {
  const roomType = g.r.GetType();
  if (roomType === RoomType.ROOM_BOSSRUSH) {
    misc.removeValueFromArray("Boss Rush", g.season7.remainingGoals);
    return;
  }

  const roomIndexUnsafe = g.l.GetCurrentRoomIndex();
  if (roomIndexUnsafe === GridRooms.ROOM_MEGA_SATAN_IDX) {
    misc.removeValueFromArray("Mega Satan", g.season7.remainingGoals);
    return;
  }

  const stage = g.l.GetStage();
  if (stage === 8) {
    misc.removeValueFromArray("It Lives!", g.season7.remainingGoals);
    return;
  }

  if (stage === 9) {
    misc.removeValueFromArray("Hush", g.season7.remainingGoals);
    return;
  }

  const stageType = g.l.GetStageType();
  if (stage === 11 && stageType === 1) {
    misc.removeValueFromArray("Blue Baby", g.season7.remainingGoals);
    return;
  }

  if (stage === 11 && stageType === 0) {
    misc.removeValueFromArray("The Lamb", g.season7.remainingGoals);
    return;
  }

  if (stage === 12) {
    misc.removeValueFromArray("Ultra Greed", g.season7.remainingGoals);
  }
}

// Called from the "PostUpdate.CheckRoomCleared()" function
export function roomCleared(): void {
  // Local variables
  const stage = g.l.GetStage();
  const roomIndexUnsafe = g.l.GetCurrentRoomIndex();
  const centerPos = g.r.GetCenterPos();
  const challenge = Isaac.GetChallenge();

  // Check to see if we just defeated Ultra Greed on a Season 7 speedrun
  if (
    challenge === ChallengeCustom.R7_SEASON_7 &&
    stage === 12 &&
    roomIndexUnsafe === g.run.customBossRoomIndex
  ) {
    // Spawn a big chest
    // (which will get replaced with either a checkpoint or a trophy on the next frame)
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_BIGCHEST,
      0,
      centerPos,
      Vector.Zero,
      null,
    );
  }
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_7 || g.speedrun.finished) {
    return;
  }

  // Make the text persist for at least 2 seconds after the player presses the map button
  const mapPressed = misc.isActionPressed(ButtonAction.ACTION_MAP);
  if (!mapPressed) {
    return;
  }

  // Draw the remaining goals on the screen for easy-reference
  const x = 95;
  const baseY = 66;
  g.font.DrawString("Remaining Goals:", x, baseY, DEFAULT_KCOLOR, 0, true);

  for (let i = 0; i < g.season7.remainingGoals.length; i++) {
    const goal = g.season7.remainingGoals[i];
    const y = baseY + 20 * i;
    const text = `- ${goal}`;
    g.font.DrawString(text, x, y, DEFAULT_KCOLOR, 0, true);
  }
}

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
// EntityType.ENTITY_ULTRA_GREED (406)
// EntityType.ENTITY_HUSH (407)
export function entityTakeDmgRemoveArmor(
  tookDamage: Entity,
  damageAmount: float,
  _damageFlag: DamageFlag,
  damageSource: EntityRef,
  damageCountdownFrames: int,
): void {
  if (g.run.dealingExtraDamage) {
    return;
  }

  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.R7_SEASON_7) {
    return;
  }

  // Adjust their HP directly to avoid the damage scaling (armor)
  tookDamage.HitPoints -= damageAmount * 0.5;

  // Make the NPC flash
  g.run.dealingExtraDamage = true;
  tookDamage.TakeDamage(0, 0, damageSource, damageCountdownFrames);
  g.run.dealingExtraDamage = false;
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStartedFirstCharacter(): void {
  g.season7.remainingGoals = [...SEASON_7_GOALS];
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  // Local variables
  const character = g.p.GetPlayerType();

  Isaac.DebugString("In the R+7 (Season 7) challenge.");

  // Lilith starts with an extra Incubus
  if (character === PlayerType.PLAYER_LILITH) {
    misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_INCUBUS);
    misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_INCUBUS);

    // If we switch characters, we want to remove the extra Incubus
    g.run.extraIncubus = true;
  }

  // Give the 5 random diversity items
  racePostGameStarted.diversity();

  // Remove some powerful items from all pools
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER); // 84
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_IPECAC); // 149
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH); // 441
}

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  // Local variables
  const stage = g.l.GetStage();
  const rooms = g.l.GetRooms();
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_7) {
    return;
  }

  if (stage !== 12) {
    return;
  }

  // Set the custom boss room to be the first 1x1 boss room
  for (let i = 0; i < rooms.Size; i++) {
    const roomDesc = rooms.Get(i); // This is 0 indexed
    if (roomDesc === null) {
      continue;
    }
    const roomIndexSafe = roomDesc.SafeGridIndex; // This is always the top-left index
    const roomData = roomDesc.Data;
    const roomType = roomData.Type;
    const roomShape = roomData.Shape;

    if (
      roomType === RoomType.ROOM_BOSS &&
      roomShape === RoomShape.ROOMSHAPE_1x1
    ) {
      g.run.customBossRoomIndex = roomIndexSafe;
      Isaac.DebugString(
        `Set the custom boss room to. ${g.run.customBossRoomIndex}`,
      );
      break;
    }
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  // Local variables
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_7) {
    return;
  }

  // Remove the diversity sprites as soon as we leave the starting room
  if (g.run.roomsEntered === 2) {
    sprites.clearPostRaceStartGraphics();
  }

  switch (stage) {
    case 9: {
      postNewRoomStage9();
      break;
    }

    case 11: {
      postNewRoomStage11();
      break;
    }

    case 12: {
      postNewRoomStage12();
      break;
    }

    default: {
      break;
    }
  }
}

function postNewRoomStage9() {
  // Local variables
  const roomType = g.r.GetType();

  if (roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  // Remove The Void door if it is open
  // (closing it does not work because it will automatically reopen)
  g.r.RemoveGridEntity(20, 0, false); // gridEntity.Destroy() does not work
  Isaac.DebugString("Manually deleted The Void door.");
}

function postNewRoomStage11() {
  // Local variables
  const roomIndexUnsafe = g.l.GetCurrentRoomIndex();
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  if (roomIndexUnsafe !== startingRoomIndex) {
    return;
  }

  // Spawn a Void Portal if we still need to go to The Void
  if (g.season7.remainingGoals.includes("Ultra Greed")) {
    const trapdoor = Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.VOID_PORTAL_FAST_TRAVEL,
      0,
      misc.gridToPos(1, 1),
      Vector.Zero,
      null,
    );

    // This is needed so that the entity will not appear on top of the player
    trapdoor.DepthOffset = -100;
  }

  // Spawn the Mega Satan trapdoor if we still need to go to Mega Satan
  // and we are on the second character or beyond
  // (the normal Mega Satan door does not appear on custom challenges that have a goal set to
  // Blue Baby)
  if (
    g.season7.remainingGoals.includes("Mega Satan") &&
    g.speedrun.characterNum >= 2
  ) {
    const trapdoor = Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.MEGA_SATAN_TRAPDOOR,
      0,
      misc.gridToPos(11, 1),
      Vector.Zero,
      null,
    );

    // This is needed so that the entity will not appear on top of the player
    trapdoor.DepthOffset = -100;
  }
}

function postNewRoomStage12() {
  // Local variables
  const roomIndexUnsafe = g.l.GetCurrentRoomIndex();
  const rooms = g.l.GetRooms();
  const centerPos = g.r.GetCenterPos();
  const roomClear = g.r.IsClear();

  // Delete the door to a non-Ultra Greed boss room, if any
  // (we must delete the door before changing the minimap, or else the icon will remain)
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (
      door !== null &&
      door.TargetRoomType === RoomType.ROOM_BOSS &&
      door.TargetRoomIndex !== g.run.customBossRoomIndex
    ) {
      g.r.RemoveDoor(i);
    }
  }

  // Show the boss icon for the custom boss room && remove all of the other ones
  for (let i = 0; i < rooms.Size; i++) {
    const roomDesc = rooms.Get(i); // This is 0 indexed
    if (roomDesc === null) {
      continue;
    }
    const roomIndexSafe = roomDesc.SafeGridIndex; // This is always the top-left index
    const roomData = roomDesc.Data;
    const roomType = roomData.Type;

    if (roomType !== RoomType.ROOM_BOSS) {
      continue;
    }

    let room: RoomDescriptor | MinimapAPIRoomDescriptor;
    if (MinimapAPI === undefined) {
      // For whatever reason,
      // we can't modify the DisplayFlags on the roomDesc that we already have,
      // so we have to re-get the room using the following function
      room = g.l.GetRoomByIdx(roomIndexSafe);
    } else {
      room = MinimapAPI.GetRoomByIdx(roomIndexSafe);
    }

    if (roomIndexSafe === g.run.customBossRoomIndex) {
      // Make the Ultra Greed room visible and show the icon
      room.DisplayFlags = 5;
    } else if (MinimapAPI === undefined) {
      // Remove the boss room icon (in case we have the Compass or The Mind)
      room.DisplayFlags = 0;
    } else if (room !== null) {
      // Remove the boss room icon (in case we have the Compass or The Mind)
      (room as MinimapAPIRoomDescriptor).Remove();
    }
  }
  g.l.UpdateVisibility(); // Setting the display flag will not actually update the map

  // Spawn the custom boss
  if (roomIndexUnsafe === g.run.customBossRoomIndex && !roomClear) {
    // Remove all enemies
    for (const entity of Isaac.GetRoomEntities()) {
      const npc = entity.ToNPC();
      if (npc !== null) {
        entity.Remove();
      }
    }

    // Spawn Ultra Greed
    Isaac.Spawn(
      EntityType.ENTITY_ULTRA_GREED,
      0,
      0,
      centerPos,
      Vector.Zero,
      null,
    );

    // Mark to potentially delete one of the Ultra Greed Doors on the next frame
    // (the Ultra Greed Doors take a frame to spawn after Ultra Greed spawns)
    g.run.spawnedUltraGreed = true;
  }
}

// ModCallbacks.MC_POST_NPC_INIT (27)
// EntityType.ENTITY_ISAAC (102)
export function postNPCInitIsaac(npc: EntityNPC): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_7) {
    return;
  }

  // In season 7 speedruns, we want to go directly into the second phase of Hush
  if (npc.Variant === 2) {
    npc.Remove();
    g.g.Spawn(
      EntityType.ENTITY_HUSH,
      0,
      Vector(580, 260), // This is copied from vanilla
      Vector.Zero,
      null,
      0,
      npc.InitSeed,
    );
  }
}
