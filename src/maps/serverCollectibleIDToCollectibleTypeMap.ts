import { CollectibleType } from "isaac-typescript-definitions";
import { ReadonlyMap } from "isaacscript-common";
import { CollectibleTypeCustom } from "../enums/CollectibleTypeCustom";

export const SERVER_COLLECTIBLE_ID_TO_COLLECTIBLE_TYPE_MAP = new ReadonlyMap<
  int,
  CollectibleType
>([
  [1001, CollectibleTypeCustom.THIRTEEN_LUCK],
  [1002, CollectibleTypeCustom.FIFTEEN_LUCK],
  [1003, CollectibleTypeCustom.SAWBLADE],
]);
