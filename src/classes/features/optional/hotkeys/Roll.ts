import {
  ButtonAction,
  CollectibleType,
  Direction,
  PlayerType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
  capitalizeFirstLetter,
  getDirectionName,
  isActionPressedOnAnyInput,
  isCharacter,
  isJacobOrEsau,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import { hotkeys } from "../../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../../utils";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

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

/** TODO: Change from mandatory to season 6. */
// ts-prune-ignore-next
export class Roll extends MandatoryModFeature {
  v = v;

  constructor() {
    super();

    // See the comment in the "FastDrop.ts" file about reading keyboard inputs.
    mod.setConditionalHotkey(keyboardFunc, rollHotkeyPressed);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (v.run.rolling) {
      stopRoll(player);
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (v.run.rolling) {
      const player = getRollPlayer();
      stopRoll(player);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    if (isCharacter(player, PlayerType.FORGOTTEN_B)) {
      return;
    }

    if (isCharacter(player, PlayerType.ESAU)) {
      this.checkRollEsau(player);
    } else {
      this.checkRoll(player);
    }
  }

  checkRoll(player: EntityPlayer): void {
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

  checkRollEsau(player: EntityPlayer): void {
    if (!v.run.rolling2) {
      return;
    }

    const rollSpeed = ROLL_SPEED * player.MoveSpeed;
    player.Velocity = v.run.originalVelocity2.Normalized().mul(rollSpeed);
  }
}

function keyboardFunc() {
  return hotkeys.roll === -1 ? undefined : hotkeys.roll;
}

function rollHotkeyPressed() {
  // TODO
  /*
  if (!onSeason(6)) {
    return;
  }
  */

  if (!shouldCheckForGameplayInputs()) {
    return;
  }

  const player = getRollPlayer();

  if (canPlayerRoll(player)) {
    startRoll(player);
  }
}

function canPlayerRoll(player: EntityPlayer) {
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
  mod.disableAllInputs(FEATURE_NAME);

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
  const suffix = directionName ?? defaultDirectionName;
  const capitalizedSuffix = capitalizeFirstLetter(suffix);

  return `Rolling${capitalizedSuffix}`;
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

  mod.enableAllInputs(FEATURE_NAME);
}

function getRollPlayer() {
  const player = Isaac.GetPlayer();

  if (isCharacter(player, PlayerType.FORGOTTEN_B)) {
    const taintedSoul = player.GetOtherTwin();
    if (taintedSoul === undefined) {
      error("Failed to get Tainted Soul from Tainted Forgotten.");
    }
    return taintedSoul;
  }

  return player;
}
