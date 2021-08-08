/*
// 1000
functionMap.set(
  EntityType.ENTITY_EFFECT,
  (
    variant: int,
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

    const preEntitySpawnEffectFunction =
      preEntitySpawnEffectFunctions.get(variant);
    if (preEntitySpawnEffectFunction !== undefined) {
      return preEntitySpawnEffectFunction(subType, spawner, initSeed);
    }

    return null;
  },
);
*/
