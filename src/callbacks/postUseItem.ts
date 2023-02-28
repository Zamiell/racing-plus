import {
  ActiveSlot,
  CollectibleType,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as removeFortuneCookieBanners from "../features/optional/quality/removeFortuneCookieBanners";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    teleport,
    CollectibleType.TELEPORT, // 44
  );

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    fortuneCookie,
    CollectibleType.FORTUNE_COOKIE, // 557
  );

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    lemegeton,
    CollectibleType.LEMEGETON, // 712
  );
}

// CollectibleType.TELEPORT (44)
function teleport(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  seededTeleports.postUseItemTeleport();

  return undefined;
}

// CollectibleType.FORTUNE_COOKIE (557)
function fortuneCookie(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  removeFortuneCookieBanners.postUseItemFortuneCookie();

  return undefined;
}

// CollectibleType.LEMEGETON (712)
function lemegeton(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  streakText.postUseItemLemegeton();

  return undefined;
}
