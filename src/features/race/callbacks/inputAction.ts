import { RaceFormat } from "../../../enums/RaceFormat";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// InputHook.IS_ACTION_TRIGGERED (1)
// ButtonAction.CONSOLE (28)
export function isActionTriggeredConsole(): boolean | void {
  if (!config.clientCommunication) {
    return undefined;
  }

  if (g.debug) {
    return undefined;
  }

  // Prevent opening the console during a race.
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format !== RaceFormat.CUSTOM // Allow usage of the console in custom races
  ) {
    return false;
  }

  return undefined;
}
