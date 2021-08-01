import { gridToPos } from "isaacscript-common";
import g from "./globals";

export default function debugFunction(): void {
  // Enable debug mode
  g.debug = true;

  for (let y = 1; y <= 6; y++) {
    for (let x = 0; x <= 12; x++) {
      const position = gridToPos(x, y);
      Isaac.GridSpawn(GridEntityType.GRID_PIT, 0, position, true);
    }
  }
}

export function debugFunction2(): void {}
