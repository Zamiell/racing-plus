import { config } from "../../../modConfigMenu";
import * as endOfRaceButtons from "../endOfRaceButtons";

export function racePostPressurePlateUpdate(
  pressurePlate: GridEntityPressurePlate,
): void {
  if (!config.clientCommunication) {
    return;
  }

  endOfRaceButtons.postPressurePlateUpdate(pressurePlate);
}
