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

  // Go back to Hell
  consoleCommand("goto x.itemdungeon.666");
}

export function postNewRoom(): void {
  const stage = g.l.GetStage();
  const position = g.r.GetCenterPos();

  if (stage !== 13 || !g.run.beastDefeated) {
    return;
  }

  // Spawning another beast prevent the fight to trigger again and we
  // don't want to kill The Beast manually or it will trigger the credits
  consoleCommand("spawn 951.0");

  // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race)
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
    0,
    position,
    Vector.Zero,
    null,
  );
}
