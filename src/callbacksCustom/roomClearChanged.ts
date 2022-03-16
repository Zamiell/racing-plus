import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import { fastClearRoomClearChanged } from "../features/optional/major/fastClear/callbacks/roomClearChanged";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_ROOM_CLEAR_CHANGE, main);
}

function main(roomCleared: boolean) {
  fastClearRoomClearChanged(roomCleared);
}
