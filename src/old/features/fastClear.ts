import { ChallengeCustom } from "../challenges/enums";
import postClearRoomFunctions from "../challenges/postClearRoomFunctions";
import { ZERO_VECTOR } from "../constants";
import g from "../globals";
import * as misc from "../misc";
import * as photos from "../photos";
import { EffectVariantCustom } from "../types/enums";
import bagFamiliarFunctions from "./bagFamiliarFunctions";
import * as bagFamiliars from "./bagFamiliars";

// ModCallbacks.MC_NPC_UPDATE (0)
export function NPCUpdate(npc: EntityNPC): void {
  // Friendly enemies (from Delirious or Friendly Ball) will be added to the aliveEnemies table
  // because there are no flags set yet in the PostNPCInit callback
  // Thus, we have to wait until they are initialized and not remove them from the table
  if (npc.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
    // Remove it from the list if it is on it
    checkDeadNPC(npc, "NPCUpdate");
    return;
  }

  // We can't rely on the PostNPCInit callback because it is not fired for certain NPCs
  // (like when a Gusher emerges from killing a Gaper)
  postNPCInit(npc);
}

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_RAGLING (246)
export function NPCUpdateRagling(npc: EntityNPC): void {
  // Rag Man Raglings (246.1) do not actually die; they turn into patches on the ground
  // So, we need to manually keep track of when this happens
  if (
    npc.Variant === 1 &&
    npc.State === NpcState.STATE_UNIQUE_DEATH
    // (they go to STATE_UNIQUE_DEATH when they are patches on the ground)
  ) {
    checkDeadNPC(npc, "NPCUpdateRagling");
  }
}

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_STONEY (302)
export function NPCUpdateStoney(npc: EntityNPC): void {
  // Stoneys have a chance to morph from EntityType.ENTITY_FATTY (208),
  // so they will get added to the aliveEnemies table before the room is loaded
  // To correct for this, we constantly check to see if Stoneys are on the aliveEnemies table
  const ptrHash = GetPtrHash(npc);
  if (g.run.fastClear.aliveEnemies.has(ptrHash)) {
    g.run.fastClear.aliveEnemies.delete(ptrHash);
    g.run.fastClear.aliveEnemiesCount -= 1;
  }
}

// ModCallbacks.MC_POST_UPDATE (1)
// Check on every frame to see if we need to open the doors
export function postUpdate(): void {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const roomClear = g.r.IsClear();
  const roomFrameCount = g.r.GetFrameCount();

  // Disable this in Greed Mode
  if (g.g.Difficulty >= Difficulty.DIFFICULTY_GREED) {
    return;
  }

  // Disable this if we are on the "PAC1F1CM" seed / Easter Egg
  if (g.seeds.HasSeedEffect(SeedEffect.SEED_PACIFIST)) {
    return;
  }

  // If a frame has passed since an enemy died, reset the delay counter
  if (
    g.run.fastClear.delayFrame !== 0 &&
    gameFrameCount >= g.run.fastClear.delayFrame
  ) {
    g.run.fastClear.delayFrame = 0;
  }

  // Check on every frame to see if ( we need to open the doors
  if (
    g.run.fastClear.aliveEnemiesCount === 0 &&
    g.run.fastClear.delayFrame === 0 &&
    !roomClear &&
    checkAllPressurePlatesPushed() &&
    // Under certain conditions, the room can be clear of enemies on the first frame
    roomFrameCount > 1
  ) {
    clearRoom();
  }
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  // Local variables
  const stage = g.l.GetStage();
  const startSeed = g.seeds.GetStartSeed();
  const stageSeed = g.seeds.GetStageSeed(stage);

  g.run.fastClear.roomClearAwardRNG = startSeed;
  g.run.fastClear.roomClearAwardRNG2 = startSeed;
  for (let i = 0; i < 500; i++) {
    // We want to insure that the second RNG counter does not overlap with the first one
    // (around 175 rooms are cleared in an average speedrun, so 500 is a reasonable upper limit)
    g.run.fastClear.roomClearAwardRNG2 = misc.incrementRNG(
      g.run.fastClear.roomClearAwardRNG2,
    );
  }

  // Initialize variables for bag familiars
  for (const familiarVariant of bagFamiliarFunctions.keys()) {
    g.run.familiarVars.set(familiarVariant, {
      seed: stageSeed,
      roomsCleared: 0,
    });
  }
}

// ModCallbacks.MC_POST_NPC_INIT (27)
export function postNPCInit(npc: EntityNPC): void {
  // Local variables
  const roomFrameCount = g.r.GetFrameCount();
  const isBoss = npc.IsBoss();

  // Don't do anything if we are already tracking this NPC
  // (we cannot use npc.Index as an index for the map because it is always set to 0 in the
  // PostNPCInit callback)
  const ptrHash = GetPtrHash(npc);
  if (g.run.fastClear.aliveEnemies.has(ptrHash)) {
    return;
  }

  // We don't care if this is a non-battle NPC
  if (!npc.CanShutDoors) {
    return;
  }

  // We don't care if the NPC is already dead
  // (this is needed because we can enter this function from the NPCUpdate callback)
  if (npc.IsDead()) {
    return;
  }

  // Rag Man Raglings (246.1) do not actually die; they turn into patches on the ground
  // So, they will get past the above check
  if (
    npc.Type === EntityType.ENTITY_RAGLING &&
    npc.Variant === 1 &&
    npc.State === NpcState.STATE_UNIQUE_DEATH
    // (they go to STATE_UNIQUE_DEATH when they are patches on the ground)
  ) {
    return;
  }

  // We don't care if this is a specific child NPC attached to some other NPC
  if (isAttachedNPC(npc)) {
    return;
  }

  // If we are entering a new room, flush all of the stuff in the old room
  // (we can't use the PostNewRoom callback to handle this since that callback fires after this one)
  // (roomFrameCount will be at -1 during the initialization phase)
  if (roomFrameCount === -1 && !g.run.fastClear.roomInitializing) {
    g.run.fastClear.aliveEnemies = new Map<int, boolean>();
    g.run.fastClear.aliveEnemiesCount = 0;
    g.run.fastClear.aliveBossesCount = 0;
    g.run.fastClear.roomInitializing = true; // (this will get set back to false in the PostNewRoom callback)
    g.run.fastClear.delayFrame = 0;
  }

  // Keep track of the enemies in the room that are alive
  g.run.fastClear.aliveEnemies.set(ptrHash, isBoss);
  g.run.fastClear.aliveEnemiesCount += 1;
  if (isBoss) {
    g.run.fastClear.aliveBossesCount += 1;
  }
}

// ModCallbacks.MC_POST_ENTITY_REMOVE (67)
export function postEntityRemove(entity: Entity): void {
  // We only care about NPCs dying
  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }

  // We can't rely on the PostEntityKill callback because it is not fired for certain NPCs
  // (like when Daddy Long Legs does a stomp attack or a Portal despawns)
  checkDeadNPC(npc, "postEntityRemove");
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
// (we can't use the PostNPCDeath callback or PostEntityRemove callbacks because they are only fired
// once the death animation is finished)
export function postEntityKill(entity: Entity): void {
  // We only care about NPCs dying
  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }

  checkDeadNPC(npc, "postEntityKill");
}

function isAttachedNPC(npc: EntityNPC) {
  // These are NPCs that have "CanShutDoors" equal to true naturally by the game,
  // but shouldn't actually keep the doors closed
  return (
    // My Shadow (23.0.1)
    // These are the black worms generated by My Shadow; they are similar to charmed enemies,
    // but do not actually have the "charmed" flag set,
    // so we don't want to add them to the "aliveEnemies" table
    (npc.Type === EntityType.ENTITY_CHARGER &&
      npc.Variant === 0 &&
      npc.SubType === 1) ||
    // Chubber Projectile (39.22)
    // (needed because Fistuloids spawn them on death)
    (npc.Type === EntityType.ENTITY_VIS && npc.Variant === 22) ||
    // Death Scythe (66.10)
    (npc.Type === EntityType.ENTITY_DEATH && npc.Variant === 10) ||
    // Peep Eye (68.10)
    (npc.Type === EntityType.ENTITY_PEEP && npc.Variant === 10) ||
    // Bloat Eye (68.11)
    (npc.Type === EntityType.ENTITY_PEEP && npc.Variant === 11) ||
    // Begotten Chain (251.10)
    (npc.Type === EntityType.ENTITY_BEGOTTEN && npc.Variant === 10) ||
    // Mama Gurdy Left Hand (266.1)
    (npc.Type === EntityType.ENTITY_MAMA_GURDY && npc.Variant === 1) ||
    // Mama Gurdy Right Hand (266.2)
    (npc.Type === EntityType.ENTITY_MAMA_GURDY && npc.Variant === 2) ||
    // Small Hole (411.1)
    (npc.Type === EntityType.ENTITY_BIG_HORN && npc.Variant === 1) ||
    // Big Hole (411.2)
    (npc.Type === EntityType.ENTITY_BIG_HORN && npc.Variant === 2)
  );
}

function checkDeadNPC(npc: EntityNPC, parentFunction: string) {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // We only care about entities that are in the aliveEnemies table
  const ptrHash = GetPtrHash(npc);
  const isBoss = g.run.fastClear.aliveEnemies.get(ptrHash);
  if (isBoss === undefined) {
    return;
  }

  // The PostEntityKill callback will be triggered when a Dark Red champion changes to a flesh pile
  // This does not count as a real death (and the NPC should not be removed),
  // so we need to handle this
  // We cannot check for "npc.GetSprite().GetFilename() === "gfx/024.000_Globin.anm2"",
  // because that will not work for champion Gapers & Globins
  // We cannot check for "npc.GetSprite().IsPlaying("ReGenChamp")",
  // because that will only be updated on the next frame
  if (
    npc.GetChampionColorIdx() === ChampionColorIdx.DARK_RED &&
    parentFunction === "PostEntityKill"
  ) {
    // We do not want to open the doors yet until the flesh pile is actually removed in the
    // PostEntityRemove callback
    return;
  }

  // Keep track of the enemies in the room that are alive
  g.run.fastClear.aliveEnemies.delete(ptrHash);
  g.run.fastClear.aliveEnemiesCount -= 1;
  if (isBoss) {
    g.run.fastClear.aliveBossesCount -= 1;
  }

  // We want to delay a frame before opening the doors to give time for splitting enemies to spawn
  // their children
  g.run.fastClear.delayFrame = gameFrameCount + 1;

  // We check on every frame to see if the "aliveEnemiesCount" variable is set to 0 the PostUpdate
  // callback
}

function checkAllPressurePlatesPushed() {
  // If we are in a puzzle room, check to see if all of the plates have been pressed
  if (g.run.fastClear.buttonsAllPushed || !g.r.HasTriggerPressurePlates()) {
    return true;
  }

  // Check all the grid entities in the room
  const gridSize = g.r.GetGridSize();
  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== null) {
      const saveState = gridEntity.GetSaveState();
      if (
        saveState.Type === GridEntityType.GRID_PRESSURE_PLATE &&
        saveState.State !== 3
      ) {
        return false;
      }
    }
  }

  g.run.fastClear.buttonsAllPushed = true;
  return true;
}

// This emulates what happens when you normally clear a room
function clearRoom() {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomType = g.r.GetType();
  const customRun = g.seeds.IsCustomRun();
  const challenge = Isaac.GetChallenge();

  // Set the room clear status to true (so that it gets marked off on the minimap)
  g.r.SetClear(true);
  g.run.room.fastCleared = true; // Keep track that the room was cleared artificially
  misc.openAllDoors();

  // Manually kill Death's Heads, Flesh Death's Heads, and any type of creep
  // (by default, they will only die after the death animations are completed)
  // Additionally, open any closed heaven doors
  for (const entity of Isaac.GetRoomEntities()) {
    switch (entity.Type) {
      // 212
      case EntityType.ENTITY_DEATHS_HEAD: {
        if (entity.Variant === 0) {
          // We don't want to target Dank Death's Heads
          // Activate its death state
          const npc = entity.ToNPC();
          if (npc !== null) {
            npc.State = 18;
          }
        }

        break;
      }

      // 286
      case EntityType.ENTITY_FLESH_DEATHS_HEAD: {
        // Activating the death state won't make the tears explode out of it,
        // so just kill it and spawn another one, which will immediately die
        entity.Visible = false;
        entity.Kill();
        const newHead = g.g
          .Spawn(
            entity.Type,
            entity.Variant,
            entity.Position,
            entity.Velocity,
            entity.Parent,
            entity.SubType,
            entity.InitSeed,
          )
          .ToNPC();
        if (newHead !== null) {
          newHead.State = 18;
        }

        break;
      }

      // 1000
      case EntityType.ENTITY_EFFECT: {
        if (
          entity.Variant === EffectVariant.CREEP_RED || // 22
          entity.Variant === EffectVariant.CREEP_GREEN || // 23
          entity.Variant === EffectVariant.CREEP_YELLOW || // 24
          entity.Variant === EffectVariant.CREEP_WHITE || // 25
          entity.Variant === EffectVariant.CREEP_BLACK || // 26
          entity.Variant === EffectVariant.CREEP_BROWN || // 56
          entity.Variant === EffectVariant.CREEP_SLIPPERY_BROWN // 94
        ) {
          entity.Kill();
        } else if (
          entity.Variant === EffectVariantCustom.HEAVEN_DOOR_FAST_TRAVEL
        ) {
          const effect = entity.ToEffect();
          if (effect !== null && effect.State === 1) {
            effect.State = 0;
            effect.GetSprite().Play("Appear", true);
          }
        }

        break;
      }

      default: {
        break;
      }
    }
  }

  if (roomType === RoomType.ROOM_BOSS) {
    // Try and spawn a Devil Room or Angel Room
    // (this takes into account their Devil/Angel percentage and so forth)
    if (g.r.TrySpawnDevilRoomDoor(true)) {
      g.run.lastDDLevel = stage;
    }

    if (stage === 6) {
      // If we just beat Mom, spawn the Boss Rush door
      const ignoreTime =
        g.race.status === "in progress" && g.race.goal === "Boss Rush";
      g.r.TrySpawnBossRushDoor(ignoreTime);
    }

    if (stage === 8) {
      // If we just beat It Lives!, do not spawn the Blue Womb door by default
      // This is because speedrunners will almost never want to go to Hush or Delirium,
      // and seeing the door spawn is distracting
      // If the player really wants to go to the Blue Womb,
      // then they can still backtrack one room and re-enter
      // However, in certain races or speedruns, we want to explicitly spawn the Blue Womb door
      if (
        (g.race.status === "in progress" && g.race.goal === "Hush") ||
        (g.race.status === "in progress" && g.race.goal === "Delirium") ||
        (challenge === ChallengeCustom.R7_SEASON_7 &&
          g.season7.remainingGoals.includes("Hush"))
      ) {
        g.r.TrySpawnBlueWombDoor(true, true);
      }
    }
  }

  // Subvert the "Would you like to do a Victory Lap!?" popup that happens after defeating The Lamb
  if (
    // 11.0 is the Dark Room
    stage === 11 &&
    stageType === 0 &&
    roomType === RoomType.ROOM_BOSS &&
    roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX
  ) {
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.ROOM_CLEAR_DELAY,
      0,
      misc.gridToPos(0, 0),
      ZERO_VECTOR,
      null,
    );
    Isaac.DebugString(
      'Spawned the "Room Clear Delay Effect" custom entity (for The Lamb).',
    );
    // (this will not work to delay the room clearing if "debug 10" is turned on)

    // Track that we have defeated The Lamb (for the "Everything" race goal)
    g.run.killedLamb = true;
  }

  // Spawn the award for clearing the room (the pickup, big chest, etc.)
  // (this also makes the trapdoor appear if we are in a boss room)
  if (
    challenge === 0 &&
    customRun &&
    // We only care about normal room drops, so ignore Boss Rooms
    roomType !== RoomType.ROOM_BOSS && // 5
    // Room drops are not supposed to spawn in crawlspaces
    roomType !== RoomType.ROOM_DUNGEON // 16
  ) {
    // If we are on a set seed, then use a custom system to award room drops in order
    spawnSeededClearAward();
  } else {
    // Use the vanilla function to spawn a room drop,
    // which takes into account the player's luck and so forth
    // (room drops are not supposed to spawn in crawlspaces,
    // but this function will internally exit if we are in a crawlspace,
    // so we do not need to explicitly check for that)
    // Just in case we just killed Mom,
    // we also mark to delete the photos spawned by the game during this step
    // (in the PreEntitySpawn callback)
    g.run.vanillaPhotosSpawning = true;
    g.r.SpawnClearAward();
    g.run.vanillaPhotosSpawning = false;
  }

  // Manually spawn the The Polaroid and/or The Negative, as appropriate
  photos.spawn();

  // Give a charge to the player's active item
  addCharge();

  // Play the sound effect for the doors opening
  // (there are no doors in a crawlspace)
  if (roomType !== RoomType.ROOM_DUNGEON) {
    g.sfx.Play(SoundEffect.SOUND_DOOR_HEAVY_OPEN, 1, 0, false, 1);
  }

  // Check to see if any bag familiars will drop anything
  bagFamiliars.incrementRoomsCleared();
  bagFamiliars.checkSpawn();

  // Perform season-specific things, if any
  const postClearRoomFunction = postClearRoomFunctions.get(challenge);
  if (postClearRoomFunction !== undefined) {
    postClearRoomFunction();
  }
}

// Give a charge to the player's active item
// (and handle co-op players, if present)
export function addCharge(): void {
  // Local variables
  const roomShape = g.r.GetRoomShape();

  for (let i = 0; i < g.g.GetNumPlayers(); i++) {
    const player = Isaac.GetPlayer(i);
    if (player === null) {
      continue;
    }
    const activeItem = player.GetActiveItem();
    const activeCharge = player.GetActiveCharge();
    const batteryCharge = player.GetBatteryCharge();
    const maxCharges = misc.getItemMaxCharges(activeItem);

    if (player.NeedsCharge()) {
      // Find out if we are in a 2x2 or L room
      let chargesToAdd = 1;
      if (roomShape >= RoomShape.ROOMSHAPE_2x2) {
        // 2x2 rooms and L rooms should grant 2 charges
        chargesToAdd = 2;
      } else if (
        player.HasTrinket(TrinketType.TRINKET_AAA_BATTERY) &&
        activeCharge === maxCharges - 2
      ) {
        // The AAA Battery grants an extra charge when the active item is one away from being fully
        // charged
        chargesToAdd = 2;
      } else if (
        player.HasTrinket(TrinketType.TRINKET_AAA_BATTERY) &&
        activeCharge === maxCharges &&
        player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY) &&
        batteryCharge === maxCharges - 2
      ) {
        // The AAA Battery should grant an extra charge when the active item is one away from being
        // fully charged with The Battery
        // (this is bugged in vanilla for The Battery)
        chargesToAdd = 2;
      }

      // Add the correct amount of charges
      const currentCharge = player.GetActiveCharge();
      player.SetActiveCharge(currentCharge + chargesToAdd);
    }
  }
}

// Normally, room drops are based on the room's seed
// This is undesirable, since someone can go a wrong way in a seeded race and then get rewarded with
// an Emperor card that the other player does not get
// Thus, we overwrite the game's room drop system with one that manually spawns awards in order
// The following code is based on the game's internal logic, documented here:
// https://bindingofisaacrebirth.gamepedia.com/Room_Clear_Awards
// (it was reverse engineered by blcd)
// However, there is some major difference from vanilla
// We hard-code values of 0 luck so that room drops are completely consistent
// (otherwise, one player would be able to get a lucky Emperor card by using a Luck Up or Luck Down
// pill, for example)
// Furthermore, we ignore the following items, since we remove them from pools:
// Lucky Foot, Silver Dollar, Bloody Crown, Daemon's Tail, Child's Heart, Rusted Key, Match Stick,
// Lucky Toe, Safety Cap, Ace of Spades, and Watch Battery
function spawnSeededClearAward() {
  // Local variables
  const roomType = g.r.GetType();
  const centerPos = g.r.GetCenterPos();

  // Find out which seed we should use
  // (Devil Rooms and Angel Rooms use a separate RNG counter so that players cannot get a lucky
  // battery)
  let seed: int;
  if (
    roomType === RoomType.ROOM_DEVIL || // 14
    roomType === RoomType.ROOM_ANGEL // 15
  ) {
    g.run.fastClear.roomClearAwardRNG2 = misc.incrementRNG(
      g.run.fastClear.roomClearAwardRNG2,
    );
    seed = g.run.fastClear.roomClearAwardRNG2;
  } else {
    g.run.fastClear.roomClearAwardRNG = misc.incrementRNG(
      g.run.fastClear.roomClearAwardRNG,
    );
    seed = g.run.fastClear.roomClearAwardRNG;
  }

  // Get a random value between 0 and 1 that will determine what kind of reward we get
  const rng = RNG();
  rng.SetSeed(seed, 35);
  const pickupPercent = rng.RandomFloat();

  // Determine the kind of pickup
  let pickupVariant = PickupVariant.PICKUP_NULL;
  if (pickupPercent > 0.22) {
    // 22% chance for nothing to drop
    if (pickupPercent < 0.3) {
      // 7% chance for a card / trinket / pill
      if (rng.RandomInt(3) === 0) {
        // 7% * 33% = 2.3% chance
        pickupVariant = PickupVariant.PICKUP_TAROTCARD; // 300
      } else if (rng.RandomInt(2) === 0) {
        // 7% * 66% * 50% = 2.3% chance
        pickupVariant = PickupVariant.PICKUP_TRINKET; // 350
      } else {
        // 7% * 66% * 50% = 2.3% chance
        pickupVariant = PickupVariant.PICKUP_PILL; // 70
      }
    } else if (pickupPercent < 0.45) {
      // 15% for a coin
      pickupVariant = PickupVariant.PICKUP_COIN; // 20
    } else if (pickupPercent < 0.6) {
      // 15% for a heart
      pickupVariant = PickupVariant.PICKUP_HEART; // 10
    } else if (pickupPercent < 0.8) {
      // 20% for a key
      pickupVariant = PickupVariant.PICKUP_KEY; // 30
    } else if (pickupPercent < 0.95) {
      // 15% for a bomb
      pickupVariant = PickupVariant.PICKUP_BOMB; // 40
    } else {
      // 5% for a chest
      pickupVariant = PickupVariant.PICKUP_CHEST; // 50
    }

    if (rng.RandomInt(20) === 0) {
      pickupVariant = PickupVariant.PICKUP_LIL_BATTERY; // 90
    }

    if (rng.RandomInt(50) === 0) {
      pickupVariant = PickupVariant.PICKUP_GRAB_BAG; // 69
    }
  }

  // Contract From Below has a chance to either:
  // 1) increase the amount of pickups that drop
  // 2) or make nothing drop
  let pickupCount = 1;
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_CONTRACT_FROM_BELOW) &&
    pickupVariant !== PickupVariant.PICKUP_TRINKET
  ) {
    pickupCount =
      g.p.GetCollectibleNum(CollectibleType.COLLECTIBLE_CONTRACT_FROM_BELOW) +
      1;

    // Nothing chance with:
    // 1 contract / 2 pickups: 0.44
    // 2 contracts / 3 pickups: 0.44 (base) (would be 0.3 otherwise)
    // 3 contracts / 4 pickups: 0.2
    // 4 contracts / 5 pickups: 0.13
    const nothingChance = 0.666 ^ pickupCount; // "math.pow()" does not exist in Isaac's Lua version
    if (nothingChance * 0.5 > rng.RandomFloat()) {
      pickupCount = 0;
    }
  }

  // Hard mode has a chance to remove a heart drop
  if (
    g.g.Difficulty === Difficulty.DIFFICULTY_HARD &&
    pickupVariant === PickupVariant.PICKUP_HEART
  ) {
    if (rng.RandomInt(100) >= 35) {
      pickupVariant = PickupVariant.PICKUP_NULL;
    }
  }

  // Broken Modem has a chance to increase the amount of pickups that drop
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BROKEN_MODEM) &&
    rng.RandomInt(4) === 0 &&
    pickupCount >= 1 &&
    (pickupVariant === PickupVariant.PICKUP_HEART || // 10
      pickupVariant === PickupVariant.PICKUP_COIN || // 20
      pickupVariant === PickupVariant.PICKUP_KEY || // 30
      pickupVariant === PickupVariant.PICKUP_BOMB || // 40
      pickupVariant === PickupVariant.PICKUP_GRAB_BAG) // 69
  ) {
    pickupCount += 1;
  }

  if (pickupCount > 0 && pickupVariant !== PickupVariant.PICKUP_NULL) {
    let subType = 0;
    for (let i = 1; i <= pickupCount; i++) {
      const pos = g.r.FindFreePickupSpawnPosition(centerPos, 1, true);
      const pickup = g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        pickupVariant,
        pos,
        ZERO_VECTOR,
        null,
        subType,
        rng.Next(),
      );

      // Pickups with a subtype of 0 can morph into the various kinds of other pickups
      // If we are spawning a 2nd copy of this pickup, make sure that it is the same type
      subType = pickup.SubType;
    }
  }
}
