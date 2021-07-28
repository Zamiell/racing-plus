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
  // const centerPosition = g.r.GetCenterPos();

  if (stage !== 13 || !g.run.beastDefeated) {
    return;
  }

  // Remove the background entities that show the bosses in the distance
  /*
  const beasts = Isaac.FindByType(EntityType.ENTITY_BEAST);
  for (const beast of beasts) {
    if (beast.Variant >= 100) {
      beast.Remove();
    }
  }
  */

  // If we do nothing, the fight will begin again
  // If we remove all of the Beast entities, it will trigger the credits
  // Instead, we spawn another Beast to prevent the fight from beginning
  Isaac.Spawn(EntityType.ENTITY_BEAST, 0, 0, Vector.Zero, Vector.Zero, null);

  // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race)
  /*
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
    0,
    centerPosition,
    Vector.Zero,
    null,
  );
  */
}
