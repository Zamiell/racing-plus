import * as startWithD6 from "../features/optional/major/startWithD6";
import racePostFirstFlip from "../features/race/callbacks/postFirstFlip";

export function main(player: EntityPlayer): void {
  startWithD6.postFirstFlip(player);
  racePostFirstFlip(player);
}
