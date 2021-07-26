import g from "../../../globals";
import formatSetup from "../formatSetup";

export function postFirstFlip(player: EntityPlayer): void {
  if (!g.config.clientCommunication) {
    return;
  }

  formatSetup(player);
}
