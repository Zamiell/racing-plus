import g from "../../globals";
import { consoleCommand } from "../../misc";

export function postEntityKillTheBeast(entity: Entity): void {
  const variant = entity.Variant;
  const stage = g.l.GetStage();

  if (variant !== BeastVariant.BEAST) {
    return;
  }

  if (stage !== 13) {
    return;
  }

  g.run.beastDefeated = true;

  // Reload the Beast room again
  consoleCommand("goto x.itemdungeon.666");
}

export function postNewRoom(): void {
  const stage = g.l.GetStage();
  const position = g.r.GetCenterPos();

  if (stage !== 13 || !g.run.beastDefeated) {
  }

  // Spawning another Beast prevent the fight to trigger again
  // (we can't kill The Beast manually or it will trigger the credits)
  // Isaac.Spawn(EntityType.ENTITY_BEAST, 0, 0, Vector.Zero, Vector.Zero, null)

  // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race)
  /*
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
    0,
    position,
    Vector.Zero,
    null,
  );
  */
}
