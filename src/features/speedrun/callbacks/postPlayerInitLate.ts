import * as disableCoop from "../disableCoop";

export function speedrunPostPlayerInitLate(player: EntityPlayer): void {
  disableCoop.postPlayerInitLate(player);
}
