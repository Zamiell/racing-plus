import { saveDataManager } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import PersistentEntity from "../../../../types/PersistentEntity";

const v = {
  run: {
    metKrampus: false,
    seeds: {
      krampus: 0,
      devilSelection: 0,
      devilEntities: 0,
      angelSelection: 0,
      angelEntities: 0,
    },

    debugRoomNum: null as int | null,

    /** Other mod features can request that a Devil Room or Angel Room is kept completely empty. */
    intentionallyLeaveEmpty: false,
  },

  level: {
    persistentEntities: [] as PersistentEntity[],
    spawnedDecorationGridIndexes: [] as int[],
  },
};
export default v;

export function init(): void {
  saveDataManager("betterDevilAngelRooms", v, featureEnabled);
}

function featureEnabled() {
  return config.betterDevilAngelRooms;
}

export function setDevilAngelEmpty(): void {
  v.run.intentionallyLeaveEmpty = true;
}

export function setDevilAngelDebugRoom(num: int): void {
  v.run.debugRoomNum = num;
}
