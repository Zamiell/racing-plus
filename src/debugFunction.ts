import { inSpeedrun } from "./features/speedrun/speedrun";
import g from "./globals";

export default function debugFunction(): void {
  // Enable debug mode
  g.debug = true;

  Isaac.DebugString(`XXX ${inSpeedrun()}`);
}

export function debugFunction2(): void {}
