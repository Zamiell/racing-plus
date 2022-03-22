import {
  capitalizeFirstLetter,
  disableAllInputs,
  enableAllInputs,
  getDirectionName,
  isActionPressedOnAnyInput,
  isJacobOrEsau,
  isKeyboardPressed,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config, hotkeys } from "../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../utilsGlobals";

const FEATURE_NAME = "roll";
const ROLL_STOP_FRAME = 17; // The total length of each roll animation is 25 frames
const VANILLA_SPEED = 4.4;
const ROLL_SPEED = VANILLA_SPEED * 2;

let isPressed = false;

const v = {
  run: {
    rolling: false,
    rolling2: false,
    originalVelocity: Vector.Zero,
    originalVelocity2: Vector.Zero,
  },
};

export function init(): void {
  saveDataManager(FEATURE_NAME, v, featureEnabled);
}

function featureEnabled() {
  return config.roll;
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!rollEnabled()) {
    return;
  }

  // See the comment in the "fastDrop.ts" file about reading keyboard inputs
  checkInput();
}

function checkInput() {
  if (!shouldCheckForGameplayInputs()) {
    return;
  }

  if (!isKeyboardPressed(hotkeys.roll)) {
    isPressed = false;
    return;
  }

  if (isPressed) {
    return;
  }
  isPressed = true;

  checkStartRoll();
}

function checkStartRoll() {
  const player = getRollPlayer();

  if (playerCanRoll(player)) {
    startRoll(player);
  }
}

function playerCanRoll(player: EntityPlayer) {
  const effects = player.GetEffects();

  return (
    !v.run.rolling &&
    !player.IsHoldingItem() &&
    !effects.HasCollectibleEffect(CollectibleType.COLLECTIBLE_MEGA_BLAST) && // 441
    !effects.HasCollectibleEffect(CollectibleType.COLLECTIBLE_MEGA_MUSH) && // 625
    !effects.HasCollectibleEffect(CollectibleType.COLLECTIBLE_DARK_ARTS) // 705
  );
}

function startRoll(player: EntityPlayer) {
  disableAllInputs(FEATURE_NAME);

  // The player's velocity is stored so that it can be restored when the roll is over
  v.run.rolling = true;
  v.run.originalVelocity = player.Velocity;
  playRollingAnimation(player);

  if (
    isJacobOrEsau(player) &&
    !isActionPressedOnAnyInput(ButtonAction.ACTION_DROP)
  ) {
    const esau = player.GetOtherTwin();
    if (esau !== undefined) {
      v.run.rolling2 = true;
      v.run.originalVelocity2 = esau.Velocity;
      playRollingAnimation(esau);
    }
  }
}

function playRollingAnimation(player: EntityPlayer) {
  const sprite = player.GetSprite();
  const movementDirection = player.GetMovementDirection();
  const rollingAnimation = getRollingAnimation(movementDirection);
  player.PlayExtraAnimation(rollingAnimation);
  sprite.PlaybackSpeed = 1.5;
}

function getRollingAnimation(direction: Direction) {
  const defaultDirectionName = getDirectionName(Direction.DOWN) as string;
  const directionName = getDirectionName(direction);
  const suffix =
    directionName === undefined ? defaultDirectionName : directionName;
  const capitalizedSuffix = capitalizeFirstLetter(suffix);

  return `Rolling${capitalizedSuffix}`;
}

// ModCallbacks.MC_POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (!rollEnabled()) {
    return;
  }

  const character = player.GetPlayerType();
  if (character === PlayerType.PLAYER_THEFORGOTTEN_B) {
    return;
  }

  if (character === PlayerType.PLAYER_ESAU) {
    checkRollEsau(player);
  } else {
    checkRoll(player);
  }
}

function checkRoll(player: EntityPlayer) {
  if (!v.run.rolling) {
    return;
  }

  const sprite = player.GetSprite();
  const frame = sprite.GetFrame();
  if (frame >= ROLL_STOP_FRAME) {
    stopRoll(player);
    return;
  }

  const rollSpeed = ROLL_SPEED * player.MoveSpeed;
  player.Velocity = v.run.originalVelocity.Normalized().mul(rollSpeed);
}

function checkRollEsau(player: EntityPlayer) {
  if (!v.run.rolling2) {
    return;
  }

  const rollSpeed = ROLL_SPEED * player.MoveSpeed;
  player.Velocity = v.run.originalVelocity2.Normalized().mul(rollSpeed);
}

function stopRoll(player: EntityPlayer) {
  player.Velocity = v.run.originalVelocity;
  if (isJacobOrEsau(player)) {
    const esau = player.GetOtherTwin();
    if (esau !== undefined) {
      esau.Velocity = v.run.originalVelocity2;
    }
  }

  v.run.rolling = false;
  v.run.rolling2 = false;
  v.run.originalVelocity = Vector.Zero;
  v.run.originalVelocity2 = Vector.Zero;

  enableAllInputs(FEATURE_NAME);
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (v.run.rolling) {
    const player = getRollPlayer();
    stopRoll(player);
  }
}

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
// EntityType.ENTITY_PLAYER (1)
export function entityTakeDmgPlayer(player: EntityPlayer): void {
  if (v.run.rolling) {
    stopRoll(player);
  }
}

function getRollPlayer() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  if (character === PlayerType.PLAYER_THEFORGOTTEN_B) {
    const taintedSoul = player.GetOtherTwin();
    if (taintedSoul === undefined) {
      error("Failed to get Tainted Soul from Tainted Forgotten.");
    }
    return taintedSoul;
  }

  return player;
}

function rollEnabled() {
  return config.roll && g.debug;
}
