import { CoinSubType } from "isaac-typescript-definitions";
import {
  getLastFrameOfAnimation,
  isCoin,
  spawnEffect,
  VectorZero,
} from "isaacscript-common";
import { EffectVariantCustom } from "../../../enums/EffectVariantCustom";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";

const v = {
  room: {
    effectToNickelPtrMap: new Map<PtrHash, EntityPtr>(),
  },
};

export function init(): void {
  mod.saveDataManager("stickyNickel", v, featureEnabled);
}

function featureEnabled() {
  return config.StickyNickel;
}

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.COIN (20)
export function postPickupInitCoin(coin: EntityPickupCoin): void {
  if (!config.StickyNickel) {
    return;
  }

  if (coin.SubType !== CoinSubType.STICKY_NICKEL) {
    return;
  }

  postPickupInitStickyNickel(coin);
}

function postPickupInitStickyNickel(stickyNickel: EntityPickupCoin) {
  const effect = spawnEffect(
    EffectVariantCustom.STICKY_NICKEL,
    0,
    stickyNickel.Position,
    VectorZero,
    stickyNickel,
  );

  // Make it render below most things.
  effect.RenderZOffset = -10000;

  const sprite = stickyNickel.GetSprite();
  const effectSprite = effect.GetSprite();
  const animation = sprite.IsPlaying("Appear") ? "Appear" : "Idle";
  effectSprite.Play(animation, true);

  // Store the relationship between this coin and effect.
  const effectPtrHash = GetPtrHash(effect);
  const stickyNickelPtr = EntityPtr(stickyNickel);
  v.room.effectToNickelPtrMap.set(effectPtrHash, stickyNickelPtr);
}

// ModCallback.POST_EFFECT_UPDATE (55)
// EffectVariantCustom.STICKY_NICKEL
export function postEffectUpdateStickyNickel(effect: EntityEffect): void {
  if (!config.StickyNickel) {
    return;
  }

  const success = tryUpdateEffectPosition(effect);
  if (!success) {
    // The sticky nickel is gone, so we should delete the associated effect.
    fadeOutStickyNickelEffect(effect);
  }
}

function tryUpdateEffectPosition(effect: EntityEffect) {
  const effectPtrHash = GetPtrHash(effect);
  const nickelPtr = v.room.effectToNickelPtrMap.get(effectPtrHash);

  if (nickelPtr === undefined) {
    return false;
  }
  const stickyNickel = nickelPtr.Ref;
  if (stickyNickel === undefined || !stickyNickel.Exists()) {
    return false;
  }
  const pickup = stickyNickel.ToPickup();
  if (
    pickup === undefined ||
    !isCoin(pickup) ||
    pickup.SubType !== CoinSubType.STICKY_NICKEL
  ) {
    return false;
  }

  // Update our position to the nickel's position (in case it moved).
  effect.Position = stickyNickel.Position;

  // We do not want to remove the effect yet, since the nickel is still sticky.
  return true;
}

function fadeOutStickyNickelEffect(effect: EntityEffect) {
  const effectPtrHash = GetPtrHash(effect);
  v.room.effectToNickelPtrMap.delete(effectPtrHash);

  const sprite = effect.GetSprite();
  if (!sprite.IsPlaying("Disappear")) {
    sprite.Play("Disappear", true);
    return;
  }

  const frame = sprite.GetFrame();
  const finalFrame = getLastFrameOfAnimation(sprite);
  if (frame === finalFrame) {
    effect.Remove();
  }
}
