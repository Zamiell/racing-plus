import { saveDataManager } from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import PersistentEntity from "../../../../types/PersistentEntity";

const v = {
  run: {
    metKrampus: false,

    seeds: {
      krampus: 0,
      devilSelection: 0,
      devilEntities: 0,
      devilCollectibles: 0,
      angelSelection: 0,
      angelEntities: 0,
      angelCollectibles: 0,
    },

    debugRoomNum: null as int | null,

    gettingCollectible: false,

    /** Other mod features can request that a Devil Room or Angel Room is kept completely empty. */
    intentionallyLeaveEmpty: false,
  },

  level: {
    roomBuilt: false,
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

export function initializeSeeds(): void {
  const startSeed = g.seeds.GetStartSeed();

  for (const key of Object.keys(v.run.seeds)) {
    const property = key as keyof typeof v.run.seeds;
    v.run.seeds[property] = startSeed;
  }
}

export function setDevilAngelEmpty(): void {
  v.run.intentionallyLeaveEmpty = true;
}

export function setDevilAngelDebugRoom(num: int): void {
  v.run.debugRoomNum = num;
}
