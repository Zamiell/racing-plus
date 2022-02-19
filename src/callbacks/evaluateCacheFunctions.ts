import * as debugPowers from "../features/mandatory/debugPowers";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";
import * as season2 from "../features/speedrun/season2";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";

export const evaluateCacheFunctions = new Map<
  CacheFlag,
  (player: EntityPlayer) => void
>();

// 0x4
evaluateCacheFunctions.set(
  CacheFlag.CACHE_SHOTSPEED,
  (player: EntityPlayer) => {
    magic8BallSeeded(player);
  },
);

function magic8BallSeeded(player: EntityPlayer) {
  const numMagic8BallSeeded = player.GetCollectibleNum(
    CollectibleTypeCustom.COLLECTIBLE_MAGIC_8_BALL_SEEDED,
  );
  for (let i = 0; i < numMagic8BallSeeded; i++) {
    player.ShotSpeed += 0.16;
  }
}

// 0x10
evaluateCacheFunctions.set(CacheFlag.CACHE_SPEED, (player: EntityPlayer) => {
  debugPowers.evaluateCacheSpeed(player);
});

// 0x40
evaluateCacheFunctions.set(
  CacheFlag.CACHE_TEARCOLOR,
  (player: EntityPlayer) => {
    changeCreepColor.evaluateCacheTearColor(player);
  },
);

// 0x80
evaluateCacheFunctions.set(CacheFlag.CACHE_FLYING, (player: EntityPlayer) => {
  season2.evaluateCacheFlying(player);
});

// 0x400
evaluateCacheFunctions.set(CacheFlag.CACHE_LUCK, (player: EntityPlayer) => {
  thirteenLuck(player);
  fifteenLuck(player);
});

function thirteenLuck(player: EntityPlayer) {
  const num13Luck = player.GetCollectibleNum(
    CollectibleTypeCustom.COLLECTIBLE_13_LUCK,
  );
  const characterLuckModifier = getCharacterLuckModifier(player);

  for (let i = 0; i < num13Luck; i++) {
    player.Luck += 13;
    player.Luck += characterLuckModifier;
  }
}

function fifteenLuck(player: EntityPlayer) {
  const num15Luck = player.GetCollectibleNum(
    CollectibleTypeCustom.COLLECTIBLE_15_LUCK,
  );
  const characterLuckModifier = getCharacterLuckModifier(player);

  for (let i = 0; i < num15Luck; i++) {
    player.Luck += 15;
    player.Luck += characterLuckModifier;
  }
}

function getCharacterLuckModifier(player: EntityPlayer) {
  const character = player.GetPlayerType();
  switch (character) {
    case PlayerType.PLAYER_LAZARUS: {
      return 1;
    }

    case PlayerType.PLAYER_KEEPER: {
      return 2;
    }

    case PlayerType.PLAYER_ESAU: {
      return 1;
    }

    case PlayerType.PLAYER_LAZARUS2_B: {
      return 2;
    }

    case PlayerType.PLAYER_KEEPER_B: {
      return 2;
    }

    default: {
      return 0;
    }
  }
}
