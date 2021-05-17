import * as postNewRoom from "./callbacks/postNewRoom";
import { ChallengeCustom } from "./challenges/enums";
import * as season8 from "./challenges/season8";
import g from "./globals";
import * as schoolbag from "./items/schoolbag";
import * as misc from "./misc";
import { CollectibleTypeCustom } from "./types/enums";

// Racing+ replaces all item pedestals with custom seeds
// This is in order to fix seed "incrementation" from touching active pedestal items over and over
// Additionally, we also do some other various pedestal fixes
export function replace(pickup: EntityPickup): void {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const stageSeed = g.seeds.GetStageSeed(stage);
  const challenge = Isaac.GetChallenge();

  // Don't do anything if this pedestal is not freshly spawned
  if (pickup.FrameCount !== 1) {
    return;
  }

  // Don't do anything if this is an empty pedestal
  if (pickup.SubType === 0) {
    return;
  }

  // If the player uses a Void on a D6, then the pedestal replacement code will cause the pedestal
  // to get duplicated
  // (instead of getting consumed/deleted)
  // Thus, explicitly check for this
  if (
    gameFrameCount === g.run.usedD6Frame + 1 &&
    gameFrameCount === g.run.usedVoidFrame + 1
  ) {
    // Account for the Butter trinket
    if (
      g.p.HasTrinket(TrinketType.TRINKET_BUTTER) &&
      pickup.SubType === CollectibleType.COLLECTIBLE_VOID
    ) {
      Isaac.DebugString(
        "Void dropped from a Butter! trinket. Explicitly not deleting this pedestal. (It will get replaced like any other normal pedestal.)",
      );
      // (this pedestal will not be rolled, even if the player has consumed a D6)
    } else {
      Isaac.DebugString(
        `Not replacing pedestal with item ${pickup.SubType} due to Void + D6 usage. (It should be naturally consumed/deleted on the next frame.)`,
      );
      return;
    }
  }

  // Check to see if this is a pedestal that was already replaced
  for (const pedestal of g.run.level.replacedPedestals) {
    // We can't check to see if the X and Y are exactly equivalent since players can push pedestals
    // around a little bit
    const pedestalPosition = Vector(pedestal.x, pedestal.y);
    if (
      pedestal.roomIndex === roomIndex &&
      pedestalPosition.Distance(pickup.Position) <= 15 && // A little less than half a square
      pedestal.seed === pickup.InitSeed
    ) {
      // We have already replaced it, so check to see if we need to delete the delay
      if (pickup.Wait > 15) {
        // When we enter a new room, the "wait" variable on all pedestals is set to 18
        // This is too long, so shorten it
        pickup.Wait = 15;
      }

      // We set the state to 1 when we have replaced it
      // If we are re-entering a room, the pedestal state might be back to 0, so change it if so
      if (pickup.State === 0) {
        pickup.State = 1;
      }

      return;
    }
  }

  // Check to see if this is a pedestal that was player-generated
  let playerGenerated = false;
  if (gameFrameCount <= g.run.playerGeneratedPedestalFrame) {
    // The player just spawned this item a frame ago
    playerGenerated = true;
  } else {
    // Check to see if this is a reroll of a player-generated item
    for (const pedestal of g.run.level.replacedPedestals) {
      if (
        pedestal.roomIndex === roomIndex &&
        Vector(pedestal.x, pedestal.y).Distance(pickup.Position) <= 15 &&
        pedestal.playerGenerated
      ) {
        playerGenerated = true;
        break;
      }
    }
  }

  // We need to replace this item, so generate a consistent seed
  const newSeed = getSeed(pickup, playerGenerated);

  // Check to see if this is an item in a Basement 1 Treasure Room && the doors are supposed to be
  // barred
  let offLimits = false;
  if (
    postNewRoom.checkBanB1TreasureRoom() &&
    roomType === RoomType.ROOM_TREASURE &&
    pickup.SubType !== CollectibleTypeCustom.COLLECTIBLE_OFF_LIMITS
  ) {
    offLimits = true;
  }

  // Check for special rerolls
  let specialReroll = 0;
  if (
    stage === 1 &&
    roomType === RoomType.ROOM_TREASURE &&
    ((g.race.rFormat === "diversity" && g.race.status === "in progress") ||
      challenge === ChallengeCustom.R7_SEASON_7)
  ) {
    // This is a special Basement 1 diversity reroll
    // (these custom placeholder items are removed in all non-diversity runs)
    if (
      pickup.SubType ===
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1
    ) {
      specialReroll = CollectibleType.COLLECTIBLE_INCUBUS;
    } else if (
      pickup.SubType ===
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2
    ) {
      specialReroll = CollectibleType.COLLECTIBLE_SACRED_HEART;
    } else if (
      pickup.SubType ===
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3
    ) {
      specialReroll = CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT;
    }
  } else if (
    stage === 1 &&
    roomType === RoomType.ROOM_TREASURE &&
    ((g.race.rFormat === "unseeded" && g.race.status === "in progress") ||
      challenge === ChallengeCustom.R7_SEASON_5)
  ) {
    // This is a special Big 4 reroll for unseeded races (50% chance to reroll)
    math.randomseed(stageSeed);
    const big4rerollChance = math.random(1, 2);
    if (big4rerollChance === 2) {
      if (pickup.SubType === CollectibleType.COLLECTIBLE_MOMS_KNIFE) {
        specialReroll =
          CollectibleTypeCustom.COLLECTIBLE_MUTANT_SPIDER_INNER_EYE;
      } else if (pickup.SubType === CollectibleType.COLLECTIBLE_TECH_X) {
        specialReroll = CollectibleType.COLLECTIBLE_SACRED_HEART;
      } else if (pickup.SubType === CollectibleType.COLLECTIBLE_EPIC_FETUS) {
        specialReroll = CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT;
      } else if (pickup.SubType === CollectibleType.COLLECTIBLE_IPECAC) {
        specialReroll = CollectibleType.COLLECTIBLE_INCUBUS;
      }
    }
  } else if (
    pickup.SubType ===
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1 ||
    pickup.SubType ===
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2 ||
    pickup.SubType === CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3
  ) {
    // If the player is on a diversity race and gets a Treasure Room item on basement 1,
    // then there is a chance that they could get a placeholder item
    pickup.SubType = 0;
  }

  // Account for the Butter Bean "surprise" mechanic
  // (this is 10% according to Kilburn)
  if (pickup.SubType === CollectibleType.COLLECTIBLE_BUTTER_BEAN) {
    g.RNGCounter.butterBean = misc.incrementRNG(g.RNGCounter.butterBean);
    math.randomseed(g.RNGCounter.butterBean);
    const surpriseChance = math.random(1, 10);
    if (surpriseChance === 1) {
      pickup.SubType = CollectibleType.COLLECTIBLE_WAIT_WHAT;
      pickup.Charge = misc.getItemMaxCharges(
        CollectibleType.COLLECTIBLE_WAIT_WHAT,
      );
    }
  }

  // Check to see if this item should go into a Schoolbag
  if (schoolbag.checkSecondItem(pickup)) {
    return;
  }

  // In season 8, prevent "set drops" from Lust, Gish, and so forth
  // (if they have already been touched)
  pickup.SubType = season8.pedestals(pickup);

  // Replace the pedestal
  let newPedestal: EntityPickup | null;
  if (offLimits) {
    // Change the item to Off Limits
    newPedestal = g.g
      .Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        pickup.Position,
        pickup.Velocity,
        pickup.Parent,
        CollectibleTypeCustom.COLLECTIBLE_OFF_LIMITS,
        newSeed,
      )
      .ToPickup();
    if (newPedestal === null) {
      error("Failed to spawn a new item pedestal.");
    }

    // Play a fart animation so that it doesn't look like some bug with the Racing+ mod
    g.g.Fart(newPedestal.Position, 0, newPedestal, 0.5, 0);
    Isaac.DebugString(`Made an Off Limits pedestal using seed: ${newSeed}`);
  } else if (specialReroll !== 0) {
    // Change the item to the special reroll
    newPedestal = g.g
      .Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        pickup.Position,
        pickup.Velocity,
        pickup.Parent,
        specialReroll,
        newSeed,
      )
      .ToPickup();
    if (newPedestal === null) {
      error("Failed to spawn a new item pedestal.");
    }

    // Remove the special item from the pools
    g.itemPool.RemoveCollectible(specialReroll);
    if (
      specialReroll ===
      CollectibleTypeCustom.COLLECTIBLE_MUTANT_SPIDER_INNER_EYE
    ) {
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER);
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_INNER_EYE);
    }

    // Play a fart animation so that it doesn't look like some bug with the Racing+ mod
    g.g.Fart(newPedestal.Position, 0, newPedestal, 0.5, 0);
    Isaac.DebugString(
      `Item ${pickup.SubType} is special, made a new ${specialReroll} pedestal using seed: ${newSeed}`,
    );
  } else {
    // Fix the bug where Steven can drop on runs where the player started with Steven
    // (the case of Little Steven is automatically handled by the vanilla game,
    // e.g. the boss will always drop Steven if the player has Little Steven)
    let subType = pickup.SubType;
    if (
      subType === CollectibleType.COLLECTIBLE_STEVEN &&
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_STEVEN)
    ) {
      subType = CollectibleType.COLLECTIBLE_LITTLE_STEVEN;
    }

    // By default, put the new pedestal in the exact same place as the one we are replacing
    let position = pickup.Position;

    // Check to see if we already know about a pedestal that is near to where this one spawned
    // If so, adjust the position of the pedestal to the old one
    // This prevents the bug where players can "push" pedestals by swapping an active item
    for (const pedestal of g.run.level.replacedPedestals) {
      const oldPedestalPosition = Vector(pedestal.x, pedestal.y);
      if (
        pedestal.roomIndex === roomIndex &&
        pickup.Position.Distance(oldPedestalPosition) <= 20
      ) {
        position = oldPedestalPosition;
        Isaac.DebugString(
          `Pushed pedestal detected - using the old position of: ${oldPedestalPosition.X}, ${oldPedestalPosition.Y}`,
        );
        break;
      }
    }

    // Make a new copy of this item
    newPedestal = g.g
      .Spawn(
        EntityType.ENTITY_PICKUP, // 5
        PickupVariant.PICKUP_COLLECTIBLE, // 100
        position,
        pickup.Velocity,
        pickup.Parent,
        subType,
        newSeed,
      )
      .ToPickup();
    if (newPedestal === null) {
      error("Failed to spawn a new item pedestal.");
    }

    // We don't need to make a fart noise because the swap will be completely transparent to the
    // player (the sprites of the two items will obviously be identical)
    // We don't need to add this item to the ban list because since it already existed,
    // it was properly decremented from the pools on sight
  }

  if (newPedestal === null) {
    error("Failed to spawn a new item pedestal.");
  }

  // We don't want to replicate the charge if this is a brand new item
  if (pickup.SubType !== 0) {
    // We need to replicate the charge of dropped active items,
    // or else they will be fully charged every time
    newPedestal.Charge = pickup.Charge;
  }

  // If we don't do this, then mods that manually update the price of items will fail
  newPedestal.AutoUpdatePrice = pickup.AutoUpdatePrice;

  // If we don't do this, shop && Devil Room items will become automatically bought
  newPedestal.Price = pickup.Price;

  // We need to keep track of touched items for banned item exception purposes
  newPedestal.Touched = pickup.Touched;

  // If we don't do this, shop items will reroll into consumables and shop items that are on sale
  // will no longer be on sale
  newPedestal.ShopItemId = pickup.ShopItemId;

  // If we don't do this, you can take both of the pedestals in a double Treasure Room
  newPedestal.TheresOptionsPickup = pickup.TheresOptionsPickup;

  // Copy over the old mod data
  const oldData = pickup.GetData();
  const newData = newPedestal.GetData();
  for (const [key, value] of pairs(oldData)) {
    newData[key] = value;
  }

  // The pedestal might be from a chest or machine, so we need to copy the overlay frame
  if (pickup.Price === 0) {
    const overlayFrame = pickup.GetSprite().GetOverlayFrame();
    if (overlayFrame !== 0) {
      newPedestal.GetSprite().SetOverlayFrame("Alternates", overlayFrame);

      // Also mark that we have "touched" a chest, which should start a Challenge Room or Boss Rush
      g.run.room.touchedPickup = true;
      Isaac.DebugString(
        `Touched pickup (from a chest opening into a pedestal item): ${pickup.Type}.${pickup.Variant}.${pickup.SubType}`,
      );
    }
  }

  // Remove the pedestal delay for the Checkpoint,
  // since players will always want to immediately pick it up
  if (
    pickup.SubType === CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT &&
    stage !== 8
  ) {
    // On vanilla, all pedestals get a 20 frame delay
    // Don't apply this to Checkpoints that spawn after It Lives!,
    // since the player may not want to take them
    newPedestal.Wait = 0;
  }

  if (pickup.State === 0) {
    // Normally, collectibles always have state 0
    // Mark it as state 1 to indicate to other mods that this is a replaced pedestal
    newPedestal.State = 1;
  } else {
    // Another mod has modified the state of this pedestal; make it persist over to the new pedestal
    newPedestal.State = pickup.State;
  }

  // We probably need to add this item to the tracking table,
  // but first check to see if it is already there
  // This is necessary to prevent the bug where touching an item will cause the next seed to get
  // "skipped"
  let alreadyInTable = false;
  for (const pedestal of g.run.level.replacedPedestals) {
    const pedestalPosition = Vector(pedestal.x, pedestal.y);
    if (
      pedestal.roomIndex === roomIndex &&
      pedestalPosition.Distance(pickup.Position) <= 15 && // A little less than half a square
      pedestal.seed === newSeed &&
      pedestal.playerGenerated === playerGenerated
    ) {
      alreadyInTable = true;
      break;
    }
  }

  // Add it to the tracking table so that we don't replace it again
  // (we don't want to add subtype 0 items to the index in case a banned item rolls into another
  // banned item)
  if (!alreadyInTable) {
    g.run.level.replacedPedestals.push({
      roomIndex,
      x: pickup.Position.X,
      y: pickup.Position.Y,
      seed: newSeed,
      playerGenerated,
    });
  }

  // Now that we have created a new pedestal, we can delete the old one
  pickup.Remove();
}

function getSeed(pickup: EntityPickup, playerGenerated: boolean) {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const roomSeed = g.r.GetSpawnSeed();

  // Check to see if ( this is an item we already touched
  if (pickup.Touched) {
    // If we touched this item,
    // we need to set it back to the last seed that we had for this position
    let newSeed = 0;
    for (const pedestal of g.run.level.replacedPedestals) {
      const pedestalPosition = Vector(pedestal.x, pedestal.y);
      if (
        pedestal.roomIndex === roomIndex &&
        pedestalPosition.Distance(pickup.Position) <= 15 // A little less than half a square
      ) {
        // Don't break after this because we want it to be equal to the seed of the last item
        newSeed = pedestal.seed;
      }
    }

    // The Butter trinket can cause new touched pedestals to spawn that we have ! seen previously
    // If this is the case, we continue into the below code block && use the room seed as a base
    if (newSeed !== 0) {
      return newSeed;
    }
  }

  if (playerGenerated) {
    // This is a player-spawned pedestal, so if we seed it per room, then it would reroll to
    // something different depending on the room the player generates the pedestal in
    // Seed these items based on the start seed, and continually increment as we go
    const finalSeed =
      g.run.playerGeneratedPedestalSeeds[
        g.run.playerGeneratedPedestalSeeds.length - 1
      ];
    const newSeed = misc.incrementRNG(finalSeed);
    g.run.playerGeneratedPedestalSeeds.push(newSeed);
    return newSeed;
  }

  // This is an ordinary item spawn,
  // so start off by assuming that we should set the new pedestal seed to that of the room
  // We can't just seed all items with the room seed because
  // it causes items that are ! fully decremented on sight to roll into themselves
  let newSeed = roomSeed;

  // Increment the seed for each time the item has been rolled
  for (const pedestal of g.run.level.replacedPedestals) {
    if (pedestal.roomIndex === roomIndex && !pedestal.playerGenerated) {
      newSeed = misc.incrementRNG(newSeed);
    }
  }

  return newSeed;
}
