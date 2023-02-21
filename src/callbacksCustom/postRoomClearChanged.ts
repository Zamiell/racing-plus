import { ModCallbackCustom } from "isaacscript-common";
import { fastClearPostRoomClearChanged } from "../features/optional/major/fastClear/callbacks/postRoomClearChanged";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, main);
}

/**
 * We primarily detect room clear using the `PRE_SPAWN_CLEAR_AWARD` callback instead of the
 * `POST_ROOM_CLEAR_CHANGED` callback because the latter only fires on the subsequent frame. Thus,
 * only a few specific features are called from here.
 */
function main(roomClear: boolean) {
  fastClearPostRoomClearChanged(roomClear);
}
