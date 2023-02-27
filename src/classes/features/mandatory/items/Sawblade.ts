import {
  CacheFlag,
  EntityType,
  ModCallback,
  NullItemID,
} from "isaac-typescript-definitions";
import {
  Callback,
  checkFamiliarFromCollectibles,
  VectorZero,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { FamiliarVariantCustom } from "../../../../enums/FamiliarVariantCustom";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const DISTANCE_AWAY_FROM_PLAYER = 35;
const ORBITAL_ROTATION_SPEED_AFTERBIRTH_PLUS = 2.7;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ORBITAL_ROTATION_SPEED_REPENTANCE = 4.05;
const SAWBLADE_ROTATION_SPEED = ORBITAL_ROTATION_SPEED_AFTERBIRTH_PLUS;

/**
 * This roughly matches what happens on vanilla, but is hard to get perfectly because the base
 * Sawblade rotation speed does not match the base rotation speed of the Spin to Win familiar.
 */
const SPIN_TO_WIN_ROTATION_MULTIPLIER = 10;

const v = {
  run: {
    /** Indexed by sawblade `InitSeed`. */
    sawbladeAngles: new Map<int, int>(),
  },
};

/**
 * The Sawblade item is a custom item included in the Treasure Room pool.
 *
 * Historically, orbitals have been a big part of speedrunning at the highest level. Since orbitals
 * got nerfed in Repentance, orbital play is infrequent. Sawblade is an attempt to restore
 * historical orbital play by providing a relatively-strong orbital.
 *
 * Sacrificial Dagger in Afterbirth+:
 * - Radius of the circle hitbox: 13
 * - Collision damage: 15
 * - Tick rate: every 2 frames
 * - Overall DPS: 225
 * - Rotation rate: 4.05 degrees per frame
 *
 * Sacrificial Dagger in Repentance:
 * - Radius of the circle hitbox: 10 (23.1% decrease)
 * - Collision damage: 15 (unchanged)
 * - Tick rate: every 4 frames (100% decrease)
 * - Overall DPS: 112.5 (100% decrease)
 * - Rotation rate: 2.7 degrees per frame (33.3% decrease)
 *
 * Cube of Meat / Ball of Bandage in Afterbirth+:
 * - Radius of the circle hitbox: 13
 * - Collision damage: 7
 * - Tick rate: every 2 frames
 * - Overall DPS: 105
 * - Rotation rate: 4.05 degrees per frame
 *
 * Cube of Meat / Ball of Bandage in Afterbirth+:
 * - Radius of the circle hitbox: 8 (38.5% decrease)
 * - Note that this is more nerfed than Sacrificial Dagger is.
 * - Collision damage is: 7 (unchanged)
 * - Tick rate: every 4 frames (100% decrease)
 * - Overall DPS: 52.5 (100% decrease)
 * - Rotation rate: 2.7 degrees per frame (33.3% decrease)
 *
 * Takeaways:
 * - Damage of all 3 orbitals is nerfed by 100% in Repentance.
 * - Sacrificial Dagger hitbox is nerfed by 23.1%.
 * - Cube of Meat & Ball of Bandages hitbox is nerfed by 38.5%.
 * - Rotation rate of all 3 orbitals is nerfed by 33.3% in Repentance.
 *
 * Sawblade stats:
 * - Radius of the circle hitbox: 13 (same as Sacrificial Dagger in Afterbirth+)
 * - Collision damage: 10
 * - Tick rate: once every 2 frames (same as Sacrificial Dagger in Afterbirth+)
 * - Overall DPS: 150
 * - 33.3% nerf from Sacrificial Dagger in Afterbirth+ (112.5 DPS)
 * - 33.3% buff from Sacrificial Dagger in Repentance (56.25 DPS)
 * - Rotation rate: 4.05 degrees per frame (same as all orbitals in Afterbirth+)
 */
export class Sawblade extends MandatoryModFeature {
  v = v;

  // 6
  @Callback(ModCallback.POST_FAMILIAR_UPDATE, FamiliarVariantCustom.SAWBLADE)
  postFamiliarUpdateSawblade(familiar: EntityFamiliar): void {
    const angle = this.getAndIncrementAngle(familiar);
    this.setPosition(familiar, angle);
  }

  getAndIncrementAngle(familiar: EntityFamiliar): float {
    const angle = v.run.sawbladeAngles.get(familiar.InitSeed);
    if (angle === undefined) {
      const initialAngle = this.getInitialAngle();
      v.run.sawbladeAngles.set(familiar.InitSeed, initialAngle);
      return initialAngle;
    }

    // We subtract because the sawblade should rotate counter-clockwise.
    const rotatedAngle = (angle - this.getAngleChange(familiar.Player)) % 360;
    v.run.sawbladeAngles.set(familiar.InitSeed, rotatedAngle);
    return rotatedAngle;
  }

  getInitialAngle(): float {
    // Default the second Sawblade to the opposite side of the first Sawblade.
    if (v.run.sawbladeAngles.size === 1) {
      // There is an existing Sawblade. Start the 2nd Sawblade on the opposite side.
      const existingSawbladeAngles = [...v.run.sawbladeAngles.values()];
      const firstSawbladeAngle = existingSawbladeAngles[0];
      return firstSawbladeAngle === undefined ? 0 : firstSawbladeAngle + 180;
    }

    // Otherwise, default the Sawblade to being below the player.
    return 0;
  }

  getAngleChange(player: EntityPlayer): float {
    return this.isSpinToWinActive(player)
      ? SAWBLADE_ROTATION_SPEED * SPIN_TO_WIN_ROTATION_MULTIPLIER
      : SAWBLADE_ROTATION_SPEED;
  }

  isSpinToWinActive(player: EntityPlayer): boolean {
    const effects = player.GetEffects();
    return effects.HasNullEffect(NullItemID.SPIN_TO_WIN);
  }

  /** Sawblades should rotate around the player like a Cube of Meat or Sacrificial Dagger does. */
  setPosition(familiar: EntityFamiliar, angle: float): void {
    familiar.Position = this.getPositionFromAngle(familiar, angle);

    // Sometimes, when the familiar collides with things, it can pick up some velocity, which will
    // cause the sprite to glitch out. Zero out the velocity on every frame.
    familiar.Velocity = VectorZero;
  }

  getPositionFromAngle(familiar: EntityFamiliar, angle: float): Vector {
    const baseVector = Vector(0, DISTANCE_AWAY_FROM_PLAYER);
    const rotatedVector = baseVector.Rotated(angle);

    return familiar.Player.Position.add(rotatedVector);
  }

  // 7
  @Callback(ModCallback.POST_FAMILIAR_INIT, FamiliarVariantCustom.SAWBLADE)
  postFamiliarInitSawblade(familiar: EntityFamiliar): void {
    this.setSpriteOffset(familiar);
  }

  setSpriteOffset(familiar: EntityFamiliar): void {
    const sprite = familiar.GetSprite();
    sprite.Offset = Vector(0, -16);
  }

  // 8, 1 << 9
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FAMILIARS)
  evaluateCacheFamiliars(player: EntityPlayer): void {
    // Automatically handle adding and removing familiars with the `checkFamiliarFromCollectibles`
    // helper function.
    checkFamiliarFromCollectibles(
      player,
      CollectibleTypeCustom.SAWBLADE,
      FamiliarVariantCustom.SAWBLADE,
    );
  }

  // 26
  @Callback(ModCallback.PRE_FAMILIAR_COLLISION, FamiliarVariantCustom.SAWBLADE)
  preFamiliarCollisionSawblade(collider: Entity): boolean | undefined {
    // Make the familiar block shots like a Cube of Meat or Sacrificial Dagger.
    if (collider.Type === EntityType.PROJECTILE) {
      collider.Die();
    }

    return undefined;
  }
}
