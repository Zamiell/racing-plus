import { racePreCustomRevive } from "../features/race/callbacks/preCustomRevive";

export function main(player: EntityPlayer): int | void {
  return racePreCustomRevive(player);
}
