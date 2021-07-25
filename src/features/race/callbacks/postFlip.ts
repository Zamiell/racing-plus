import * as startWithD6 from "../../optional/major/startWithD6";
import giveFormatItems from "../giveFormatItems";

export function postFirstFlip(): void {
  const player = Isaac.GetPlayer();

  startWithD6.postPlayerChange(player);
  giveFormatItems(player);
}

export function postFlip(): void {}
