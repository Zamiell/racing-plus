import { CollectibleTypeCustom } from "../../../../types/enums";

export const COLLECTIBLE_REPLACEMENT_MAP = new Map<
  CollectibleTypeCustom,
  CollectibleType
>([
  [
    CollectibleTypeCustom.COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_SACRED_HEART_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_SACRED_HEART,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_DEATHS_TOUCH_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_DEATHS_TOUCH,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_JUDAS_SHADOW_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_JUDAS_SHADOW,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_GODHEAD_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_GODHEAD,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_INCUBUS_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_INCUBUS,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_MAW_OF_THE_VOID_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_MAW_OF_THE_VOID,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_CROWN_OF_LIGHT_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_TWISTED_PAIR_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_TWISTED_PAIR,
  ],
]);

export const COLLECTIBLE_PLACEHOLDER_REVERSE_MAP = new Map<
  CollectibleType,
  CollectibleTypeCustom
>();
for (const [key, value] of COLLECTIBLE_REPLACEMENT_MAP.entries()) {
  COLLECTIBLE_PLACEHOLDER_REVERSE_MAP.set(value, key);
}

export const PLACEHOLDER_COLLECTIBLES_SET = new Set(
  COLLECTIBLE_REPLACEMENT_MAP.keys(),
);
