import { PlayerType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getPlayersOfType,
  ModCallbackCustom,
} from "isaacscript-common";
import { inSeededRace } from "../../../../features/race/v";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class TaintedKeeperExtraMoney extends ConfigurableModFeature {
  configKey: keyof Config = "TaintedKeeperExtraMoney";

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (inSeededRace()) {
      return;
    }

    const taintedKeepers = getPlayersOfType(PlayerType.KEEPER_B);
    for (const taintedKeeper of taintedKeepers) {
      taintedKeeper.AddCoins(15);
    }
  }
}
