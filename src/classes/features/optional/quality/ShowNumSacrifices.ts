import { RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  inRoomType,
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

  const room = game.GetRoom();
  const roomFrameCount = room.GetFrameCount();

  return inRoomType(RoomType.SACRIFICE) && roomFrameCount > 0;
}

export function getNumSacrifices(): int {
  return v.level.numSacrifices;
}
