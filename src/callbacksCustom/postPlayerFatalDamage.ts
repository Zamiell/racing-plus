import { racePostPlayerFatalDamage } from "../features/race/callbacks/postPlayerFatalDamage";

export function main(player: EntityPlayer): boolean | void {
  return racePostPlayerFatalDamage(player);
}
