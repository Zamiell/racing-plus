// This feature affects:
// - Daddy Long Legs ()
// - Reap Creep
// - Bumbino

import { TargetSubTypeCustom } from "../../../types/enums";

const BLUE = Color(0, 0, 1, 1);

// ModCallbacks.MC_POST_NPC_INIT (27)
// EntityType.ENTITY_DADDYLONGLEGS (101)
export function postNPCInitDaddyLongLegs(npc: EntityNPC): void {
  // We only want to target the child entities that represent the multi-stomp attack
  if (npc.SpawnerEntity === undefined) {
    return;
  }

  const target = Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.TARGET,
    TargetSubTypeCustom.SHADOW_ATTACKS,
    npc.Position,
    Vector.Zero,
    npc,
  ).ToEffect();
  if (target !== null) {
    const sprite = target.GetSprite();
    sprite.Color = BLUE;
    Isaac.DebugString("SPAWNED A TARGET");
  }
}

// ModCallbacks.MC_POST_EFFECT_UPDATE (55)
// EffectVariant.TARGET (30)
export function postEffectUpdateTarget(effect: EntityEffect): void {
  if (effect.SubType !== TargetSubTypeCustom.SHADOW_ATTACKS) {
    return;
  }

  if (effect.SpawnerEntity === null) {
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
