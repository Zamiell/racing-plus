import {
  AngelVariant,
  CollectibleType,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  onGameFrame,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const FRAME_DELAY_TO_SPAWN_AFTER_MEAT_CLEAVER = 2;

const v = {
  run: {
    nextAngelType: EntityType.URIEL, // 271
  },

  room: {
    usedMeatCleaverGameFrame: null as int | null,
  },
};

/**
 * In vanilla, bombing two angel statues will sometimes result in two of the same angel type
 * spawning. Furthermore, in vanilla, sometimes the first angel from an angel statue is not seeded
 * properly. Prevent this from happening by explicitly making angels spawn in order. Unlike vanilla,
 * we always make Uriel spawn first for balance reasons.
 */
export class ConsistentAngels extends ConfigurableModFeature {
  configKey: keyof Config = "ConsistentAngels";
  v = v;

  // 3, 631
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.MEAT_CLEAVER)
  postUseItemMeatCleaver(): boolean | undefined {
    v.room.usedMeatCleaverGameFrame = game.GetFrameCount();
    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER, EntityType.URIEL)
  preEntitySpawnFilterUriel(
    entityType: EntityType,
    variant: AngelVariant,
    subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ):
    | [entityType: EntityType, variant: int, subType: int, initSeed: Seed]
    | undefined {
    return this.checkCorrectAngelType(entityType, variant, subType, initSeed);
  }

  @CallbackCustom(ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER, EntityType.GABRIEL)
  preEntitySpawnFilterGabriel(
    entityType: EntityType,
    variant: AngelVariant,
    subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ):
    | [entityType: EntityType, variant: int, subType: int, initSeed: Seed]
    | undefined {
    return this.checkCorrectAngelType(entityType, variant, subType, initSeed);
  }

  checkCorrectAngelType(
    entityType: EntityType,
    variant: AngelVariant,
    subType: int,
    initSeed: Seed,
  ):
    | [entityType: EntityType, variant: int, subType: int, initSeed: Seed]
    | undefined {
    // This feature should not apply to angels that were duplicated with a Meat Cleaver.
    if (v.room.usedMeatCleaverGameFrame !== null) {
      const meatCleaverSpawnGameFrame =
        v.room.usedMeatCleaverGameFrame +
        FRAME_DELAY_TO_SPAWN_AFTER_MEAT_CLEAVER;
      if (onGameFrame(meatCleaverSpawnGameFrame)) {
        return undefined;
      }
    }

    // This feature does not apply to Fallen Angels.
    if (variant !== AngelVariant.NORMAL) {
      return undefined;
    }

    const angelShouldBeThisType = v.run.nextAngelType;
    v.run.nextAngelType =
      v.run.nextAngelType === EntityType.GABRIEL
        ? EntityType.URIEL
        : EntityType.GABRIEL;

    if (entityType === angelShouldBeThisType) {
      return undefined;
    }

    return [angelShouldBeThisType, variant, subType, initSeed];
  }
}
