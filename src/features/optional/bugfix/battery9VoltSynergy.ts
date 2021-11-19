import {
  getCollectibleMaxCharges,
  getPlayerFromIndex,
  getPlayerIndex,
  getTotalCharge,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// In vanilla, The Battery & 9 Volt do not synergize together

const v = {
  run: {
    giveExtraChargePlayerIndex: null as PlayerIndex | null,
    giveExtraChargeActiveSlot: null as int | null,
  },
};

export function init(): void {
  saveDataManager("battery9VoltSynergy", v, featureEnabled);
}

function featureEnabled() {
  return config.battery9VoltSynergy;
}

export function useItem(
  collectibleType: CollectibleType | int,
  player: EntityPlayer,
  activeSlot: ActiveSlot,
): void {
  if (!config.battery9VoltSynergy) {
    return;
  }

  if (
    !player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY) ||
    !player.HasCollectible(CollectibleType.COLLECTIBLE_9_VOLT)
  ) {
    return;
  }

  // This callback is reached before any charge is depleted from using the active item,
  // so we must grant an extra charge on the next frame
  const activeCharge = player.GetActiveCharge(activeSlot);
  const batteryCharge = player.GetBatteryCharge(activeSlot);
  const activeItemMaxCharges = getCollectibleMaxCharges(collectibleType);

  // Fix The Battery + 9 Volt synergy (1/2)
  if (
    activeItemMaxCharges >= 2 &&
    activeCharge === activeItemMaxCharges &&
    batteryCharge === activeItemMaxCharges
  ) {
    v.run.giveExtraChargePlayerIndex = getPlayerIndex(player);
    v.run.giveExtraChargeActiveSlot = activeSlot;
  }
}

// Fix The Battery + 9 Volt synergy (2/2)
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
