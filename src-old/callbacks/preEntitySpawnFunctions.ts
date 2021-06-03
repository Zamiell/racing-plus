/*
// Is this necessary now in Rep?
// 6
functionMap.set(
  EntityType.ENTITY_SLOT,
  (
    variant: EntityVariantForAC,
    _subType: int,
    _position: Vector,
    _spawner: Entity,
    _initSeed: int,
  ) => {
    // Remove Donation Machines
    // Racing+ always enables the "BLCK CNDL" Easter Egg
    // Normally, when playing on this Easter Egg, all Donation Machines are removed
    // However, because of the save file check on the first run,
    // it is possible for Donation Machines to spawn, so we have to explicitly check for them
    if (variant === 8) {
      // Donation Machine (6.8)
      Isaac.DebugString("Prevented a Donation Machine from spawning.");
      return [EntityType.ENTITY_EFFECT, 0, 0, 0];
    }

    return null;
  },
);

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
