import g from "./globals";

export default function debugFunction(): void {
  // Enable debug mode
  g.debug = true;

  Isaac.DebugString("+--------------------------+");
  Isaac.DebugString("| Entering debug function. |");
  Isaac.DebugString("+--------------------------+");

  Isaac.DebugString("Fast clear variables:")
  Isaac.DebugString("- aliveEnemies:")
  for (const [key, value] of pairs(g.run.fastClear)) {
    Isaac.DebugString(`  - ${key} - ${value}`);
  }

  Isaac.DebugString("+-------------------------+");
  Isaac.DebugString("| Exiting debug function. |");
  Isaac.DebugString("+-------------------------+");
}
