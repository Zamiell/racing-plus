import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { fastClearPostRoomClearChanged } from "../features/optional/major/fastClear/callbacks/postRoomClearChanged";
import { speedrunPostRoomClearChanged } from "../features/speedrun/callbacks/postRoomClearChanged";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, main);
}

function main(roomClear: boolean) {
  fastClearPostRoomClearChanged(roomClear);
  speedrunPostRoomClearChanged(roomClear);
}
