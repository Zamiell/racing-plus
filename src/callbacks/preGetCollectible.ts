import {
  CollectibleType,
  ItemPoolType,
  ModCallback,
} from "isaac-typescript-definitions";
import { log } from "isaacscript-common";
import { betterDevilAngelRoomsPreGetCollectible } from "../features/optional/major/betterDevilAngelRooms/callbacks/preGetCollectible";
import { mod } from "../mod";

const DEBUG = false as boolean;

export function init(): void {
  mod.AddCallback(ModCallback.PRE_GET_COLLECTIBLE, main);
}

function main(
  itemPoolType: ItemPoolType,
  decrease: boolean,
  seed: int,
): CollectibleType | undefined {
  if (DEBUG) {
    log(
      `MC_PRE_GET_COLLECTIBLE - itemPoolType: ${itemPoolType}, decrease: ${decrease}, seed: ${seed}`,
    );
  }

  return betterDevilAngelRoomsPreGetCollectible(itemPoolType, decrease, seed);
}
