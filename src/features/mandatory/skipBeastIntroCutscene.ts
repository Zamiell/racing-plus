import { consoleCommand } from "../../misc";

export function postEntityKillDogma(entity: Entity): void {
  // As soon as the player kills the second phase of Dogma,
  // warp them immediately to The Beast fight without playing the cutscene
  if (entity.Variant === DogmaVariant.ANGEL) {
    consoleCommand("goto x.itemdungeon.666");
  }
}
