import { log } from "isaacscript-common";
import * as reverseJusticeFix from "../features/optional/bugfix/reverseJusticeFix";
import { betterDevilAngelRoomsPreGetCollectible } from "../features/optional/major/betterDevilAngelRooms/callbacks/preGetCollectible";

const DEBUG = false;

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_PRE_GET_COLLECTIBLE, main);
}

function main(
  itemPoolType: ItemPoolType,
  decrease: boolean,
  seed: int,
): CollectibleType | int | void {
  if (DEBUG) {
    log(
      `MC_PRE_GET_COLLECTIBLE - itemPoolType: ${itemPoolType}, decrease: ${decrease}, seed: ${seed}`,
    );
  }

  // This has to be before the "betterDevilAngelRooms" feature
  const returnValue = reverseJusticeFix.preGetCollectible();
  if (returnValue !== undefined) {
    return returnValue;
  }

  return betterDevilAngelRoomsPreGetCollectible(itemPoolType, decrease, seed);
}
