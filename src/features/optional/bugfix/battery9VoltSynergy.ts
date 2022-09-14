// In vanilla, The Battery & 9 Volt do not synergize together.

import {
  ActiveSlot,
  CollectibleType,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  getCollectibleMaxCharges,
  getPlayerFromIndex,
  getPlayerIndex,
  getTotalCharge,
  hasFlag,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const v = {
  run: {
    giveExtraChargePlayerIndex: null as PlayerIndex | null,
    giveExtraChargeActiveSlot: null as ActiveSlot | null,
  },
};

export function init(): void {
  saveDataManager("battery9VoltSynergy", v, featureEnabled);
}

function featureEnabled() {
  return config.battery9VoltSynergy;
}

// ModCallback.POST_USE_ITEM (3)
export function postUseItem(
  collectibleType: CollectibleType,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: ActiveSlot,
): void {
  if (!config.battery9VoltSynergy) {
    return;
  }

  if (!hasFlag(useFlags, UseFlag.OWNED)) {
    return;
  }

  if (
    !player.HasCollectible(CollectibleType.BATTERY) ||
    !player.HasCollectible(CollectibleType.NINE_VOLT)
  ) {
    return;
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
}

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  if (!config.battery9VoltSynergy) {
    return;
  }

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
