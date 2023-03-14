import { PickupVariant } from "isaac-typescript-definitions";
import { PlayerIndex } from "isaacscript-common";

export interface PickupQueueEntry {
  readonly pickupVariant: PickupVariant;
  readonly playerIndex: PlayerIndex;
}

// This is registered in "AutomaticItemInsertion.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  run: {
    /**
     * Track which pickups that we are automatically inserting so that we can display it to the
     * player on the UI.
     */
    delta: {
      coins: null as int | null,
      coinsFrame: null as int | null,
      bombs: null as int | null,
      bombsFrame: null as int | null,
      keys: null as int | null,
      keysFrame: null as int | null,
      bloodOrSoulCharge: null as int | null,
      bloodOrSoulChargeFrame: null as int | null,
      pocketItem: null as int | null,
      pocketItemFrame: null as int | null,
      trinket: null as int | null,
      trinketFrame: null as int | null,
    },
  },

  room: {
    pickupQueue: [] as PickupQueueEntry[],
  },
};