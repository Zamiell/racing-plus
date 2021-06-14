import { HEALTH_UP_ITEMS } from "../constants";
import g from "../globals";
import { CollectibleTypeCustom } from "../types/enums";

// CacheFlag.CACHE_DAMAGE (1)
export function damage(player: EntityPlayer, _cacheFlag: CacheFlag): void {
  debugDamage(player);
  techZeroBuild(player);
}

function debugDamage(player: EntityPlayer) {
  if (g.run.debugDamage) {
    player.Damage = 1000;
  }
}

function techZeroBuild(player: EntityPlayer) {
  if (
    g.race.startingItems.includes(
      CollectibleType.COLLECTIBLE_TECHNOLOGY_ZERO,
    ) &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY_ZERO) &&
    g.race.startingItems.includes(CollectibleType.COLLECTIBLE_POP) &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_POP) &&
    g.race.startingItems.includes(CollectibleType.COLLECTIBLE_CUPIDS_ARROW) &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_CUPIDS_ARROW) &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS)
  ) {
    player.Damage *= 0.5;
  }
}

// CacheFlag.CACHE_FIREDELAY (2)
export function fireDelay(player: EntityPlayer, _cacheFlag: CacheFlag): void {
  debugFireDelay(player);
}

function debugFireDelay(player: EntityPlayer) {
  if (g.run.debugTears) {
    player.MaxFireDelay = 3;
  }
}

// CacheFlag.CACHE_SHOTSPEED (4)
export function shotSpeed(player: EntityPlayer, _cacheFlag: CacheFlag): void {
  crownOfLightHealJudas(player);
}

function crownOfLightHealJudas(player: EntityPlayer) {
  // Local variables
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const character = player.GetPlayerType();

  // If Crown of Light is started from a Basement 1 Treasure Room, it should heal for a half heart
  if (
    player.HasCollectible(CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) &&
    stage === 1 &&
    roomType === RoomType.ROOM_TREASURE &&
    // (this will still work even if you exit the room with the item held overhead)
    character === PlayerType.PLAYER_JUDAS
  ) {
    player.AddHearts(1);
  }
}

// CacheFlag.CACHE_RANGE (8)
export function range(player: EntityPlayer, _cacheFlag: CacheFlag): void {
  manageKeeperHeartContainers(player);
}

function manageKeeperHeartContainers(player: EntityPlayer) {
  // Local variables
  const character = player.GetPlayerType();
  const maxHearts = player.GetMaxHearts();
  const coins = player.GetNumCoins();
  let coinContainers = 0;

  if (
    character !== PlayerType.PLAYER_KEEPER ||
    !player.HasCollectible(CollectibleType.COLLECTIBLE_GREEDS_GULLET)
  ) {
    return;
  }

  // Find out how many coin containers we should have
  // (2 is equal to 1 actual heart container)
  if (coins >= 99) {
    coinContainers = 8;
  } else if (coins >= 75) {
    coinContainers = 6;
  } else if (coins >= 50) {
    coinContainers = 4;
  } else if (coins >= 25) {
    coinContainers = 2;
  }
  const baseHearts = maxHearts - coinContainers;

  // We have to add the range cache to all health up items in the "items.xml" file for this to work
  for (const itemID of HEALTH_UP_ITEMS) {
    const numItemsOnThisFrame = player.GetCollectibleNum(itemID);
    let numItemsOnPreviousFrame = g.run.keeper.healthUpItems.get(itemID);
    if (numItemsOnPreviousFrame === undefined) {
      numItemsOnPreviousFrame = 0;
    }

    if (
      (itemID !== 1000 && numItemsOnThisFrame > numItemsOnPreviousFrame) ||
      (itemID === 1000 && g.run.keeper.usedHealthUpPill)
    ) {
      // We just got a new health up item
      // Keep track of it
      g.run.keeper.healthUpItems.set(itemID, numItemsOnPreviousFrame + 1);
      if (itemID === 1000) {
        g.run.keeper.usedHealthUpPill = false;
      }

      if (itemID === CollectibleType.COLLECTIBLE_ABADDON) {
        player.AddMaxHearts(-24, true); // Remove all hearts
        // Give whatever containers we should have from coins
        player.AddMaxHearts(coinContainers, true);
        player.AddHearts(24); // This is needed because all the new heart containers will be empty
        // We have no way of knowing what the current health was before,
        // because "player.GetHearts()" returns 0 at this point
        // So, just give them max health
      } else if (itemID === CollectibleType.COLLECTIBLE_DEAD_CAT) {
        player.AddMaxHearts(-24, true); // Remove all hearts
        player.AddMaxHearts(2 + coinContainers, true);
        // Give 1 heart container + whatever containers we should have from coins
        player.AddHearts(24); // This is needed because all the new heart containers will be empty
        // We have no way of knowing what the current health was before,
        // because "player.GetHearts()" returns 0 at this point
        // So, just give them max health
      } else if (
        baseHearts < 0 &&
        itemID === CollectibleType.COLLECTIBLE_BODY
      ) {
        // Give 3 heart containers
        player.AddMaxHearts(6, true);

        // Fill in the new containers
        player.AddCoins(1);
        player.AddCoins(1);
        player.AddCoins(1);
      } else if (
        baseHearts < 2 &&
        (itemID === CollectibleType.COLLECTIBLE_RAW_LIVER || // 16
          itemID === CollectibleType.COLLECTIBLE_BUCKET_LARD || // 129
          itemID === CollectibleType.COLLECTIBLE_BODY) // 334
      ) {
        // Give 2 heart containers
        player.AddMaxHearts(4, true);

        // Fill in the new containers
        player.AddCoins(1);
        player.AddCoins(1);
      } else if (baseHearts < 4) {
        // Give 1 heart container
        player.AddMaxHearts(2, true);

        if (
          itemID !== CollectibleType.COLLECTIBLE_ODD_MUSHROOM_DAMAGE &&
          itemID !== CollectibleType.COLLECTIBLE_OLD_BANDAGE &&
          itemID !== 1000 // Health Up pill
        ) {
          // Fill in the new container
          // (Odd Mushroom (Thick), Old Bandage, and Health Up pills do not give filled heart
          // containers)
          player.AddCoins(1);
        }
      }
    }
  }
}

// CacheFlag.CACHE_SPEED (16)
export function speed(player: EntityPlayer, _cacheFlag: CacheFlag): void {
  debugSpeed(player);
  magdaleneSpeedUp(player);
}

function debugSpeed(player: EntityPlayer) {
  if (g.run.debugSpeed) {
    player.MoveSpeed = 2;
  }
}

function magdaleneSpeedUp(player: EntityPlayer) {
  // Local variables
  const character = player.GetPlayerType();

  if (character !== PlayerType.PLAYER_MAGDALENA) {
    return;
  }

  // Emulate having used the starting "Speed Up" pill
  player.MoveSpeed += 0.15;
}

// CacheFlag.CACHE_LUCK (1024)
export function luck(player: EntityPlayer, _cacheFlag: CacheFlag): void {
  dadsLostCoinCustom(player);
  thirteenLuck(player);
  pageantBoyRuleset(player);
}

function dadsLostCoinCustom(player: EntityPlayer) {
  // We want to put the lucky penny directly into the inventory,
  // so we make the item itself grant luck
  const numDadsLostCoins = g.p.GetCollectibleNum(
    CollectibleTypeCustom.COLLECTIBLE_DADS_LOST_COIN_CUSTOM,
  );
  if (numDadsLostCoins > 0) {
    for (let i = 1; i <= numDadsLostCoins; i++) {
      player.Luck += 1;
    }
  }
}

function thirteenLuck(player: EntityPlayer) {
  if (player.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_13_LUCK)) {
    // Set it directly at 13 instead of adding luck in case we are playing a character with negative
    // luck, or in case we have a luck down pill, etc.
    player.Luck = 13;
  }
}

function pageantBoyRuleset(player: EntityPlayer) {
  // The Pageant Boy ruleset starts with 7 luck
  if (g.race.format === "pageant") {
    player.Luck += 7;
  }
}
