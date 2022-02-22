import { getFinalFrameOfAnimation, saveDataManager } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import { EffectVariantCustom } from "../../../types/EffectVariantCustom";

const v = {
  room: {
    effectToNickelPtrMap: new Map<PtrHash, EntityPtr>(),
  },
};

export function init(): void {
  saveDataManager("stickyNickel", v);
}

// ModCallbacks.MC_POST_PICKUP_INIT (34)
// PickupVariant.PICKUP_COIN (20)
export function postPickupInitCoin(pickup: EntityPickup): void {
  if (!config.stickyNickel) {
    return;
  }

  if (pickup.SubType !== CoinSubType.COIN_STICKYNICKEL) {
    return;
  }

  postPickupInitStickyNickel(pickup);
}

function postPickupInitStickyNickel(pickup: EntityPickup) {
  const effect = Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.STICKY_NICKEL,
    0,
    pickup.Position,
    Vector.Zero,
    pickup,
  );

  // Make it render below most things
  effect.RenderZOffset = -10000;

  const sprite = pickup.GetSprite();
  const effectSprite = effect.GetSprite();
  const animation = sprite.IsPlaying("Appear") ? "Appear" : "Idle";
  effectSprite.Play(animation, true);

  // Store the relationship between this coin and effect
  const effectPtrHash = GetPtrHash(effect);
  const pickupEntityPtr = EntityPtr(pickup);
  v.room.effectToNickelPtrMap.set(effectPtrHash, pickupEntityPtr);
}

// ModCallbacks.MC_POST_EFFECT_UPDATE (55)
// EffectVariantCustom.STICKY_NICKEL
export function postEffectUpdateStickyNickel(effect: EntityEffect): void {
  if (!config.stickyNickel) {
    return;
  }

  const success = tryUpdateEffectPosition(effect);
  if (!success) {
    // The sticky nickel is gone, so we should delete the associated effect
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
  if (
    stickyNickel === undefined ||
    !stickyNickel.Exists() ||
    stickyNickel.SubType !== CoinSubType.COIN_STICKYNICKEL
  ) {
    return false;
  }

  // Update our position to the nickel's position (in case it moved)
  effect.Position = stickyNickel.Position;

  // We do not want to remove the effect yet, since the nickel is still sticky
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
  const finalFrame = getFinalFrameOfAnimation(sprite);
  if (frame === finalFrame) {
    effect.Remove();
  }
}
