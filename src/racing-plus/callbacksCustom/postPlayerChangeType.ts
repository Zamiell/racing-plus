import * as startWithD6 from "../features/optional/major/startWithD6";

export function main(player: EntityPlayer): void {
  startWithD6.postPlayerChangeType(player);
}
