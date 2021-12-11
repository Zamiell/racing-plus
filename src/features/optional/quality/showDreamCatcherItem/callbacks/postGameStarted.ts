import * as sprites from "../sprites";
import v from "../v";

export function showDreamCatcherItemPostGameStarted(): void {
  v.level.collectibles = [];
  v.level.bosses = [];

  sprites.reset();
}
