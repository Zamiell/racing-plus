import type { UseFlag } from "isaac-typescript-definitions";
import {
  ActiveSlot,
  CollectibleType,
  ItemType,
  ModCallback,
  PlayerType,
} from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
import {
  Callback,
  CallbackCustom,
  DefaultMap,
  ModCallbackCustom,
  defaultMapGetPlayer,
  findFreePosition,
  game,
  getCollectibleMaxCharges,
  getTotalCharge,
  hasOpenActiveItemSlot,
  isCharacter,
  isJacobOrEsau,
  isTaintedLazarus,
  mapSetPlayer,
  spawnCollectible,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { mod } from "../../../../mod";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const D6_STARTING_CHARGE = getCollectibleMaxCharges(CollectibleType.D6);

const v = {
  run: {
    playersPocketActiveD6Charge: new DefaultMap<PlayerIndex, int>(
      D6_STARTING_CHARGE,
    ),
    currentFlipCharge: 0,
  },
};

/**
 * A major feature of Racing+ is to give every character the D6, since it heavily reduces run
 * disparity.
 *
 * We choose to give the D6 as a pocket active item. If we instead gave the D6 as a normal active
 * item, the vast majority of the active items in the game would go unused, since players hardly
 * ever drop the D6 for anything. Giving the D6 as a pocket active fixes this problem.
 *
 * Some characters already have pocket active items. In these cases, we could award the D6 as an
 * active item. However, we want players to have consistent muscle memory for which key to use the
 * D6 on. Thus, we strip the vanilla pocket active item and move it to the active item slot. (The
 * exception for this is Tainted Cain, since the Bag of Crafting does not work properly in the
 * active slot.)
 */
export class StartWithD6 extends ConfigurableModFeature {
  configKey: keyof Config = "StartWithD6";
  v = v;

  /**
   * Record the current charge so that we can propagate it to the other Flip.
   *
   * This function is triggered when:
   *  - flip is used by the player
   *  - flip is triggered automatically by clearing a room
   */
  // 23, 711
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.FLIP)
  preUseItemFlip(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
    useFlags: BitFlags<UseFlag>,
  ): boolean | undefined {
    if (!isTaintedLazarus(player)) {
      return undefined;
    }

    // We can't use the `ActiveSlot` passed by the callback because it will be -1 when Flip is
    // triggered via a room clear.
    const flipActiveSlot = this.getFlipActiveSlot(player);
    if (flipActiveSlot === undefined) {
      return undefined;
    }

    // When using the Flip manually, "useFlags" will be equal to 27, which is the composition of the
    // following flags:
    // - UseFlag.NO_ANIMATION (1 << 0)
    // - UseFlag.NO_COSTUME (1 << 1)
    // - UseFlag.ALLOW_NON_MAIN (1 << 3)
    // - UseFlag.REMOVE_ACTIVE (1 << 4)

    // When the game uses Flip automatically after clearing a room, "useFlags" will be equal to 0.
    // Since none of these flags correspond highly to using the item, default to checking for 0.
    const flipCharge = getTotalCharge(player, flipActiveSlot);
    const flipTriggeredByRoomClear = useFlags === 0;
    v.run.currentFlipCharge = flipTriggeredByRoomClear ? flipCharge : 0;

    return undefined;
  }

  getFlipActiveSlot(player: EntityPlayer): ActiveSlot | undefined {
    for (const activeSlot of [ActiveSlot.PRIMARY, ActiveSlot.SECONDARY]) {
      const activeItem = player.GetActiveItem(activeSlot);
      if (
        activeItem === CollectibleType.FLIP ||
        activeItem === CollectibleTypeCustom.FLIP_CUSTOM
      ) {
        return activeSlot;
      }
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const pocketActiveCharge = getTotalCharge(player, ActiveSlot.POCKET);
    mapSetPlayer(v.run.playersPocketActiveD6Charge, player, pocketActiveCharge);
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_CHANGE_TYPE)
  postPlayerChangeType(player: EntityPlayer): void {
    this.changedCharacterInSomeWay(player);
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST)
  playerPlayerInitFirst(player: EntityPlayer): void {
    giveD6(player);
  }

  @CallbackCustom(ModCallbackCustom.POST_FLIP)
  postFlip(player: EntityPlayer): void {
    if (!isTaintedLazarus(player)) {
      return;
    }

    // Normally, Tainted Lazarus has Flip in a pocket active slot, and the amount of charges on the
    // Flip is maintained between characters. However, this does not happen if the item is in a
    // normal active slot, so we have to manually ensure that the charge state is duplicated.
    const flipActiveSlot = this.getFlipActiveSlot(player);
    if (flipActiveSlot === undefined) {
      return;
    }

    // We cannot simply set the active charge, because Tainted Lazarus will get an additional charge
    // on the next frame, causing them to get a double-charge for clearing a room. Thus, defer
    // setting the charge for a frame.
    mod.runNextGameFrame(() => {
      player.SetActiveCharge(v.run.currentFlipCharge, flipActiveSlot);
    });
  }

  @CallbackCustom(ModCallbackCustom.POST_FIRST_FLIP)
  postFirstFlip(player: EntityPlayer): void {
    // Giving Dead Tainted Lazarus the pocket D6 using the "getTaintedLazarusSubPlayer" function
    // does not work, so we revert to using the PostFirstFlip callback.
    this.changedCharacterInSomeWay(player);
  }

  @CallbackCustom(ModCallbackCustom.POST_FIRST_ESAU_JR)
  postFirstEsauJr(player: EntityPlayer): void {
    this.changedCharacterInSomeWay(player, true);
  }

  changedCharacterInSomeWay(
    player: EntityPlayer,
    gotHereFromEsauJr = false,
  ): void {
    if (isCharacter(player, PlayerType.JACOB)) {
      const esau = player.GetOtherTwin();
      if (esau !== undefined) {
        giveD6(esau, gotHereFromEsauJr);
      }
    }

    // In some cases, switching the character will delete the D6, so we may need to give another
    // one.
    giveD6(player, gotHereFromEsauJr);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_ITEM_PICKUP,
    ItemType.PASSIVE,
    CollectibleType.BIRTHRIGHT,
  )
  postItemPickupBirthright(player: EntityPlayer): void {
    if (!isCharacter(player, PlayerType.FORGOTTEN_B)) {
      return;
    }

    // Birthright will give a pocket active item of Recall, which will replace the D6. Give the D6
    // back and make Recall a normal active item.
    const pocketActive = player.GetActiveItem(ActiveSlot.POCKET);
    const itemToReplace = CollectibleType.RECALL;
    if (pocketActive !== itemToReplace) {
      return;
    }

    const d6Charge = defaultMapGetPlayer(
      v.run.playersPocketActiveD6Charge,
      player,
    );

    player.SetPocketActiveItem(CollectibleType.D6, ActiveSlot.POCKET);
    player.SetActiveCharge(d6Charge, ActiveSlot.POCKET);

    const itemCharges = getCollectibleMaxCharges(itemToReplace);
    giveActiveItem(player, itemToReplace, itemCharges);
  }
}

function giveD6(player: EntityPlayer, gotHereFromEsauJr = false) {
  const pocketItem = player.GetActiveItem(ActiveSlot.POCKET);
  const pocketItemCharge = getTotalCharge(player, ActiveSlot.POCKET);
  const hasPocketD6 = pocketItem === CollectibleType.D6;

  // Jacob & Esau (19, 20) are a special case. Since pocket actives do not work on them properly,
  // give each of them a normal D6. Don't give a D6 to Jacob if we transformed to them with Clicker.
  if (isJacobOrEsau(player)) {
    if (hasOpenActiveItemSlot(player)) {
      player.AddCollectible(CollectibleType.D6, D6_STARTING_CHARGE);
    }

    return;
  }

  // Tainted Cain (23) is a special case. The Bag of Crafting does not work properly in the normal
  // active slot. Since the D6 is useless on Tainted Cain anyway, he does not need to be awarded the
  // D6.
  if (isCharacter(player, PlayerType.CAIN_B)) {
    return;
  }

  // Tainted Soul (40) is a special case; he cannot use items.
  if (isCharacter(player, PlayerType.SOUL_B)) {
    return;
  }

  if (hasPocketD6) {
    return;
  }

  // If we are switching characters, get the charge from the D6 on the previous frame.
  const oldCharge = defaultMapGetPlayer(
    v.run.playersPocketActiveD6Charge,
    player,
  );
  const d6Charge = player.FrameCount === 0 ? D6_STARTING_CHARGE : oldCharge;

  // The "EntityPlayer.SetPocketActiveItem" method also removes it from item pools.
  player.SetPocketActiveItem(CollectibleType.D6, ActiveSlot.POCKET);
  player.SetActiveCharge(d6Charge, ActiveSlot.POCKET);

  // If we previously had a pocket active item, move it to the normal active item slot.
  if (pocketItem !== CollectibleType.NULL && !gotHereFromEsauJr) {
    giveActiveItem(player, pocketItem, pocketItemCharge);
  }
}

function giveActiveItem(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  itemCharge: int,
) {
  const seeds = game.GetSeeds();

  if (hasOpenActiveItemSlot(player)) {
    player.AddCollectible(collectibleType, itemCharge);
  } else {
    // Spawn it on the ground instead.
    const position = findFreePosition(player.Position);
    const startSeed = seeds.GetStartSeed();
    const collectible = spawnCollectible(collectibleType, position, startSeed);
    collectible.Charge = itemCharge;
  }
}
