import g from "../../../../globals";
import {
  getFireDelayFromTearsStat,
  getTearsStat,
  isSelfDamage,
} from "../../../../misc";

const MAX_COUNTERS = 5;
const TEARS_INCREASE = 0.4;
const CUSTOM_ANM2_PATH = "gfx/003.221_paschal candle custom.anm2";

// ModCallbacks.MC_POST_UPDATE (1)
export function clearedRoom(familiar: EntityFamiliar): void {
  if (familiar.Variant !== FamiliarVariant.PASCHAL_CANDLE) {
    return;
  }

  const player = familiar.Player;
  const oldCounters = g.run.fastClear.paschalCandleCounters.get(
    player.ControllerIndex,
  );
  let newCounters = oldCounters + 1;
  if (newCounters > MAX_COUNTERS) {
    newCounters = MAX_COUNTERS;
  }
  if (oldCounters !== newCounters) {
    g.run.fastClear.paschalCandleCounters.set(
      player.ControllerIndex,
      newCounters,
    );
    player.AddCacheFlags(CacheFlag.CACHE_FIREDELAY);
    player.EvaluateItems();
  }
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(familiar: EntityFamiliar): void {
  const sprite = familiar.GetSprite();
  if (sprite.GetFilename() !== CUSTOM_ANM2_PATH) {
    sprite.Load(CUSTOM_ANM2_PATH, true);
  }

  const counters = g.run.fastClear.paschalCandleCounters.get(
    familiar.Player.ControllerIndex,
  );

  const animation = sprite.GetAnimation();
  const correctAnimation = `ModifiedIdle${counters}`;
  if (animation !== correctAnimation) {
    sprite.Play(correctAnimation, true);
  }
}

// ModCallbacks.MC_EVALUATE_CACHE (8)
export function fireDelay(player: EntityPlayer): void {
  const counters = g.run.fastClear.paschalCandleCounters.get(
    player.ControllerIndex,
  );
  if (counters === undefined) {
    return;
  }

  for (let i = 0; i < counters; i++) {
    const tearStat = getTearsStat(player.MaxFireDelay);
    const newTearsStat = tearStat + TEARS_INCREASE;
    player.MaxFireDelay = getFireDelayFromTearsStat(newTearsStat);
  }
}

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
export function entityTakeDmg(
  tookDamage: Entity,
  damageFlags: DamageFlag,
): void {
  const player = tookDamage.ToPlayer();
  if (player === null) {
    return;
  }
  const counters = g.run.fastClear.paschalCandleCounters.get(
    player.ControllerIndex,
  );
  if (player !== null && !isSelfDamage(damageFlags) && counters > 0) {
    g.run.fastClear.paschalCandleCounters.set(player.ControllerIndex, 0);
    player.AddCacheFlags(CacheFlag.CACHE_FIREDELAY);
    player.EvaluateItems();
  }
}
