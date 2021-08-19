/*

This code needs to run after a forgotten switch

    if (g.run.seededDeath.state === SeededDeath.state.DEATH_ANIMATION) {
      g.p.PlayExtraAnimation("Death");
    }

Test to see what happens if Soul dies in seeded death

*/

/*
// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const previousRoomIndex = g.l.GetPreviousRoomIndex();
  const character = g.p.GetPlayerType();
  const playerSprite = g.p.GetSprite();

  // Fix the bug where The Forgotten will not be properly faded if he switched from The Soul
  // immediately before the debuff occurred
  if (
    g.run.fadeForgottenFrame !== 0 &&
    gameFrameCount >= g.run.fadeForgottenFrame
  ) {
    g.run.fadeForgottenFrame = 0;

    // Re-fade the player
    playerSprite.Color = Color(1, 1, 1, 0.25, 0, 0, 0);
  }

  // Check to see if the (fake) death animation is over
  if (
    g.run.seededDeath.state === SeededDeathState.DEATH_ANIMATION &&
    g.run.seededDeath.reviveFrame !== 0 &&
    gameFrameCount >= g.run.seededDeath.reviveFrame
  ) {
    g.run.seededDeath.reviveFrame = 0;
    g.run.seededDeath.state = SeededDeathState.CHANGING_ROOMS;
    g.p.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL;
    g.seeds.RemoveSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);

    if (character === PlayerType.PLAYER_THEFORGOTTEN) {
      // The "Revive()" function is bugged with The Forgotten;
      // he will be revived with one soul heart unless he is given a bone heart first
      g.p.AddBoneHearts(1);
    } else if (character === PlayerType.PLAYER_THESOUL) {
      // If we died on The Soul, we want to remove all of The Forgotten's bone hearts,
      // emulating what happens if you die with Dead Cat
      g.p.AddBoneHearts(-24);
      g.p.AddBoneHearts(1);
    }
    const enterDoor = g.l.EnterDoor;
    const door = g.r.GetDoor(enterDoor);
    const direction = (door && door.Direction) || Direction.NO_DIRECTION;
    let transition = RoomTransition.TRANSITION_NONE;
    if (g.run.seededDeath.guppysCollar) {
      transition = RoomTransition.TRANSITION_GUPPYS_COLLAR;
    }
    teleport(previousRoomIndex, direction, transition);
    g.l.LeaveDoor = enterDoor;

    if (character === PlayerType.PLAYER_THESOUL) {
      // If we are The Soul, the manual revival will not work properly
      // Thus, manually switch to the Forgotten to avoid this
      g.run.switchForgotten = true;
    }
  }

  // Check to see if the debuff is over
  if (g.run.seededDeath.state === SeededDeathState.GHOST_FORM) {
    const remainingTime = g.run.seededDeath.debuffEndTime - Isaac.GetTime();
    if (remainingTime <= 0) {
      g.run.seededDeath.state = SeededDeathState.DISABLED;
      g.run.seededDeath.debuffEndTime = 0;
      debuffOff();
      g.p.AnimateHappy();
      Isaac.DebugString("Seeded death debuff complete.");
    }
  }
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  const playerSprite = g.p.GetSprite();

  if (g.run.seededDeath.state === SeededDeathState.FETAL_POSITION) {
    // Keep the player in place during the "AppearVanilla" animation
    g.p.Position = g.run.seededDeath.position;

    if (!playerSprite.IsPlaying("AppearVanilla")) {
      g.run.seededDeath.state = SeededDeathState.GHOST_FORM;
    }
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const effects = g.p.GetEffects();

  // Add a temporary Holy Mantle effect for Keeper after a seeded revival
  if (g.run.level.tempHolyMantle) {
    effects.AddCollectibleEffect(CollectibleType.COLLECTIBLE_HOLY_MANTLE, true);
  }

  // Make any Checkpoints not touchable
  if (g.run.seededDeath.state > 0) {
    const checkpoints = Isaac.FindByType(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COLLECTIBLE,
      CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
    );
    for (const checkpoint of checkpoints) {
      const pickup = checkpoint.ToPickup();
      if (pickup !== null) {
        pickup.Timeout = 10000000;
        Isaac.DebugString("Delayed a Checkpoint due to seeded death.");
      }
    }
  }

  // Check for if they entered a loading zone while dying (e.g. running through a Curse Room door)
  if (g.run.seededDeath.state === SeededDeathState.DEATH_ANIMATION) {
    // Play the death animation again, since entering a new room canceled it
    g.p.PlayExtraAnimation("Death");

    // We need to disable the controls,
    // or the player will be able to move around during the death animation
    // If we disable them now, it will not apply,
    // since you cannot disable controls inside of this callback
    // So mark to disable the controls during the next post-update frame
    g.run.disableControls = true;

    // We need to disable the collision,
    // or else enemies will be able to push around the body during the death animation
    g.p.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
  }

  // Put the player in the fetal position (the "AppearVanilla" animation)
  if (g.run.seededDeath.state === SeededDeathState.CHANGING_ROOMS) {
    // Do not continue on with the custom death mechanic if the 50% roll for Guppy's Collar was
    // successful
    if (g.run.seededDeath.guppysCollar) {
      g.run.seededDeath.state = SeededDeathState.DISABLED;
      g.run.seededDeath.guppysCollar = false;
      return;
    }

    g.run.seededDeath.state = SeededDeathState.FETAL_POSITION;

    // Start the debuff and set the finishing time to be in the future
    debuffOn();
    const debuffTimeMilliseconds = SEEDED_DEATH_DEBUFF_SECONDS * 1000;
    g.run.seededDeath.debuffEndTime = Isaac.GetTime() + debuffTimeMilliseconds;

    // Play the animation where Isaac lies in the fetal position
    g.p.PlayExtraAnimation("AppearVanilla");

    g.run.seededDeath.position = Vector(g.p.Position.X, g.p.Position.Y);
  }
}

export function entityTakeDmgPlayer(damageAmount: int): boolean | null {
  const gameFrameCount = g.g.GetFrameCount();
  const roomType = g.r.GetType();
  const character = g.p.GetPlayerType();
  const hearts = g.p.GetHearts();
  const eternalHearts = g.p.GetEternalHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();
  let extraLives = g.p.GetExtraLives();
  const challenge = Isaac.GetChallenge();

  // Make the player invulnerable during the death animation
  if (g.run.seededDeath.state === SeededDeathState.DEATH_ANIMATION) {
    return false;
  }

  // Check to see if this is a situation where the custom death mechanic should apply
  if (
    g.race.format !== "seeded" &&
    challenge !== ChallengeCustom.R7_SEASON_6
  ) {
    return null;
  }

  // Check to see if the custom death mechanic is active
  if (
    g.run.seededDeath.state === SeededDeathState.DISABLED ||
    g.run.seededDeath.state === SeededDeathState.GHOST_FORM
  ) {
    return null;
  }

  // Check to see if this is fatal damage
  const totalHealth = hearts + eternalHearts + soulHearts + boneHearts;
  if (damageAmount < totalHealth) {
    return null;
  }

  // Furthermore, this will not be fatal damage if we have two different kinds of hearts
  // e.g. a bomb explosion deals 2 damage,
  // but if the player has one half soul heart and one half red heart,
  // the game will only remove the soul heart
  if (
    (hearts > 0 && soulHearts > 0) ||
    (hearts > 0 && boneHearts > 0) ||
    (soulHearts > 0 && boneHearts > 0) ||
    (soulHearts > 0 && eternalHearts > 0) ||
    boneHearts >= 2 // Two bone hearts and nothing else should not result in a death
  ) {
    return null;
  }

  // Check to see if they have a revival item
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR)) {
    // Having Guppy's Collar causes the extra lives to always be set to 1
    // We handle Guppy's Collar manually
    extraLives -= 1;
  }
  if (
    g.p.HasTrinket(TrinketType.TRINKET_MISSING_POSTER) &&
    // Mysterious Paper has a chance to give Missing Poster on every frame
    !g.p.HasTrinket(TrinketType.TRINKET_MYSTERIOUS_PAPER)
  ) {
    // Having Missing Poster does not affect the extra lives variable, so manually account for this
    extraLives += 1;
  }
  if (extraLives > 0) {
    return null;
  }

  // Do not revive the player if they took a devil deal within the past 5 seconds (150 game frames)
  // (we cannot use the "DamageFlag.DAMAGE_DEVIL" to determine this because the player could have
  // taken a devil deal and died to a fire / spikes / etc.)
  if (gameFrameCount <= g.run.frameOfLastDD + 150) {
    return null;
  }

  // Do not revive the player if they are trying to get a "free" item in either a Sacrifice Room or
  // the Boss Rush
  if (
    roomType === RoomType.ROOM_SACRIFICE || // 13
    roomType === RoomType.ROOM_BOSSRUSH // 17
  ) {
    return null;
  }

  // Calculate if Guppy's Collar should work
  g.run.seededDeath.guppysCollar = false;
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR)) {
    g.RNGCounter.guppysCollar = misc.incrementRNG(g.RNGCounter.guppysCollar);
    math.randomSeed(g.RNGCounter.guppysCollar);
    const reviveChance = math.random(1, 2);
    if (reviveChance === 1) {
      g.run.seededDeath.guppysCollar = true;
    }
  }

  // The player has taken fatal damage
  // Invoke the custom death mechanic
  g.run.seededDeath.state = SeededDeathState.DEATH_ANIMATION;
  g.run.seededDeath.reviveFrame = gameFrameCount + 46;
  g.p.PlayExtraAnimation("Death");
  g.sfx.Play(SoundEffect.SOUND_ISAACDIES, 1, 0, false, 1);

  // We need to disable the controls,
  // or the player will be able to move around during the death animation
  g.p.ControlsEnabled = false;

  // We need to disable the collision,
  // or else enemies will be able to push around the body during the death animation
  g.p.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;

  // Hide the player's health to obfuscate the fact that they are still technically alive
  g.seeds.AddSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);

  // Drop all trinkets and pocket items
  if (!g.run.seededDeath.guppysCollar) {
    const pos1 = findFreePosition(g.p.Position);
    g.p.DropTrinket(pos1, false);
    const pos2 = findFreePosition(g.p.Position);
    g.p.DropPocketItem(0, pos2);
    const pos3 = findFreePosition(g.p.Position);
    g.p.DropPocketItem(1, pos3);
  }

  // If we are The Soul, the death animation will not work properly
  // Thus, manually switch to the Forgotten to avoid this
  if (character === PlayerType.PLAYER_THESOUL) {
    g.run.switchForgotten = true;
  }

  return false;
}

// Prevent people from abusing the death mechanic to use a Sacrifice Room
export function postNewRoomCheckSacrificeRoom(): void {
  const roomType = g.r.GetType();

  if (
    g.run.seededDeath.state !== SeededDeathState.GHOST_FORM ||
    roomType !== RoomType.ROOM_SACRIFICE
  ) {
    return;
  }

  g.p.AnimateSad();
  for (let i = 0; i < g.r.GetGridSize(); i++) { // change to getGridEntities
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== null) {
      const saveState = gridEntity.GetSaveState();
      if (saveState.Type === GridEntityType.GRID_SPIKES) {
        removeGridEntity(gridEntity)
      }
    }
  }
}

function debuffOn() {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const playerSprite = g.p.GetSprite();
  const character = g.p.GetPlayerType();

  // Store the current level
  g.run.seededDeath.stage = stage;

  // Set their health to explicitly 1.5 soul hearts
  // (of custom values for Keeper & The Forgotten)
  g.p.AddMaxHearts(-24, true);
  g.p.AddSoulHearts(-24);
  g.p.AddBoneHearts(-12);
  if (character === PlayerType.PLAYER_KEEPER) {
    // 14
    g.p.AddMaxHearts(2, true); // One coin container
    g.p.AddHearts(2);
  } else if (character === PlayerType.PLAYER_THEFORGOTTEN) {
    // 16
    g.p.AddMaxHearts(2, true);
    g.p.AddHearts(1);
  } else if (character === PlayerType.PLAYER_THESOUL) {
    // 17
    g.p.AddHearts(1);
  } else {
    g.p.AddSoulHearts(3);
  }

  // Store their active item charge for later
  g.run.seededDeath.charge = g.p.GetActiveCharge();

  // Store their Schoolbag item and remove it
  // (we need to check to see if it is equal to 0 in case they die twice in a row)
  if (g.run.schoolbag.item !== 0) {
    g.run.seededDeath.sbItem = g.run.schoolbag.item;
    g.run.seededDeath.sbCharge = g.run.schoolbag.charge;
    g.run.seededDeath.sbChargeBattery = g.run.schoolbag.chargeBattery;
    g.run.schoolbag.item = 0;
    g.run.schoolbag.charge = 0;
    g.run.schoolbag.chargeBattery = 0;
  }

  // Store their size for later and reset it to default
  // (in case they had items like Magic Mushroom and so forth)
  g.run.seededDeath.spriteScale = g.p.SpriteScale;
  g.p.SpriteScale = Vector(1, 1);

  // Store their golden bomb / key status
  g.run.seededDeath.goldenBomb = g.p.HasGoldenBomb();
  g.run.seededDeath.goldenKey = g.p.HasGoldenKey();

  // We need to remove every item (and store it for later)
  // ("player.GetCollectibleNum()" is bugged;
  // if you feed it a number higher than the total amount of items, it can cause the game to crash)
  for (let itemID = 1; itemID <= g.numTotalCollectibles; itemID++) {
    const numItems = g.p.GetCollectibleNum(itemID);
    if (numItems > 0 && g.p.HasCollectible(itemID)) {
      // Checking both "GetCollectibleNum()" and "HasCollectible()" prevents bugs such as Lilith
      // having 1 Incubus
      for (let i = 1; i <= numItems; i++) {
        g.run.seededDeath.items.push(itemID);
        g.p.RemoveCollectible(itemID);
        misc.removeItemFromItemTracker(itemID);
        g.p.TryRemoveCollectibleCostume(itemID, false);
      }
    }
  }

  // Now that we have deleted every item, update the players stats
  g.p.AddCacheFlags(CacheFlag.CACHE_ALL);
  g.p.EvaluateItems();

  // Remove any golden bombs && keys
  g.p.RemoveGoldenBomb();
  g.p.RemoveGoldenKey();

  // Remove the Dead Eye multiplier, if ( any
  for (let i = 0; i < 100; i++) {
    // Each time this function is called, it only has a chance of working,
    // so just call it 100 times to be safe
    g.p.ClearDeadEyeCharge();
  }

  // Make them take "red heart damage" for the purposes of getting a Devil Deal
  g.l.SetRedHeartDamage();

  // Fade the player
  playerSprite.Color = Color(1, 1, 1, 0.25, 0, 0, 0);

  // The fade will now work if ( we just switched from The Soul on the last frame,
  // so mark to redo the fade a few frames from now
  if (character === PlayerType.PLAYER_THEFORGOTTEN) {
    // 16
    // If we wait 5 frames || less, ) { the fade will ! stick
    g.run.fadeForgottenFrame = gameFrameCount + 6;
  }
}

function debuffOff() {
  const stage = g.l.GetStage();
  const playerSprite = g.p.GetSprite();
  const character = g.p.GetPlayerType();
  const effects = g.p.GetEffects();

  // Un-fade the character
  playerSprite.Color = DEFAULT_COLOR;

  // Store the current active item, red hearts, soul/black hearts, bombs, keys, and pocket items
  const subPlayer = g.p.GetSubPlayer();
  const activeItem = g.p.GetActiveItem();
  const activeCharge = g.p.GetActiveCharge();
  const hearts = g.p.GetHearts();
  const maxHearts = g.p.GetMaxHearts();
  let soulHearts = g.p.GetSoulHearts();
  let blackHearts = g.p.GetBlackHearts();
  if (character === PlayerType.PLAYER_THEFORGOTTEN) {
    soulHearts = subPlayer.GetSoulHearts();
    blackHearts = subPlayer.GetBlackHearts();
  }
  const boneHearts = g.p.GetBoneHearts();
  const bombs = g.p.GetNumBombs();
  const keys = g.p.GetNumKeys();
  const card1 = g.p.GetCard(0);
  const pill1 = g.p.GetPill(0);

  // Add all of the items from the array
  for (const itemID of g.run.seededDeath.items) {
    // Make an exception for The Quarter and The Dollar,
    // since it will just give us extra money
    if (
      itemID !== CollectibleType.COLLECTIBLE_QUARTER &&
      itemID !== CollectibleType.COLLECTIBLE_DOLLAR
    ) {
      g.p.AddCollectible(itemID, 0, false);

      // The Halo of Flies item actually gives two Halo of Flies, so we need to remove one
      if (itemID === CollectibleType.COLLECTIBLE_HALO_OF_FLIES) {
        g.p.RemoveCollectible(itemID);
      }
    }
  }

  // Reset the items in the array
  g.run.seededDeath.items = [];

  // Set the charge to the way it was before the debuff was applied
  g.p.SetActiveCharge(g.run.seededDeath.charge);

  // Set their size to the way it was before the debuff was applied
  g.p.SpriteScale = g.run.seededDeath.spriteScale;

  // Set the health to the way it was before the items were added
  g.p.AddMaxHearts(-24, true); // Remove all hearts
  g.p.AddSoulHearts(-24);
  g.p.AddBoneHearts(-24);
  g.p.AddMaxHearts(maxHearts, true);
  g.p.AddBoneHearts(boneHearts);
  g.p.AddHearts(hearts);
  for (let i = 1; i <= soulHearts; i++) {
    const bitPosition = math.floor((i - 1) / 2);
    const bit = (blackHearts & (1 << bitPosition)) >>> bitPosition;
    if (bit === 0) {
      // Soul heart
      g.p.AddSoulHearts(1);
    } else {
      // Black heart
      g.p.AddBlackHearts(1);
    }
  }

  // If The Soul is active when the debuff ends, the health will not be handled properly,
  // so manually set everything
  if (character === PlayerType.PLAYER_THESOUL) {
    g.p.AddBoneHearts(-24);
    g.p.AddBoneHearts(1);
    g.p.AddHearts(-24);
    g.p.AddHearts(1);
  }

  // Set the inventory to the way it was before the items were added
  g.p.AddBombs(-99);
  g.p.AddBombs(bombs);
  g.p.AddKeys(-99);
  g.p.AddKeys(keys);
  if (g.run.seededDeath.goldenBomb) {
    g.run.seededDeath.goldenBomb = false;
    if (stage === g.run.seededDeath.stage) {
      g.p.AddGoldenBomb();
    }
  }
  if (g.run.seededDeath.goldenKey) {
    g.run.seededDeath.goldenKey = false;
    if (stage === g.run.seededDeath.stage) {
      g.p.AddGoldenKey();
    }
  }

  // We also have to account for Caffeine Pill,
  // which is the only item in the game that directly puts a pocket item into your inventory
  if (card1 !== 0) {
    g.p.SetCard(0, card1);
  } else {
    g.p.SetPill(0, pill1);
  }

  // Delete all newly-spawned pickups in the room
  // (re-giving back some items will cause pickups to spawn)
  const pickups = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
  );
  for (const pickup of pickups) {
    if (
      pickup.Variant !== PickupVariant.PICKUP_COLLECTIBLE &&
      pickup.FrameCount === 0
    ) {
      pickup.Remove();
    }
  }

  // Fix character-specific bugs
  if (character === PlayerType.PLAYER_LILITH) {
    // If Lilith had Incubus, the debuff will grant an extra Incubus, so account for this
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_INCUBUS)) {
      g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_INCUBUS);
    }
  } else if (character === PlayerType.PLAYER_KEEPER) {
    // Keeper will get extra blue flies if he was given any items that grant soul hearts
    const blueFlies = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR,
      FamiliarVariant.BLUE_FLY,
    );
    for (const fly of blueFlies) {
      fly.Remove();
    }

    // Keeper will start with one coin container, which can lead to chain deaths
    // Give Keeper a temporary Wooden Cross effect
    g.run.level.tempHolyMantle = true;
    effects.AddCollectibleEffect(CollectibleType.COLLECTIBLE_HOLY_MANTLE, true);
  }

  // Now that we have added every item, update the players stats
  // (needed in case e.g. we dropped a Pony)
  g.p.AddCacheFlags(CacheFlag.CACHE_ALL);
  g.p.EvaluateItems();

  // Make any Checkpoints touchable again
  const checkpoints = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
  );
  for (const checkpoint of checkpoints) {
    const pickup = checkpoint.ToPickup();
    if (pickup !== null) {
      pickup.Timeout = -1;
    }
  }
}

export function deleteMegaBlastLaser(laser: EntityLaser): void {
  if (g.run.seededDeath.debuffEndTime === 0) {
    return;
  }

  const remainingDebuffTime = g.run.seededDeath.debuffEndTime - Isaac.GetTime();
  if (remainingDebuffTime <= 0) {
    return;
  }

  // There is no way to stop a Mega Blast while it is currently going with the API
  // It will keep firing, so we need to delete it on every frame
  laser.Remove();

  // Even though we delete it, it will still show up for a frame
  // Thus, the Mega Blast laser will look like it is intermittently shooting,
  // even though it deals no damage
  // Make it invisible to fix this
  laser.Visible = false;
  // (this also has the side effect of muting the sound effects)

  // Even though we make it invisible, it still displays effects when it hits a wall
  // So, reduce the size of it to mitigate this
  laser.SpriteScale = Vector.Zero;
  laser.SizeMulti = Vector.Zero;
}
*/
