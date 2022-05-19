import { CollectibleType, PlayerForm } from "isaac-typescript-definitions";
import { CollectibleTypeCustom } from "../enums/CollectibleTypeCustom";

export const TRANSFORMATION_TO_HELPERS: ReadonlyMap<
  PlayerForm,
  CollectibleType
> = new Map([
  [
    PlayerForm.GUPPY, // 0
    CollectibleTypeCustom.GUPPY_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.BEELZEBUB, // 1
    CollectibleTypeCustom.BEELZEBUB_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.FUN_GUY, // 2
    CollectibleTypeCustom.FUN_GUY_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.SERAPHIM, // 3
    CollectibleTypeCustom.SERAPHIM_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.BOB, // 4
    CollectibleTypeCustom.BOB_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.SPUN, // 5
    CollectibleTypeCustom.SPUN_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.YES_MOTHER, // 6
    CollectibleTypeCustom.YES_MOTHER_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.CONJOINED, // 7
    CollectibleTypeCustom.CONJOINED_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.LEVIATHAN, // 8
    CollectibleTypeCustom.LEVIATHAN_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.OH_CRAP, // 9
    CollectibleTypeCustom.OH_CRAP_TRANSFORMATION_HELPER,
  ],
  [
    PlayerForm.BOOKWORM, // 10
    CollectibleTypeCustom.BOOKWORM_TRANSFORMATION_HELPER,
  ],
  // PlayerForm.ADULTHOOD (11) is skipped since that is not based on items.
  [
    PlayerForm.SPIDER_BABY, // 12
    CollectibleTypeCustom.SPIDER_BABY_TRANSFORMATION_HELPER,
  ],
  // PlayerForm.STOMPY (13) is skipped since that is not based on items.
]);
