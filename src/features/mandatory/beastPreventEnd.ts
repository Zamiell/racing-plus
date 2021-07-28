import g from "../../globals";
import { consoleCommand } from "../../misc";

export function postEntityKillTheBeast(entity: Entity): void {
  const variant = entity.Variant;

  if (variant !== BeastVariant.BEAST) {
    return;
  }

  g.run.beastDefeated = true;

  // Reload the Beast room again
  consoleCommand("goto x.itemdungeon.666");
}

export function postNewRoom(): void {
  const stage = g.l.GetStage();
  const centerPosition = g.r.GetCenterPos();

  if (stage !== 13 || !g.run.beastDefeated) {
    return;
  }

  // If we do nothing, The Beast fight will begin again
  // If we remove all of the Beast entities, it will trigger the credits
  // Instead, we spawn another Beast to prevent the fight from beginning
  Isaac.Spawn(EntityType.ENTITY_BEAST, 0, 0, Vector.Zero, Vector.Zero, null);

  // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race)
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
    0,
    centerPosition,
    Vector.Zero,
    null,
  );
}
