import { CollectibleType, PlayerForm } from "isaac-typescript-definitions";
import {
  GAME_FRAMES_PER_SECOND,
  RENDER_FRAMES_PER_SECOND,
  ReadonlyMap,
  ReadonlySet,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../../enums/CollectibleTypeCustom";

export const SEEDED_DEATH_DEBUG = false as boolean;
export const SEEDED_DEATH_FEATURE_NAME = "seededDeath";
const SEEDED_DEATH_DEBUFF_SECONDS = 45;
export const SEEDED_DEATH_DEBUFF_RENDER_FRAMES =
  SEEDED_DEATH_DEBUFF_SECONDS * RENDER_FRAMES_PER_SECOND;

export const SEEDED_DEATH_TIMER_STARTING_X = 65;
export const SEEDED_DEATH_TIMER_STARTING_Y = 79;
export const SEEDED_DEATH_TIMER_SEASON_OFFSET_X = 18;

/** The holding item animation lasts 1.3 seconds, so we round up to 2 seconds to be safe. */
export const DEVIL_DEAL_BUFFER_GAME_FRAMES = 2 * GAME_FRAMES_PER_SECOND;

export const SEEDED_DEATH_FADE_AMOUNT = 0.25;

export const TRANSFORMATION_TO_HELPERS = new ReadonlyMap<
  PlayerForm,
  CollectibleType
>([
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

export const TRANSFORMATION_HELPERS_SET = new ReadonlySet<CollectibleType>([
  ...TRANSFORMATION_TO_HELPERS.values(),
]);
