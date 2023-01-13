import {
  DefaultMap,
  defaultMapGetPlayer,
  PlayerIndex,
} from "isaacscript-common";
import { mod } from "../../../../mod";

export const MAX_BLOODY_LUST_CHARGES = 6;

export const v = {
  level: {
    playersNumHits: new DefaultMap<PlayerIndex, int>(0),
  },
};

export function init(): void {
  mod.saveDataManager("bloodyLustChargeBar", v);
}

export function isMaxBloodyLustCharges(player: EntityPlayer): boolean {
  const numHits = defaultMapGetPlayer(v.level.playersNumHits, player);
  return numHits >= MAX_BLOODY_LUST_CHARGES;
}
