import { config } from "../../../modConfigMenu";
import * as endOfRaceButtons from "../endOfRaceButtons";

export function racePostPressurePlateUpdate(
  pressurePlate: GridEntityPressurePlate,
): void {
  if (!config.ClientCommunication) {
    return;
  }

  endOfRaceButtons.postPressurePlateUpdate(pressurePlate);
}
