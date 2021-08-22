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
*/
