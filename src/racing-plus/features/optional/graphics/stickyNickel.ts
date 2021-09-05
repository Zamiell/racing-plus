import { getFinalFrameOfAnimation } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import { EffectVariantCustom } from "../../../types/enums";

interface StickyNickelEffectData {
  associatedCoinPtr: EntityPtr | undefined;
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

  const effect = Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.STICKY_NICKEL,
    0,
    pickup.Position,
    Vector.Zero,
    pickup,
  );

  const sprite = pickup.GetSprite();
  const effectSprite = effect.GetSprite();
  const animation = sprite.IsPlaying("Appear") ? "Appear" : "Idle";
  effectSprite.Play(animation, true);

  const effectData = effect.GetData() as unknown as StickyNickelEffectData;
  effectData.associatedCoinPtr = EntityPtr(pickup);

  // Make it render below most things
  effect.RenderZOffset = -10000;
}

// ModCallbacks.MC_POST_EFFECT_UPDATE (55)
// EffectVariantCustom.STICKY_NICKEL
export function postEffectUpdateStickyNickel(effect: EntityEffect): void {
  if (!config.stickyNickel) {
    return;
  }

  const success = tryUpdateEffectPosition(effect);
  if (success) {
    return;
  }

  // The sticky nickel is now gone, so delete the associated effect
  const data = effect.GetData() as unknown as StickyNickelEffectData;
  data.associatedCoinPtr = undefined;

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

function tryUpdateEffectPosition(effect: EntityEffect) {
  const data = effect.GetData() as unknown as StickyNickelEffectData;

  if (data.associatedCoinPtr === undefined) {
    return false;
  }

  const stickyNickel = data.associatedCoinPtr.Ref;
  if (stickyNickel === undefined) {
    return false;
  }

  if (!stickyNickel.Exists()) {
    return false;
  }

  if (stickyNickel.SubType !== CoinSubType.COIN_STICKYNICKEL) {
    return false;
  }

  // Update our position to the nickel's position (in case it moved)
  effect.Position = stickyNickel.Position;

  // We do not want to remove the effect yet, since the nickel is still sticky
  return true;
}
