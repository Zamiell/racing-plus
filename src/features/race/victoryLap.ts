import { config } from "../../modConfigMenu";
import v from "./v";

export function shouldShowVictoryLaps(): boolean {
  return config.clientCommunication && v.run.victoryLaps > 0;
}
