import { CollectibleType } from "isaac-typescript-definitions";
import { copyMap } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";

export const COLLECTIBLE_REPLACEMENT_MAP: ReadonlyMap<
  CollectibleTypeCustom,
  CollectibleType
> = new Map([
  [
    CollectibleTypeCustom.MAGIC_MUSHROOM_PLACEHOLDER,
    CollectibleType.MAGIC_MUSHROOM,
  ],
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

const collectiblePlaceholderReverseMap = new Map<
  CollectibleType,
  CollectibleTypeCustom
>();
for (const [key, value] of COLLECTIBLE_REPLACEMENT_MAP.entries()) {
  collectiblePlaceholderReverseMap.set(value, key);
}

export const COLLECTIBLE_PLACEHOLDER_REVERSE_MAP: ReadonlyMap<
  CollectibleType,
  CollectibleTypeCustom
> = copyMap(collectiblePlaceholderReverseMap);

export const PLACEHOLDER_COLLECTIBLES_SET: ReadonlySet<CollectibleTypeCustom> =
  new Set(COLLECTIBLE_REPLACEMENT_MAP.keys());
