import g from "../../../globals";
import openAntibirthDoor from "../openAntibirthDoor";

export function main(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  openAntibirthDoor();
}
