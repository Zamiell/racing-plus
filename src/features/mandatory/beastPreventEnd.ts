import {
  saveDataManager,
  spawn,
  spawnPickup,
  VectorZero,
} from "isaacscript-common";
import g from "../../globals";
import { consoleCommand } from "../../utils";

const v = {
  run: {
    beastDefeated: false,
  },
};

export function init(): void {
  saveDataManager("beastPreventEnd", v);
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const stage = g.l.GetStage();
  const centerPos = g.r.GetCenterPos();

  if (stage !== 13 || !v.run.beastDefeated) {
    return;
  }

  // If we do nothing, The Beast fight will begin again
  // If we remove all of the Beast entities, it will trigger the credits
  // Instead, we spawn another Beast to prevent the fight from beginning
  spawn(EntityType.ENTITY_BEAST, BeastVariant.BEAST, 0, VectorZero);

  // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race)
  spawnPickup(PickupVariant.PICKUP_BIGCHEST, 0, centerPos);
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
// EntityType.ENTITY_BEAST (951)
export function postEntityKillTheBeast(entity: Entity): void {
  const variant = entity.Variant;

  if (variant !== BeastVariant.BEAST) {
    return;
  }

  v.run.beastDefeated = true;

  // Reload the Beast room again
  consoleCommand("goto x.itemdungeon.666");
}
