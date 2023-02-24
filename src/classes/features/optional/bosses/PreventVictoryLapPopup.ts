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
  addRoomClearCharges,
  asNumber,
  Callback,
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
  VectorZero,
} from "isaacscript-common";
import { EffectVariantCustom } from "../../../../enums/EffectVariantCustom";
import { mod } from "../../../../mod";
import { Config } from "../../../Config";
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
  @Callback(ModCallback.POST_ENTITY_KILL, EntityType.THE_LAMB)
  postEntityKillLamb(entity: Entity): void {
    if (entity.HasEntityFlags(EntityFlag.FRIENDLY)) {
      return;
    }

    if (!this.inUnclearedLambBossRoom()) {
      return;
    }

    // There is an edge-case with The Lamb where if you deal fatal damage to it in phase 1, it will
    // trigger the `POST_ENTITY_KILL` callback. However, in this situation, The Lamb will not
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
    const lambs = getNPCs(EntityType.THE_LAMB);

    for (const lamb of lambs) {
      if (lamb.HasEntityFlags(EntityFlag.FRIENDLY)) {
        continue;
      }

      if (lamb.Variant === asNumber(LambVariant.BODY) && lamb.IsInvincible()) {
        continue;
      }

      if (!lamb.IsDead()) {
        return false;
      }
    }

    return true;
  }

  spawnRoomClearDelayEffect(): void {
    const effect = spawnEffect(
      EffectVariantCustom.ROOM_CLEAR_DELAY,
      0,
      VectorZero,
    );
    effect.ClearEntityFlags(EntityFlag.APPEAR);
    log('Spawned the "Room Clear Delay Effect" custom entity (for The Lamb).');
    // - This will not work to delay the room clearing if "debug 10" is turned on.
    // - This will not die if the player uses Blood Rights or Plan C, since it is an effect.
  }

  emulateRoomClear(): void {
    const room = game.GetRoom();

    room.SetClear(true);
    addRoomClearCharges();
    openAllDoors();
    sfxManager.Play(SoundEffect.DOOR_HEAVY_OPEN);

    // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race).
    const position = room.GetCenterPos();
    spawnPickup(PickupVariant.BIG_CHEST, 0, position);
  }
}
