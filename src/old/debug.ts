import g from "./globals";

export function main(): void {
  // Enable debug mode
  g.debug = true;

  Isaac.DebugString("+--------------------------+");
  Isaac.DebugString("| Entering debug function. |");
  Isaac.DebugString("+--------------------------+");

  // TODO

  Isaac.DebugString("+-------------------------+");
  Isaac.DebugString("| Exiting debug function. |");
  Isaac.DebugString("+-------------------------+");
}
