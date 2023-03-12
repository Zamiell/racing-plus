import {
  DingleVariant,
  EffectVariant,
  EntityType,
  HeavenLightDoorSubType,
  ModCallback,
  NPCState,
  ProjectileVariant,
  SeedEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ColorDefault,
  game,
  getEffects,
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  isRaglingDeathPatch,
  log,
  ModCallbackCustom,
  removeEntities,
} from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { earlyClearRoomPostUpdate } from "./fastClear/earlyClearRoom";
import { postItLivesOrHushPathPostNewRoom } from "./fastClear/postItLivesOrHushPath";
import {
  trackingAddPostNPCInit,
  trackingAddPostNPCUpdate,
  trackingAddPostProjectileInitMeat,
} from "./fastClear/trackingAdd";
import {
  fastClearCheckRemove,
  trackingRemovePostEntityKill,
  trackingRemovePostEntityRemove,
} from "./fastClear/trackingRemove";
import { v } from "./fastClear/v";

export class FastClear extends ConfigurableModFeature {
  configKey: keyof Config = "FastClear";
  v = v;

  override shouldCallbackMethodsFire = (): boolean => {
    const seeds = game.GetSeeds();

    return (
      config.FastClear &&
      !game.IsGreedMode() &&
      // Fast-clear does not work with the "PAC1F1CM" seed / Easter Egg.
      !seeds.HasSeedEffect(SeedEffect.PACIFIST)
    );
  };

  // 0
  @Callback(ModCallback.POST_NPC_UPDATE)
  postNPCUpdate(npc: EntityNPC): void {
    trackingAddPostNPCUpdate(npc);
  }

  /**
   * Rag Man Raglings do not actually die; they turn into patches on the ground. So, we need to
   * manually keep track of when this happens.
   */
  // 0, 246
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.RAGLING)
  postNPCUpdateRagling(npc: EntityNPC): void {
    if (isRaglingDeathPatch(npc)) {
      fastClearCheckRemove(npc, false, "NPC_UPDATE_RAGLING");
    }
  }

  /**
   * Stonies have a chance to morph from EntityType.FATTY (208), so they will get added to the
   * `aliveEnemies` set before the room is loaded. To correct for this, we constantly remove them
   * from the set.
   */
  // 0, 302
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.STONEY)
  postNPCUpdateStoney(npc: EntityNPC): void {
    fastClearCheckRemove(npc, false, "NPC_UPDATE_STONEY");
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    earlyClearRoomPostUpdate();
  }

  // 27
  @Callback(ModCallback.POST_NPC_INIT)
  postNPCInit(npc: EntityNPC): void {
    trackingAddPostNPCInit(npc);
  }

  // 43, 11
  @Callback(ModCallback.POST_PROJECTILE_INIT, ProjectileVariant.MEAT)
  postProjectileInitMeat(projectile: EntityProjectile): void {
    trackingAddPostProjectileInitMeat(projectile);
  }

  // 67
  @Callback(ModCallback.POST_ENTITY_REMOVE)
  postEntityRemove(entity: Entity): void {
    trackingRemovePostEntityRemove(entity);
  }

  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    trackingRemovePostEntityKill(entity);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.checkBugTwoHeavenDoors();
    postItLivesOrHushPathPostNewRoom();
  }

  /**
   * Check for two or more heaven doors in the room, which is assumed to be a bug. For example, this
   * can happen if you die on the It Lives fight on the save frame that the vanilla Heaven Door
   * spawns.
   *
   * If this is the case, we delete all of the heaven doors except for one. By default, we prefer
   * the heaven door that is in in the center of the room.
   */
  checkBugTwoHeavenDoors(): void {
    const heavenDoors = getEffects(
      EffectVariant.HEAVEN_LIGHT_DOOR,
      HeavenLightDoorSubType.HEAVEN_DOOR,
    );
    if (heavenDoors.length < 2) {
      return;
    }

    const heavenDoorInCenter = heavenDoors.find((heavenDoor) => {
      const room = game.GetRoom();
      const gridIndex = room.GetGridIndex(heavenDoor.Position);
      return gridIndex === GRID_INDEX_CENTER_OF_1X1_ROOM;
    });

    const firstHeavenDoor = heavenDoors[0];
    if (firstHeavenDoor === undefined) {
      return;
    }

    const heavenDoorToKeep =
      heavenDoorInCenter === undefined ? firstHeavenDoor : heavenDoorInCenter;
    const heavenDoorsToRemove = heavenDoors.filter(
      (heavenDoor) => heavenDoor.Index !== heavenDoorToKeep.Index,
    );
    removeEntities(heavenDoorsToRemove);
  }

  /**
   * Fix the bug where a Dangle spawned from a Brownie will be faded. We only care about Dangles
   * that are freshly spawned.
   */
  @CallbackCustom(
    ModCallbackCustom.POST_NPC_UPDATE_FILTER,
    EntityType.DINGLE,
    DingleVariant.DANGLE,
  )
  postNPCUpdateDangle(npc: EntityNPC): void {
    if (npc.State === NPCState.INIT) {
      npc.SetColor(ColorDefault, 1000, 0, true, true);
    }
  }

  /** This intentionally does not use the `PRE_SPAWN_CLEAR_AWARD` callback. */
  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED)
  postRoomClearChanged(roomClear: boolean): void {
    this.checkVanillaRoomClear(roomClear);
  }

  checkVanillaRoomClear(roomClear: boolean): void {
    if (roomClear && !v.room.fastClearedRoom) {
      log("Vanilla room clear detected.");
    }
  }
}
