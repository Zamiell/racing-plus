import {
  EntityFlag,
  EntityType,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, setEntityOpacity } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/** The floating heart animation must be separately faded in "statuseffects.anm2". */
const FADE_AMOUNT = 0.25;

export class FadeFriendlyEnemies extends ConfigurableModFeature {
  configKey: keyof Config = "FadeFriendlyEnemies";

  /** We reapply the fade on every frame because enemies can be unfaded occasionally. */
  // 0
  @Callback(ModCallback.POST_NPC_UPDATE)
  postNPCUpdate(npc: EntityNPC): void {
    if (npc.HasEntityFlags(EntityFlag.FRIENDLY)) {
      setEntityOpacity(npc, FADE_AMOUNT);
    }
  }

  // 6, 224
  @Callback(ModCallback.POST_FAMILIAR_UPDATE, FamiliarVariant.BABY_PLUM)
  postFamiliarUpdateBabyPlum(familiar: EntityFamiliar): void {
    setEntityOpacity(familiar, FADE_AMOUNT);
  }

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    if (
      tear.SpawnerType === EntityType.FAMILIAR &&
      tear.SpawnerVariant === (FamiliarVariant.BABY_PLUM as int)
    ) {
      setEntityOpacity(tear, FADE_AMOUNT);
    }
  }

  /** This does not work properly if done in the `POST_PROJECTILE_INIT` callback. */
  // 44
  @Callback(ModCallback.POST_PROJECTILE_UPDATE)
  postProjectileUpdate(projectile: EntityProjectile): void {
    if (
      projectile.Parent !== undefined &&
      projectile.Parent.HasEntityFlags(EntityFlag.FRIENDLY)
    ) {
      setEntityOpacity(projectile, FADE_AMOUNT);
    }
  }

  /**
   * We need to also fade the Brimstone lasers from friendly Vis.
   *
   * This does not work properly if done in the `POST_LASER_INIT` callback.
   *
   * The laser will look bugged, since it will first appear at full opacity, but there is not an
   * elegant workaround for this, so keep it the way it is for now.
   */
  // 48
  @Callback(ModCallback.POST_LASER_UPDATE)
  postLaserUpdate(laser: EntityLaser): void {
    if (
      laser.Parent !== undefined &&
      laser.Parent.HasEntityFlags(EntityFlag.FRIENDLY)
    ) {
      setEntityOpacity(laser, FADE_AMOUNT);
    }
  }
}
