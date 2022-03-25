import {
  DefaultMap,
  defaultMapGetPlayer,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";

export const MAX_BLOODY_LUST_CHARGES = 6;

const v = {
  level: {
    playersNumHits: new DefaultMap<PlayerIndex, int>(0),
  },
};
export default v;

export function init(): void {
  saveDataManager("bloodyLustChargeBar", v);
}

export function isMaxBloodyLustCharges(player: EntityPlayer): boolean {
  const numHits = defaultMapGetPlayer(v.level.playersNumHits, player);
  return numHits >= MAX_BLOODY_LUST_CHARGES;
}
