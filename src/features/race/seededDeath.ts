import {
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  isJacobOrEsau,
  MAX_PLAYER_POCKET_ITEM_SLOTS,
  MAX_PLAYER_TRINKET_SLOTS,
  willReviveFromSpiritShackles,
} from "isaacscript-common";
import {
  GAME_FRAMES_PER_SECOND,
  ISAAC_FRAMES_PER_SECOND,
} from "../../constants";
import g from "../../globals";
import * as timer from "../../timer";
import TimerType from "../../types/TimerType";
import {
  findFreePosition,
  removeGridEntity,
  teleport,
} from "../../utilGlobals";
import { forceSwitchToForgotten } from "../mandatory/switchForgotten";
import { debuffOff, debuffOn } from "./seededDeathDebuff";
import RaceFormat from "./types/RaceFormat";
import RacerStatus from "./types/RacerStatus";
import RaceStatus from "./types/RaceStatus";
import SeededDeathState from "./types/SeededDeathState";
import v from "./v";

const SEEDED_DEATH_DEBUFF_FRAMES = 5 * ISAAC_FRAMES_PER_SECOND;
const DEVIL_DEAL_BUFFER_FRAMES = 5 * GAME_FRAMES_PER_SECOND;
const DEATH_ANIMATION_FRAMES = 46;

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  postUpdateDeathAnimation();
  postUpdateGhostForm();
  postUpdateDisableControls();
  postUpdateCheckTakingDevilItem();
  postUpdateWaitingForForgottenSwitch();
}

function postUpdateDeathAnimation() {
  if (v.run.seededDeath.state !== SeededDeathState.DEATH_ANIMATION) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  const previousRoomIndex = g.l.GetPreviousRoomIndex();
  const player = Isaac.GetPlayer();

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
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== null) {
      twin.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL;
    }
  }

  const enterDoor = g.l.EnterDoor;
  const door = g.r.GetDoor(enterDoor);
  const direction = (door !== null && door.Direction) || Direction.NO_DIRECTION;
  teleport(previousRoomIndex, direction, RoomTransitionAnim.WALK);
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
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== null) {
      debuffOff(twin);
      twin.AnimateHappy();
    }
  }
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
    if (isJacobOrEsau(player)) {
      const twin = player.GetOtherTwin();
      if (twin !== null) {
        twin.ControlsEnabled = false;
      }
    }
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

function postUpdateWaitingForForgottenSwitch() {
  if (!v.run.seededDeath.deferringDeathUntilForgottenSwitch) {
    return;
  }

  const forgottenBodies = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.FORGOTTEN_BODY,
  );
  if (forgottenBodies.length > 0) {
    return;
  }

  v.run.seededDeath.deferringDeathUntilForgottenSwitch = false;
  const player = Isaac.GetPlayer();
  invokeCustomDeathMechanic(player);
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
    // Lock the player to the same position
    // If we do not do this, they will be able to move around (even if their controls are disabled)
    player.Position = v.run.seededDeath.fetalPosition;
    if (isJacobOrEsau(player)) {
      const twin = player.GetOtherTwin();
      if (twin !== null) {
        const adjustment = Vector(20, 0);
        twin.Position = v.run.seededDeath.fetalPosition.add(adjustment);
      }
    }
  } else {
    v.run.seededDeath.state = SeededDeathState.GHOST_FORM;
    player.ControlsEnabled = true;
    if (isJacobOrEsau(player)) {
      const twin = player.GetOtherTwin();
      if (twin !== null) {
        twin.ControlsEnabled = true;
      }
    }
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
  // We need to disable the collision again,
  // or else enemies will be able to push around the body during the death animation
  player.PlayExtraAnimation("Death");
  player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== null) {
      twin.PlayExtraAnimation("Death");
      twin.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
    }
  }
}

function postNewRoomChangingRooms() {
  if (v.run.seededDeath.state !== SeededDeathState.CHANGING_ROOMS) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();
  const player = Isaac.GetPlayer();

  v.run.seededDeath.state = SeededDeathState.FETAL_POSITION;
  v.run.seededDeath.fetalPosition = player.Position;
  v.run.seededDeath.debuffEndFrame =
    isaacFrameCount + SEEDED_DEATH_DEBUFF_FRAMES;
  g.seeds.RemoveSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);

  // Play the animation where Isaac lies in the fetal position
  player.PlayExtraAnimation("AppearVanilla");
  debuffOn(player);
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== null) {
      twin.PlayExtraAnimation("AppearVanilla");
      debuffOn(twin);
    }
  }
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
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== null) {
      twin.AnimateSad();
    }
  }
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

  // Do not revive the player if they have Spirit Shackles and it is activated
  if (willReviveFromSpiritShackles(player)) {
    return undefined;
  }

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

  // Do not revive the player if they are trying to get a "free" item from a particular special room
  if (
    roomType === RoomType.ROOM_SACRIFICE || // 13
    roomType === RoomType.ROOM_BOSSRUSH // 17
  ) {
    return undefined;
  }

  // If we are already switching from The Soul to The Forgotten,
  // prevent the death and continue to wait
  if (v.run.seededDeath.deferringDeathUntilForgottenSwitch) {
    return false;
  }

  // If the player is The Soul, switch back to The Forgotten and defer invoking the custom death
  // mechanic until the switch is complete
  if (character === PlayerType.PLAYER_THESOUL) {
    forceSwitchToForgotten();
    v.run.seededDeath.deferringDeathUntilForgottenSwitch = true;
    return false;
  }

  return invokeCustomDeathMechanic(player);
}

function seededDeathShouldApply() {
  return true; // TODO debugging
  return (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format === RaceFormat.SEEDED
  );
}

function invokeCustomDeathMechanic(player: EntityPlayer) {
  const gameFrameCount = g.g.GetFrameCount();

  v.run.seededDeath.state = SeededDeathState.DEATH_ANIMATION;
  v.run.seededDeath.reviveFrame = gameFrameCount + DEATH_ANIMATION_FRAMES;
  g.sfx.Play(SoundEffect.SOUND_ISAACDIES);

  // Hide the player's health to obfuscate the fact that they are still technically alive
  g.seeds.AddSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);

  startDeathAnimation(player);
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== null) {
      startDeathAnimation(twin);
    }
  }

  return false;
}

function startDeathAnimation(player: EntityPlayer) {
  player.PlayExtraAnimation("Death");
  player.ControlsEnabled = false;
  player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
  dropEverything(player);
}

function dropEverything(player: EntityPlayer) {
  for (
    let pocketItemSlot = 0;
    pocketItemSlot < MAX_PLAYER_POCKET_ITEM_SLOTS;
    pocketItemSlot++
  ) {
    const position = findFreePosition(player.Position);
    player.DropPocketItem(pocketItemSlot, position);
  }

  for (
    let trinketSlot = 0;
    trinketSlot < MAX_PLAYER_TRINKET_SLOTS;
    trinketSlot++
  ) {
    const position = findFreePosition(player.Position);
    player.DropTrinket(position, true);
  }
}
