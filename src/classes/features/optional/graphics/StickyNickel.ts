import {
  CoinSubType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getLastFrameOfAnimation,
  isCoin,
  ModCallbackCustom,
  spawnEffect,
  VectorZero,
} from "isaacscript-common";
import { EffectVariantCustom } from "../../../../enums/EffectVariantCustom";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const v = {
  room: {
    effectToNickelPtrMap: new Map<PtrHash, EntityPtr>(),
  },
};

export class StickyNickel extends ConfigurableModFeature {
  configKey: keyof Config = "StickyNickel";
  v = v;

  // 55
  @Callback(ModCallback.POST_EFFECT_UPDATE, EffectVariantCustom.STICKY_NICKEL)
  postEffectUpdateStickyNickel(effect: EntityEffect): void {
    const success = this.tryUpdateEffectPosition(effect);
    if (!success) {
      // The sticky nickel is gone, so we should delete the associated effect.
      this.fadeOutStickyNickelEffect(effect);
    }
  }

  tryUpdateEffectPosition(effect: EntityEffect): boolean {
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

  fadeOutStickyNickelEffect(effect: EntityEffect): void {
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

  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_FILTER,
    PickupVariant.COIN,
    CoinSubType.STICKY_NICKEL,
  )
  postPickupInitStickyNickel(pickup: EntityPickup): void {
    const effect = spawnEffect(
      EffectVariantCustom.STICKY_NICKEL,
      0,
      pickup.Position,
      VectorZero,
      pickup,
    );

    // Make it render below most things.
    effect.RenderZOffset = -10000;

    const sprite = pickup.GetSprite();
    const effectSprite = effect.GetSprite();
    const animation = sprite.IsPlaying("Appear") ? "Appear" : "Idle";
    effectSprite.Play(animation, true);

    // Store the relationship between this coin and effect.
    const effectPtrHash = GetPtrHash(effect);
    const stickyNickelPtr = EntityPtr(pickup);
    v.room.effectToNickelPtrMap.set(effectPtrHash, stickyNickelPtr);
  }
}
