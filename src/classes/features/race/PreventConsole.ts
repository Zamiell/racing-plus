import { ButtonAction, InputHook } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { RaceFormat } from "../../../enums/RaceFormat";
import { inRace } from "../../../features/race/v";
import { g } from "../../../globals";
import { Config } from "../../Config";
import { ConfigurableModFeature } from "../../ConfigurableModFeature";

export class PreventConsole extends ConfigurableModFeature {
  configKey: keyof Config = "ClientCommunication";

  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_FILTER,
    InputHook.IS_ACTION_TRIGGERED,
    ButtonAction.CONSOLE,
  )
  inputActionFilterIsActionTriggeredConsole(): boolean | undefined {
    if (g.debug) {
      return undefined;
    }

    // Prevent opening the console during a race.
    if (
      inRace() &&
      g.race.format !== RaceFormat.CUSTOM // Allow usage of the console in custom races.
    ) {
      return false;
    }

    return undefined;
  }
}
