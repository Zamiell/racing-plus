import {
  DefaultMap,
  defaultMapGetPlayer,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";

class FooPlayerData {
  numPoops = 0;
  numFarts = 0;
}

const v = {
  run: {
    playersData: new DefaultMap<PlayerIndex, FooPlayerData>(
      () => new FooPlayerData(),
    ),
  },
};

export function init(): void {
  saveDataManager("thisFeatureNameOrWhatever", v);
}

export function postPlayerUpdate(player: EntityPlayer): void {
  const data = defaultMapGetPlayer(v.run.playersData, player);
  Isaac.DebugString(`LOL MY DATA IS: ${data.numPoops}, ${data.numFarts}`);
}
