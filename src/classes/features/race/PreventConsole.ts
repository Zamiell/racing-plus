import { ButtonAction, InputHook } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isRepentancePlus,
  ModCallbackCustom,
} from "isaacscript-common";
import { RaceFormat } from "../../../enums/RaceFormat";
import { inRace } from "../../../features/race/v";
import { g } from "../../../globals";
import type { Config } from "../../Config";
import { ConfigurableModFeature } from "../../ConfigurableModFeature";

export class PreventConsole extends ConfigurableModFeature {
  configKey: keyof Config = "ClientCommunication";

  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_FILTER,
    InputHook.IS_ACTION_TRIGGERED,
  )
  inputActionFilterIsActionTriggeredConsole(
    _entity: Entity | undefined,
    _inputHook: InputHook,
    buttonAction: ButtonAction,
  ): boolean | undefined {
    const buttonActionConsole = isRepentancePlus()
      ? ButtonAction.CONSOLE_REPENTANCE_PLUS
      : ButtonAction.CONSOLE_REPENTANCE;
    if (buttonAction !== buttonActionConsole) {
      return undefined;
    }

    if (g.debug) {
      return undefined;
    }

    // Prevent opening the console during a race.
    if (
      inRace()
      && g.race.format !== RaceFormat.CUSTOM // Allow usage of the console in custom races.
    ) {
      return false;
    }

    return undefined;
  }
}
