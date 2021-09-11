import * as debugPowers from "../features/mandatory/debugPowers";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";
import { CollectibleTypeCustom } from "../types/enums";

const functionMap = new Map<CacheFlag, (player: EntityPlayer) => void>();
export default functionMap;

// 1 << 4
functionMap.set(CacheFlag.CACHE_SPEED, (player: EntityPlayer) => {
  debugPowers.evaluateCacheSpeed(player);
});

// 1 << 6
functionMap.set(CacheFlag.CACHE_TEARCOLOR, (player: EntityPlayer) => {
  changeCreepColor.evaluateCacheTearColor(player);
});

// 1 << 10
functionMap.set(CacheFlag.CACHE_LUCK, (player: EntityPlayer) => {
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
