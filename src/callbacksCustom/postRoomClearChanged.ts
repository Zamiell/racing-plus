import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { fastClearRoomClearChanged } from "../features/optional/major/fastClear/callbacks/roomClearChanged";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, main);
}

function main(roomCleared: boolean) {
  fastClearRoomClearChanged(roomCleared);
}
