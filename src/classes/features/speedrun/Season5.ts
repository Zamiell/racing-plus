import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { hasErrors } from "../mandatory/misc/checkErrors/v";

export class Season5 extends ChallengeModFeature {
  challenge = ChallengeCustom.SEASON_5;

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (hasErrors()) {
      return;
    }

    this.giveStartingItems();
  }

  giveStartingItems(): void {
    // TODO
  }
}
