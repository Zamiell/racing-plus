import type { PlayerType } from "isaac-typescript-definitions";
import { isCharacter } from "isaacscript-common";

export const RANDOM_BABY_NAME = "Random Baby";

export function getRandomBabyPlayerType(): PlayerType | undefined {
  // We cannot make a `PlayerTypeCustom` enum because of mod load order. (It would be equal to -1.)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const randomBaby = Isaac.GetPlayerTypeByName(RANDOM_BABY_NAME) as
    PlayerType | -1;

  return randomBaby === -1 ? undefined : randomBaby;
}

export function isBabiesModEnabled(): boolean {
  return getRandomBabyPlayerType() !== undefined;
}

export function isRandomBaby(player: EntityPlayer): boolean {
  const randomBaby = getRandomBabyPlayerType();
  return randomBaby !== undefined && isCharacter(player, randomBaby);
}
