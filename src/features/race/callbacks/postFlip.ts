import g from "../../../globals";
import giveFormatItems from "../giveFormatItems";

export function postFirstFlip(): void {
  const player = Isaac.GetPlayer();

  if (!g.config.clientCommunication) {
    return;
  }

  giveFormatItems(player);
}

export function postFlip(): void {}
