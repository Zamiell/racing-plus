import { RoomType } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";

const v = {
  level: {
    numSacrifices: 0,
  },
};

export function init(): void {
  mod.saveDataManager("showNumSacrifices", v, featureEnabled);
}

function featureEnabled() {
  return config.ShowNumSacrifices;
}

// ModCallbackCustom.POST_SACRIFICE
export function postSacrifice(numSacrifices: int): void {
  v.level.numSacrifices = numSacrifices;
}

export function shouldShowNumSacrifices(): boolean {
  if (!config.ShowNumSacrifices) {
    return false;
  }

  const room = game.GetRoom();
  const roomType = room.GetType();
  const roomFrameCount = room.GetFrameCount();

  return roomType === RoomType.SACRIFICE && roomFrameCount > 0;
}

export function getNumSacrifices(): int {
  return v.level.numSacrifices;
}
