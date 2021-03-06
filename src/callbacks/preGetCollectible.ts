import {
  CollectibleType,
  ItemPoolType,
  ModCallback,
} from "isaac-typescript-definitions";
import { log } from "isaacscript-common";
import { betterDevilAngelRoomsPreGetCollectible } from "../features/optional/major/betterDevilAngelRooms/callbacks/preGetCollectible";

const DEBUG = false;

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.PRE_GET_COLLECTIBLE, main);
}

function main(
  itemPoolType: ItemPoolType,
  decrease: boolean,
  seed: int,
): CollectibleType | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (DEBUG) {
    log(
      `MC_PRE_GET_COLLECTIBLE - itemPoolType: ${itemPoolType}, decrease: ${decrease}, seed: ${seed}`,
    );
  }

  return betterDevilAngelRoomsPreGetCollectible(itemPoolType, decrease, seed);
}
