import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";

export const TRANSFORMATION_TO_HELPER_MAP = new Map<
  PlayerForm,
  CollectibleTypeCustom
>([
  [
    PlayerForm.PLAYERFORM_GUPPY, // 0
    CollectibleTypeCustom.COLLECTIBLE_GUPPY_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.PLAYERFORM_LORD_OF_THE_FLIES, // 1
    CollectibleTypeCustom.COLLECTIBLE_BEELZEBUB_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.PLAYERFORM_MUSHROOM, // 2
    CollectibleTypeCustom.COLLECTIBLE_FUN_GUY_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.PLAYERFORM_ANGEL, // 3
    CollectibleTypeCustom.COLLECTIBLE_SERAPHIM_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.PLAYERFORM_BOB, // 4
    CollectibleTypeCustom.COLLECTIBLE_BOB_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.PLAYERFORM_DRUGS, // 5
    CollectibleTypeCustom.COLLECTIBLE_SPUN_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.PLAYERFORM_MOM, // 6
    CollectibleTypeCustom.COLLECTIBLE_YES_MOTHER_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.PLAYERFORM_BABY, // 7
    CollectibleTypeCustom.COLLECTIBLE_CONJOINED_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.PLAYERFORM_EVIL_ANGEL, // 8
    CollectibleTypeCustom.COLLECTIBLE_LEVIATHAN_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.PLAYERFORM_POOP, // 9
    CollectibleTypeCustom.COLLECTIBLE_OH_CRAP_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.PLAYERFORM_BOOK_WORM, // 10
    CollectibleTypeCustom.COLLECTIBLE_BOOKWORM_TRANSFORMATION_HELPER,
  ],
  // PlayerForm.PLAYERFORM_ADULTHOOD (11) is skipped since that is not based on items
  [
    PlayerForm.PLAYERFORM_SPIDERBABY, // 12
    CollectibleTypeCustom.COLLECTIBLE_SPIDER_BABY_TRANSFORMATION_HELPER,
  ],
  // PlayerForm.PLAYERFORM_STOMPY (13) is skipped since that is not based on items
  // Playerform.PLAYERFORM_FLIGHT (14) is unused by the game
]);
