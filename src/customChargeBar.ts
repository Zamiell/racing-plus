import {
  CollectibleType,
  EntityType,
  FamiliarVariant,
  PlayerType,
} from "isaac-typescript-definitions";
import {
  doesEntityExist,
  game,
  hasCollectible,
  isCharacter,
  isChildPlayer,
  isReflectionRender,
} from "isaacscript-common";
import { isMaxBloodyLustCharges } from "./classes/features/optional/quality/bloodyLustChargeBar/v";
import { CustomChargeBarType } from "./enums/CustomChargeBarType";
import { config } from "./modConfigMenu";

const VANILLA_CHARGE_BAR_OFFSET = Vector(-19, -54);
const OVERLAP_ADJUSTMENT = Vector(-20, 0);

const LEAD_PENCIL_UNTRACKABLE_COLLECTIBLES = [
  CollectibleType.DR_FETUS, // 52
  CollectibleType.TECHNOLOGY, // 68
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.BRIMSTONE, // 118
  CollectibleType.TECHNOLOGY_2, // 152
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.TECH_X, // 395
  CollectibleType.HAEMOLACRIA, // 531
  CollectibleType.SPIRIT_SWORD, // 579
] as const;

// Azazels' Rage constants.
export const NUM_ROOMS_TO_CHARGE_AZAZELS_RAGE = 4;

/**
 * Corresponds to the "Charging" animation in "chargebar.anm2", which is the base for all custom
 * charge bar ANM2 files.
 */
export const NUM_FRAMES_IN_CHARGING_ANIMATION = 101;

/**
 * The vanilla charge bars appear to the top-right of the player. We place the custom charge bar to
 * the top-left.
 */
export function drawCustomChargeBar(
  player: EntityPlayer,
  sprite: Sprite,
  barFrame: int,
  chargeBarType: CustomChargeBarType,
): void {
  // For vanilla charge bars, as the player grows bigger, the charge bar offset increases.
  const sizeOffset = VANILLA_CHARGE_BAR_OFFSET.mul(player.SpriteScale);

  // Additionally, the charge bar offset changes depending on if the player is flying.
  const flyingOffset = player.GetFlyingOffset();

  // Adjust this charge bar to the left if there are other custom charge bars showing of a higher
  // precedence.
  const numHigherPrecedenceCustomChargeBars =
    getNumHigherPrecedenceCustomChargeBars(player, chargeBarType);
  const overlapOffset = OVERLAP_ADJUSTMENT.mul(
    numHigherPrecedenceCustomChargeBars,
  );

  const adjustedPosition = player.Position.add(sizeOffset)
    .add(flyingOffset)
    .add(overlapOffset);

  // Render it
  barFrame = Math.round(barFrame);
  sprite.SetFrame("Charging", barFrame);
  const position = Isaac.WorldToScreen(adjustedPosition);
  sprite.Render(position);
}

function getNumHigherPrecedenceCustomChargeBars(
  player: EntityPlayer,
  chargeBarType: CustomChargeBarType,
): int {
  const leadPencilShowing = shouldDrawCustomChargeBar(
    player,
    CustomChargeBarType.LEAD_PENCIL,
  );
  const leadPencil = leadPencilShowing ? 1 : 0;
  const azazelsRageShowing = shouldDrawCustomChargeBar(
    player,
    CustomChargeBarType.AZAZELS_RAGE,
  );
  const azazelsRage = azazelsRageShowing ? 1 : 0;
  const taintedSamsonShowing = shouldDrawCustomChargeBar(
    player,
    CustomChargeBarType.TAINTED_SAMSON,
  );
  const taintedSamson = taintedSamsonShowing ? 1 : 0;

  switch (chargeBarType) {
    case CustomChargeBarType.LEAD_PENCIL: {
      return 0;
    }

    case CustomChargeBarType.AZAZELS_RAGE: {
      return leadPencil;
    }

    case CustomChargeBarType.TAINTED_SAMSON: {
      return leadPencil + azazelsRage;
    }

    case CustomChargeBarType.BLOODY_LUST: {
      return leadPencil + azazelsRage + taintedSamson;
    }
  }
}

export function shouldDrawCustomChargeBar(
  player: EntityPlayer,
  chargeBarType: CustomChargeBarType,
): boolean {
  if (!shouldDrawAnyCustomChargeBar(player)) {
    return false;
  }

  switch (chargeBarType) {
    case CustomChargeBarType.LEAD_PENCIL: {
      return shouldDrawLeadPencilChargeBar(player);
    }

    case CustomChargeBarType.AZAZELS_RAGE: {
      return shouldDrawAzazelsRageChargeBar(player);
    }

    case CustomChargeBarType.TAINTED_SAMSON: {
      return shouldDrawTaintedSamsonChargeBar(player);
    }

    case CustomChargeBarType.BLOODY_LUST: {
      return shouldDrawBloodyLustChargeBar(player);
    }
  }
}

/**
 * Since this is a UI element, we only want to draw it when the HUD is enabled and if this is not a
 * water reflection.
 */
function shouldDrawAnyCustomChargeBar(player: EntityPlayer): boolean {
  const hud = game.GetHUD();

  return hud.IsVisible() && !isReflectionRender() && !isChildPlayer(player);
}

function shouldDrawLeadPencilChargeBar(player: EntityPlayer) {
  return (
    config.LeadPencilChargeBar
    && player.HasCollectible(CollectibleType.LEAD_PENCIL)
    // In some situations, the Lead Pencil barrage will fire, but we have no way of tracking it
    // (because there is no `POST_LASER_FIRED` callback).
    && !isCharacter(player, PlayerType.AZAZEL)
    // When Incubus or a Blood Baby fires a Lead Pencil barrage, there is no way to tell that it
    // came from a familiar (because the `SpawnerEntity` shows up as the player for some reason).
    && !doesEntityExist(EntityType.FAMILIAR, FamiliarVariant.INCUBUS)
    && !doesEntityExist(EntityType.FAMILIAR, FamiliarVariant.BLOOD_BABY)
    && !hasCollectible(player, ...LEAD_PENCIL_UNTRACKABLE_COLLECTIBLES)
  );
}

function shouldDrawAzazelsRageChargeBar(player: EntityPlayer) {
  const hasAzazelsRage = player.HasCollectible(CollectibleType.AZAZELS_RAGE);
  const effects = player.GetEffects();
  const numCharges = effects.GetCollectibleEffectNum(
    CollectibleType.AZAZELS_RAGE,
  );

  // The number of effects goes from 4 to 6 when the blast is firing.
  const isBlastFiring = numCharges > NUM_ROOMS_TO_CHARGE_AZAZELS_RAGE;

  return config.AzazelsRageChargeBar && hasAzazelsRage && !isBlastFiring;
}

function shouldDrawTaintedSamsonChargeBar(player: EntityPlayer) {
  const isTaintedSamson = isCharacter(player, PlayerType.SAMSON_B);
  const effects = player.GetEffects();
  const isBerserk = effects.HasCollectibleEffect(CollectibleType.BERSERK);

  return config.TaintedSamsonChargeBar && isTaintedSamson && !isBerserk;
}

function shouldDrawBloodyLustChargeBar(player: EntityPlayer) {
  return (
    config.BloodyLustChargeBar
    && player.HasCollectible(CollectibleType.BLOODY_LUST)
    && !isMaxBloodyLustCharges(player)
  );
}
