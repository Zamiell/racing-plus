import * as consistentTrollBombs from "../features/optional/gameplay/consistentTrollBombs";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_BOMB_INIT,
    troll,
    BombVariant.BOMB_TROLL, // 3
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_BOMB_INIT,
    megaTroll,
    BombVariant.BOMB_SUPERTROLL, // 4
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_BOMB_INIT,
    goldenTroll,
    BombVariant.BOMB_GOLDENTROLL, // 18
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
