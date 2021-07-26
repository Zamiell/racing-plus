import g from "../../../globals";
import giveFormatItems from "../giveFormatItems";

export function postFirstFlip(player: EntityPlayer): void {
  if (!g.config.clientCommunication) {
    return;
  }

  giveFormatItems(player);
}

export function postFlip(): void {}
