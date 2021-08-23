import {
  getRandom,
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  log,
} from "isaacscript-common";
import {
  GAME_FRAMES_PER_SECOND,
  ISAAC_FRAMES_PER_SECOND,
} from "../../constants";
import g from "../../globals";
import * as timer from "../../timer";
import TimerType from "../../types/TimerType";
import { incrementRNG } from "../../util";
import {
  findFreePosition,
  removeGridEntity,
  teleport,
} from "../../utilGlobals";
import { forceSwitchToForgotten } from "../mandatory/switchForgotten";
import RaceFormat from "./types/RaceFormat";
import RacerStatus from "./types/RacerStatus";
import RaceStatus from "./types/RaceStatus";
import SeededDeathState from "./types/SeededDeathState";
import v from "./v";

// const SEEDED_DEATH_DEBUFF_FRAMES = 45 * ISAAC_FRAMES_PER_SECOND;
const SEEDED_DEATH_DEBUFF_FRAMES = 5 * ISAAC_FRAMES_PER_SECOND;
const DEVIL_DEAL_BUFFER_FRAMES = 5 * GAME_FRAMES_PER_SECOND;
const DEATH_ANIMATION_FRAMES = 46;

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  postUpdateDeathAnimation();
  postUpdateGhostForm();
  postUpdateDisableControls();
  postUpdateCheckTakingDevilItem();
}

function postUpdateDeathAnimation() {
  if (v.run.seededDeath.state !== SeededDeathState.DEATH_ANIMATION) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  const previousRoomIndex = g.l.GetPreviousRoomIndex();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  // Check to see if the (fake) death animation is over
  if (
    v.run.seededDeath.reviveFrame === null ||
    gameFrameCount < v.run.seededDeath.reviveFrame
  ) {
    return;
  }

  v.run.seededDeath.reviveFrame = null;
  v.run.seededDeath.state = SeededDeathState.CHANGING_ROOMS;
  player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL;
  g.seeds.RemoveSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);

  if (character === PlayerType.PLAYER_THEFORGOTTEN) {
    // The "Revive()" function is bugged with The Forgotten;
    // he will be revived with one soul heart unless he is given a bone heart first
    player.AddBoneHearts(1);
  } else if (character === PlayerType.PLAYER_THESOUL) {
    // If we died on The Soul, we want to remove all of The Forgotten's bone hearts,
    // emulating what happens if you die with Dead Cat
    player.AddBoneHearts(-24);
    player.AddBoneHearts(1);
  }

  const enterDoor = g.l.EnterDoor;
  const door = g.r.GetDoor(enterDoor);
  const direction = (door !== null && door.Direction) || Direction.NO_DIRECTION;
  const transition = v.run.seededDeath.guppysCollar
    ? RoomTransitionAnim.COLLAR
    : RoomTransitionAnim.WALK;
  teleport(previousRoomIndex, direction, transition);
  g.l.LeaveDoor = enterDoor;
}

function postUpdateGhostForm() {
  if (v.run.seededDeath.state !== SeededDeathState.GHOST_FORM) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();
  const player = Isaac.GetPlayer();

  // Check to see if the debuff is over
  if (
    v.run.seededDeath.debuffEndFrame === null ||
    isaacFrameCount < v.run.seededDeath.debuffEndFrame
  ) {
    return;
  }

  v.run.seededDeath.state = SeededDeathState.DISABLED;
  v.run.seededDeath.debuffEndFrame = null;
  debuffOff(player);
  player.AnimateHappy();
}

function postUpdateDisableControls() {
  const player = Isaac.GetPlayer();

  // Ensure that they cannot perform any inputs while seeded death is happening
  if (
    v.run.seededDeath.state === SeededDeathState.DEATH_ANIMATION ||
    v.run.seededDeath.state === SeededDeathState.CHANGING_ROOMS ||
    v.run.seededDeath.state === SeededDeathState.FETAL_POSITION
  ) {
    player.ControlsEnabled = false;
  }
}

function postUpdateCheckTakingDevilItem() {
  const devilRoomDeals = g.g.GetDevilRoomDeals();
  const gameFrameCount = g.g.GetFrameCount();

  if (devilRoomDeals !== v.run.seededDeath.devilRoomDeals) {
    v.run.seededDeath.devilRoomDeals = devilRoomDeals;
    v.run.seededDeath.frameOfLastDevilDeal = gameFrameCount;
  }
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  const player = Isaac.GetPlayer();
  player.AddCurseMistEffect();

  postRenderFetalPosition();
  postRenderCheckDisplayTimer();
}

function postRenderFetalPosition() {
  if (v.run.seededDeath.state !== SeededDeathState.FETAL_POSITION) {
    return;
  }

  const player = Isaac.GetPlayer();
  const playerSprite = player.GetSprite();

  if (playerSprite.IsPlaying("AppearVanilla")) {
    // If we do not lock the player to the same position, they can move while in the fetal position
    // animation (even if their controls are disabled)
    player.Position = v.run.seededDeath.fetalPosition;
  } else {
    v.run.seededDeath.state = SeededDeathState.GHOST_FORM;
    player.ControlsEnabled = true;
  }
}

export function postRenderCheckDisplayTimer(): void {
  if (v.run.seededDeath.debuffEndFrame === null) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();
  const remainingFrames = v.run.seededDeath.debuffEndFrame - isaacFrameCount;
  const seconds = remainingFrames / ISAAC_FRAMES_PER_SECOND;

  const startingX = 65;
  const startingY = 79;
  timer.display(TimerType.SEEDED_DEATH, seconds, startingX, startingY);
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  postNewRoomDeathAnimation();
  postNewRoomChangingRooms();
  postNewRoomGhostForm();
}

function postNewRoomDeathAnimation() {
  if (v.run.seededDeath.state !== SeededDeathState.DEATH_ANIMATION) {
    return;
  }

  const player = Isaac.GetPlayer();

  // They entered a loading zone while dying (e.g. running through a Curse Room door)
  // Play the death animation again, since entering a new room canceled it
  player.PlayExtraAnimation("Death");

  // We need to disable the collision,
  // or else enemies will be able to push around the body during the death animation
  player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
}

function postNewRoomChangingRooms() {
  if (v.run.seededDeath.state !== SeededDeathState.CHANGING_ROOMS) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();
  const player = Isaac.GetPlayer();

  // Do not continue on with the custom death mechanic if the 50% roll for Guppy's Collar was
  // successful
  if (v.run.seededDeath.guppysCollar) {
    v.run.seededDeath.guppysCollar = false;
    v.run.seededDeath.state = SeededDeathState.DISABLED;
    player.ControlsEnabled = true;
    return;
  }

  v.run.seededDeath.state = SeededDeathState.FETAL_POSITION;

  // Play the animation where Isaac lies in the fetal position
  player.PlayExtraAnimation("AppearVanilla");
  v.run.seededDeath.fetalPosition = player.Position;

  debuffOn(player);
  v.run.seededDeath.debuffEndFrame =
    isaacFrameCount + SEEDED_DEATH_DEBUFF_FRAMES;
}

export function postNewRoomGhostForm(): void {
  if (v.run.seededDeath.state !== SeededDeathState.GHOST_FORM) {
    return;
  }

  // Prevent people from abusing the death mechanic to use a Sacrifice Room
  const roomType = g.r.GetType();
  const player = Isaac.GetPlayer();

  if (roomType !== RoomType.ROOM_SACRIFICE) {
    return;
  }

  const spikes = g.r.GetGridEntity(GRID_INDEX_CENTER_OF_1X1_ROOM);
  if (spikes !== null) {
    removeGridEntity(spikes);
  }

  player.AnimateSad();
}

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
// EntityType.ENTITY_PLAYER (1)
export function entityTakeDmgPlayer(): boolean | void {
  // Make the player invulnerable during the death process
  if (
    v.run.seededDeath.state === SeededDeathState.DEATH_ANIMATION ||
    v.run.seededDeath.state === SeededDeathState.CHANGING_ROOMS ||
    v.run.seededDeath.state === SeededDeathState.FETAL_POSITION
  ) {
    return false;
  }

  return undefined;
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  v.run.seededDeath.guppysCollarSeed = g.seeds.GetStartSeed();
}

// ModCallbacksCustom.MC_POST_PLAYER_FATAL_DAMAGE
export function postPlayerFatalDamage(player: EntityPlayer): boolean | void {
  if (
    v.run.seededDeath.state !== SeededDeathState.DISABLED &&
    v.run.seededDeath.state !== SeededDeathState.GHOST_FORM
  ) {
    return undefined;
  }

  if (!seededDeathShouldApply()) {
    return undefined;
  }

  const gameFrameCount = g.g.GetFrameCount();
  const roomType = g.r.GetType();
  const character = player.GetPlayerType();

  // Do not revive the player if they took a devil deal within the past few seconds
  // (we cannot use the "DamageFlag.DAMAGE_DEVIL" to determine this because the player could have
  // taken a devil deal and died to a fire / spikes / etc.)
  if (
    v.run.seededDeath.frameOfLastDevilDeal !== null &&
    gameFrameCount <=
      v.run.seededDeath.frameOfLastDevilDeal + DEVIL_DEAL_BUFFER_FRAMES
  ) {
    return undefined;
  }

  // Do not revive the player if they are trying to get a "free" item in the Boss Rush
  if (roomType === RoomType.ROOM_BOSSRUSH) {
    return undefined;
  }

  // Calculate if Guppy's Collar should work
  v.run.seededDeath.guppysCollar = false;
  if (player.HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR)) {
    v.run.seededDeath.guppysCollarSeed = incrementRNG(
      v.run.seededDeath.guppysCollarSeed,
    );
    const reviveChance = getRandom(v.run.seededDeath.guppysCollarSeed);
    if (reviveChance < 0.5) {
      v.run.seededDeath.guppysCollar = true;
      // (continue with the custom death animation; later on, we won't apply the debuff)
    }
  }

  // The player has taken fatal damage
  // Invoke the custom death mechanic
  v.run.seededDeath.state = SeededDeathState.DEATH_ANIMATION;
  v.run.seededDeath.reviveFrame = gameFrameCount + DEATH_ANIMATION_FRAMES;
  player.PlayExtraAnimation("Death");
  g.sfx.Play(SoundEffect.SOUND_ISAACDIES);
  player.ControlsEnabled = false;
  player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;

  // Hide the player's health to obfuscate the fact that they are still technically alive
  g.seeds.AddSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);

  // Drop all trinkets and pocket items
  if (!v.run.seededDeath.guppysCollar) {
    const trinketPosition1 = findFreePosition(player.Position);
    player.DropTrinket(trinketPosition1, false);
    const trinketPosition2 = findFreePosition(player.Position);
    player.DropTrinket(trinketPosition2, false);
    const pocketPosition1 = findFreePosition(player.Position);
    player.DropPocketItem(0, pocketPosition1);
    const pocketPosition2 = findFreePosition(player.Position);
    player.DropPocketItem(1, pocketPosition2);
  }

  // If we are The Soul, the death animation will not work properly
  // Thus, manually switch to the Forgotten to avoid this
  if (character === PlayerType.PLAYER_THESOUL) {
    forceSwitchToForgotten();
  }

  return false;
}

/*
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

function debuffOn(player: EntityPlayer) {
  player.AddCurseMistEffect();
  log("Seeded death debuff applied.");

  /*
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const player = Isaac.GetPlayer();
  const playerSprite = player.GetSprite();
  const character = player.GetPlayerType();

  v.run.seededDeath.stage = stage;

  debuffOnSetHealth(player);

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
  */
}

/*
function debuffOnSetHealth(player: EntityPlayer) {
  const character = player.GetPlayerType();

  player.AddMaxHearts(-24, true);
  player.AddSoulHearts(-24);
  player.AddBoneHearts(-12);

  switch (character) {
    // 14
    case PlayerType.PLAYER_KEEPER: {
      player.AddMaxHearts(2, true); // One coin container
      player.AddHearts(2);
      break;
    }

    // 16
    case PlayerType.PLAYER_THEFORGOTTEN: {
      player.AddMaxHearts(2, true);
      player.AddHearts(1);
      break;
    }

    // 17
    case PlayerType.PLAYER_THESOUL: {
      player.AddHearts(1);
      break;
    }

    default: {
      player.AddSoulHearts(3);
      break;
    }
  }
}
*/

function debuffOff(player: EntityPlayer) {
  player.RemoveCurseMistEffect();
  log("Seeded death debuff removed.");

  /*
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
  const pickups = Isaac.FindByType(EntityType.ENTITY_PICKUP);
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
    removeAllEntities(blueFlies);

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
  */
}

function seededDeathShouldApply() {
  return (
    true || // TODO
    (g.race.status === RaceStatus.IN_PROGRESS &&
      g.race.myStatus === RacerStatus.RACING &&
      g.race.format === RaceFormat.SEEDED)
  );
}
