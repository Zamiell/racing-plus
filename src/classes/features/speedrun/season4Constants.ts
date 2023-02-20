import { CollectibleType, PlayerType } from "isaac-typescript-definitions";
import { ReadonlyMap, ReadonlySet } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";

export const SEASON_4_STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND = [
  PlayerType.BETHANY, // 18
  PlayerType.JACOB, // 19
] as const;

export const SEASON_4_EXTRA_STARTING_COLLECTIBLE_TYPES_MAP = new ReadonlyMap<
  PlayerType,
  CollectibleType[]
>([
  // 13
  [PlayerType.LILITH, [CollectibleType.BIRTHRIGHT]],

  // 18
  [PlayerType.BETHANY, [CollectibleType.DUALITY]],

  // 19
  [
    PlayerType.JACOB,
    [CollectibleType.THERES_OPTIONS, CollectibleType.MORE_OPTIONS],
  ],
]);

export const SEASON_4_BANNED_COLLECTIBLES = [
  CollectibleType.WE_NEED_TO_GO_DEEPER,
] as const;

export const SEASON_4_BANNED_COLLECTIBLES_WITH_STORAGE =
  new ReadonlySet<CollectibleType>([CollectibleTypeCustom.CHECKPOINT]);

export const SEASON_4_STORED_ITEM_POSITIONS = [
  // Row 1 left
  Vector(80, 160),
  Vector(120, 160),
  Vector(160, 160),
  Vector(200, 160),
  Vector(240, 160),

  // Row 1 right
  Vector(400, 160),
  Vector(440, 160),
  Vector(480, 160),
  Vector(520, 160),
  Vector(560, 160),

  // Row 2 left
  Vector(80, 240),
  Vector(120, 240),
  Vector(160, 240),
  Vector(200, 240),
  Vector(240, 240),

  // Row 2 right
  Vector(400, 240),
  Vector(440, 240),
  Vector(480, 240),
  Vector(520, 240),
  Vector(560, 240),

  // Row 3 left
  Vector(80, 320),
  Vector(120, 320),
  Vector(160, 320),
  Vector(200, 320),
  Vector(240, 320),

  // Row 3 right
  Vector(400, 320),
  Vector(440, 320),
  Vector(480, 320),
  Vector(520, 320),
  Vector(560, 320),

  // Row 4 left
  Vector(80, 400),
  Vector(120, 400),
  Vector(160, 400),
  Vector(200, 400),
  Vector(240, 400),

  // Row 4 right
  Vector(400, 400),
  Vector(440, 400),
  Vector(480, 400),
  Vector(520, 400),
  Vector(560, 400),

  // --------
  // Overflow
  // --------

  // Row 1 left
  Vector(100, 160),
  Vector(140, 160),
  Vector(180, 160),
  Vector(220, 160),

  // Row 1 right
  Vector(420, 160),
  Vector(460, 160),
  Vector(500, 160),
  Vector(540, 160),

  // Row 2 left
  Vector(100, 240),
  Vector(140, 240),
  Vector(180, 240),
  Vector(220, 240),

  // Row 2 right
  Vector(420, 240),
  Vector(460, 240),
  Vector(500, 240),
  Vector(540, 240),

  // Row 3 left
  Vector(100, 320),
  Vector(140, 320),
  Vector(180, 320),
  Vector(220, 320),

  // Row 3 right
  Vector(420, 320),
  Vector(460, 320),
  Vector(500, 320),
  Vector(540, 320),

  // Row 4 left
  Vector(100, 400),
  Vector(140, 400),
  Vector(180, 400),
  Vector(220, 400),

  // Row 4 right
  Vector(420, 400),
  Vector(460, 400),
  Vector(500, 400),
  Vector(540, 400),
] as const;

export const SEASON_4_COLLECTIBLE_OVERFLOW_LENGTH = 40;

export const SEASON_4_STORAGE_ICON_OFFSET = Vector(0, -30);
