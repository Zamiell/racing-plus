import betterDevilAngelRoomsPreGetCollectible from "../features/optional/major/betterDevilAngelRooms/callbacks/preGetCollectible";

export function main(
  itemPoolType: ItemPoolType,
  decrease: boolean,
  seed: int,
): CollectibleType | int | void {
  return betterDevilAngelRoomsPreGetCollectible(itemPoolType, decrease, seed);
}
