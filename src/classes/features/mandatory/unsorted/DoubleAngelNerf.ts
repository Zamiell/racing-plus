import {
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

/** In vanilla, this is 660. */
const NERFED_GABRIEL_HP_AMOUNT = 400;

/** This feature is not configurable since it overall a nerf to vanilla. */
export class DoubleAngelNerf extends MandatoryModFeature {
  // 27, 272
  @Callback(ModCallback.POST_NPC_INIT, EntityType.GABRIEL)
  postNPCInitGabriel(npc: EntityNPC): void {
    npc.MaxHitPoints = NERFED_GABRIEL_HP_AMOUNT;
    npc.HitPoints = NERFED_GABRIEL_HP_AMOUNT;
  }

  // 11, 271
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.URIEL)
  entityTakeDmgUriel(
    _entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
  ): boolean | undefined {
    return this.preventDamageFromAngels(source);
  }

  // 11, 272
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.GABRIEL)
  entityTakeDmgGabriel(
    _entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
  ): boolean | undefined {
    return this.preventDamageFromAngels(source);
  }

  preventDamageFromAngels(source: EntityRef): boolean | undefined {
    const entity = source.Entity;
    if (entity === undefined || !entity.Exists()) {
      return undefined;
    }

    if (
      entity.Type === EntityType.URIEL ||
      entity.Type === EntityType.GABRIEL
    ) {
      return false;
    }

    return undefined;
  }
}
