// Check various things once per game frame (30 times a second)
// (this will not fire while a floor is loading or a room is loading)

import * as season5 from "../challenges/season5";
import { DEFAULT_COLOR, TRANSFORMATION_NAMES } from "../constants";
import * as bossRush from "../features/bossRush";
import * as challengeRooms from "../features/challengeRooms";
import * as fastClear from "../features/fastClear";
import * as fastTravel from "../features/fastTravel";
import g from "../globals";
import * as schoolbag from "../items/schoolbag";
import * as misc from "../misc";
import * as postItemPickup from "../postItemPickup";
import postItemPickupFunctions from "../postItemPickupFunctions";
import {
  CollectibleTypeCustom,
  EffectVariantCustom,
  EntityTypeCustom,
  PickupVariantCustom,
  PlayerTypeCustom,
  SoundEffectCustom,
} from "../types/enums";

export function main(): void {
  removeInvisibleEntities();
  checkStartTime();
  checkRoomCleared();
  checkDDItems();
  checkKeeperHearts();
  checkItemPickup();
  checkTransformations();
  checkCharacter();
  checkHauntSpeedup();
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

  pills.CheckPHD();

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
    -1,
    false,
    false,
  );
  for (const invisiblePickup of invisiblePickups) {
    invisiblePickup.Remove();
  }

  // Remove invisible effects on every frame, since they will not go away by themselves
  const invisibleEffects = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.INVISIBLE_EFFECT,
    -1,
    false,
    false,
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
    -1,
    false,
    false,
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

function checkItemPickup() {
  if (g.p.IsItemQueueEmpty()) {
    checkItemPickupQueueEmpty();
  } else {
    checkItemPickupQueueNotEmpty();
  }
}

function checkItemPickupQueueEmpty() {
  // Check to see if we were picking up something on the previous frame
  if (g.run.pickingUpItem === CollectibleType.COLLECTIBLE_NULL) {
    return;
  }

  // We just finished putting an item into our inventory
  // (e.g. the animation where Isaac holds the item over his head just finished)
  // Check to see if we need to do something specific after this item is added to our inventory
  if (
    g.run.pickingUpItemType === ItemType.ITEM_PASSIVE || // 1
    g.run.pickingUpItemType === ItemType.ITEM_ACTIVE || // 3
    g.run.pickingUpItemType === ItemType.ITEM_FAMILIAR // 4
  ) {
    postNewItem();
  }

  // Mark that we are no longer picking up anything anymore
  g.run.pickingUpItem = CollectibleType.COLLECTIBLE_NULL;
  g.run.pickingUpItemRoom = 0;
  g.run.pickingUpItemType = ItemType.ITEM_NULL;
}

function checkItemPickupQueueNotEmpty() {
  // Local variables
  const roomIndex = misc.getRoomIndex();

  // We are currently in the animation where Isaac holds an item over his head
  if (g.run.pickingUpItem !== CollectibleType.COLLECTIBLE_NULL) {
    // We have already marked down which item is being held, so do nothing
    return;
  }

  if (g.p.QueuedItem.Item === null) {
    // We are currently picking up an item, but QueuedItem is null
    // This should never happen
    return;
  }

  // Record which item we are picking up
  g.run.pickingUpItem = g.p.QueuedItem.Item.ID;
  g.run.pickingUpItemRoom = roomIndex;
  g.run.pickingUpItemType = g.p.QueuedItem.Item.Type;

  preItemPickup(g.p.QueuedItem.Item);
}

function preItemPickup(itemConfigItem: ItemConfigItem) {
  // Mark that we have touched a pedestal item (for Challenge Rooms & the Boss Rush)
  // (trinkets do not start Challenge Rooms or the Boss Rush on vanilla)
  if (g.run.pickingUpItemType !== ItemType.ITEM_TRINKET) {
    g.run.room.touchedPickup = true;
  }

  // Mark to draw the streak text for this item
  g.run.streakText = itemConfigItem.Name;
  g.run.streakFrame = Isaac.GetFrameCount();

  // Keep track of our passive items over the course of the run
  if (
    itemConfigItem.Type === ItemType.ITEM_PASSIVE || // 1
    itemConfigItem.Type === ItemType.ITEM_FAMILIAR // 4
  ) {
    g.run.passiveItems.push(itemConfigItem.ID);
  }

  // Put Mutant Spider's Inner Eye on the item tracker
  if (
    itemConfigItem.ID ===
    CollectibleTypeCustom.COLLECTIBLE_MUTANT_SPIDER_INNER_EYE
  ) {
    Isaac.DebugString("Adding collectible 3001 (Mutant Spider's Inner Eye)");
  }

  // Other
  season5.preItemPickup(itemConfigItem);
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

function checkTransformations() {
  for (let i = 0; i <= PlayerForm.NUM_PLAYER_FORMS - 1; i++) {
    const hasForm = g.p.HasPlayerForm(i);
    if (hasForm && !g.run.transformations.has(i)) {
      // We have gotten a new transformation that has not been recorded yet
      g.run.transformations.set(i, true);
      g.run.streakText = TRANSFORMATION_NAMES[i];
      g.run.streakFrame = Isaac.GetFrameCount();

      if (i === PlayerForm.PLAYERFORM_DRUGS) {
        postItemPickup.insertNearestPill();
      }
    }
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
    const effects = Isaac.FindByType(
      EntityType.ENTITY_EFFECT,
      -1,
      -1,
      false,
      false,
    );
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

// Speed up the first Lil' Haunt attached to a Haunt (3/3)
function checkHauntSpeedup() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const blackChampionHaunt = g.run.speedLilHauntsBlack;
  if (
    g.run.speedLilHauntsFrame === 0 ||
    gameFrameCount < g.run.speedLilHauntsFrame
  ) {
    return;
  }
  g.run.speedLilHauntsFrame = 0;
  g.run.speedLilHauntsBlack = false;

  // Haunt (260.0)
  const hauntCount = Isaac.CountEntities(
    null,
    EntityType.ENTITY_THE_HAUNT,
    0,
    -1,
  );

  // As a sanity check, do not do anything if there are no Haunts in the room
  if (hauntCount === 0) {
    return;
  }

  // Lil' Haunt (260.10)
  const lilHaunts = Isaac.FindByType(
    EntityType.ENTITY_THE_HAUNT,
    10,
    0,
    false,
    true,
  );

  // If there is more than one Haunt, detach every Lil Haunt,
  // because tracking everything will be too hard
  if (hauntCount > 1) {
    for (const lilHaunt of lilHaunts) {
      const npc = lilHaunt.ToNPC();
      if (npc !== null) {
        detachLilHaunt(npc);
      }
    }
    return;
  }

  const lilHauntIndexes: int[] = [];
  for (const lilHaunt of lilHaunts) {
    const npc = lilHaunt.ToNPC();
    if (npc !== null) {
      lilHauntIndexes.push(lilHaunt.Index);
    }
  }
  table.sort(lilHauntIndexes);
  for (const lilHaunt of lilHaunts) {
    const npc = lilHaunt.ToNPC();
    if (npc !== null) {
      if (lilHaunt.Index === lilHauntIndexes[0]) {
        detachLilHaunt(npc);
      }
      if (lilHaunt.Index === lilHauntIndexes[1] && blackChampionHaunt) {
        detachLilHaunt(npc);
      }
    }
  }
}

function detachLilHaunt(npc: EntityNPC) {
  // Detach them
  npc.State = NpcState.STATE_MOVE;

  // We need to manually set them to visible (or else they will be invisible for some reason)
  npc.Visible = true;

  // We need to manually set the color, or else the Lil' Haunt will remain faded
  npc.SetColor(DEFAULT_COLOR, 0, 0, false, false);

  // We need to manually set their collision or else ears will pass through them
  npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL;
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

      const familiars = Isaac.FindByType(
        EntityType.ENTITY_FAMILIAR,
        -1,
        -1,
        false,
        false,
      );
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

      const knives = Isaac.FindByType(
        EntityType.ENTITY_KNIFE,
        -1,
        -1,
        false,
        false,
      );
      for (const knife of knives) {
        knife.Visible = true;
      }

      const scythes = Isaac.FindByType(
        EntityTypeCustom.ENTITY_SAMAEL_SCYTHE,
        -1,
        -1,
        false,
        false,
      );
      for (const scythe of scythes) {
        scythe.Visible = true;
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
        false,
        false,
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
        false,
        false,
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
