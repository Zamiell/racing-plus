/*

The Sawblade item is a custom item included in the Treasure Room pool. It is intended to solve two
specific problems:

1) Historically, orbitals have been a big part of speedrunning at the highest level. Since orbitals
got nerfed in Repentance, orbital play is infrequent. Sawblade is an attempt to restore historical
orbital play by providing a relatively-strong orbital as a possible starting item.
2) To decrease the amount of time player spend resetting for an item.

Sacrificial Dagger in Afterbirth+:
- Radius of the circle hitbox: 13
- Collision damage: 15
- Tick rate: every 2 frames
- Overall DPS: 225
- Rotation rate: 4.05 degrees per frame

Sacrificial Dagger in Repentance:
- Radius of the circle hitbox: 10 (23.1% decrease)
- Collision damage: 15 (unchanged)
- Tick rate: every 4 frames (100% decrease)
- Overall DPS: 112.5 (100% decrease)
- Rotation rate: 2.7 degrees per frame (33.3% decrease)

Cube of Meat / Ball of Bandage in Afterbirth+:
- Radius of the circle hitbox: 13
- Collision damage: 7
- Tick rate: every 2 frames
- Overall DPS: 105
- Rotation rate: 4.05 degrees per frame

Cube of Meat / Ball of Bandage in Afterbirth+:
- Radius of the circle hitbox: 8 (38.5% decrease)
    - Note that this is more nerfed than Sacrificial Dagger is.
- Collision damage is: 7 (unchanged)
- Tick rate: every 4 frames (100% decrease)
- Overall DPS: 52.5 (100% decrease)
- Rotation rate: 2.7 degrees per frame (33.3% decrease)

Takeaways:
- Damage of all 3 orbitals is nerfed by 100% in Rep.
- Sacrificial Dagger hitbox is nerfed by 23.1%.
- Cube of Meat & Ball of Bandages hitbox is nerfed by 38.5%.
- Rotation rate of all 3 orbitals is nerfed by 33.3% in Rep.

Sawblade stats:
- Radius of the circle hitbox: 13 (same as Sacrificial Dagger in Afterbirth+)
- Collision damage: 10
- Tick rate: once every 2 frames (same as Sacrificial Dagger in Afterbirth+)
- Overall DPS: 150
    - 33.3% nerf from Sacrificial Dagger in Afterbirth+ (112.5 DPS)
    - 33.3% buff from Sacrificial Dagger in Repentance (56.25 DPS)
- Rotation rate: 4.05 degrees per frame (same as all orbitals in Afterbirth+)

*/

import { checkFamiliar, saveDataManager } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../types/CollectibleTypeCustom";
import { FamiliarVariantCustom } from "../../types/FamiliarVariantCustom";

const DISTANCE_AWAY_FROM_PLAYER = 35;
const ORBITAL_ROTATION_SPEED_AFTERBIRTH_PLUS = 2.7;
// const ORBITAL_ROTATION_SPEED_REPENTANCE = 4.05;
const SAWBLADE_ROTATION_SPEED = ORBITAL_ROTATION_SPEED_AFTERBIRTH_PLUS;

/**
 * This roughly matches what happens on vanilla, but is hard to get perfectly because the base
 * Sawblade rotation speed does not match the base rotation speed of the Spin to Win familiar.
 */
const SPIN_TO_WIN_ROTATION_MULTIPLIER = 10;

const v = {
  run: {
    /** Indexed by sawblade InitSeed. */
    sawbladeAngles: new Map<int, int>(),
  },
};

export function init(): void {
  saveDataManager("sawblade", v);
}

// ModCallbacks.MC_FAMILIAR_UPDATE (6)
// FamiliarVariantCustom.SAWBLADE
export function postFamiliarUpdateSawblade(familiar: EntityFamiliar): void {
  const angle = getAndIncrementAngle(familiar);
  setPosition(familiar, angle);
}

function getAndIncrementAngle(familiar: EntityFamiliar) {
  const angle = v.run.sawbladeAngles.get(familiar.InitSeed);
  if (angle === undefined) {
    const initialAngle = getInitialAngle();
    v.run.sawbladeAngles.set(familiar.InitSeed, initialAngle);
    return initialAngle;
  }

  // We subtract because the sawblade should rotate counter-clockwise
  const rotatedAngle = (angle - getAngleChange(familiar.Player)) % 360;
  v.run.sawbladeAngles.set(familiar.InitSeed, rotatedAngle);
  return rotatedAngle;
}

function getAngleChange(player: EntityPlayer) {
  return isSpinToWinActive(player)
    ? SAWBLADE_ROTATION_SPEED * SPIN_TO_WIN_ROTATION_MULTIPLIER
    : SAWBLADE_ROTATION_SPEED;
}

function isSpinToWinActive(player: EntityPlayer) {
  const effects = player.GetEffects();
  return effects.HasNullEffect(NullItemID.ID_SPIN_TO_WIN);
}

function getInitialAngle() {
  // Default the second Sawblade to the opposite side of the first Sawblade
  if (v.run.sawbladeAngles.size === 1) {
    // There is an existing Sawblade
    // Start the 2nd Sawblade on the opposite side
    const existingSawbladeAngles = [...v.run.sawbladeAngles.values()];
    const firstSawbladeAngle = existingSawbladeAngles[0];
    return firstSawbladeAngle + 180;
  }

  // Otherwise, default the Sawblade to being below the player
  return 0;
}

/** Sawblades should rotate around the player like a Cube of Meat or Sacrificial Dagger does. */
function setPosition(familiar: EntityFamiliar, angle: float) {
  const position = getPositionFromAngle(familiar, angle);
  if (position === undefined) {
    return;
  }

  familiar.Position = position;

  // Sometimes, when the familiar collides with things, it can pick up some velocity,
  // which will cause the sprite to glitch out
  // Zero out the velocity on every frame
  familiar.Velocity = Vector.Zero;
}

function getPositionFromAngle(familiar: EntityFamiliar, angle: float) {
  const baseVector = Vector(0, DISTANCE_AWAY_FROM_PLAYER);
  const rotatedVector = baseVector.Rotated(angle);

  return familiar.Player.Position.add(rotatedVector);
}

// ModCallbacks.MC_FAMILIAR_INIT (7)
// FamiliarVariantCustom.SAWBLADE
export function postFamiliarInitSawblade(familiar: EntityFamiliar): void {
  setSpriteOffset(familiar);
}

function setSpriteOffset(familiar: EntityFamiliar) {
  const sprite = familiar.GetSprite();
  sprite.Offset = Vector(0, -16);
}

// ModCallbacks.MC_EVALUATE_CACHE (8)
// CacheFlag.CACHE_FAMILIARS (1 << 9)
export function evaluateCacheFamiliars(player: EntityPlayer): void {
  // Automatically handle adding and removing familiars with the "checkFamiliar()" helper function
  checkFamiliar(
    player,
    CollectibleTypeCustom.COLLECTIBLE_SAWBLADE,
    FamiliarVariantCustom.SAWBLADE,
  );
}

// ModCallbacks.MC_PRE_FAMILIAR_COLLISION (26)
// FamiliarVariantCustom.SAWBLADE
export function preFamiliarCollisionSawblade(collider: Entity): void {
  // Make the familiar block shots like a Cube of Meat or Sacrificial Dagger
  if (collider.Type === EntityType.ENTITY_PROJECTILE) {
    collider.Die();
  }
}
