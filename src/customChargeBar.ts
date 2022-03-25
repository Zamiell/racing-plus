import { ensureAllCases, isCharacter } from "isaacscript-common";
import { CustomChargeBarType } from "./enums/CustomChargeBarType";
import { isMaxBloodyLustCharges } from "./features/optional/quality/bloodyLustChargeBar/v";
import g from "./globals";
import { config } from "./modConfigMenu";

const VANILLA_CHARGE_BAR_OFFSET = Vector(-19, -54);
const OVERLAP_ADJUSTMENT = Vector(-20, 0);

// Lead Pencil constants
const UNTRACKABLE_COLLECTIBLES: readonly CollectibleType[] = [
  CollectibleType.COLLECTIBLE_DR_FETUS, // 52
  CollectibleType.COLLECTIBLE_TECHNOLOGY, // 68
  CollectibleType.COLLECTIBLE_MOMS_KNIFE, // 114
  CollectibleType.COLLECTIBLE_BRIMSTONE, // 118
  CollectibleType.COLLECTIBLE_TECHNOLOGY_2, // 152
  CollectibleType.COLLECTIBLE_EPIC_FETUS, // 168
  CollectibleType.COLLECTIBLE_MONSTROS_LUNG, // 229
  CollectibleType.COLLECTIBLE_TECH_X, // 395
];

// Azazels' Rage constants
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
  // For vanilla charge bars, as the player grows bigger, the charge bar offset increases
  const sizeOffset = VANILLA_CHARGE_BAR_OFFSET.mul(player.SpriteScale);

  // Additionally, the charge bar offset changes depending on if the player is flying or not
  const flyingOffset = player.GetFlyingOffset();

  // Adjust this charge bar to the left if there are other custom charge bars showing of a higher
  // precedence
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
  const position = g.r.WorldToScreenPosition(adjustedPosition);
  sprite.Render(position, Vector.Zero, Vector.Zero);
}

function getNumHigherPrecedenceCustomChargeBars(
  player: EntityPlayer,
  chargeBarType: CustomChargeBarType,
) {
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

    default: {
      return ensureAllCases(chargeBarType);
    }
  }
}

export function shouldDrawCustomChargeBar(
  player: EntityPlayer,
  chargeBarType: CustomChargeBarType,
): boolean {
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

    default: {
      return ensureAllCases(chargeBarType);
    }
  }
}

function shouldDrawLeadPencilChargeBar(player: EntityPlayer) {
  return (
    config.leadPencilChargeBar &&
    player.HasCollectible(CollectibleType.COLLECTIBLE_LEAD_PENCIL) &&
    // In some situations, the Lead Pencil barrage will fire, but we have no way of tracking it
    // (because there is no PostLaserFired callback)
    !isCharacter(player, PlayerType.PLAYER_AZAZEL) &&
    !playerHasUntrackableCollectible(player)
  );
}

function playerHasUntrackableCollectible(player: EntityPlayer) {
  return UNTRACKABLE_COLLECTIBLES.some((collectibleType) =>
    player.HasCollectible(collectibleType),
  );
}

function shouldDrawAzazelsRageChargeBar(player: EntityPlayer) {
  const hasAzazelsRage = player.HasCollectible(
    CollectibleType.COLLECTIBLE_AZAZELS_RAGE,
  );
  const effects = player.GetEffects();
  const numCharges = effects.GetCollectibleEffectNum(
    CollectibleType.COLLECTIBLE_AZAZELS_RAGE,
  );

  // The number of effects goes from 4 to 6 when the blast is firing
  const isBlastFiring = numCharges > NUM_ROOMS_TO_CHARGE_AZAZELS_RAGE;

  return config.azazelsRageChargeBar && hasAzazelsRage && !isBlastFiring;
}

function shouldDrawTaintedSamsonChargeBar(player: EntityPlayer) {
  const isTaintedSamson = isCharacter(player, PlayerType.PLAYER_SAMSON_B);
  const effects = player.GetEffects();
  const isBerserk = effects.HasCollectibleEffect(
    CollectibleType.COLLECTIBLE_BERSERK,
  );

  return config.taintedSamsonChargeBar && isTaintedSamson && !isBerserk;
}

function shouldDrawBloodyLustChargeBar(player: EntityPlayer) {
  return (
    config.bloodyLustChargeBar &&
    player.HasCollectible(CollectibleType.COLLECTIBLE_BLOODY_LUST) &&
    !isMaxBloodyLustCharges(player)
  );
}
