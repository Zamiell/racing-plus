import type { ButtonAction } from "isaac-typescript-definitions";
import { InputHook } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  isShootAction,
  onOrAfterGameFrame,
} from "isaacscript-common";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const v = {
  run: {
    preventShootUntilGameFrame: null as int | null,
  },
};

export class IBSCheckpoint extends MandatoryModFeature {
  v = v;

  @CallbackCustom(ModCallbackCustom.INPUT_ACTION_PLAYER)
  // eslint-disable-next-line isaacscript/strict-undefined-functions
  inputActionPlayer(
    _player: EntityPlayer,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ): boolean | float | undefined {
    if (
      v.run.preventShootUntilGameFrame === null ||
      onOrAfterGameFrame(v.run.preventShootUntilGameFrame)
    ) {
      return undefined;
    }

    if (!isShootAction(buttonAction)) {
      return undefined;
    }

    switch (inputHook) {
      case InputHook.IS_ACTION_PRESSED: {
        return false;
      }

      case InputHook.IS_ACTION_TRIGGERED: {
        return false;
      }

      case InputHook.GET_ACTION_VALUE: {
        return 0;
      }
    }
  }
}

export function forceReleaseInputsDueToHavingIBS(): void {
  const gameFrameCount = game.GetFrameCount();
  v.run.preventShootUntilGameFrame = gameFrameCount + 2;
}
