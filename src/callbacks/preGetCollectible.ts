import { log } from "isaacscript-common";
import { betterDevilAngelRoomsPreGetCollectible } from "../features/optional/major/betterDevilAngelRooms/callbacks/preGetCollectible";

const DEBUG = true;

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

  return betterDevilAngelRoomsPreGetCollectible(itemPoolType, decrease, seed);
}
