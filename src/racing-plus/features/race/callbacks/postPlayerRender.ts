import * as seededDeath from "../seededDeath";

export default function racePostPlayerRender(player: EntityPlayer): void {
  seededDeath.postPlayerRender(player);
}
