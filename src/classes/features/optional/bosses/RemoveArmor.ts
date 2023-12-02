import {
  CollectibleType,
  DamageFlag,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  addFlag,
  getActiveItemSlots,
  getTotalCharge,
  hasArmor,
  hasFlag,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class RemoveArmor extends ConfigurableModFeature {
  configKey: keyof Config = "RemoveArmor";

  // 11
  @Callback(ModCallback.ENTITY_TAKE_DMG)
  entityTakeDmg(
    entity: Entity,
    amount: float,
    damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    countdownFrames: int,
  ): boolean | undefined {
    // Instead of checking every entity in the game, we could have individual callbacks for each
    // individual entity that has armor. However, there are too many entities with armor for this to
    // be feasible. Additionally, we have to filter out entities without armor because adding
    // `DamageFlag.IGNORE_ARMOR` to all damage has some weird side effects, like fires not being
    // able to deal any damage, and the sneeze effect from Tainted Azazel not applying the debuff.
    if (!hasArmor(entity)) {
      return undefined;
    }

    if (hasFlag(damageFlags, DamageFlag.IGNORE_ARMOR)) {
      return undefined;
    }

    const newDamageFlags = addFlag(damageFlags, DamageFlag.IGNORE_ARMOR);
    entity.TakeDamage(amount, newDamageFlags, source, countdownFrames);

    this.checkDischargeNotchedAxe(damageFlags, source);

    return false;
  }

  /**
   * Making the entity manually take damage has the side effect of not decrementing the charges of
   * Notched Axe, so we need to explicitly check for this case.
   */
  checkDischargeNotchedAxe(
    damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
  ): void {
    if (source.Entity === undefined || !source.Entity.Exists()) {
      return;
    }

    const player = source.Entity.ToPlayer();
    if (player === undefined) {
      return;
    }

    // Check if they have the Notched Axe currently deployed/out.
    const effects = player.GetEffects();
    if (!effects.HasCollectibleEffect(CollectibleType.NOTCHED_AXE)) {
      return;
    }

    // Notched Axe hits will have `DamageFlag.CRUSH`.
    if (!hasFlag(damageFlags, DamageFlag.CRUSH)) {
      return;
    }

    const activeSlots = getActiveItemSlots(player, CollectibleType.NOTCHED_AXE);

    for (const activeSlot of activeSlots) {
      const previousCharge = getTotalCharge(player, activeSlot);
      let newCharge = previousCharge - 2;
      if (newCharge < 0) {
        newCharge = 0;
      }

      player.SetActiveCharge(newCharge, activeSlot);
    }
  }
}
