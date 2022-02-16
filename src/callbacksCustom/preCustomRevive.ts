import { seededDeathPreCustomRevive } from "../features/mandatory/seededDeath/callbacks/preCustomRevive";

export function main(player: EntityPlayer): int | void {
  return seededDeathPreCustomRevive(player);
}
