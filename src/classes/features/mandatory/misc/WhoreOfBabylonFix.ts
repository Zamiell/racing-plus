import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  HealthType,
  ModCallbackCustom,
  isAfterRoomFrame,
  log,
  shouldWhoreOfBabylonBeActive,
} from "isaacscript-common";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

/**
 * As a side-effect of removing giantbook animations, Whore of Babylon will not properly activate if
 * the player is damaged on room frame 1 or earlier. Thus, we manually add the effect in these
 * cases.
 */
export class WhoreOfBabylonFix extends MandatoryModFeature {
  @CallbackCustom(ModCallbackCustom.POST_PLAYER_CHANGE_HEALTH)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    healthType: HealthType,
    _difference: int,
    _oldValue: int,
    _newValue: int,
  ): boolean | undefined {
    if (healthType !== HealthType.RED) {
      return;
    }

    // The bug only occurs when e.g. Razor Blade is activated on room frame 0 or room frame 1.
    // However, the `POST_PLAYER_CHANGE_HEALTH` callback will not fire a frame later, so the latest
    // we need to check for is frame 2.
    if (isAfterRoomFrame(2)) {
      return;
    }

    const effects = player.GetEffects();
    if (effects.HasCollectibleEffect(CollectibleType.WHORE_OF_BABYLON)) {
      return;
    }

    if (shouldWhoreOfBabylonBeActive(player)) {
      effects.AddCollectibleEffect(CollectibleType.WHORE_OF_BABYLON);
      log("Fixed a bugged activation of Whore of Babylon.");
    }

    return undefined;
  }
}
