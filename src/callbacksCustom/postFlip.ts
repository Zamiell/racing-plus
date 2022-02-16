import { seededDeathPostFlip } from "../features/mandatory/seededDeath/callbacks/postFlip";
import * as startWithD6 from "../features/optional/major/startWithD6";

export function main(player: EntityPlayer): void {
  // Mandatory
  seededDeathPostFlip(player);

  // Major
  startWithD6.postFlip(player);
}
