// We grant Judas an extra bomb so that the character is slightly more skill based.

import { PlayerType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getPlayersOfType,
  ModCallbackCustom,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class JudasAddBomb extends ConfigurableModFeature {
  configKey: keyof Config = "JudasAddBomb";

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    const judases = getPlayersOfType(PlayerType.JUDAS);
    for (const judas of judases) {
      judas.AddBombs(1);
    }
  }
}
