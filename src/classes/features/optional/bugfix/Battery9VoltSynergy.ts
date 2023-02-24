// In vanilla, The Battery & 9 Volt do not synergize together.

import {
  ActiveSlot,
  CollectibleType,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  Callback,
  getCollectibleMaxCharges,
  getPlayerFromIndex,
  getPlayerIndex,
  getTotalCharge,
  hasFlag,
  PlayerIndex,
} from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const v = {
  run: {
    giveExtraChargePlayerIndex: null as PlayerIndex | null,
    giveExtraChargeActiveSlot: null as ActiveSlot | null,
  },
};

export class Battery9VoltSynergy extends ConfigurableModFeature {
  configKey: keyof Config = "Battery9VoltSynergy";
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    if (v.run.giveExtraChargePlayerIndex === null) {
      return;
    }

    const player = getPlayerFromIndex(v.run.giveExtraChargePlayerIndex);
    const activeSlot = v.run.giveExtraChargeActiveSlot;

    v.run.giveExtraChargePlayerIndex = null;
    v.run.giveExtraChargeActiveSlot = null;

    if (player !== undefined && activeSlot !== null) {
      const totalCharge = getTotalCharge(player, activeSlot);
      player.SetActiveCharge(totalCharge + 1, activeSlot);
    }
  }

  // 3
  @Callback(ModCallback.POST_USE_ITEM)
  postUseItem(
    collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
    useFlags: BitFlags<UseFlag>,
    activeSlot: ActiveSlot,
  ): boolean | undefined {
    if (!config.Battery9VoltSynergy) {
      return undefined;
    }

    if (!hasFlag(useFlags, UseFlag.OWNED)) {
      return undefined;
    }

    if (
      !player.HasCollectible(CollectibleType.BATTERY) ||
      !player.HasCollectible(CollectibleType.NINE_VOLT)
    ) {
      return undefined;
    }

    // This callback is reached before any charge is depleted from using the active item, so we must
    // grant an extra charge on the next frame.
    const activeCharge = player.GetActiveCharge(activeSlot);
    const batteryCharge = player.GetBatteryCharge(activeSlot);
    const activeItemMaxCharges = getCollectibleMaxCharges(collectibleType);
    const playerIndex = getPlayerIndex(player);

    if (
      activeItemMaxCharges >= 2 &&
      activeCharge === activeItemMaxCharges &&
      batteryCharge === activeItemMaxCharges
    ) {
      v.run.giveExtraChargePlayerIndex = playerIndex;
      v.run.giveExtraChargeActiveSlot = activeSlot;
    }

    return undefined;
  }
}
