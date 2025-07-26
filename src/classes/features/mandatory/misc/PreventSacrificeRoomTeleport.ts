import { GridEntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  ModCallbackCustom,
  removeGridEntity,
} from "isaacscript-common";
import { inRaceToDarkRoom } from "../../../../features/race/v";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const NUM_SACRIFICES_FOR_GABRIEL = 11;

const v = {
  level: {
    numSacrifices: 0,
  },
};

/**
 * We prevent the sacrifice room teleport by deleting the spikes when Gabriel spawns.
 *
 * Note that this does not have to be performed inside of a speedrun because the vanilla game
 * prevents the teleport when the challenge has the following tags: `endstage="11" altpath="true"`
 */
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
    gridEntity !== undefined
    && gridEntity.GetType() === GridEntityType.SPIKES
  ) {
    removeGridEntity(gridEntity, false);
  }
}

function shouldDeleteSpikes() {
  return (
    v.level.numSacrifices >= NUM_SACRIFICES_FOR_GABRIEL && inRaceToDarkRoom()
  );
}
