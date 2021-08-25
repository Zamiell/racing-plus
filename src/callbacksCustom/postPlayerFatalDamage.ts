import { racePostPlayerFatalDamage } from "../features/race/callbacks/postPlayerFatalDamage";

export function main(player: EntityPlayer): boolean | void {
  Isaac.DebugString("GETTING HERE");
  return racePostPlayerFatalDamage(player);
}
