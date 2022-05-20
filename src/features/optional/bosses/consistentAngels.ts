// In vanilla, bombing two angel statues will sometimes result in two of the same angel type
// spawning. Furthermore, in vanilla, sometimes the first angel from an angel statue is not seeded
// properly. Prevent this from happening by explicitly making angels spawn in order. Unlike vanilla,
// we always make Uriel spawn first for balance reasons.

import { AngelVariant, EntityType } from "isaac-typescript-definitions";
import { saveDataManager } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const FRAME_DELAY_TO_SPAWN_AFTER_MEAT_CLEAVER = 2;

const v = {
  run: {
    nextAngelType: EntityType.URIEL, // 271
  },

  room: {
    usedMeatCleaverFrame: null as int | null,
  },
};

export function init(): void {
  saveDataManager("consistentAngels", v);
}

// ModCallback.POST_USE_ITEM (3)
// CollectibleType.MEAT_CLEAVER (631)
export function useItemMeatCleaver(): void {
  if (!config.consistentAngels) {
    return;
  }

  v.room.usedMeatCleaverFrame = g.g.GetFrameCount();
}

// ModCallback.PRE_ENTITY_SPAWN (24)
// EntityType.URIEL (271)
export function preEntitySpawnUriel(
  variant: AngelVariant,
  subType: int,
  initSeed: int,
): [EntityType, int, int, int] | void {
  if (!config.consistentAngels) {
    return undefined;
  }

  return checkCorrectAngelType(EntityType.URIEL, variant, subType, initSeed);
}

// ModCallback.PRE_ENTITY_SPAWN (24)
// EntityType.GABRIEL (272)
export function preEntitySpawnGabriel(
  variant: AngelVariant,
  subType: int,
  initSeed: int,
): [EntityType, int, int, int] | void {
  if (!config.consistentAngels) {
    return undefined;
  }

  return checkCorrectAngelType(EntityType.GABRIEL, variant, subType, initSeed);
}

function checkCorrectAngelType(
  entityType: EntityType,
  variant: AngelVariant,
  subType: int,
  initSeed: int,
): [EntityType, int, int, int] | void {
  const gameFrameCount = g.g.GetFrameCount();

  // This feature should not apply to angels that were duplicated with a Meat Cleaver.
  if (
    v.room.usedMeatCleaverFrame !== null &&
    v.room.usedMeatCleaverFrame + FRAME_DELAY_TO_SPAWN_AFTER_MEAT_CLEAVER ===
      gameFrameCount
  ) {
    return undefined;
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
