import {
  EntityFlag,
  EntityType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  addRoomClearCharges,
  game,
  log,
  spawnPickup,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/**
 * There is a 50% chance after defeating Mega Satan that the game will trigger a cutscene and force
 * the player to leave the run. By simply setting the room to be cleared when Mega Satan 2 dies, the
 * game will never go on to make the 50% roll.
 */
export class PreventEndMegaSatan extends ConfigurableModFeature {
  configKey: keyof Config = "PreventEndMegaSatan";

  // 68, 275
  @Callback(ModCallback.POST_ENTITY_KILL, EntityType.MEGA_SATAN_2)
  postEntityKillMegaSatan2(entity: Entity): void {
    if (entity.HasEntityFlags(EntityFlag.FRIENDLY)) {
      return;
    }

    this.emulateRoomClear();
  }

  emulateRoomClear(): void {
    const room = game.GetRoom();

    room.SetClear(true);
    addRoomClearCharges();
    log("Manually set the room to be clear after Mega Satan 2 died.");

    // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race).
    const centerPos = room.GetCenterPos();
    spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);
  }
}
