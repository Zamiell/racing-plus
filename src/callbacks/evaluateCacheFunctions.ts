import * as debugPowers from "../features/mandatory/debugPowers";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";
import { CollectibleTypeCustom } from "../types/enums";

export const evaluateCacheFunctions = new Map<
  CacheFlag,
  (player: EntityPlayer) => void
>();

// 1 << 2
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

// 1 << 4
evaluateCacheFunctions.set(CacheFlag.CACHE_SPEED, (player: EntityPlayer) => {
  debugPowers.evaluateCacheSpeed(player);
});

// 1 << 6
evaluateCacheFunctions.set(
  CacheFlag.CACHE_TEARCOLOR,
  (player: EntityPlayer) => {
    changeCreepColor.evaluateCacheTearColor(player);
  },
);

// 1 << 10
evaluateCacheFunctions.set(CacheFlag.CACHE_LUCK, (player: EntityPlayer) => {
  thirteenLuck(player);
  fifteenLuck(player);
});

function thirteenLuck(player: EntityPlayer) {
  const num13Luck = player.GetCollectibleNum(
    CollectibleTypeCustom.COLLECTIBLE_13_LUCK,
  );
  for (let i = 0; i < num13Luck; i++) {
    player.Luck += 13;
  }
}

function fifteenLuck(player: EntityPlayer) {
  const num15Luck = player.GetCollectibleNum(
    CollectibleTypeCustom.COLLECTIBLE_15_LUCK,
  );
  for (let i = 0; i < num15Luck; i++) {
    player.Luck += 15;
  }
}
