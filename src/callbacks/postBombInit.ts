import { BombVariant, ModCallback } from "isaac-typescript-definitions";
import * as consistentTrollBombs from "../features/optional/gameplay/consistentTrollBombs";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_BOMB_INIT,
    troll,
    BombVariant.TROLL, // 3
  );

  mod.AddCallback(
    ModCallback.POST_BOMB_INIT,
    megaTroll,
    BombVariant.MEGA_TROLL, // 4
  );

  mod.AddCallback(
    ModCallback.POST_BOMB_INIT,
    goldenTroll,
    BombVariant.GOLDEN_TROLL, // 18
  );
}

function troll(bomb: EntityBomb) {
  consistentTrollBombs.postBombInitTroll(bomb);
}

function megaTroll(bomb: EntityBomb) {
  consistentTrollBombs.postBombInitMegaTroll(bomb);
}

function goldenTroll(bomb: EntityBomb) {
  consistentTrollBombs.postBombInitGoldenTroll(bomb);
}
