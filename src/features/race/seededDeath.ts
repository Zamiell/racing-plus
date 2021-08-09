import SeededDeathState from "./types/SeededDeathState";
import v from "./v";

export function isSeededDeathActive(): boolean {
  return v.run.seededDeath.state !== SeededDeathState.Disabled;
}
