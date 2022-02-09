import {
  canTakeFreeDevilDeals,
  disableAllInputs,
  enableAllInputs,
  findFreePosition,
  GAME_FRAMES_PER_SECOND,
  getDeathAnimationName,
  getFinalFrameOfAnimation,
  getPlayerFromIndex,
  getPlayerIndex,
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  inBeastRoom,
  ISAAC_FRAMES_PER_SECOND,
  isJacobOrEsau,
  isKeeper,
  log,
  MAX_PLAYER_POCKET_ITEM_SLOTS,
  MAX_PLAYER_TRINKET_SLOTS,
  removeGridEntity,
  runNextFrame,
  useActiveItemTemp,
  willReviveFromSpiritShackles,
} from "isaacscript-common";
import g from "../../globals";
import * as timer from "../../timer";
import { TimerType } from "../../types/TimerType";
import { inBeastDebugRoom } from "../../util";
import { applySeededGhostFade, debuffOff, debuffOn } from "./seededDeathDebuff";
import { RaceFormat } from "./types/RaceFormat";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";
import { RevivalType } from "./types/RevivalType";
import { SeededDeathState } from "./types/SeededDeathState";
import v from "./v";

const DEBUG = true;
const SEEDED_DEATH_DEBUFF_FRAMES = 45 * ISAAC_FRAMES_PER_SECOND;
/** The holding item animation lasts 1.3 seconds, so we round up to 2 seconds to be safe. */
const DEVIL_DEAL_BUFFER_FRAMES = 2 * GAME_FRAMES_PER_SECOND;

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  postUpdateGhostForm();
  postUpdateCheckTakingDevilItem();
}

function postUpdateGhostForm() {
  if (v.run.seededDeath.state !== SeededDeathState.GHOST_FORM) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();
  const player = Isaac.GetPlayer();

  // We have to re-apply the fade on every frame in case the player takes a pill or steps on cobwebs
  applySeededGhostFade(player, true);

  // Check to see if the debuff is over
  if (
    v.run.seededDeath.debuffEndFrame === null ||
    isaacFrameCount < v.run.seededDeath.debuffEndFrame
  ) {
    return;
  }

  v.run.seededDeath.state = SeededDeathState.DISABLED;
  v.run.seededDeath.debuffEndFrame = null;
  logStateChange();

  debuffOff(player);
  player.AnimateHappy();
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      debuffOff(twin);
      twin.AnimateHappy();
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
    return;
  }

  v.run.seededDeath.state = SeededDeathState.GHOST_FORM;
  logStateChange();

  enableAllInputs();

  // Since Keeper only has one coin container, he gets a bonus usage of Holy Card
  // We grant it here so that it does not cancel the "AppearVanilla" animation
  if (isKeeper(player)) {
    player.UseCard(Card.CARD_HOLY);
  }
}

function postRenderCheckDisplayTimer() {
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
  postNewRoomWaitingForNewRoom();
  postNewRoomGhostForm();
}

function postNewRoomWaitingForNewRoom() {
  if (v.run.seededDeath.state !== SeededDeathState.WAITING_FOR_NEW_ROOM) {
    return;
  }

  if (v.run.seededDeath.dyingPlayerIndex === null) {
    return;
  }

  const player = getPlayerFromIndex(v.run.seededDeath.dyingPlayerIndex);
  if (player === undefined) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();

  v.run.seededDeath.state = SeededDeathState.FETAL_POSITION;
  v.run.seededDeath.debuffEndFrame =
    isaacFrameCount + SEEDED_DEATH_DEBUFF_FRAMES;
  logStateChange();

  disableAllInputs();
  applySeededGhostFade(player, true);

  // Play the animation where Isaac lies in the fetal position
  player.PlayExtraAnimation("AppearVanilla");
  debuffOn(player);
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      twin.PlayExtraAnimation("AppearVanilla");
      debuffOn(twin);
    }
  }
}

function postNewRoomGhostForm() {
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
  if (spikes !== undefined) {
    removeGridEntity(spikes);
  }

  player.AnimateSad();
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      twin.AnimateSad();
    }
  }
}

// ModCallbacks.MC_POST_PLAYER_RENDER (32)
export function postPlayerRender(player: EntityPlayer): void {
  if (
    v.run.seededDeath.state !==
    SeededDeathState.WAITING_FOR_DEATH_ANIMATION_TO_FINISH
  ) {
    return;
  }

  const playerIndex = getPlayerIndex(player);
  if (playerIndex !== v.run.seededDeath.dyingPlayerIndex) {
    return;
  }

  const sprite = player.GetSprite();
  const deathAnimation = getDeathAnimationName(player);
  if (!sprite.IsPlaying(deathAnimation)) {
    return;
  }

  const frame = sprite.GetFrame();
  const finalFrameOfDeathAnimation = getFinalFrameOfAnimation(sprite);
  if (frame !== finalFrameOfDeathAnimation) {
    return;
  }

  v.run.seededDeath.state = SeededDeathState.WAITING_FOR_NEW_ROOM;
  logStateChange();
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

// ModCallbacksCustom.MC_PRE_CUSTOM_REVIVE
export function preCustomRevive(player: EntityPlayer): int | void {
  if (!seededDeathFeatureShouldApply()) {
    return undefined;
  }

  const roomType = g.r.GetType();
  const playerIndex = getPlayerIndex(player);
  const gameFrameCount = g.g.GetFrameCount();

  // Do not revive the player if they have Spirit Shackles and it is activated
  if (willReviveFromSpiritShackles(player)) {
    return undefined;
  }

  // Do not revive the player if they took a devil deal within the past few seconds
  // (we cannot use the "DamageFlag.DAMAGE_DEVIL" to determine this because the player could have
  // taken a devil deal and died to a fire / spikes / etc.)
  // In order to reduce false positives, we can safely ignore characters that cannot die on taking a
  // devil deal
  if (
    v.run.seededDeath.frameOfLastDevilDeal !== null &&
    gameFrameCount <=
      v.run.seededDeath.frameOfLastDevilDeal + DEVIL_DEAL_BUFFER_FRAMES &&
    !canCharacterDieFromTakingADevilDeal(player)
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

  // Do not revive the player in The Beast room
  // Handling this special case would be too complicated and the player would probably lose the race
  // anyway
  if (inBeastRoom() || inBeastDebugRoom()) {
    return undefined;
  }

  dropEverything(player);
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      dropEverything(player);
    }
  }

  v.run.seededDeath.state =
    SeededDeathState.WAITING_FOR_DEATH_ANIMATION_TO_FINISH;
  v.run.seededDeath.dyingPlayerIndex = playerIndex;
  logStateChange();

  return RevivalType.SEEDED_DEATH;
}

function canCharacterDieFromTakingADevilDeal(player: EntityPlayer) {
  return !canTakeFreeDevilDeals(player) && !isKeeper(player);
}

function seededDeathFeatureShouldApply() {
  return (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format === RaceFormat.SEEDED
  );
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
    const trinketType = player.GetTrinket(trinketSlot);
    if (trinketType === TrinketType.TRINKET_PERFECTION) {
      // In the special case of the Perfection trinket, it should be deleted instead of dropped
      player.TryRemoveTrinket(TrinketType.TRINKET_PERFECTION);
    } else {
      const position = findFreePosition(player.Position);
      player.DropTrinket(position, true);
    }
  }
}

// ModCallbacksCustom.MC_POST_CUSTOM_REVIVE
export function postCustomRevive(player: EntityPlayer): void {
  // The 1-Up animation has started playing,
  // so we need to cancel it by playing the fetal position animation again
  player.PlayExtraAnimation("AppearVanilla");
}

// ModCallbacksCustom.MC_POST_FLIP
export function postFlip(player: EntityPlayer): void {
  if (v.run.seededDeath.state !== SeededDeathState.GHOST_FORM) {
    return;
  }

  // If Tainted Lazarus clears a room while in ghost form, he will switch to other Lazarus
  // Prevent this from happening by switching back
  // If we do the switch now, Tainted Lazarus will enter a bugged state where he has a very fast
  // movement speed
  // Mark to do the switch a frame from now
  if (v.run.seededDeath.switchingBackToGhostLazarus) {
    v.run.seededDeath.switchingBackToGhostLazarus = false;

    // Flipping back from the other Lazarus will remove the seeded death fade,
    // so we have to reapply it
    applySeededGhostFade(player, true);
  } else {
    runNextFrame(() => {
      v.run.seededDeath.switchingBackToGhostLazarus = true;
      useActiveItemTemp(player, CollectibleType.COLLECTIBLE_FLIP);
    });
  }
}

function logStateChange() {
  if (DEBUG) {
    log(
      `Changed seeded death state: ${
        SeededDeathState[v.run.seededDeath.state]
      }`,
    );
  }
}
