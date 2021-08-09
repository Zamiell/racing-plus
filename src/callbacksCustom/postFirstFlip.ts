import * as startWithD6 from "../features/optional/major/startWithD6";
import * as racePostFlip from "../features/race/callbacks/postFlip";

export function main(player: EntityPlayer): void {
  startWithD6.postFirstFlip(player);
  racePostFlip.postFirstFlip(player);
}
