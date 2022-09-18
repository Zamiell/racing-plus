import {
  ButtonAction,
  CollectibleType,
  Direction,
  PlayerType,
} from "isaac-typescript-definitions";
import {
  capitalizeFirstLetter,
  disableAllInputs,
  enableAllInputs,
  getDirectionName,
  isActionPressedOnAnyInput,
  isCharacter,
  isJacobOrEsau,
  saveDataManager,
  setConditionalHotkey,
  VectorZero,
} from "isaacscript-common";
import g from "../../../globals";
import { config, hotkeys } from "../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../utils";

const FEATURE_NAME = "roll";

/** The total length of each roll animation is 25 frames. */
const ROLL_STOP_FRAME = 17;

const VANILLA_SPEED = 4.4;
const ROLL_SPEED = VANILLA_SPEED * 2;

const v = {
  run: {
    rolling: false,
    rolling2: false,
    originalVelocity: VectorZero,
    originalVelocity2: VectorZero,
  },
};

export function init(): void {
  saveDataManager(FEATURE_NAME, v, featureEnabled);

  // See the comment in the "fastDrop.ts" file about reading keyboard inputs.
  const keyboardFunc = () => (hotkeys.roll === -1 ? undefined : hotkeys.roll);
  setConditionalHotkey(keyboardFunc, checkStartRoll);
}

function featureEnabled() {
  return config.roll;
}

function checkStartRoll() {
  if (!rollEnabled()) {
    return;
  }

  if (!shouldCheckForGameplayInputs()) {
    return;
  }

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
    !effects.HasCollectibleEffect(CollectibleType.MEGA_BLAST) && // 441
    !effects.HasCollectibleEffect(CollectibleType.MEGA_MUSH) && // 625
    !effects.HasCollectibleEffect(CollectibleType.DARK_ARTS) // 705
  );
}

function startRoll(player: EntityPlayer) {
  disableAllInputs(FEATURE_NAME);

  // The player's velocity is stored so that it can be restored when the roll is over.
  v.run.rolling = true;
  v.run.originalVelocity = player.Velocity;
  playRollingAnimation(player);

  if (isJacobOrEsau(player) && !isActionPressedOnAnyInput(ButtonAction.DROP)) {
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const defaultDirectionName = getDirectionName(Direction.DOWN)!;
  const directionName = getDirectionName(direction);
  const suffix =
    directionName === undefined ? defaultDirectionName : directionName;
  const capitalizedSuffix = capitalizeFirstLetter(suffix);

  return `Rolling${capitalizedSuffix}`;
}

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (!rollEnabled()) {
    return;
  }

  if (isCharacter(player, PlayerType.THE_FORGOTTEN_B)) {
    return;
  }

  if (isCharacter(player, PlayerType.ESAU)) {
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
  v.run.originalVelocity = VectorZero;
  v.run.originalVelocity2 = VectorZero;

  enableAllInputs(FEATURE_NAME);
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (v.run.rolling) {
    const player = getRollPlayer();
    stopRoll(player);
  }
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.PLAYER (1)
export function entityTakeDmgPlayer(player: EntityPlayer): void {
  if (v.run.rolling) {
    stopRoll(player);
  }
}

function getRollPlayer() {
  const player = Isaac.GetPlayer();

  if (isCharacter(player, PlayerType.THE_FORGOTTEN_B)) {
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
