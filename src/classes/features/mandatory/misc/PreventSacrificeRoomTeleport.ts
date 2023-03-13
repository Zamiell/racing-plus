import { GridEntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  ModCallbackCustom,
  removeGridEntity,
} from "isaacscript-common";
import { inRaceToDarkRoom } from "../../../../features/race/v";
import {
  inSpeedrun,
  onSpeedrunWithDarkRoomGoal,
} from "../../../../speedrun/utilsSpeedrun";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const NUM_SACRIFICES_FOR_GABRIEL = 11;

const v = {
  level: {
    numSacrifices: 0,
  },
};

export class PreventSacrificeRoomTeleport extends MandatoryModFeature {
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    checkDeleteSpikes();
  }

  @CallbackCustom(ModCallbackCustom.POST_SACRIFICE)
  postSacrifice(_player: EntityPlayer, numSacrifices: int): void {
    v.level.numSacrifices = numSacrifices;

    checkDeleteSpikes();
  }
}

function checkDeleteSpikes() {
  const room = game.GetRoom();

  if (!shouldDeleteSpikes()) {
    return;
  }

  const gridEntity = room.GetGridEntity(GRID_INDEX_CENTER_OF_1X1_ROOM);
  if (
    gridEntity !== undefined &&
    gridEntity.GetType() === GridEntityType.SPIKES
  ) {
    removeGridEntity(gridEntity, false);
  }
}

function shouldDeleteSpikes() {
  return (
    v.level.numSacrifices >= NUM_SACRIFICES_FOR_GABRIEL &&
    (inRaceToDarkRoom() || (inSpeedrun() && onSpeedrunWithDarkRoomGoal()))
  );
}
