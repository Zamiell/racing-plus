import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { fastClearPostRoomClearChanged } from "../features/optional/major/fastClear/callbacks/postRoomClearChanged";
import { season3PostRoomClearChanged } from "../features/speedrun/season3/callbacks/postRoomClearChanged";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, main);
}

function main(roomCleared: boolean) {
  fastClearPostRoomClearChanged(roomCleared);
  season3PostRoomClearChanged(roomCleared);
}
