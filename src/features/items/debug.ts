import { debugFunction } from "../../debugFunction";

export function useItemDebug(): boolean {
  debugFunction();
  return true; // Display the "use" animation
}
