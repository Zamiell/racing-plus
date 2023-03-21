import {
  GridCollisionClass,
  LevelStage,
  PickupVariant,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
  findFreePosition,
  game,
  onStage,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

// On stage 8, we do not want the Perfection Trinket to be close to the trapdoor or the beam of
// light. We put it 2 squares to the right of where the beam of light is.
const STAGE_8_SPAWN_GRID_LOCATION = 70;

// On stage 10, we do not want the Perfection Trinket to be close to the passage to the next floor
// in the center of the room. We put it 2 squares to the right of the center of the room.
const STAGE_10_SPAWN_GRID_LOCATION = 69;

const v = {
  run: {
    spawnedPerfection: false,
  },
};

/**
 * Since the Perfection trinket spawns with a velocity, it can sometimes go over pits and become
 * inaccessible.
 */
export class RemovePerfectionVelocity extends ConfigurableModFeature {
  configKey: keyof Config = "RemovePerfectionVelocity";
  v = v;

  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_FILTER,
    PickupVariant.TRINKET,
    TrinketType.PERFECTION,
  )
  postPickupInitPerfection(pickup: EntityPickup): void {
    if (v.run.spawnedPerfection) {
      return;
    }

    // Normally, the Perfection trinket will be flung outward from the location of the boss.
    // Instead, set it to be a free tile near the center of the room.
    pickup.Position = this.getPerfectionPosition();
    pickup.Velocity = VectorZero;

    v.run.spawnedPerfection = true;
  }

  getPerfectionPosition(): Vector {
    const room = game.GetRoom();
    const centerPos = room.GetCenterPos();
    const gridEntity = room.GetGridEntityFromPos(centerPos);

    if (onStage(LevelStage.WOMB_2)) {
      return room.GetGridPosition(STAGE_8_SPAWN_GRID_LOCATION);
    }

    if (onStage(LevelStage.SHEOL_CATHEDRAL)) {
      return room.GetGridPosition(STAGE_10_SPAWN_GRID_LOCATION);
    }

    // Some boss rooms have pits in the center of the room.
    if (
      gridEntity !== undefined &&
      gridEntity.CollisionClass !== GridCollisionClass.NONE
    ) {
      return findFreePosition(centerPos);
    }

    // By default, spawn Perfection in the middle of the room.
    return centerPos;
  }
}
