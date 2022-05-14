// Double pennies do not heal Keeper and Tainted Keeper for the proper amount

import {
  DefaultMap,
  defaultMapGetPlayer,
  isKeeper,
  mapSetPlayer,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";

const ONE_COIN_CONTAINER_HEARTS_VALUE = 2;

const v = {
  run: {
    playersCoinMap: new DefaultMap<PlayerIndex, int, [EntityPlayer]>(
      (_key: PlayerIndex, player: EntityPlayer) => player.GetNumCoins(),
    ),
  },
};

export function init(): void {
  saveDataManager("keeperHeal", v);
}

// ModCallback.POST_EFFECT_UPDATE (55)
export function postPEffectUpdate(player: EntityPlayer): void {
  checkPlayerCoinsChanged(player);
}

function checkPlayerCoinsChanged(player: EntityPlayer) {
  const coins = player.GetNumCoins();
  const oldCoins = defaultMapGetPlayer(v.run.playersCoinMap, player, player);
  if (coins === oldCoins) {
    return;
  }
  mapSetPlayer(v.run.playersCoinMap, player, coins);

  const delta = coins - oldCoins;
  playerCoinsChanged(player, delta);
}

function playerCoinsChanged(player: EntityPlayer, delta: int) {
  const gainedCoins = delta > 0;
  if (isKeeper(player) && gainedCoins) {
    checkMissingHealth(player, delta);
  }
}

function checkMissingHealth(player: EntityPlayer, delta: int) {
  const maxHearts = player.GetMaxHearts();

  while (delta > 0 && player.GetHearts() < maxHearts) {
    player.AddHearts(ONE_COIN_CONTAINER_HEARTS_VALUE);
    player.AddCoins(-1);
    delta = -1;
  }
}
