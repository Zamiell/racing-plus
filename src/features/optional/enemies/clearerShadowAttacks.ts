// This feature affects:
// - Daddy Long Legs (101) (only the multi-stomp attack)
// - Reap Creep (900) (rock projectiles)
// - Bumbino (916) (rock projectiles)

import { VectorZero } from "isaacscript-common";
import { TargetSubTypeCustom } from "../../../enums/TargetSubTypeCustom";

const LIGHT_BLUE = Color(0, 0, 0.5, 0.5);

// ModCallbacks.MC_POST_NPC_INIT (27)
// EntityType.ENTITY_DADDYLONGLEGS (101)
export function postNPCInitDaddyLongLegs(npc: EntityNPC): void {
  // We only want to target the child entities that represent the multi-stomp attack
  if (npc.SpawnerEntity === undefined) {
    return;
  }

  spawnTarget(npc);
}

// ModCallbacks.MC_POST_EFFECT_UPDATE (55)
// EffectVariant.TARGET (30)
export function postEffectUpdateTarget(effect: EntityEffect): void {
  if (effect.SubType !== TargetSubTypeCustom.SHADOW_ATTACKS) {
    return;
  }

  if (effect.SpawnerEntity === undefined) {
    effect.Remove();
    return;
  }

  if (
    effect.SpawnerEntity.EntityCollisionClass !==
    EntityCollisionClass.ENTCOLL_NONE
  ) {
    effect.Remove();
  }
}

// ModCallbacks.MC_POST_PROJECTILE_INIT (43)
// ProjectileVariant.PROJECTILE_ROCK (9)
export function postProjectileInitRock(projectile: EntityProjectile): void {
  spawnTarget(projectile);
}

function spawnTarget(spawner: Entity) {
  const target = Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.TARGET,
    TargetSubTypeCustom.SHADOW_ATTACKS,
    spawner.Position,
    VectorZero,
    spawner,
  ).ToEffect();
  if (target !== undefined) {
    const sprite = target.GetSprite();
    sprite.Color = LIGHT_BLUE;
  }
}
