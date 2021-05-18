// Check to see if the "Veto" button was pressed

import { DEFAULT_KCOLOR, Vector.Zero } from "../constants";
import g from "../globals";
import * as misc from "../misc";
import { CollectibleTypeCustom } from "../types/enums";
import {
  BIG_4_ITEMS,
  SEASON_6_ITEM_LOCK_MILLISECONDS,
  SEASON_6_STARTING_BUILDS,
  SEASON_6_VETO_BUTTON_LENGTH,
} from "./constants";
import { ChallengeCustom } from "./enums";
import * as speedrun from "./speedrun";

// Called from the "CheckEntities.Grid()" function
export function checkVetoButton(gridEntity: GridEntity): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (
    challenge !== ChallengeCustom.R7_SEASON_6 ||
    g.speedrun.characterNum !== 1 ||
    g.run.roomsEntered !== 1 ||
    gridEntity.GetSaveState().State !== 3 // Pressed
  ) {
    return;
  }

  // Add the item to the veto list
  g.season6.vetoList.push(g.season6.lastBuildItem);
  if (g.season6.vetoList.length > 5) {
    // Remove the first element
    g.season6.vetoList.splice(0, 1);
  }

  // Add the sprite to the sprite list
  g.season6.vetoSprites = [];
  for (let i = 0; i < g.season6.vetoList.length; i++) {
    const vetoItem = g.season6.vetoList[i];

    const vetoSprite = Sprite();
    vetoSprite.Load("gfx/schoolbag_item.anm2", false);
    const fileName = g.itemConfig.GetCollectible(vetoItem).GfxFileName;
    vetoSprite.ReplaceSpritesheet(0, fileName);
    vetoSprite.LoadGraphics();
    vetoSprite.SetFrame("Default", 1);
    vetoSprite.Scale = Vector(0.75, 0.75);

    g.season6.vetoSprites.push(vetoSprite);
  }

  // Play a poop sound
  g.sfx.Play(SoundEffect.SOUND_FART, 1, 0, false, 1);

  // Reset the timer && restart the game
  g.season6.vetoTimer = Isaac.GetTime() + SEASON_6_VETO_BUTTON_LENGTH;
  g.season6.timeItemAssigned = 0;
  g.run.restart = true;
  Isaac.DebugString(
    `Restarting because we vetoed item: ${g.season6.lastBuildItem}`,
  );
}

// ModCallbacks.MC_POST_RENDER (2)
// Draw the "Veto" button
export function postRender(): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (
    challenge !== ChallengeCustom.R7_SEASON_6 ||
    g.speedrun.characterNum !== 1 ||
    g.run.roomsEntered !== 1
  ) {
    return;
  }

  // Don't draw the Veto text if there is not a valid order set
  if (!speedrun.checkValidCharOrder()) {
    return;
  }

  // Draw the sprites that correspond to the items that are currently on the veto list
  let x = -45;
  for (let i = 0; i < g.season6.vetoList.length; i++) {
    const itemPosGame = misc.gridToPos(11, 7);
    const itemPos = Isaac.WorldToRenderPosition(itemPosGame);
    x += 15;
    const modifiedItemPos = Vector(itemPos.X + x, itemPos.Y);
    g.season6.vetoSprites[i].Render(modifiedItemPos, Vector.Zero, Vector.Zero);
  }

  if (g.season6.vetoTimer === 0) {
    // Draw the "Veto" text
    const posGame = misc.gridToPos(11, 5);
    const pos = Isaac.WorldToRenderPosition(posGame);
    const text = "Veto";
    const length = g.font.GetStringWidthUTF8(text);
    g.font.DrawString(text, pos.X - length / 2, pos.Y, DEFAULT_KCOLOR, 0, true);
  }
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStartedFirstCharacter(): void {
  g.season6.remainingStartingBuilds = [];
  for (const startingBuild of SEASON_6_STARTING_BUILDS) {
    g.season6.remainingStartingBuilds.push(startingBuild);
  }
  if (
    Isaac.GetTime() - g.season6.timeItemAssigned >=
    SEASON_6_ITEM_LOCK_MILLISECONDS
  ) {
    g.season6.selectedStartingBuilds = [];
  }
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  // Local variables
  const character = g.p.GetPlayerType();

  Isaac.DebugString("In the R+7 (Season 6) challenge.");

  // If Eden starts with The Compass as the random passive item or a banned trinket,
  // restart the game
  if (
    character === PlayerType.PLAYER_EDEN &&
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_COMPASS) ||
      g.p.HasTrinket(TrinketType.TRINKET_CAINS_EYE) ||
      g.p.HasTrinket(TrinketType.TRINKET_BROKEN_ANKH))
  ) {
    g.run.restart = true;
    g.speedrun.fastReset = true;
    Isaac.DebugString(
      "Restarting because Eden started with either The Compass, Cain's Eye, or Broken Ankh.",
    );
    return;
  }

  // Everyone starts with the Schoolbag in this season
  misc.giveItemAndRemoveFromPools(
    CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
  );

  // Everyone starts with the Compass in this season
  misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_COMPASS);
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_CAINS_EYE);

  // Since this season has a custom death mechanic, we also want to remove the Broken Ankh
  // (since we need the custom revival to always take priority over random revivals)
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_BROKEN_ANKH);

  // Check to see if the player has played a run with one of the big 4
  let alreadyStartedBig4 = false;
  for (const selectedStartingBuild of g.season6.selectedStartingBuilds) {
    const primaryItem = selectedStartingBuild[0];
    if (BIG_4_ITEMS.includes(primaryItem as CollectibleType)) {
      alreadyStartedBig4 = true;
      break;
    }
  }

  // Disable starting a big 4 item on the first character
  if (g.speedrun.characterNum === 1) {
    alreadyStartedBig4 = true;
  }

  // Everyone starts with a random passive item / build
  // Check to see if a start is already assigned for this character number
  // (dying and resetting should not reassign the selected starting item)
  let startingBuild = g.season6.selectedStartingBuilds[g.speedrun.characterNum];
  if (startingBuild === undefined) {
    startingBuild = getNewStartingBuild(alreadyStartedBig4);
  }

  // Give the items to the player (and remove the items from the pools)
  for (const itemID of startingBuild) {
    // Eden might have already started with this item, so reset the run if so
    if (character === PlayerType.PLAYER_EDEN && g.p.HasCollectible(itemID)) {
      g.run.restart = true;
      g.speedrun.fastReset = true;
      Isaac.DebugString(
        `Restarting because Eden naturally started with the selected starting item of: ${itemID}`,
      );
      return;
    }

    misc.giveItemAndRemoveFromPools(itemID);

    if (itemID === CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) {
      // Also remove the additional soul hearts from Crown of Light
      g.p.AddSoulHearts(-4);

      // Re-heal Judas back to 1 red heart so that they can properly use the Crown of Light
      // (this should do nothing on all of the other characters)
      g.p.AddHearts(1);
    }
  }

  // Spawn a "Veto" button on the first character
  if (g.season6.vetoTimer !== 0 && Isaac.GetTime() >= g.season6.vetoTimer) {
    g.season6.vetoTimer = 0;
  }
  if (g.speedrun.characterNum === 1 && g.season6.vetoTimer === 0) {
    const pos = misc.gridToPos(11, 6);
    Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, pos, true);
  }
}

function getNewStartingBuild(alreadyStartedBig4: boolean) {
  let seed = g.seeds.GetStartSeed();
  let valid = false;
  let startingBuild: Array<CollectibleType | CollectibleTypeCustom>;
  let startingBuildIndex: int;
  let randomAttempts = 0;
  do {
    seed = misc.incrementRNG(seed);
    math.randomseed(seed);

    if (alreadyStartedBig4) {
      startingBuildIndex = math.random(
        4,
        g.season6.remainingStartingBuilds.length - 1,
      );
    } else if (g.speedrun.characterNum >= 2 && g.speedrun.characterNum <= 6) {
      const startBig4Chance = math.random(1, 8 - g.speedrun.characterNum);
      if (startBig4Chance === 1) {
        startingBuildIndex = math.random(0, 3);
      } else {
        startingBuildIndex = math.random(
          4,
          g.season6.remainingStartingBuilds.length - 1,
        );
      }
    } else if (g.speedrun.characterNum === 7) {
      // Guarantee at least one big 4 start
      startingBuildIndex = math.random(0, 3);
    } else {
      startingBuildIndex = math.random(
        0,
        g.season6.remainingStartingBuilds.length - 1,
      );
    }

    startingBuild = g.season6.remainingStartingBuilds[startingBuildIndex];
    valid = isValidStartingBuild(startingBuild);
    randomAttempts += 1;
  } while (!valid && randomAttempts < 100);
  // (check for random attempts to prevent the possibility of having an infinite loop, just in case)

  // Keep track of what item we start so that we don't get the same two starts in a row
  g.season6.lastBuildItem = startingBuild[1];
  if (g.speedrun.characterNum === 1) {
    g.season6.lastBuildItemOnFirstChar = startingBuild[1];
  }
  Isaac.DebugString(
    `Set the last starting build to: ${g.season6.lastBuildItem}`,
  );

  // Remove it from the remaining builds left
  g.season6.remainingStartingBuilds.splice(startingBuildIndex, 1);

  // Keep track of what item we are supposed to be starting on this character / run
  g.season6.selectedStartingBuilds.push(startingBuild);

  // Mark down the time that we assigned this item
  g.season6.timeItemAssigned = Isaac.GetTime();

  // Break out of the infinite loop
  Isaac.DebugString(`Assigned a starting item of: ${startingBuild[0]}`);

  return startingBuild;
}

function isValidStartingBuild(
  startingBuild: Array<CollectibleType | CollectibleTypeCustom>,
) {
  // Local variables
  const character = g.p.GetPlayerType();
  const primaryItem = startingBuild[0];

  // If we are on the first character,
  // we do not want to play a build that we have already played recently
  if (
    g.speedrun.characterNum === 1 &&
    (primaryItem === g.season6.lastBuildItem ||
      primaryItem === g.season6.lastBuildItemOnFirstChar)
  ) {
    return false;
  }

  // Check to see if we already started this item
  for (const pastSelectedBuild of g.season6.selectedStartingBuilds) {
    const pastSelectedPrimaryItem = pastSelectedBuild[0];
    if (pastSelectedPrimaryItem === primaryItem) {
      return false;
    }
  }

  // Check to see if we banned this item
  const charOrder = RacingPlusData.Get("charOrder-R7S6") as int[];
  for (let i = 7; i < charOrder.length; i++) {
    // We start at 7 because the banned items are placed after the character IDs
    let itemID = charOrder[i];

    // Convert builds to the primary item
    switch (itemID) {
      case 1001: {
        itemID = CollectibleType.COLLECTIBLE_MUTANT_SPIDER;
        break;
      }

      case 1002: {
        itemID = CollectibleType.COLLECTIBLE_TECHNOLOGY;
        break;
      }

      case 1003: {
        itemID = CollectibleType.COLLECTIBLE_FIRE_MIND;
        break;
      }

      case 1005: {
        itemID = CollectibleType.COLLECTIBLE_JACOBS_LADDER;
        break;
      }

      case 1006: {
        itemID = CollectibleType.COLLECTIBLE_CHOCOLATE_MILK;
        break;
      }

      default: {
        break;
      }
    }

    if (primaryItem === itemID) {
      return false;
    }
  }

  // Check to see if this start is an anti-synergy with this character (character/item bans)
  switch (character) {
    // 3
    case PlayerType.PLAYER_JUDAS: {
      if (primaryItem === CollectibleType.COLLECTIBLE_JUDAS_SHADOW) {
        return false;
      }
      break;
    }

    // 5
    case PlayerType.PLAYER_EVE: {
      if (primaryItem === CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) {
        return false;
      }
      break;
    }

    // 7
    case PlayerType.PLAYER_AZAZEL: {
      if (
        primaryItem === CollectibleType.COLLECTIBLE_IPECAC || // 149
        primaryItem === CollectibleType.COLLECTIBLE_MUTANT_SPIDER || // 153
        primaryItem === CollectibleType.COLLECTIBLE_CRICKETS_BODY || // 224
        primaryItem === CollectibleType.COLLECTIBLE_DEAD_EYE || // 373
        primaryItem === CollectibleType.COLLECTIBLE_JUDAS_SHADOW || // 331
        primaryItem === CollectibleType.COLLECTIBLE_FIRE_MIND || // 257
        primaryItem === CollectibleType.COLLECTIBLE_JACOBS_LADDER // 494
      ) {
        return false;
      }
      break;
    }

    // 16
    case PlayerType.PLAYER_THEFORGOTTEN: {
      if (
        primaryItem === CollectibleType.COLLECTIBLE_DEATHS_TOUCH || // 237
        primaryItem === CollectibleType.COLLECTIBLE_FIRE_MIND || // 257
        primaryItem === CollectibleType.COLLECTIBLE_LIL_BRIMSTONE || // 275
        primaryItem === CollectibleType.COLLECTIBLE_JUDAS_SHADOW || // 311
        primaryItem === CollectibleType.COLLECTIBLE_INCUBUS // 350
      ) {
        return false;
      }
      break;
    }

    default: {
      break;
    }
  }

  // Check to see if we vetoed this item and we are on the first character
  if (g.speedrun.characterNum === 1) {
    for (const veto of g.season6.vetoList) {
      if (veto === primaryItem) {
        return false;
      }
    }
  }

  return true;
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
// Delete the veto button if we are re-entering the starting room
export function postNewRoom(): void {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const challenge = Isaac.GetChallenge();

  if (
    challenge === ChallengeCustom.R7_SEASON_6 &&
    stage === 1 &&
    roomIndex === startingRoomIndex &&
    g.run.roomsEntered !== 1
  ) {
    g.r.RemoveGridEntity(117, 0, false);
  }
}

// ModCallbacks.MC_POST_BOMB_UPDATE (58)
export function postBombUpdate(bomb: EntityBomb): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_6) {
    return;
  }

  if (bomb.SpawnerType !== EntityType.ENTITY_PLAYER || bomb.FrameCount !== 1) {
    return;
  }

  // Find out if this bomb has the homing flag
  const homing = (bomb.Flags & (1 << 2)) >>> 2;
  if (homing === 0) {
    return;
  }

  // Don't do anything if we do not have Sacred Heart
  if (!g.p.HasCollectible(CollectibleType.COLLECTIBLE_SACRED_HEART)) {
    return;
  }

  // Don't do anything if we have Dr. Fetus or Bobby Bomb (normal homing bombs)
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) ||
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BOBBY_BOMB)
  ) {
    return;
  }

  // Remove the homing bombs from Sacred Heart
  // (bombs use tear flags for some reason)
  bomb.Flags &= ~TearFlags.TEAR_HOMING;
}

// Reset the starting item timer if we just killed the Basement 2 boss
export function postClearRoom(): void {
  // Local variables
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const challenge = Isaac.GetChallenge();

  if (
    challenge === ChallengeCustom.R7_SEASON_6 &&
    stage === 2 &&
    roomType === RoomType.ROOM_BOSS
  ) {
    g.season6.timeItemAssigned = 0;
  }
}
