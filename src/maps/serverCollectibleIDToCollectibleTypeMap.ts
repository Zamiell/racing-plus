import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";

export const SERVER_COLLECTIBLE_ID_TO_COLLECTIBLE_TYPE_MAP = new Map<
  int,
  CollectibleTypeCustom
>([
  [1001, CollectibleTypeCustom.COLLECTIBLE_13_LUCK],
  [1002, CollectibleTypeCustom.COLLECTIBLE_15_LUCK],
  [1003, CollectibleTypeCustom.COLLECTIBLE_SAWBLADE],
]);
