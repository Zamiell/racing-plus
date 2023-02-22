// Since the Perfection trinket spawns with a velocity, it can sometimes go over pits and become
// inaccessible.

import {
  GridCollisionClass,
  LevelStage,
  TrinketType,
} from "isaac-typescript-definitions";
import { findFreePosition, VectorZero } from "isaacscript-common";
import { g } from "../../../globals";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";

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

export function init(): void {
  mod.saveDataManager("removePerfectionVelocity", v, featureEnabled);
}

function featureEnabled() {
  return config.RemovePerfectionVelocity;
}

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.TRINKET (350)
export function postPickupInitTrinket(pickup: EntityPickupTrinket): void {
  if (!config.RemovePerfectionVelocity) {
    return;
  }

  if (pickup.SubType !== TrinketType.PERFECTION) {
    return;
  }

  if (v.run.spawnedPerfection) {
    return;
  }

  // Normally, the Perfection trinket will be flung outward from the location of the boss. Instead,
  // set it to be a free tile near the center of the room.
  pickup.Position = getPerfectionPosition();
  pickup.Velocity = VectorZero;

  v.run.spawnedPerfection = true;
}

function getPerfectionPosition(): Vector {
  const stage = g.l.GetStage();
  const centerPos = g.r.GetCenterPos();
  const gridEntity = g.r.GetGridEntityFromPos(centerPos);

  if (stage === LevelStage.WOMB_2) {
    return g.r.GetGridPosition(STAGE_8_SPAWN_GRID_LOCATION);
  }

  if (stage === LevelStage.SHEOL_CATHEDRAL) {
    return g.r.GetGridPosition(STAGE_10_SPAWN_GRID_LOCATION);
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
