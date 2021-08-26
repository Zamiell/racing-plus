import * as seededDeath from "../seededDeath";

export default function racePreCustomRevive(player: EntityPlayer): int | void {
  return seededDeath.preCustomRevive(player);
}
