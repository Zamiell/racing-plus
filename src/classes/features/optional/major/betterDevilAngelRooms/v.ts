import type { PlayerIndex } from "isaacscript-common";
import { newRNG } from "isaacscript-common";

// This is registered in "BetterDevilAngelRooms.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  run: {
    metKrampus: false,

    rng: {
      krampus: newRNG(),
      devilSelection: newRNG(),
      devilEntities: newRNG(),
      devilCollectibles: newRNG(),
      angelSelection: newRNG(),
      angelEntities: newRNG(),
      angelCollectibles: newRNG(),
    },

    debugRoomNum: null as int | null,

    gettingCollectible: false,

    /** Other mod features can request that a Devil Room or Angel Room is kept completely empty. */
    intentionallyLeaveEmpty: false,

    regiveGuppysEyePlayers: [] as PlayerIndex[],
    regiveGuppysEyeRoomListIndex: null as int | null,
  },

  level: {
    vanillaCollectiblesHaveSpawnedInCustomRoom: false,

    spawnedKrampusOnThisFloor: false,
    killedKrampusOnThisFloor: false,
  },

  room: {
    usedD4Frame: null as int | null,
  },
};
