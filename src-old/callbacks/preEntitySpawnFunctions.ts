/*
// 1000
functionMap.set(
  EntityType.ENTITY_EFFECT,
  (
    variant: EntityVariantForAC,
    subType: int,
    _position: Vector,
    spawner: Entity,
    initSeed: int,
  ) => {
    // Remove all unnecessary effects to decrease lag
    if (LOW_FX_VARIANTS.includes(variant)) {
      return [
        EntityType.ENTITY_EFFECT,
        EffectVariantCustom.INVISIBLE_EFFECT,
        0,
        0,
      ];
    }

    // We only remove blood explosions on specific laggy bosses
    if (
      g.run.room.preventBloodExplosion &&
      (variant === EffectVariant.BLOOD_EXPLOSION || // 2
        variant === EffectVariant.BLOOD_PARTICLE) // 5
    ) {
      return [
        EntityType.ENTITY_EFFECT,
        EffectVariantCustom.INVISIBLE_EFFECT,
        0,
        0,
      ];
    }

    const preEntitySpawnEffectFunction =
      preEntitySpawnEffectFunctions.get(variant);
    if (preEntitySpawnEffectFunction !== undefined) {
      return preEntitySpawnEffectFunction(subType, spawner, initSeed);
    }

    return null;
  },
);
*/
