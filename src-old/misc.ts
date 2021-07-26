/*
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

// From: https://stackoverflow.com/questions/7342957/how-do-you-round-to-1-decimal-place-in-javascript
export function round(value: float, precision: int): float {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
*/
