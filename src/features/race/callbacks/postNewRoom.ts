import g from "../../../globals";
import * as tempMoreOptions from "../tempMoreOptions";

export function main(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  tempMoreOptions.postNewRoom();
}
