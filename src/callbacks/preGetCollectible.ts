import * as reverseJusticeFix from "../features/optional/bugfix/reverseJusticeFix";
import { betterDevilAngelRoomsPreGetCollectible } from "../features/optional/major/betterDevilAngelRooms/callbacks/preGetCollectible";

export function main(
  itemPoolType: ItemPoolType,
  decrease: boolean,
  seed: int,
): CollectibleType | int | void {
  /*
  log(
    `MC_PRE_GET_COLLECTIBLE - itemPoolType: ${itemPoolType}, decrease: ${decrease}, seed: ${seed}`,
  );
  */

  // This has to be before the "betterDevilAngelRooms" feature
  const returnValue = reverseJusticeFix.preGetCollectible();
  if (returnValue !== undefined) {
    return returnValue;
  }

  return betterDevilAngelRoomsPreGetCollectible(itemPoolType, decrease, seed);
}
