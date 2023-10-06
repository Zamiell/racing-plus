import type { PickupVariant } from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";

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
      coinsGameFrame: null as int | null,
      bombs: null as int | null,
      bombsGameFrame: null as int | null,
      keys: null as int | null,
      keysGameFrame: null as int | null,
      bloodOrSoulCharge: null as int | null,
      bloodOrSoulChargeGameFrame: null as int | null,
      pocketItem: null as int | null,
      pocketItemGameFrame: null as int | null,
      trinket: null as int | null,
      trinketGameFrame: null as int | null,
    },
  },

  room: {
    pickupQueue: [] as PickupQueueEntry[],
  },
};
