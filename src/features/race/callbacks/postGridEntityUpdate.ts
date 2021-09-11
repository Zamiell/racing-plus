import { config } from "../../../modConfigMenu";
import * as endOfRaceButtons from "../endOfRaceButtons";

export function pressurePlate(gridEntity: GridEntity): void {
  if (!config.clientCommunication) {
    return;
  }

  endOfRaceButtons.postGridEntityUpdatePressurePlate(gridEntity);
}
