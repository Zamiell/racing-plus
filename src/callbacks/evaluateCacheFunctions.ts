import { repeat } from "isaacscript-common";
import * as sawblade from "../features/items/sawblade";
import * as debugPowers from "../features/mandatory/debugPowers";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";
import { speedrunEvaluateCacheFlying } from "../features/speedrun/callbacks/evaluateCache";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";

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
  repeat(numMagic8BallSeeded, () => {
    player.ShotSpeed += 0.16;
  });
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

// 1 << 7
evaluateCacheFunctions.set(CacheFlag.CACHE_FLYING, (player: EntityPlayer) => {
  speedrunEvaluateCacheFlying(player);
});

// 1 << 9
evaluateCacheFunctions.set(
  CacheFlag.CACHE_FAMILIARS,
  (player: EntityPlayer) => {
    sawblade.evaluateCacheFamiliars(player);
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

  // Don't change base player's negative luck if he doesn't have 13 Luck
  if (num13Luck === 0) {
    return;
  }

  player.Luck += getCharacterLuckModifier(player);
  repeat(num13Luck, () => {
    player.Luck += 13;
  });
}

function fifteenLuck(player: EntityPlayer) {
  const num15Luck = player.GetCollectibleNum(
    CollectibleTypeCustom.COLLECTIBLE_15_LUCK,
  );

  // Don't change base player's negative luck if he doesn't have 15 Luck
  if (num15Luck === 0) {
    return;
  }

  player.Luck += getCharacterLuckModifier(player);
  repeat(num15Luck, () => {
    player.Luck += 15;
  });
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
