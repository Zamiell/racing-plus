import * as sprites from "../sprites";
import v from "../v";

export default function showDreamCatcherItemPostGameStarted(): void {
  v.level.items = [];
  v.level.bosses = [];

  sprites.reset();
}
