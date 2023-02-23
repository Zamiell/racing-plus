// This feature affects:
// - Daddy Long Legs (101) (only the multi-stomp attack)
// - Reap Creep (900) (rock projectiles)
// - Bumbino (916) (rock projectiles)

import {
  EffectVariant,
  EntityCollisionClass,
  EntityType,
  ModCallback,
  ProjectileVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  spawnEffect,
  VectorZero,
} from "isaacscript-common";
import { TargetSubTypeCustom } from "../../../../enums/TargetSubTypeCustom";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const LIGHT_BLUE = Color(0, 0, 0.5, 0.5);

export class ClearerShadowAttacks extends ConfigurableModFeature {
  configKey: keyof Config = "ClearerShadowAttacks";

  // 27, 101
  @Callback(ModCallback.POST_NPC_INIT, EntityType.DADDY_LONG_LEGS)
  postNPCInitDaddyLongLegs(npc: EntityNPC): void {
    // We only want to target the child entities that represent the multi-stomp attack.
    if (npc.SpawnerEntity !== undefined) {
      this.spawnTarget(npc);
    }
  }

  // 43, 9
  @Callback(ModCallback.POST_PROJECTILE_INIT, ProjectileVariant.ROCK)
  postProjectileInitRock(projectile: EntityProjectile): void {
    this.spawnTarget(projectile);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_EFFECT_UPDATE_FILTER,
    EffectVariant.TARGET,
    TargetSubTypeCustom.SHADOW_ATTACKS,
  )
  postEffectUpdateTargetShadowAttacks(effect: EntityEffect): void {
    if (effect.SpawnerEntity === undefined) {
      effect.Remove();
      return;
    }

    if (
      effect.SpawnerEntity.EntityCollisionClass !== EntityCollisionClass.NONE
    ) {
      effect.Remove();
    }
  }

  spawnTarget(spawner: Entity): void {
    const target = spawnEffect(
      EffectVariant.TARGET,
      TargetSubTypeCustom.SHADOW_ATTACKS,
      spawner.Position,
      VectorZero,
      spawner,
    );
    const sprite = target.GetSprite();
    sprite.Color = LIGHT_BLUE;
  }
}