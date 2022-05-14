import { CollectibleTypeCustom } from "../enums/CollectibleTypeCustom";

export const SERVER_COLLECTIBLE_ID_TO_COLLECTIBLE_TYPE_MAP: ReadonlyMap<
  int,
  CollectibleTypeCustom
> = new Map([
  [1001, CollectibleTypeCustom.THIRTEEN_LUCK],
  [1002, CollectibleTypeCustom.FIFTEEN_LUCK],
  [1003, CollectibleTypeCustom.SAWBLADE],
]);
