import * as streakText from "../features/mandatory/streakText";
import * as showPills from "../features/optional/quality/showPills";
import g from "../globals";

export function main(pillEffect: PillEffect): void {
  checkNewPill(g.p, pillEffect);
  showStreakText(pillEffect);
}

function checkNewPill(player: EntityPlayer, pillEffect: PillEffect) {
  // This callback fires before the pill is consumed, so we can still get the color of the pill
  const pillColor = player.GetPill(0);

  // A mod may have manually used a pill with a null color
  if (pillColor === PillColor.PILL_NULL) {
    return;
  }

  // See if we have already used this particular pill color on this run
  for (const pill of g.run.pills) {
    if (pill.color === pillColor) {
      return;
    }
  }

  newPill(pillColor, pillEffect);
}

function newPill(pillColor: PillColor, pillEffect: PillEffect) {
  // This is the first time we have used this pill, so keep track of the pill color and effect
  const pillDescription = {
    color: pillColor,
    effect: pillEffect,
    sprite: showPills.getSprite(pillColor),
  };
  g.run.pills.push(pillDescription);
}

function showStreakText(pillEffect: PillEffect) {
  const pillEffectName = g.itemConfig.GetPillEffect(pillEffect).Name;
  streakText.set(pillEffectName);
}
