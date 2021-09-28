import {
  disableAllInputs,
  enableAllInputs,
  ensureAllCases,
  isKeyboardPressed,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config, hotkeys } from "../../../modConfigMenu";

const ROLL_STOP_FRAME = 17; // The total length of each roll animation is 25 frames

const VANILLA_SPEED = 4.4;
const ROLL_SPEED = VANILLA_SPEED * 2;

let isPressed = false;

const v = {
  run: {
    rolling: false,
    originalVelocity: Vector.Zero,
  },
};

export function init(): void {
  saveDataManager("roll", v, featureEnabled);
}

function featureEnabled() {
  return config.roll;
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!config.roll || !g.debug) {
    return;
  }

  // See the comment in the "fastDrop.ts" file about reading keyboard inputs
  checkInput();
}

function checkInput() {
  const player = Isaac.GetPlayer();

  if (player.IsHoldingItem()) {
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

  roll(player);
}

function roll(player: EntityPlayer) {
  if (v.run.rolling) {
    return;
  }

  v.run.rolling = true;
  disableAllInputs();

  // The player's velocity is stored so that it can be restored when the roll is over
  v.run.originalVelocity = player.Velocity;

  // Play the rolling animation
  const sprite = player.GetSprite();
  const movementDirection = player.GetMovementDirection();
  const rollingAnimation = getRollingAnimation(movementDirection);
  player.PlayExtraAnimation(rollingAnimation);
  sprite.PlaybackSpeed = 1.5;
}

function getRollingAnimation(direction: Direction) {
  switch (direction) {
    // -1
    case Direction.NO_DIRECTION: {
      return "RollingDown";
    }

    // 0
    case Direction.LEFT: {
      return "RollingLeft";
    }

    // 1
    case Direction.UP: {
      return "RollingUp";
    }

    // 2
    case Direction.RIGHT: {
      return "RollingRight";
    }

    // 3
    case Direction.DOWN: {
      return "RollingDown";
    }

    default: {
      ensureAllCases(direction);
      return "RollingDown";
    }
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (v.run.rolling) {
    const player = Isaac.GetPlayer();
    stopRoll(player);
  }
}

// ModCallbacks.MC_POST_PLAYER_UPDATE (31)
export function postPlayerUpdate(player: EntityPlayer): void {
  if (!config.roll || !g.debug) {
    return;
  }

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

function stopRoll(player: EntityPlayer) {
  player.Velocity = v.run.originalVelocity;

  v.run.rolling = false;
  v.run.originalVelocity = Vector.Zero;

  enableAllInputs();
}

export function entityTakeDmgPlayer(player: EntityPlayer): boolean | void {
  if (v.run.rolling) {
    stopRoll(player);
  }

  return undefined;
}
