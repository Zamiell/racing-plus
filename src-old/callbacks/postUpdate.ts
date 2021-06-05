/*
export function main(): void {
  removeInvisibleEntities();
  checkStartTime();
  checkRoomCleared();
  checkDDItems();
  checkKeeperHearts();
  checkItemPickup();
  checkCharacter();
  checkMomStomp();
  checkManualRechargeActive();
  checkMutantSpiderInnerEye();
  crownOfLight();
  checkLilithExtraIncubus();
  checkLudoSoftlock();
  checkWishbone();
  checkWalnut();
  fix9VoltSynergy();
  checkDisableControls();
  checkRemoveWraithSkull();
  bossRush.postUpdate();
  challengeRooms.postUpdate();

  // Check on every frame to see if we need to open the doors
  fastClear.postUpdate();

  // Check to see if we are leaving a crawlspace (and if we are softlocked in a Boss Rush)
  fastTravel.crawlspace.checkExit();
  fastTravel.crawlspace.checkSoftlock();

  checkEntities.grid(); // Check all the grid entities in the room
  checkEntities.nonGrid(); // Check all the non-grid entities in the room

  // Check for item drop inputs (fast-drop)
  if (isCustomInputPressed("hotkeyDrop")) {
    fastDrop.Main("both");
  }
  if (isCustomInputPressed("hotkeyDropTrinket")) {
    fastDrop.Main("trinket");
  }
  if (isCustomInputPressed("hotkeyDropPocket")) {
    fastDrop.Main("pocket");
  }
  if (isCustomInputPressed("hotkeyAutofire")) {
    autofire.Toggle();
  }

  // Check for Schoolbag switch inputs (and other miscellaneous Schoolbag activities)
  schoolbag.checkInput();
  // (Schoolbag switching is too complicated to use the "isCustomInputPressed()" function)
  schoolbag.checkActiveCharges();
  schoolbag.checkEmptyActiveItem();
  schoolbag.convertVanilla();
  schoolbag.checkRemoved();

  // Check the player's health for the Soul Jar mechanic
  soulJar.PostUpdate();

  // Handle things for races
  racePostUpdate.Main();
  shadow.PostUpdate();

  // Handle things for multi-character speedruns
  speedrunPostUpdate.Main();

  // Handle things for the "Change Char Order" custom challenge
  changeCharOrder.PostUpdate();
}

function removeInvisibleEntities() {
  // Remove invisible pickups on every frame, since they will not go away by themselves
  const invisiblePickups = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariantCustom.INVISIBLE_PICKUP,
  );
  for (const invisiblePickup of invisiblePickups) {
    invisiblePickup.Remove();
  }

  // Remove invisible effects on every frame, since they will not go away by themselves
  const invisibleEffects = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.INVISIBLE_EFFECT,
  );
  for (const invisibleEffect of invisibleEffects) {
    invisibleEffect.Remove();
  }
}

// Check to see if we need to start the timers
function checkStartTime() {
  if (g.run.startedTime === 0) {
    g.run.startedTime = Isaac.GetTime();
  }
}

// Keep track of the when the room is cleared
// and the total amount of rooms cleared on this run thus far
function checkRoomCleared() {
  // Local variables
  const roomClear = g.r.IsClear();

  // Check the clear status of the room and compare it to what it was a frame ago
  if (roomClear === g.run.currentRoomClearState) {
    return;
  }

  g.run.currentRoomClearState = roomClear;

  if (!roomClear) {
    return;
  }

  if (!g.run.room.fastCleared) {
    Isaac.DebugString("Vanilla room clear detected!");
  }

  // Give a charge to the player's Schoolbag item
  schoolbag.AddCharge();

  // Handle speedrun tasks
  season7.RoomCleared();
}

function checkDDItems() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();

  // Check to see if the player is taking a devil deal
  if (
    // In Racing+ Rebalanced, there are DD items in a Curse Room
    roomType !== RoomType.ROOM_CURSE && // 10
    roomType !== RoomType.ROOM_DEVIL && // 14
    roomType !== RoomType.ROOM_BLACK_MARKET // 22
  ) {
    return;
  }

  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  let numDDItems = 0;
  for (const entity of collectibles) {
    const collectible = entity.ToPickup();
    if (collectible !== null && collectible.Price < 0) {
      numDDItems += 1;
    }
  }

  if (roomFrameCount === 1) {
    g.run.room.numDDItems = numDDItems;
    return;
  }

  if (numDDItems < g.run.room.numDDItems) {
    g.run.room.numDDItems = numDDItems;
    g.run.frameOfLastDD = gameFrameCount;
  }
}

// Keep track of our hearts if we are Keeper
// (to fix the Greed's Gullet bug and the double coin / nickel healing bug)
function checkKeeperHearts() {
  // Local variables
  const character = g.p.GetPlayerType();
  const maxHearts = g.p.GetMaxHearts();
  const coins = g.p.GetNumCoins();

  if (character !== PlayerType.PLAYER_KEEPER) {
    return;
  }

  // Find out how many coin containers we should have
  // (2 is equal to 1 actual heart container)
  let coinContainers = 0;
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

  if (baseHearts !== g.run.keeper.baseHearts) {
    // Our health changed; we took a devil deal, took a health down pill,
    // || went from 1 heart to 2 hearts
    const heartsDiff = baseHearts - g.run.keeper.baseHearts;
    g.run.keeper.baseHearts += heartsDiff;
  }

  // Check Keeper coin count
  if (coins !== g.run.keeper.coins) {
    const coinDifference = coins - g.run.keeper.coins;
    if (coinDifference > 0) {
      for (let i = 1; i <= coinDifference; i++) {
        const newCoins = g.p.GetNumCoins();
        if (
          g.p.GetHearts() < g.p.GetMaxHearts() &&
          newCoins !== 25 &&
          newCoins !== 50 &&
          newCoins !== 75 &&
          newCoins !== 99
        ) {
          g.p.AddHearts(2);
          g.p.AddCoins(-1);
        }
      }
    }

    // Set the new coin count (we re-get it since it may have changed)
    g.run.keeper.coins = g.p.GetNumCoins();
  }
}

function postNewItem() {
  // Local variables
  const roomIndex = misc.getRoomIndex();

  // Keep track of all the items that we pick up
  g.run.items.push(g.run.pickingUpItem);

  // Check to see if we picked up the item that conflicts with the custom 3 Dollar Bill
  if (
    g.p.HasCollectible(
      CollectibleTypeCustom.COLLECTIBLE_3_DOLLAR_BILL_SEEDED,
    ) &&
    g.run.pickingUpItem === g.run.threeDollarBillItem
  ) {
    // Set the variable back to 0 so that the new item does not get blown away after a room change
    g.run.threeDollarBillItem = 0;
  }

  // Automatically insert pickups
  const postItemFunction = postItemPickupFunctions.get(g.run.pickingUpItem);
  if (
    postItemFunction !== undefined &&
    // Don't do any custom inventory work if we have changed rooms in the meantime
    roomIndex === g.run.pickingUpItemRoom &&
    // Allow the player to cancel the automatic insertion functionality by holding down a
    // "drop" input
    !misc.isActionPressed(ButtonAction.ACTION_DROP) &&
    !isCustomInputPressed("hotkeyDrop") &&
    !isCustomInputPressed("hotkeyDropTrinket") &&
    !isCustomInputPressed("hotkeyDropPocket")
  ) {
    postItemFunction();
  }
}

function checkCharacter() {
  const character = g.p.GetPlayerType();
  if (g.run.currentCharacter === character) {
    return;
  }
  g.run.currentCharacter = character;

  if (
    character !== PlayerType.PLAYER_THEFORGOTTEN && // 16
    character !== PlayerType.PLAYER_THESOUL // 17
  ) {
    return;
  }

  // Fix the bug where the player can accidentally switch characters and go down a trapdoor
  if (g.run.trapdoor.state === 0) {
    const effects = Isaac.FindByType(EntityType.ENTITY_EFFECT);
    for (const entity of effects) {
      if (
        (entity.Variant === EffectVariantCustom.TRAPDOOR_FAST_TRAVEL ||
          entity.Variant === EffectVariantCustom.CRAWLSPACE_FAST_TRAVEL ||
          entity.Variant === EffectVariantCustom.WOMB_TRAPDOOR_FAST_TRAVEL ||
          entity.Variant ===
            EffectVariantCustom.BLUE_WOMB_TRAPDOOR_FAST_TRAVEL ||
          entity.Variant === EffectVariantCustom.HEAVEN_DOOR_FAST_TRAVEL) &&
        g.p.Position.Distance(entity.Position) <= 40
      ) {
        const effect = entity.ToEffect();
        if (effect !== null) {
          effect.State = 1;
          effect.GetSprite().Play("Closed", true);
        }
      }
    }
  }
}

// Subverting the teleport on the Mom fight can result in a buggy interaction where Mom does not
// stomp
// Force Mom to stomp by teleporting the player to the middle of the room for one frame
function checkMomStomp() {
  if (!g.run.room.forceMomStomp) {
    return;
  }

  // Local variables
  const roomFrameCount = g.r.GetFrameCount();
  const centerPos = g.r.GetCenterPos();

  switch (roomFrameCount) {
    case 19: {
      g.run.room.forceMomStompPos = g.p.Position;
      g.p.Position = centerPos;
      g.p.Visible = false;

      const familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR);
      for (const familiar of familiars) {
        familiar.Visible = false;
      }

      const knives = Isaac.FindByType(
        EntityType.ENTITY_KNIFE,
        -1,
        -1,
        false,
        false,
      );
      for (const knife of knives) {
        knife.Visible = false;
      }

      const scythes = Isaac.FindByType(
        EntityTypeCustom.ENTITY_SAMAEL_SCYTHE,
        -1,
        -1,
        false,
        false,
      );
      for (const scythe of scythes) {
        scythe.Visible = false;
      }

      break;
    }

    case 20: {
      g.p.Position = g.run.room.forceMomStompPos;
      g.p.Visible = true;
      break;
    }

    case 21: {
      // We have to delay a frame before making familiars and knives visible,
      // since they lag behind the position of the player by a frame

      const familiars = Isaac.FindByType(
        EntityType.ENTITY_FAMILIAR,
        -1,
        -1,
        false,
        false,
      );
      for (const familiar of familiars) {
        familiar.Visible = true;
      }

      const knives = Isaac.FindByType(EntityType.ENTITY_KNIFE);
      for (const knife of knives) {
        knife.Visible = true;
      }

      g.run.room.forceMomStomp = false;
      break;
    }

    default: {
      break;
    }
  }
}

// Check to see if an item that messes with item pedestals got canceled
// (this has to be done a frame later or else it won't work)
function checkManualRechargeActive() {
  if (g.run.rechargeItemFrame === g.g.GetFrameCount()) {
    g.run.rechargeItemFrame = 0;
    g.p.FullCharge();
    g.sfx.Stop(SoundEffect.SOUND_BATTERYCHARGE);
  }
}

// Check for Mutant Spider's Inner Eye (a custom item)
function checkMutantSpiderInnerEye() {
  if (
    g.p.HasCollectible(
      CollectibleTypeCustom.COLLECTIBLE_MUTANT_SPIDER_INNER_EYE,
    ) &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER)
  ) {
    // This custom item is set to not be shown on the item tracker
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER, 0, false);
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER);
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_INNER_EYE, 0, false);
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_INNER_EYE);
  }
}

// Check to see if the player just picked up the a Crown of Light from a Basement 1 Treasure Room
// fart-reroll
function crownOfLight() {
  // Local variables
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();

  if (
    !g.run.removedCrownHearts &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) &&
    g.run.roomsEntered === 1 // They are still in the starting room
  ) {
    // The player started with Crown of Light, so we don't need to go into the below code block
    g.run.removedCrownHearts = true;
    return;
  }

  if (
    !g.run.removedCrownHearts &&
    stage === 1 &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) &&
    (((g.race.rFormat === "unseeded" || g.race.rFormat === "diversity") &&
      g.race.status === "in progress") ||
      challenge === ChallengeCustom.R7_SEASON_7)
  ) {
    // Remove the two soul hearts that the Crown of Light gives
    g.run.removedCrownHearts = true;
    g.p.AddSoulHearts(-4);
  }
}

// In R+7 Season 4 and Racing+ Rebalanced,
// we want to remove the Lilith's extra Incubus if they attempt to switch characters
function checkLilithExtraIncubus() {
  // Local variables
  const character = g.p.GetPlayerType();

  if (g.run.extraIncubus && character !== PlayerType.PLAYER_LILITH) {
    g.run.extraIncubus = false;
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_INCUBUS);
    Isaac.DebugString("Removed the extra Incubus.");
  }
}

function checkLudoSoftlock() {
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE) &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS)
  ) {
    // These 3 items will cause a stationary Brimstone ring to surround the player
    // It deals damage, but it can softlock the game if there are island enemies
    // Just remove Dr. Fetus to fix the softlock condition
    // (which transforms the build into a normal Ludo + Brimstone)
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_DR_FETUS);
  }

  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE) &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY) &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE)
  ) {
    // These 3 items will cause a stationary laser ring to surround the player
    // It deals damage, but it can softlock the game if there are island enemies
    // Just remove Mom's Knife to fix the softlock condition
    // (which transform the build into a normal Ludo + Technology)
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE);
  }
}

function checkWishbone() {
  if (g.run.haveWishbone) {
    if (!g.p.HasTrinket(TrinketType.TRINKET_WISH_BONE)) {
      g.run.haveWishbone = false;
      const wishBones = Isaac.FindByType(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TRINKET,
        TrinketType.TRINKET_WISH_BONE,
      );
      if (wishBones.length === 0) {
        g.sfx.Play(SoundEffectCustom.SOUND_WALNUT, 1, 0, false, 1);
        // (we reuse the Walnut breaking sound effect for this)
      }
    }
  } else if (g.p.HasTrinket(TrinketType.TRINKET_WISH_BONE)) {
    g.run.haveWishbone = true;
  }
}

function checkWalnut() {
  if (g.run.haveWalnut) {
    if (!g.p.HasTrinket(TrinketType.TRINKET_WALNUT)) {
      g.run.haveWalnut = false;
      const walnuts = Isaac.FindByType(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TRINKET,
        TrinketType.TRINKET_WALNUT,
      );
      if (walnuts.length === 0) {
        g.sfx.Play(SoundEffectCustom.SOUND_WALNUT, 1, 0, false, 1);
      }
    }
  } else if (g.p.HasTrinket(TrinketType.TRINKET_WALNUT)) {
    g.run.haveWalnut = true;
  }
}

// Fix The Battery + 9 Volt synergy (2/2)
function fix9VoltSynergy() {
  if (g.run.giveExtraCharge) {
    g.run.giveExtraCharge = false;
    g.p.SetActiveCharge(g.p.GetActiveCharge() + 1);
  }
}

function checkDisableControls() {
  if (g.run.disableControls) {
    g.run.disableControls = false;
    g.p.ControlsEnabled = false;
  }
}

function checkRemoveWraithSkull() {
  // Local variables
  const character = g.p.GetPlayerType();

  // Judas Shadow + Wraith Skull bug
  if (character !== PlayerTypeCustom.PLAYER_SAMAEL) {
    if (g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_WRAITH_SKULL)) {
      g.p.RemoveCollectible(CollectibleTypeCustom.COLLECTIBLE_WRAITH_SKULL);
      Isaac.DebugString(
        "Removed the Wraith Skull since we are not on Samael anymore.",
      );
    }
    if (
      g.run.schoolbag.item === CollectibleTypeCustom.COLLECTIBLE_WRAITH_SKULL
    ) {
      schoolbag.remove();
      Isaac.DebugString(
        "Removed the Wraith Skull (from the Schoolbag) since we are not on Samael anymore.",
      );
    }
  }
}

function isCustomInputPressed(racingPlusDataKey: string) {
  // If they do not have a hotkey bound, do nothing
  if (RacingPlusData === undefined) {
    return false;
  }
  const hotkey = RacingPlusData.Get(racingPlusDataKey) as undefined | int;
  if (hotkey === undefined || hotkey === 0) {
    return false;
  }

  return misc.isButtonPressed(hotkey);
}

*/
