import { printConsole, saveDataManager } from "isaacscript-common";

const MAX_SPEED = 2;

const v = {
  run: {
    chaosCard: false,
    spam: false,
    speed: false,
    damage: false,
  },
};

export function init(): void {
  saveDataManager("debugPowers", v);
}

export function toggleChaosCard(): void {
  v.run.chaosCard = !v.run.chaosCard;
  const enabled = v.run.chaosCard ? "Enabled" : "Disabled";
  printConsole(`${enabled} Chaos Card tears.`);
}

export function toggleSpam(): void {
  v.run.spam = !v.run.spam;
}

export function toggleSpeed(): void {
  const player = Isaac.GetPlayer();

  v.run.speed = !v.run.speed;
  const enabled = v.run.speed ? "Enabled" : "Disabled";
  printConsole(`${enabled} max speed.`);

  // Also, give the player flight
  if (!player.HasCollectible(CollectibleType.COLLECTIBLE_LORD_OF_THE_PIT)) {
    player.AddCollectible(CollectibleType.COLLECTIBLE_LORD_OF_THE_PIT);
  }

  player.AddCacheFlags(CacheFlag.CACHE_SPEED);
  player.EvaluateItems();
}

export function toggleDamage(): void {
  v.run.damage = !v.run.damage;
  const enabled = v.run.damage ? "Enabled" : "Disabled";
  printConsole(`${enabled} debug damage.`);
}

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  const player = Isaac.GetPlayer();

  if (v.run.spam) {
    player.UseActiveItem(CollectibleType.COLLECTIBLE_BLOOD_RIGHTS);
  }
}

// ModCallbacks.MC_EVALUATE_CACHE (8)
// CacheFlag.CACHE_SPEED (1 << 4)
export function evaluateCacheSpeed(player: EntityPlayer): void {
  if (v.run.speed) {
    player.MoveSpeed = MAX_SPEED;
  }
}

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
// EntityType.ENTITY_PLAYER (1)
export function entityTakeDmgPlayer(): boolean | void {
  if (v.run.spam) {
    return false;
  }

  return undefined;
}

// ModCallbacks.MC_POST_FIRE_TEAR (61)
export function postFireTear(tear: EntityTear): void {
  if (v.run.chaosCard) {
    tear.ChangeVariant(TearVariant.CHAOS_CARD);
  }

  if (v.run.damage) {
    // If we increase the damage stat too high, then the tears will become bigger than the screen
    // Instead, increase the collision damage of the tear
    tear.CollisionDamage *= 1000;

    // Change the visual of the tear so that it is more clear that we have debug-damage turned on
    tear.ChangeVariant(TearVariant.TOOTH);
  }
}
