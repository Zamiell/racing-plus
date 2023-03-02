import { CollectibleType } from "isaac-typescript-definitions";
import { getReversedMap, ReadonlyMap } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../../enums/CollectibleTypeCustom";

export const COLLECTIBLE_REPLACEMENT_MAP = new ReadonlyMap<
  CollectibleType,
  CollectibleType
>([
  [
    CollectibleTypeCustom.MAGIC_MUSHROOM_PLACEHOLDER,
    CollectibleType.MAGIC_MUSHROOM,
  ],
  [CollectibleTypeCustom.EPIC_FETUS_PLACEHOLDER, CollectibleType.EPIC_FETUS],
  [
    CollectibleTypeCustom.SACRED_HEART_PLACEHOLDER,
    CollectibleType.SACRED_HEART,
  ],
  [
    CollectibleTypeCustom.DEATHS_TOUCH_PLACEHOLDER,
    CollectibleType.DEATHS_TOUCH,
  ],
  [
    CollectibleTypeCustom.JUDAS_SHADOW_PLACEHOLDER,
    CollectibleType.JUDAS_SHADOW,
  ],
  [CollectibleTypeCustom.GODHEAD_PLACEHOLDER, CollectibleType.GODHEAD],
  [CollectibleTypeCustom.INCUBUS_PLACEHOLDER, CollectibleType.INCUBUS],
  [
    CollectibleTypeCustom.MAW_OF_THE_VOID_PLACEHOLDER,
    CollectibleType.MAW_OF_THE_VOID,
  ],
  [
    CollectibleTypeCustom.CROWN_OF_LIGHT_PLACEHOLDER,
    CollectibleType.CROWN_OF_LIGHT,
  ],
  [
    CollectibleTypeCustom.TWISTED_PAIR_PLACEHOLDER,
    CollectibleType.TWISTED_PAIR,
  ],
]);

export const COLLECTIBLE_PLACEHOLDER_REVERSE_MAP = getReversedMap(
  COLLECTIBLE_REPLACEMENT_MAP,
);

export const PLACEHOLDER_COLLECTIBLE_TYPES = [
  ...COLLECTIBLE_REPLACEMENT_MAP.keys(),
] as const;