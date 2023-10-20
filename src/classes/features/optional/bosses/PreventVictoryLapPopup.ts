import {
  EntityFlag,
  EntityType,
  LambVariant,
  ModCallback,
  PickupVariant,
  RoomType,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  VectorZero,
  addRoomClearCharges,
  asNumber,
  game,
  getNPCs,
  inRoomType,
  isRoomInsideGrid,
  log,
  onDarkRoom,
  openAllDoors,
  sfxManager,
  spawnEffect,
  spawnPickup,
} from "isaacscript-common";
import { EffectVariantCustom } from "../../../../enums/EffectVariantCustom";
import { mod } from "../../../../mod";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const v = {
  room: {
    pseudoClearedRoom: false,
  },
};

export class PreventVictoryLapPopup extends ConfigurableModFeature {
  configKey: keyof Config = "PreventVictoryLapPopup";
  v = v;

  // 68, 273
  @Callback(ModCallback.POST_ENTITY_KILL, EntityType.LAMB)
  postEntityKillLamb(entity: Entity): void {
    if (entity.HasEntityFlags(EntityFlag.FRIENDLY)) {
      return;
    }

    if (!this.inUnclearedLambBossRoom()) {
      return;
    }

    // There is an special case with The Lamb where if you deal fatal damage to it in phase 1, it
    // will trigger the `POST_ENTITY_KILL` callback. However, in this situation, The Lamb will not
    // actually die, and will instead proceed to transition to phase 2 anyway. To work around this,
    // wait a frame before checking to see if all of the Lamb entities in the room are dead. (It is
    // difficult to distinguish between this special case and throwing a Chaos Card.)
    mod.runNextGameFrame(() => {
      if (!this.isAllLambEntitiesDead()) {
        return;
      }

      if (v.room.pseudoClearedRoom) {
        return;
      }
      v.room.pseudoClearedRoom = true;

      this.spawnRoomClearDelayEffect();
      this.emulateRoomClear();
    });
  }

  inUnclearedLambBossRoom(): boolean {
    const room = game.GetRoom();
    const roomClear = room.IsClear();

    return (
      onDarkRoom() &&
      inRoomType(RoomType.BOSS) &&
      isRoomInsideGrid() &&
      !roomClear
    );
  }

  isAllLambEntitiesDead(): boolean {
    const lambs = getNPCs(EntityType.LAMB);
    const filteredLambs = lambs.filter(
      (lamb) =>
        !lamb.HasEntityFlags(EntityFlag.FRIENDLY) &&
        !(lamb.Variant === asNumber(LambVariant.BODY) && lamb.IsInvincible()),
    );

    return filteredLambs.every((lamb) => lamb.IsDead());
  }

  spawnRoomClearDelayEffect(): void {
    const effect = spawnEffect(
      EffectVariantCustom.ROOM_CLEAR_DELAY,
      0,
      VectorZero,
    );
    effect.ClearEntityFlags(EntityFlag.APPEAR);
    // - This will not work to delay the room clearing if "debug 10" is turned on.
    // - This will not die if the player uses Blood Rights or Plan C, since it is an effect.
  }

  emulateRoomClear(): void {
    const room = game.GetRoom();

    room.SetClear(true);
    addRoomClearCharges();
    openAllDoors();
    sfxManager.Play(SoundEffect.DOOR_HEAVY_OPEN);
    log("Manually set the room to be clear after The Lamb died.");

    // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race).
    const centerPos = room.GetCenterPos();
    spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);
  }
}
