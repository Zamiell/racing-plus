import { CollectibleTypeCustom } from "./types/enums";

export function arrayEquals(arr1: int[], arr2: int[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function getHeartXOffset(): int {
  // Local variables
  const curses = g.l.GetCurses();
  const maxHearts = g.p.GetMaxHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();
  const extraLives = g.p.GetExtraLives();

  const heartLength = 12; // This is how long each heart is on the UI in the upper left hand corner
  // (this is not in pixels, but in draw coordinates;
  // you can see that it is 13 pixels wide in the "ui_hearts.png" file)
  let combinedHearts = maxHearts + soulHearts + boneHearts * 2; // There are no half bone hearts
  if (combinedHearts > 12) {
    combinedHearts = 12; // After 6 hearts, it wraps to a second row
  }

  if (curses === LevelCurse.CURSE_OF_THE_UNKNOWN) {
    combinedHearts = 2;
  }

  let offset = (combinedHearts / 2) * heartLength;
  if (extraLives > 9) {
    offset += 20;
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR)) {
      offset += 6;
    }
  } else if (extraLives > 0) {
    offset += 16;
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR)) {
      offset += 4;
    }
  }

  return offset;
}

// This function is from Kilburn
export function getNumTotalCollectibles(): int {
  let id = CollectibleType.NUM_COLLECTIBLES - 1; // Start at the last vanilla ID
  let step = 16;
  while (step > 0) {
    if (g.itemConfig.GetCollectible(id + step)) {
      id += step;
    } else {
      step = math.floor(step / 2);
    }
  }

  return id;
}

// From piber20 Helper
// https://steamcommunity.com/workshop/filedetails/?id=1553455339
export function getPlayerVisibleHearts(): int {
  const maxHearts = math.max(
    g.p.GetEffectiveMaxHearts(),
    g.p.GetBoneHearts() * 2,
  );

  let visibleHearts = math.ceil((maxHearts + g.p.GetSoulHearts()) / 2);
  if (visibleHearts < 1) {
    visibleHearts = 1;
  }

  return visibleHearts;
}

// Taken from Alphabirth
// https://steamcommunity.com/sharedfiles/filedetails/?id=848056541
export function getScreenCenterPosition(): Vector {
  // Local variables
  const shape = g.r.GetRoomShape();
  const centerPos = g.r.GetCenterPos();
  const topLeftPos = g.r.GetTopLeftPos();
  const centerOffset = centerPos.__sub(topLeftPos);
  const pos = centerPos;

  if (centerOffset.X > 260) {
    pos.X -= 260;
  }
  if (shape === RoomShape.ROOMSHAPE_LBL || shape === RoomShape.ROOMSHAPE_LTL) {
    pos.X -= 260;
  }
  if (centerOffset.Y > 140) {
    pos.Y -= 140;
  }
  if (shape === RoomShape.ROOMSHAPE_LTR || shape === RoomShape.ROOMSHAPE_LTL) {
    pos.Y -= 140;
  }

  return Isaac.WorldToRenderPosition(pos);
}

// Kilburn's function (pinned in the Isaac Discord server)
export function getScreenSize(): [int, int] {
  const screenPos = g.r.WorldToScreenPosition(Vector.Zero);
  const renderScrollPos = screenPos.__sub(g.r.GetRenderScrollOffset());
  const finalPos = renderScrollPos.__sub(g.g.ScreenShakeOffset);

  const rx = finalPos.X + (60 * 26) / 40;
  const ry = finalPos.Y + 140 * (26 / 40);

  const x = rx * 2 + 13 * 26;
  const y = ry * 2 + 7 * 26;

  return [x, y];
}

export function giveItemAndRemoveFromPools(
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  const maxCharges = getItemMaxCharges(collectibleType);
  g.p.AddCollectible(collectibleType, maxCharges, false);
  g.itemPool.RemoveCollectible(collectibleType);
}

export function removeItemFromItemTracker(
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  const itemConfig = g.itemConfig.GetCollectible(collectibleType);
  Isaac.DebugString(
    `Removing collectible ${collectibleType} (${itemConfig.Name})`,
  );
}

export function removeValueFromArray<T>(value: T, array: T[]): void {
  const index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

// From: https://stackoverflow.com/questions/7342957/how-do-you-round-to-1-decimal-place-in-javascript
export function round(value: float, precision: int): float {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
