import { saveDataManager } from "isaacscript-common";

const MAX_SPEED = 2;

const v = {
  run: {
    chaosCard: false,
    speed: false,
  },
};

export function init(): void {
  saveDataManager("debugPowers", v);
}

export function toggleChaosCard(): void {
  v.run.chaosCard = !v.run.chaosCard;
  const enabled = v.run.chaosCard ? "Enabled" : "Disabled";
  print(`${enabled} Chaos Card tears.`);
}

export function toggleSpeed(): void {
  const player = Isaac.GetPlayer();

  v.run.speed = !v.run.speed;
  const enabled = v.run.speed ? "Enabled" : "Disabled";
  print(`${enabled} max speed.`);

  // Also, give the player flight
  if (!player.HasCollectible(CollectibleType.COLLECTIBLE_LORD_OF_THE_PIT)) {
    player.AddCollectible(CollectibleType.COLLECTIBLE_LORD_OF_THE_PIT);
  }

  player.AddCacheFlags(CacheFlag.CACHE_SPEED);
  player.EvaluateItems();
}

// ModCallbacks.MC_EVALUATE_CACHE (8)
// CacheFlag.CACHE_SPEED (16)
export function evaluateCacheSpeed(player: EntityPlayer): void {
  if (v.run.speed) {
    player.MoveSpeed = MAX_SPEED;
  }
}

// ModCallbacks.MC_POST_FIRE_TEAR (61)
export function postFireTear(tear: EntityTear): void {
  if (v.run.chaosCard) {
    tear.ChangeVariant(TearVariant.CHAOS_CARD);
  }
}
