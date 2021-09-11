import { saveDataManager } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const v = {
  level: {
    numSacrifices: 0,
  },
};

export function init(): void {
  saveDataManager("showNumSacrifices", v, featureEnabled);
}

function featureEnabled() {
  return config.showNumSacrifices;
}

// ModCallbacksCustom.MC_POST_SACRIFICE
export function postSacrifice(numSacrifices: int): void {
  v.level.numSacrifices = numSacrifices;
}

export function shouldShowNumSacrifices(): boolean {
  if (!config.showNumSacrifices) {
    return false;
  }

  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();

  return roomType === RoomType.ROOM_SACRIFICE && roomFrameCount > 0;
}

export function getNumSacrifices(): int {
  return v.level.numSacrifices;
}
