import {
  DefaultMap,
  defaultMapGetPlayer,
  PlayerIndex,
} from "isaacscript-common";

export const MAX_BLOODY_LUST_CHARGES = 6;

// This is registered in "BloodyLustChargeBar.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  level: {
    playersNumHits: new DefaultMap<PlayerIndex, int>(0),
  },
};

export function isMaxBloodyLustCharges(player: EntityPlayer): boolean {
  const numHits = defaultMapGetPlayer(v.level.playersNumHits, player);
  return numHits >= MAX_BLOODY_LUST_CHARGES;
}
