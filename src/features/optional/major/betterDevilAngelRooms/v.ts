import { newRNG, PlayerIndex, setAllRNGToStartSeed } from "isaacscript-common";
import { mod } from "../../../../mod";
import { config } from "../../../../modConfigMenu";

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

export function init(): void {
  mod.saveDataManager("betterDevilAngelRooms", v, featureEnabled);
}

function featureEnabled() {
  return config.betterDevilAngelRooms;
}

export function initBetterDevilAngelRoomsRNG(): void {
  setAllRNGToStartSeed(v.run.rng);
}

export function setDevilAngelEmpty(): void {
  v.run.intentionallyLeaveEmpty = true;
}

export function setDevilAngelDebugRoom(num: int): void {
  v.run.debugRoomNum = num;
}
