import * as consistentTrollBombs from "../features/optional/gameplay/consistentTrollBombs";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_BOMB_INIT,
    trollBomb,
    BombVariant.BOMB_TROLL, // 3
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_BOMB_INIT,
    megaTrollBomb,
    BombVariant.BOMB_SUPERTROLL, // 4
  );
}

function trollBomb(bomb: EntityBomb) {
  consistentTrollBombs.postBombInitTrollBomb(bomb);
}

function megaTrollBomb(bomb: EntityBomb) {
  consistentTrollBombs.postBombInitMegaTrollBomb(bomb);
}
