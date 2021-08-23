import { getRandom, GRID_INDEX_CENTER_OF_1X1_ROOM } from "isaacscript-common";
import {
  COLOR_DEFAULT,
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

const SEEDED_DEATH_DEBUFF_FRAMES = 45 * ISAAC_FRAMES_PER_SECOND;
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
  postRenderFetalPosition();
  postRenderCheckDisplayTimer();
}

function postRenderFetalPosition() {
  if (v.run.seededDeath.state !== SeededDeathState.FETAL_POSITION) {
    return;
  }

  const player = Isaac.GetPlayer();
  const sprite = player.GetSprite();

  if (sprite.IsPlaying("AppearVanilla")) {
    // If we do not lock the player to the same position, they can move while in the fetal position
    // animation (even if their controls are disabled)
    player.Position = v.run.seededDeath.fetalPosition;
  } else {
    v.run.seededDeath.state = SeededDeathState.GHOST_FORM;
    player.ControlsEnabled = true;
  }
}

function postRenderCheckDisplayTimer(): void {
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

// ModCallbacks.MC_INPUT_ACTION (13)
// InputHook.GET_ACTION_VALUE (2)
// ButtonAction.ACTION_BOMB (8)
export function inputActionIsActionTriggeredBomb(): void {
  if (v.run.seededDeath.debuffEndFrame === null) {
    return;
  }

  // After setting the mist curse, the game immediately removes it,
  // presumably because we are not in the alternate dimension
  // Even if you continually set it on every PostUpdate or PostRender frame,
  // it will not work properly
  // However, it does work if we set it on every InputAction fire
  // Since this callback fires multiple times per frame, we can limit the total amount of function
  // calls by arbitrarily choosing one kind of button (bomb) and only calling it once a frame
  const gameFrameCount = g.g.GetFrameCount();
  if (gameFrameCount !== v.run.seededDeath.curseSetFrame) {
    const player = Isaac.GetPlayer();
    player.AddCurseMistEffect();
  }
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

function postNewRoomGhostForm(): void {
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

// ModCallbacks.MC_POST_LASER_INIT (47)
// LaserVariant.GIANT_RED (6)
export function postLaserInitGiantRed(laser: EntityLaser): void {
  if (v.run.seededDeath.debuffEndFrame === null) {
    return;
  }

  // There is no way to stop a Mega Blast while it is currently going with the current API
  // As a workaround, remove all "giant" lasers on initialization
  laser.Remove();

  // Even though we delete it, it will still show up for a frame
  // Thus, the Mega Blast laser will look like it is intermittently shooting,
  // even though it deals no damage
  // Make it invisible to fix this
  laser.Visible = false;
  // (this also has the side effect of muting the sound effects)
}

// ModCallbacks.MC_POST_EFFECT_INIT (54)
// EffectVariant.BLOOD_DROP (70)
export function postEffectInitBloodDrop(effect: EntityEffect): void {
  if (v.run.seededDeath.debuffEndFrame === null) {
    return;
  }

  // Since there is no way to stop the Mega Blast from firing,
  // we remove the laser in the PostLaserInit callback
  // However, blood drops will also spawn when the laser hits a wall
  effect.Remove();
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

function debuffOn(player: EntityPlayer) {
  // Make them take "red heart damage" for the purposes of getting a Devil Deal
  g.l.SetRedHeartDamage();

  // Fade the player
  const sprite = player.GetSprite();
  sprite.Color = Color(1, 1, 1, 0.25, 0, 0, 0);

  // All of the items and so forth will be taken away by the "mist" curse that is applied in the
  // InputAction callback
}

function debuffOff(player: EntityPlayer) {
  // Un-fade the character
  const sprite = player.GetSprite();
  sprite.Color = COLOR_DEFAULT;
}

function seededDeathShouldApply() {
  return (
    true || // TODO
    (g.race.status === RaceStatus.IN_PROGRESS &&
      g.race.myStatus === RacerStatus.RACING &&
      g.race.format === RaceFormat.SEEDED)
  );
}
