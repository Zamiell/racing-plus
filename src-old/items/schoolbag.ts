/*
// Variables
export const sprites = {
  item: null as Sprite | null,
  barBack: null as Sprite | null,
  barMeter: null as Sprite | null,
  barMeterBattery: null as Sprite | null,
  barLines: null as Sprite | null,
};

export function resetSprites(): void {
  sprites.item = null;
  sprites.barBack = null;
  sprites.barMeter = null;
  sprites.barMeterBattery = null;
  sprites.barLines = null;
}

export function put(item: int, charge: int): void {
  remove();

  if (item === 0) {
    return;
  }

  g.run.schoolbag.item = item;
  g.run.schoolbag.charge =
    charge === -1 ? misc.getItemMaxCharges(item) : charge;

  Isaac.DebugString(
    `Adding collectible ${item} (${g.itemConfig.GetCollectible(item).Name})`,
  );
}

export function remove(): void {
  g.run.schoolbag.item = 0;
  g.run.schoolbag.charge = 0;
  g.run.schoolbag.chargeBattery = 0;
  sprites.item = null;
}

export function addCharge(singleCharge: boolean): void {
  // Local variables
  const roomShape = g.r.GetRoomShape();
  const maxCharges = misc.getItemMaxCharges(g.run.schoolbag.item);

  if (isItemFullyCharged(maxCharges)) {
    return;
  }

  // Find out how many charges we should add
  let chargesToAdd = 1;
  if (roomShape >= RoomShape.ROOMSHAPE_2x2) {
    // 2x2 rooms or L rooms
    chargesToAdd = 2;
  } else if (
    g.p.HasTrinket(TrinketType.TRINKET_AAA_BATTERY) &&
    g.run.schoolbag.charge === maxCharges - 2
  ) {
    // The AAA Battery grants an extra charge when the active item is one away from being fully
    // charged
    chargesToAdd = 2;
  }
  if (singleCharge) {
    // We might only want to add a single charge to the Schoolbag item in certain situations
    chargesToAdd = 1;
  }

  // Add the correct amount of charges (accounting for The Battery)
  g.run.schoolbag.charge += chargesToAdd;
  if (g.run.schoolbag.charge > maxCharges) {
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY)) {
      const extraChargesToAdd = g.run.schoolbag.charge - maxCharges;
      g.run.schoolbag.chargeBattery += extraChargesToAdd;
      if (g.run.schoolbag.chargeBattery > maxCharges) {
        g.run.schoolbag.chargeBattery = maxCharges;
      }
    }
    g.run.schoolbag.charge = maxCharges;
  }
}

function isItemFullyCharged(maxCharges: int) {
  // We don't need to do anything if we do not have a Schoolbag
  // or we do not have an item in the Schoolbag
  if (
    !g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM) ||
    g.run.schoolbag.item === 0
  ) {
    return true;
  }

  // We don't need to do anything if the item is already charged
  if (
    g.run.schoolbag.charge >= maxCharges &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY)
  ) {
    return true;
  }

  // We don't need to do anything if the item is already double-charged
  if (
    g.run.schoolbag.chargeBattery >= maxCharges &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY)
  ) {
    return true;
  }

  return false;
}

export function spriteDisplay(): void {
  // Local variables
  const maxCharges = misc.getItemMaxCharges(g.run.schoolbag.item);
  const itemX = 45;
  const itemY = 50;
  const barXOffset = 17;
  const barYOffset = 1;
  const itemVector = Vector(itemX, itemY);
  const barVector = Vector(itemX + barXOffset, itemY + barYOffset);

  if (g.seeds.HasSeedEffect(SeedEffect.SEED_NO_HUD)) {
    return;
  }

  if (!g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)) {
    return;
  }

  // Load the sprites
  if (
    sprites.item === null ||
    sprites.barBack === null ||
    sprites.barMeter === null ||
    sprites.barMeterBattery === null ||
    sprites.barLines === null
  ) {
    let fileName: string;
    if (g.run.schoolbag.item === 0) {
      // We don't have anything inside of the Schoolbag, so show a faded Schoolbag sprite
      fileName = "gfx/items/collectibles/Schoolbag_Empty.png";
    } else if (
      g.run.schoolbag.item === CollectibleType.COLLECTIBLE_MOVING_BOX &&
      g.run.movingBoxOpen
    ) {
      // We need custom logic to handle Moving Box, which has two different sprites
      fileName = "gfx/items/collectibles/collectibles_523_movingbox_open.png";
    } else {
      fileName = g.itemConfig.GetCollectible(g.run.schoolbag.item).GfxFileName;
    }

    sprites.item = Sprite();
    sprites.item.Load("gfx/schoolbag_item.anm2", false);
    sprites.item.ReplaceSpritesheet(0, fileName);
    sprites.item.LoadGraphics();
    sprites.item.Play("Default", true);

    sprites.barBack = Sprite();
    sprites.barBack.Load("gfx/ui/ui_chargebar.anm2", true);
    sprites.barBack.Play("BarEmpty", true);

    sprites.barMeter = Sprite();
    sprites.barMeter.Load("gfx/ui/ui_chargebar.anm2", true);
    sprites.barMeter.Play("BarFull", true);

    sprites.barMeterBattery = Sprite();
    sprites.barMeterBattery.Load("gfx/ui/ui_chargebar_battery.anm2", true);
    sprites.barMeterBattery.Play("BarFull", true);

    sprites.barLines = Sprite();
    sprites.barLines.Load("gfx/ui/ui_chargebar.anm2", true);
    if (maxCharges > 12) {
      // This is an item that slowly recharges, so show the 1-charge sprite
      sprites.barLines.Play("BarOverlay1", true);
    } else {
      sprites.barLines.Play(`BarOverlay${maxCharges}`, true);
    }

    // Fade the placeholder image (the Schoolbag icon)
    if (g.run.schoolbag.item === 0) {
      sprites.item.Color = Color(1, 1, 1, 0.5, 0, 0, 0);
      sprites.item.Scale = Vector(0.75, 0.75);
    }
  }

  // Draw the item image
  sprites.item.Update();
  sprites.item.Render(itemVector, Vector.Zero, Vector.Zero);

  // Draw the charge bar
  if (maxCharges !== 0) {
    // The background
    sprites.barBack.Update();
    sprites.barBack.Render(barVector, Vector.Zero, Vector.Zero);

    // The bar itself, clipped appropriately
    sprites.barMeter.Update();
    const meterMultiplier = 24 / maxCharges;
    const meterClip1 = 26 - g.run.schoolbag.charge * meterMultiplier;
    sprites.barMeter.Render(barVector, Vector(0, meterClip1), Vector.Zero);

    // The bar for The Battery charges
    sprites.barMeterBattery.Update();
    const meterClip2 = 26 - g.run.schoolbag.chargeBattery * meterMultiplier;
    sprites.barMeterBattery.Render(
      barVector,
      Vector(0, meterClip2),
      Vector.Zero,
    );

    // The segment lines on top
    sprites.barLines.Update();
    sprites.barLines.Render(barVector, Vector.Zero, Vector.Zero);
  }
}

// Called from the PostUpdate callback
export function checkActiveCharges(): void {
  // Local variables
  const activeCharge = g.p.GetActiveCharge();
  const batteryCharge = g.p.GetBatteryCharge();

  if (
    !g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM) ||
    g.p.GetActiveItem() === 0
  ) {
    return;
  }

  // Store the new active charge
  // (we need to know how many charges we have if we pick up a second active item)
  g.run.schoolbag.last.active.charge = activeCharge;
  g.run.schoolbag.last.active.chargeBattery = batteryCharge;
}

// Called from the PostUpdate callback
// Check for the vanilla Schoolbag and convert it to the Racing+ Schoolbag if necessary
export function convertVanilla(): void {
  if (!g.p.HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG)) {
    return;
  }

  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG);
  misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_SCHOOLBAG);
  if (!g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)) {
    g.p.AddCollectible(
      CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
      0,
      false,
    );
  }
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
  );
}

// Called from the PostUpdate callback (the "CheckEntities.ReplacePedestal()" function)
// (this code check runs only when the item is first spawned)
export function checkSecondItem(pickup: EntityPickup): boolean {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const roomFrameCount = g.r.GetFrameCount();

  if (
    !g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM) ||
    g.run.schoolbag.item !== 0 ||
    !pickup.Touched ||
    g.itemConfig.GetCollectible(pickup.SubType).Type !== ItemType.ITEM_ACTIVE
  ) {
    return false;
  }

  // We don't want to put the item in the Schoolbag if we just entered the room
  // and there is a touched item sitting on the ground for whatever reason
  if (roomFrameCount === 1) {
    return false;
  }

  // We don't want to put the item in the Schoolbag if we dropped it from a Butter! trinket
  if (
    g.p.HasTrinket(TrinketType.TRINKET_BUTTER) &&
    g.run.droppedButterItem === pickup.SubType
  ) {
    g.run.droppedButterItem = 0;
    Isaac.DebugString(
      `Prevented putting item ${pickup.SubType} in the Schoolbag (from Butter).`,
    );
    return false;
  }

  // Put the item in our Schoolbag
  g.run.schoolbag.item = pickup.SubType;
  g.run.schoolbag.charge = g.run.schoolbag.last.schoolbag.charge;
  g.run.schoolbag.chargeBattery = g.run.schoolbag.last.schoolbag.chargeBattery;
  sprites.item = null;
  Isaac.DebugString(
    `Put pedestal ${pickup.SubType} into the Schoolbag with ${g.run.schoolbag.charge} charges ` +
      `(and ${g.run.schoolbag.chargeBattery} Battery charges).`,
  );

  if (gameFrameCount === g.run.frameOfLastDD + 1) {
    // If we took this item from a devil deal, then we want to delete the pedestal entirely
    // (since the item was not on a pedestal to begin with,
    // it would not make any sense to leave an empty pedestal)
    // Unfortunately, the empty pedestal will still show for a single frame
    pickup.Remove();
  } else {
    // Otherwise, empty the pedestal
    pickup.SubType = 0;
    pickup.GetSprite().Play("Empty", true);
  }

  return true;
}

// Check to see if the Schoolbag item needs to be swapped back in
export function checkEmptyActiveItem(): void {
  if (
    !g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM) ||
    g.run.schoolbag.item === 0 ||
    g.p.GetActiveItem() !== 0 ||
    !g.p.IsItemQueueEmpty()
  ) {
    return;
  }

  // They used up their primary item (e.g. Pandora's Box, etc.)
  // So, put the Schoolbag item in the primary slot
  Isaac.DebugString(
    `Empty active detected; swapping in Schoolbag item ${g.run.schoolbag.item}.`,
  );
  schoolbagSwitch();
  remove();
}

// Check for Schoolbag switch inputs
export function checkInput(): void {
  // Local variables
  const activeItem = g.p.GetActiveItem();
  const activeCharge = g.p.GetActiveCharge();
  const batteryCharge = g.p.GetBatteryCharge();

  // We do not care about detecting inputs if:
  // we do not have the Schoolbag,
  // or we don't have anything in the Schoolbag,
  // or we currently have an active item held overhead
  if (
    !g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM) ||
    g.run.schoolbag.item === 0 ||
    isActiveItemQueued()
  ) {
    // This will allow switches while the use/pickup animation is occurring but
    // prevent bugs where queued items will override things
    return;
  }

  let schoolbagSwitchInputPressed: boolean;
  let hotkeySwitch: int | null = null;
  if (RacingPlusData !== undefined) {
    hotkeySwitch = RacingPlusData.Get("hotkeySwitch") as int | null;
  }
  if (hotkeySwitch !== null && hotkeySwitch !== 0) {
    // They have a custom Schoolbag-switch hotkey bound, so we need check for that input
    // (we use "IsButtonPressed()" instead of "IsButtonTriggered()" because
    // the latter is not very responsive with fast sequences of inputs)
    schoolbagSwitchInputPressed = misc.isButtonPressed(hotkeySwitch);
  } else {
    // They do not have a Schoolbag-switch hotkey bound
    // Default to using the same button that is used for the vanilla Schoolbag
    // (e.g. card/pill switch)
    // (we use "IsActionPressed()" instead of "IsActionTriggered()" because
    // the latter is not very responsive with fast sequences of inputs)
    schoolbagSwitchInputPressed = Input.IsActionPressed(
      ButtonAction.ACTION_DROP,
      g.p.ControllerIndex,
    );
  }

  if (!schoolbagSwitchInputPressed) {
    g.run.schoolbag.switchButtonHeld = false;
    return;
  }
  if (g.run.schoolbag.switchButtonHeld) {
    return;
  }

  g.run.schoolbag.switchButtonHeld = true;

  // Put the item from the Schoolbag in the active slot
  schoolbagSwitch();

  // Put the old item in the Schoolbag
  g.run.schoolbag.item = activeItem;
  g.run.schoolbag.charge = activeCharge;
  g.run.schoolbag.chargeBattery = batteryCharge;
  sprites.item = null;
  Isaac.DebugString(
    `Put item ${g.run.schoolbag.item} into the Schoolbag with charge: ${g.run.schoolbag.charge}-${g.run.schoolbag.chargeBattery}`,
  );
}

function isActiveItemQueued() {
  if (g.p.QueuedItem.Item === null) {
    return false;
  }

  return g.p.QueuedItem.Item.Type === ItemType.ITEM_ACTIVE;
}

function schoolbagSwitch() {
  // Local variables
  const activeItem = g.p.GetActiveItem();
  const maxCharges = misc.getItemMaxCharges(g.run.schoolbag.item);

  // Fix the bug where you can spam Schoolbag switches to get permanent invincibility from
  // My Little Unicorn and Unicorn Stump
  if (
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN) || // 77
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_UNICORN_STUMP)) && // 298
    g.p.HasInvincibility()
  ) {
    g.p.ClearTemporaryEffects();
    Isaac.DebugString(
      "Ended My Little Unicorn / Unicorn Stump invulnerability early.",
    );
  }

  // Set the new active item
  g.p.AddCollectible(g.run.schoolbag.item, 0, false); // We set the charges manually in the next line
  g.p.DischargeActiveItem(); // This is necessary to prevent some bugs with The Battery
  const totalCharges = g.run.schoolbag.charge + g.run.schoolbag.chargeBattery;
  g.p.SetActiveCharge(totalCharges);
  Isaac.DebugString(`Set charges to: ${totalCharges}`);

  // Fix the bug where the charge sound will play if the item is fully charged or partially charged
  if (
    g.p.GetActiveCharge() === maxCharges &&
    g.sfx.IsPlaying(SoundEffect.SOUND_BATTERYCHARGE)
  ) {
    g.sfx.Stop(SoundEffect.SOUND_BATTERYCHARGE);
  }
  if (g.p.GetActiveCharge() !== 0 && g.sfx.IsPlaying(SoundEffect.SOUND_BEEP)) {
    g.sfx.Stop(SoundEffect.SOUND_BEEP);
  }

  // Update the cache (in case the new or old item granted stats, like A Pony)
  // (we don't want to update the familiar cache because it can cause bugs with Dino Baby
  // and cause temporary familiars to despawn)
  g.p.AddCacheFlags(ALL_CACHE_FLAGS_MINUS_FAMILIARS);
  g.p.EvaluateItems();

  // If the old active item granted a non-temporary costume, we need to remove it
  // Only certain specific items grant permanent costumes;
  // this list was determined by testing all active items through trial and error
  if (
    activeItem === CollectibleType.COLLECTIBLE_KAMIKAZE || // 40
    activeItem === CollectibleType.COLLECTIBLE_MONSTROS_TOOTH || // 86
    activeItem === CollectibleType.COLLECTIBLE_PONY || // 130
    activeItem === CollectibleType.COLLECTIBLE_WHITE_PONY // 181
  ) {
    g.p.RemoveCostume(g.itemConfig.GetCollectible(activeItem));
  }

  // Set the item hold cooldown to 0 since this doesn't count as picking up a new item
  // (this fixes the bug where you can't immediately pick up a new item after performing a Schoolbag
  // switch)
  g.p.ItemHoldCooldown = 0;

  // Tell The Babies Mod to reload the sprite just in case the new active item has a costume and it
  // messes up the sprite
  if (SinglePlayerCoopBabies !== null) {
    SinglePlayerCoopBabies.run.reloadSprite = true;
  }
}

// Called from the PostUpdate callback
export function checkRemoved(): void {
  if (
    g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM) &&
    !g.run.schoolbag.hasSchoolbagCollectible
  ) {
    // We just got the Schoolbag for the first time
    g.run.schoolbag.hasSchoolbagCollectible = true;
  }

  if (
    !g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM) &&
    g.run.schoolbag.hasSchoolbagCollectible
  ) {
    // We had the Schoolbag collectible at some point in the past and now it is gone
    g.run.schoolbag.hasSchoolbagCollectible = false;
    if (g.run.schoolbag.item !== 0) {
      // Drop the item that was in the Schoolbag on the ground
      // (spawn it with an InitSeed of 0 so that it will be replaced on the next frame)
      const position = g.r.FindFreePickupSpawnPosition(g.p.Position, 0, true);
      const collectible = g.g
        .Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_COLLECTIBLE,
          position,
          Vector.Zero,
          null,
          g.run.schoolbag.item,
          0,
        )
        .ToPickup();
      if (collectible !== null) {
        // We need to transfer back the current charge to the item
        // Furthermore, we do not need to worry about the case of The Battery overcharge,
        // because by using the D4 or the D100, they will have rerolled away The Battery
        collectible.Charge = g.run.schoolbag.charge;
      }

      remove();
    }
  }
}

export function postNewRoom(): void {
  // Local variables
  const activeItem = g.p.GetActiveItem();
  const activeCharge = g.p.GetActiveCharge();
  const activeChargeBattery = g.p.GetBatteryCharge();

  if (g.run.schoolbag.usedGlowingHourGlass === 0) {
    // Record the state of the active item + the Schoolbag item in case we use a Glowing Hour Glass
    g.run.schoolbag.last = {
      active: {
        item: activeItem,
        charge: activeCharge,
        chargeBattery: activeChargeBattery,
      },
      schoolbag: {
        item: g.run.schoolbag.item,
        charge: g.run.schoolbag.charge,
        chargeBattery: g.run.schoolbag.chargeBattery,
      },
    };
  } else if (g.run.schoolbag.usedGlowingHourGlass === 1) {
    // We just used a Glowing Hour Glass,
    // so mark to reset the active item + the Schoolbag item on the next render frame
    g.run.schoolbag.usedGlowingHourGlass = 2;
  }
}

// Make the Schoolbag work properly with the Glowing Hour Glass
// (this has to be in the PostRender callback instead of the PostNewRoom callback since the game
// decrements the charge from the Glowing Hour Glass on the first render frame after the room is
// loaded)
export function glowingHourGlass(): void {
  if (g.run.schoolbag.usedGlowingHourGlass !== 2) {
    return;
  }

  // Local variables
  const last = g.run.schoolbag.last;

  // Decrement the charges on the Glowing Hour Glass
  if (last.active.item === CollectibleType.COLLECTIBLE_GLOWING_HOUR_GLASS) {
    last.active.charge -= 2;
  }
  if (last.schoolbag.item === CollectibleType.COLLECTIBLE_GLOWING_HOUR_GLASS) {
    last.schoolbag.charge = last.schoolbag.chargeBattery;
  }

  // Rewind the charges on the active item && the Schoolbag item
  g.run.schoolbag.usedGlowingHourGlass = 0;
  const totalActiveCharge = last.active.charge + last.active.chargeBattery;
  g.p.AddCollectible(last.active.item, totalActiveCharge, true);
  put(last.schoolbag.item, last.schoolbag.charge);
  g.run.schoolbag.chargeBattery = last.schoolbag.chargeBattery;
  Isaac.DebugString(
    `Glowing Hour Glass used. Manually restored the active item: ${last.active.item} - ${last.active.charge} - ${last.active.chargeBattery}`,
  );
  Isaac.DebugString(
    `Glowing Hour Glass used. Manually restored the Schoolbag item: ${last.schoolbag.item} - ${last.schoolbag.charge} - ${last.schoolbag.chargeBattery}`,
  );
}
*/
