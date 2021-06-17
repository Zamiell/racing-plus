/*
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

// From: https://stackoverflow.com/questions/7342957/how-do-you-round-to-1-decimal-place-in-javascript
export function round(value: float, precision: int): float {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
*/
