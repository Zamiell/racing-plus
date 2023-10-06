import { RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  inRoomType,
  isAfterRoomFrame,
  ModCallbackCustom,
} from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const v = {
  level: {
    numSacrifices: 0,
  },
};

export class ShowNumSacrifices extends ConfigurableModFeature {
  configKey: keyof Config = "ShowNumSacrifices";
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_SACRIFICE)
  postSacrifice(_player: EntityPlayer, numSacrifices: int): void {
    v.level.numSacrifices = numSacrifices;
  }
}

export function shouldShowNumSacrifices(): boolean {
  if (!config.ShowNumSacrifices) {
    return false;
  }

  return inRoomType(RoomType.SACRIFICE) && isAfterRoomFrame(0);
}

export function getNumSacrifices(): int {
  return v.level.numSacrifices;
}
