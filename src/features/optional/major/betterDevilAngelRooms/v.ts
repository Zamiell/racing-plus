import { PlayerIndex, saveDataManager } from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";

const v = {
  run: {
    metKrampus: false,

    seeds: {
      krampus: 0 as Seed,
      devilSelection: 0 as Seed,
      devilEntities: 0 as Seed,
      devilCollectibles: 0 as Seed,
      angelSelection: 0 as Seed,
      angelEntities: 0 as Seed,
      angelCollectibles: 0 as Seed,
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
  },

  room: {
    usedD4Frame: null as int | null,
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
