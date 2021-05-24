import * as fastClearClearRoom from "../features/optional/major/fastClear/clearRoom";
import g from "../globals";

// This is intentionally a tiny bit bigger than the real distance to be safe
const MIN_DISTANCE_TO_TOUCH_FIRE = 40;

export function postUpdate(): void {
  if (!shouldCheckForWhiteFire()) {
    return;
  }

  const whiteFires = Isaac.FindByType(
    EntityType.ENTITY_FIREPLACE,
    FireplaceVariant.WHITE,
    -1,
    false,
    false,
  );
  for (const whiteFire of whiteFires) {
    if (
      whiteFire.Position.Distance(g.p.Position) <= MIN_DISTANCE_TO_TOUCH_FIRE
    ) {
      ghostFormOn();
    }
  }
}

function shouldCheckForWhiteFire() {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  return (
    !g.run.ghostForm &&
    stage === 2 &&
    (stageType === StageType.STAGETYPE_REPENTANCE ||
      stageType === StageType.STAGETYPE_REPENTANCE_B)
  );
}

function ghostFormOn() {
  g.run.ghostForm = true;

  fastClearClearRoom.setDeferClearForGhost(true);
}

export function ghostFormOff(): void {
  g.run.ghostForm = false;
}
