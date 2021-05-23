import g from "./globals";

export default function debugFunction(): void {
  // Enable debug mode
  g.debug = true;

  Isaac.DebugString("+--------------------------+");
  Isaac.DebugString("| Entering debug function. |");
  Isaac.DebugString("+--------------------------+");

  // printFastClearVariables();

  Isaac.DebugString("+-------------------------+");
  Isaac.DebugString("| Exiting debug function. |");
  Isaac.DebugString("+-------------------------+");
}

export function debugFunction2(): void {}

export function printFastClearVariables(): void {
  Isaac.DebugString("Fast clear variables:");
  Isaac.DebugString("- aliveEnemies:");
  for (const [key, value] of pairs(g.run.fastClear.aliveEnemies)) {
    Isaac.DebugString(`  - ${key} - ${value}`);
  }
  Isaac.DebugString(
    `- aliveEnemiesCount: ${g.run.fastClear.aliveEnemiesCount}`,
  );
  Isaac.DebugString(`- aliveBossesCount: ${g.run.fastClear.aliveBossesCount}`);
  Isaac.DebugString(`- buttonsAllPushed: ${g.run.fastClear.buttonsAllPushed}`);
  Isaac.DebugString(`- roomInitializing: ${g.run.fastClear.roomInitializing}`);
  Isaac.DebugString(`- delayFrame: ${g.run.fastClear.delayFrame}`);
  Isaac.DebugString(
    `- vanillaPhotosSpawning: ${g.run.fastClear.vanillaPhotosSpawning}`,
  );
  Isaac.DebugString(
    `- paschalCandleCounters: ${g.run.fastClear.paschalCandleCounters}`,
  );
  Isaac.DebugString(
    `- roomClearAwardSeed: ${g.run.fastClear.roomClearAwardSeed}`,
  );
  Isaac.DebugString(
    `- roomClearAwardSeedDevilAngel: ${g.run.fastClear.roomClearAwardSeedDevilAngel}`,
  );
}
