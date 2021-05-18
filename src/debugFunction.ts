import g from "./globals";

export default function debugFunction(): void {
  // Enable debug mode
  g.debug = true;

  Isaac.DebugString("+--------------------------+");
  Isaac.DebugString("| Entering debug function. |");
  Isaac.DebugString("+--------------------------+");

  Isaac.DebugString("+-------------------------+");
  Isaac.DebugString("| Exiting debug function. |");
  Isaac.DebugString("+-------------------------+");
}
